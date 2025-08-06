
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { useToast } from '@/components/ui/use-toast';
import UserEditModal from '@/components/users/UserEditModal';
import { Textarea } from '@/components/ui/textarea';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';

// Interfaces
interface User {
    uid: string;
    name: string;
    email: string;
    role: 'admin' | 'corretor';
    [key: string]: any;
}

interface Banner {
    title: string;
    text: string;
    imageUrl: string;
    imageFile?: File | null;
}

const SettingsPage = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const functions = getFunctions();
  const storage = getStorage();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [settings, setSettings] = useState({
    facebookPixelId: '',
    companyName: '',
    footerPhone: '',
    footerEmail: '',
    footerAddress: '',
    facebookUrl: '',
    instagramUrl: '',
    whatsappUrl: '',
    headerLogoUrl: '',
    headerLogoFile: null as File | null,
    footerLogoUrl: '',
    footerLogoFile: null as File | null,
    banners: [
      { title: '', text: '', imageUrl: '', imageFile: null as File | null },
    ] as Banner[],
  });
  
  // Carregar configurações do Firestore na montagem
  useEffect(() => {
    const fetchSettings = async () => {
        const settingsDocRef = doc(db, "settings", "general");
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Garante que banners seja um array com pelo menos 1 elemento
            let fetchedBanners = data.banners;
            if (!Array.isArray(fetchedBanners) || fetchedBanners.length === 0) {
                fetchedBanners = [{ title: '', text: '', imageUrl: '', imageFile: null }];
            }
            setSettings(prev => ({ ...prev, ...data, banners: fetchedBanners }));
        }
    };

    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      const listUsersFunction = httpsCallable(functions, 'listUsers');
      try {
          const result: HttpsCallableResult<any> = await listUsersFunction();
          setUsers(result.data as User[]);
      } catch (error) {
          toast({ title: "Erro ao Carregar Usuários", variant: "destructive" });
      } finally {
          setIsLoadingUsers(false);
      }
    };

    if (role === 'admin') {
      fetchUsers();
      fetchSettings();
    }
  }, [role, functions, toast]);
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (updatedUser: User) => {
    setIsSaving(true);
    const updateUserFunction = httpsCallable(functions, 'updateUser');
    try {
        await updateUserFunction(updatedUser);
        setUsers(users.map(u => u.uid === updatedUser.uid ? updatedUser : u));
        toast({ title: "Usuário Atualizado!" });
        handleCloseModal();
    } catch (error: any) {
        toast({ title: "Erro ao Salvar", description: error.message, variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'headerLogoFile' | 'footerLogoFile') => {
    if (e.target.files && e.target.files.length > 0) {
      setSettings(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleBannerChange = (index: number, field: 'title' | 'text', value: string) => {
    const newBanners = [...settings.banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setSettings(prev => ({ ...prev, banners: newBanners }));
  };

  const handleBannerFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const newBanners = [...settings.banners];
        newBanners[index] = { ...newBanners[index], imageFile: e.target.files![0] };
        setSettings(prev => ({ ...prev, banners: newBanners }));
    }
  };
  
  const addBanner = () => {
    setSettings(prev => ({
      ...prev,
      banners: [...prev.banners, { title: '', text: '', imageUrl: '', imageFile: null }]
    }));
  };

  const removeBanner = (indexToRemove: number) => {
    if (settings.banners.length <= 1) {
      toast({ title: "Atenção", description: "É necessário manter pelo menos um banner." });
      return;
    }
    setSettings(prev => ({
      ...prev,
      banners: prev.banners.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    try {
        const uploadFile = async (file: File | null, path: string): Promise<string | null> => {
            if (!file) return null;
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        };

        const headerLogoUrl = await uploadFile(settings.headerLogoFile, 'logos/header_logo');
        const footerLogoUrl = await uploadFile(settings.footerLogoFile, 'logos/footer_logo');
        
        const bannerUrls = await Promise.all(
            settings.banners.map((banner, index) => 
                uploadFile(banner.imageFile, `banners/banner_${Date.now()}_${index + 1}`)
            )
        );

        const settingsToSave: any = {
            ...settings,
            headerLogoUrl: headerLogoUrl || settings.headerLogoUrl,
            footerLogoUrl: footerLogoUrl || settings.footerLogoUrl,
            banners: settings.banners.map((banner, index) => ({
                title: banner.title,
                text: banner.text,
                imageUrl: bannerUrls[index] || banner.imageUrl,
            })),
        };
        
        delete settingsToSave.headerLogoFile;
        delete settingsToSave.footerLogoFile;

        const settingsDocRef = doc(db, "settings", "general");
        await setDoc(settingsDocRef, settingsToSave, { merge: true });

        toast({ title: "Sucesso!", description: "Configurações gerais salvas com sucesso." });

    } catch (error) {
        toast({ title: "Erro ao Salvar", description: "Não foi possível salvar as configurações.", variant: "destructive"});
    } finally {
        setIsSavingSettings(false);
    }
  };

  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <UserEditModal user={selectedUser} isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveUser} isSaving={isSaving} />
      <PageLayout>
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Configurações e Acessos</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Gerenciar Usuários do Painel</CardTitle>
              <CardDescription>Adicione, remova ou edite o acesso dos usuários ao sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Função</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {isLoadingUsers ? (
                              <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin" /></TableCell></TableRow>
                          ) : (
                              users.map(user => (
                                  <TableRow key={user.uid}>
                                      <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                                      <TableCell>{user.email}</TableCell>
                                      <TableCell>
                                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                                              {user.role}
                                          </span>
                                      </TableCell>
                                      <TableCell className="text-right">
                                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                              <Pencil className="h-4 w-4 mr-2" />
                                              Editar
                                          </Button>
                                      </TableCell>
                                  </TableRow>
                              ))
                          )}
                      </TableBody>
                  </Table>
               </div>
            </CardContent>
          </Card>
          
          <form onSubmit={handleSettingsSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Site</CardTitle>
                <CardDescription>Gerencie as informações globais e de marketing do site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input id="facebookPixelId" placeholder="Seu ID do Pixel aqui" value={settings.facebookPixelId} onChange={handleSettingsChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input id="companyName" placeholder="Nome que aparece na Home" value={settings.companyName} onChange={handleSettingsChange} />
                </div>
                
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-4">Banners da Página Inicial</h3>
                  <div className="space-y-6">
                    {settings.banners.map((banner, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Banner {index + 1}</h4>
                            {settings.banners.length > 1 && (
                              <Button variant="ghost" size="sm" onClick={() => removeBanner(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`banner-title-${index}`}>Título do Banner</Label>
                              <Input id={`banner-title-${index}`} value={banner.title} onChange={(e) => handleBannerChange(index, 'title', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`banner-text-${index}`}>Texto do Banner (aceita HTML)</Label>
                              <Textarea id={`banner-text-${index}`} value={banner.text} onChange={(e) => handleBannerChange(index, 'text', e.target.value)} placeholder='Ex: A casa dos seus <span class="text-yellow-400">sonhos</span>' />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`banner-image-${index}`}>Imagem de Fundo</Label>
                              <Input id={`banner-image-${index}`} type="file" onChange={(e) => handleBannerFileChange(index, e)} />
                              {banner.imageUrl && !banner.imageFile && <img src={banner.imageUrl} alt={`Banner ${index+1}`} className="w-32 mt-2 rounded-md" />}
                          </div>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addBanner} className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Adicionar Novo Banner
                  </Button>
                </div>

                <Separator />
                <h3 className="text-lg font-medium">Informações do Rodapé e Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerPhone">Telefone de Contato</Label>
                    <Input id="footerPhone" placeholder="(00) 12345-6789" value={settings.footerPhone} onChange={handleSettingsChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footerEmail">Email Principal</Label>
                    <Input id="footerEmail" type="email" placeholder="contato@empresa.com" value={settings.footerEmail} onChange={handleSettingsChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerAddress">Endereço Físico</Label>
                  <Input id="footerAddress" placeholder="Rua Exemplo, 123, Cidade - UF" value={settings.footerAddress} onChange={handleSettingsChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="facebookUrl">URL do Facebook</Label>
                        <Input id="facebookUrl" placeholder="https://facebook.com/suaempresa" value={settings.facebookUrl} onChange={handleSettingsChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagramUrl">URL do Instagram</Label>
                        <Input id="instagramUrl" placeholder="https://instagram.com/suaempresa" value={settings.instagramUrl} onChange={handleSettingsChange} />
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label htmlFor="whatsappUrl">URL do WhatsApp</Label>
                        <Input id="whatsappUrl" placeholder="https://wa.me/55119XXXXXXXX" value={settings.whatsappUrl} onChange={handleSettingsChange} />
                        <p className="text-sm text-muted-foreground">Use o formato internacional: https://wa.me/55119...</p>
                    </div>
                </div>
                
                <Separator />
                <h3 className="text-lg font-medium">Logos da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="headerLogo">Logo do Cabeçalho</Label>
                    <Input id="headerLogo" type="file" onChange={(e) => handleFileChange(e, 'headerLogoFile')} />
                     {settings.headerLogoUrl && !settings.headerLogoFile && <img src={settings.headerLogoUrl} alt="Header Logo" className="w-32 mt-2 rounded-md" />}
                     <p className="text-sm text-muted-foreground">png 916x332px</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footerLogo">Logo do Rodapé</Label>
                    <Input id="footerLogo" type="file" onChange={(e) => handleFileChange(e, 'footerLogoFile')} />
                     {settings.footerLogoUrl && !settings.footerLogoFile && <img src={settings.footerLogoUrl} alt="Footer Logo" className="w-32 mt-2 rounded-md" />}
                     <p className="text-sm text-muted-foreground">png monocromatico 916x332px</p>
                  </div>
                </div>
                <Button type="submit" disabled={isSavingSettings}>
                  {isSavingSettings ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSavingSettings ? 'Salvando...' : 'Salvar Configurações Gerais'}
                </Button>
              </CardContent>
            </Card>
          </form>

        </div>
      </PageLayout>
    </>
  );
};

export default SettingsPage;
