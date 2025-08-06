
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

// Interfaces para tipagem
interface User {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'corretor';
  // Adicionar outros campos conforme necessário
  [key: string]: any;
}

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const UserEditModal = ({ user, isOpen, onClose, onSave }: UserEditModalProps) => {
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [id]: value });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com upload de arquivos
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Usuário: {formData.name}</DialogTitle>
          <DialogDescription>
            Atualize as informações do corretor. Clique em salvar para aplicar as mudanças.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-6">
          <div className="space-y-6">

            {/* 1. Identificação Pessoal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Identificação Pessoal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={formData.name || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" value={formData.cpf || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={formData.email || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input id="birthDate" type="date" value={formData.birthDate || ''} onChange={handleChange} />
                </div>
              </div>
            </div>
            
            <Separator />

            {/* 2. Contato */}
            <div className="space-y-4">
               <h3 className="text-lg font-semibold">2. Contato</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cellphone">Telefone Celular</Label>
                        <Input id="cellphone" placeholder="(00) 99999-9999" value={formData.cellphone || ''} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Telefone Residencial/Comercial</Label>
                        <Input id="phone" placeholder="(00) 3333-3333" value={formData.phone || ''} onChange={handleChange} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input id="address" placeholder="Rua, Número, Bairro, Cidade, Estado, CEP" value={formData.address || ''} onChange={handleChange} />
                </div>
            </div>
            
            <Separator />

            {/* 3. Dados Profissionais */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">3. Dados Profissionais (CRECI)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="creciNumber">Número do CRECI</Label>
                        <Input id="creciNumber" value={formData.creciNumber || ''} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="creciState">Estado do CRECI</Label>
                        <Input id="creciState" value={formData.creciState || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="creciValidity">Data de Validade</Label>
                        <Input id="creciValidity" type="date" value={formData.creciValidity || ''} onChange={handleChange} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="specializations">Especializações/Áreas de Atuação</Label>
                    <Input id="specializations" placeholder="Ex: residencial, comercial, alto padrão" value={formData.specializations || ''} onChange={handleChange} />
                </div>
            </div>
            
            <Separator />

            {/* 4. Vínculo com a Imobiliária */}
             <div className="space-y-4">
                <h3 className="text-lg font-semibold">4. Vínculo com a Imobiliária</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bondStart">Data de Início do Vínculo</Label>
                        <Input id="bondStart" type="date" value={formData.bondStart || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bondType">Tipo de Vínculo</Label>
                         <select id="bondType" value={formData.bondType || ''} onChange={handleChange} className="w-full p-2 border rounded-md bg-transparent">
                            <option value="">Selecione...</option>
                            <option value="CLT">CLT</option>
                            <option value="PJ">Pessoa Jurídica</option>
                            <option value="Cooperado">Cooperado</option>
                            <option value="Comissionado">Comissionado</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status do Corretor</Label>
                        <select id="status" value={formData.status || ''} onChange={handleChange} className="w-full p-2 border rounded-md bg-transparent">
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                            <option value="ferias">Férias</option>
                             <option value="afastado">Afastado</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="team">Equipe/Gerente Responsável</Label>
                        <Input id="team" value={formData.team || ''} onChange={handleChange} />
                    </div>
                </div>
            </div>
            
            <Separator />

            {/* 5. Dados Bancários */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">5. Dados Bancários</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bankName">Banco</Label>
                        <Input id="bankName" value={formData.bankName || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="agency">Agência</Label>
                        <Input id="agency" value={formData.agency || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account">Conta Corrente</Label>
                        <Input id="account" value={formData.account || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accountHolderName">Nome do Titular</Label>
                        <Input id="accountHolderName" value={formData.accountHolderName || ''} onChange={handleChange} />
                    </div>
                 </div>
            </div>
            
            <Separator />

             {/* 6. Acessos e Segurança */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">6. Acessos e Segurança</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Nível de Permissão/Acesso</Label>
                        <select id="role" value={formData.role || 'corretor'} onChange={handleChange} className="w-full p-2 border rounded-md bg-transparent">
                            <option value="corretor">Corretor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="newPassword">Redefinir Senha (Opcional)</Label>
                        <Input id="newPassword" type="password" placeholder="Deixe em branco para não alterar" onChange={handleChange} />
                    </div>
                 </div>
            </div>
            
            <Separator />

            {/* 7. Documentos (Anexos) */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">7. Documentos (Anexos)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="docCreci">Cópia da Carteira do CRECI</Label>
                        <Input id="docCreci" type="file" onChange={handleFileChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="docRgCpf">Cópia do RG e CPF</Label>
                        <Input id="docRgCpf" type="file" onChange={handleFileChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="docAddress">Comprovante de Residência</Label>
                        <Input id="docAddress" type="file" onChange={handleFileChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="docContract">Contrato de Vínculo</Label>
                        <Input id="docContract" type="file" onChange={handleFileChange} />
                    </div>
                 </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
