
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Car, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Importando os componentes reutilizáveis
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import '../components/home/PropertyCard.css'; // Importando o CSS

import { Settings, PropertyViewModel } from '@/types/crm';

// --- Dados Padrão e Mocks ---
const defaultSettings: Settings = {
    companyName: "Sonhar Imóveis",
    banners: [{
        title: "Cadastre um Banner na Página de Configurações",
        text: "Adicione um título, texto e imagem de fundo para personalizar a sua página inicial.",
        imageUrl: "https://placehold.co/1920x800/4f46e5/ffffff?text=Adicione+um+Banner"
    }],
    footerPhone: "(00) 1234-5678",
    footerEmail: "contato@imobiliaria.com",
    footerAddress: "Seu Endereço Completo Aqui",
};

const mockProperty: PropertyViewModel = {
    id: 'mock1',
    nome: 'Casa de Exemplo - Bairro Modelo',
    cidade: 'Sua Cidade',
    bairro: 'Bairro Modelo',
    valor: 750000,
    tipo: 'Casa',
    condicao: 'Venda',
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    fotos: [{ url: 'https://placehold.co/600x400/a5b4fc/3730a3?text=Imóvel+Exemplo' }]
};


// --- Componente Card de Imóvel ---
const PropertyCard = ({ property }: { property: PropertyViewModel }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 transform hover:-translate-y-1 hover:shadow-xl group force-light-card">
        <Link to={`/imovel/${property.id}`} className="block">
            <div className="relative overflow-hidden h-56">
                <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                    {property.condicao && property.condicao !== 'Não informado' && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-md shadow-md cardss" style={{ backgroundColor: '#2ECC71' }}>
                            {property.condicao}
                        </span>
                    )}
                    {property.tipo && property.tipo !== 'Não informado' && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-md shadow-md cardss" style={{ backgroundColor: '#FF9100' }}>
                            {property.tipo}
                        </span>
                    )}
                </div>
                <img
                    src={property.fotos && property.fotos.length > 0 ? property.fotos[0].url : 'https://placehold.co/600x400/E0E7FF/4F46E5?text=Sem+Foto'}
                    alt={`Foto de ${property.nome}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-xl property-price">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.valor)}
                    </p>
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mt-1 truncate" title={property.nome}>{property.nome}</h3>
                <p className="flex items-center text-gray-500 text-sm mt-2 mb-4">
                    <MapPin className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                    {property.bairro}, {property.cidade}
                </p>
                <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-sm border-t border-gray-100 pt-4">
                    {property.quartos && <span title="Quartos" className="flex items-center text-gray-800"><Bed className="mr-1.5 h-4 w-4 text-gray-500" /> {property.quartos}</span>}
                    {property.banheiros && <span title="Banheiros" className="flex items-center text-gray-800"><Bath className="mr-1.5 h-4 w-4 text-gray-500" /> {property.banheiros}</span>}
                    {property.vagas && <span title="Vagas" className="flex items-center text-gray-800"><Car className="mr-1.5 h-4 w-4 text-gray-500" /> {property.vagas}</span>}
                </div>
            </div>
        </Link>
    </div>
);

// --- Componente Principal da Página ---
const HomePage = () => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [properties, setProperties] = useState<PropertyViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [propertyCondition, setPropertyCondition] = useState('');
    
    // Estado para o carrossel de banners
    const [currentBanner, setCurrentBanner] = useState(0);

    // Efeito para trocar o banner automaticamente
    useEffect(() => {
        const activeBanners = settings.banners?.filter(b => b.title && b.imageUrl) || [];
        if (activeBanners.length > 1) {
            const timer = setTimeout(() => {
                setCurrentBanner((prevBanner) => (prevBanner + 1) % activeBanners.length);
            }, 5000); // Troca a cada 5 segundos
            return () => clearTimeout(timer); // Limpa o timer
        }
    }, [currentBanner, settings.banners]);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const settingsDocRef = doc(db, "settings", "general");
                const settingsSnap = await getDoc(settingsDocRef);
                if (settingsSnap.exists()) {
                    setSettings(settingsSnap.data() as Settings);
                }

                const propertiesQuery = query(collection(db, "properties"), limit(6));
                const propertiesSnap = await getDocs(propertiesQuery);
                const propsData = propertiesSnap.docs.map(docSnap => {
                    const data = docSnap.data();
                    const getCondicao = (status: string) => {
                        if (status === 'disponivel') return 'Venda';
                        if (status === 'alugado') return 'Aluguel';
                        return status; // Retorna o status original ou 'Não informado'
                    };
                    return {
                        id: docSnap.id,
                        nome: data.title || "Título Indisponível",
                        cidade: data.address?.city || "Cidade não informada",
                        bairro: data.address?.neighborhood || "Bairro não informado",
                        valor: data.price || 0,
                        tipo: data.type || "Não informado",
                        condicao: getCondicao(data.status),
                        quartos: data.bedrooms,
                        banheiros: data.bathrooms,
                        vagas: data.parkingSpaces,
                        fotos: data.images || [],
                    } as PropertyViewModel;
                });
                setProperties(propsData);

            } catch (error) {
                console.error("Error fetching data for home page:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams = new URLSearchParams({
            term: searchTerm,
            type: propertyType,
            condition: propertyCondition,
        }).toString();
        navigate(`/propriedades?${queryParams}`);
    };

    const activeBanners = settings.banners?.filter(b => b.title && b.imageUrl) || [];
    const heroBanner = activeBanners.length > 0 ? activeBanners[currentBanner] : defaultSettings.banners![0];

    const nextBanner = () => {
        setCurrentBanner(current => (current + 1) % activeBanners.length);
    };

    const prevBanner = () => {
        setCurrentBanner(current => (current - 1 + activeBanners.length) % activeBanners.length);
    };


    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-12 w-12 text-brand-blue" /></div>;
    }

    return (
        <div className="bg-gray-50">
            <AppHeader settings={settings} />

            <section
                className="relative text-white py-20 lg:py-32 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${heroBanner.imageUrl}')` }}
            >
                <div className="container mx-auto text-center px-4 z-10 relative">
                    <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg" dangerouslySetInnerHTML={{ __html: heroBanner.title }}></h1>
                    <p className="font-satisfy text-3xl lg:text-4xl mb-8 max-w-3xl mx-auto drop-shadow-md" dangerouslySetInnerHTML={{ __html: heroBanner.text }}></p>
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-4xl mx-auto">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input type="text" placeholder="Busque por título, bairro..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="col-span-1 md:col-span-2 p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                            <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="p-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                                <option value="">Tipo</option>
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="terreno">Terreno</option>
                                <option value="comercial">Comercial</option>
                            </select>
                             <select value={propertyCondition} onChange={e => setPropertyCondition(e.target.value)} className="p-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                                <option value="">Condição</option>
                                <option value="disponivel">Venda</option>
                                <option value="alugado">Aluguel</option>
                            </select>
                            <button type="submit" className="col-span-1 md:col-span-4 bg-brand-blue text-white font-bold p-3 rounded-md hover:bg-brand-blue-dark transition flex items-center justify-center">
                                <Search className="mr-2 h-5 w-5"/>
                                Buscar Imóvel
                            </button>
                        </form>
                    </div>
                </div>

                {/* Controles do Carrossel */}
                {activeBanners.length > 1 && (
                    <>
                        {/* <button onClick={prevBanner} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-20">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextBanner} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-20">
                            <ChevronRight size={24} />
                        </button> */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                            {activeBanners.map((_, index) => (
                                <button key={index} onClick={() => setCurrentBanner(index)} className={`h-2 w-2 rounded-full ${currentBanner === index ? 'bg-white' : 'bg-white/50'}`}></button>
                            ))}
                        </div>
                    </>
                )}
            </section>

            <main className="container mx-auto p-4 lg:p-8">
                <section className="my-16">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Imóveis para Você</h2>
                    <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Confira os mais recentes imóveis que adicionamos ao nosso portfólio.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                       {properties.length > 0 ?
                         properties.map(prop => <PropertyCard key={prop.id} property={prop} />) :
                         (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center p-8 bg-gray-100 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-700">Ainda não há imóveis aqui!</h3>
                                <p className="text-gray-500 mt-2 mb-4">Cadastre o primeiro imóvel na "Área do Corretor" para que ele apareça na sua página inicial.</p>
                                <div className="max-w-sm mx-auto mt-4">
                                    <PropertyCard property={mockProperty} />
                                </div>
                            </div>
                         )
                       }
                    </div>
                    {properties.length > 0 &&
                        <div className="text-center mt-12">
                            <Link to="/propriedades" className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition">Ver Todos os Imóveis</Link>
                        </div>}
                </section>
            </main>

            <AppFooter settings={settings} />
        </div>
    );
};

export default HomePage;
