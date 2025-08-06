import { MapPin } from "lucide-react";
import { format } from 'date-fns';

// --- Helper para formatar moeda ---
const formatCurrency = (value: number) => {
  if (typeof value !== 'number') return "Preço sob consulta";
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// --- Helper para converter a descrição em lista ---
const parseDescriptionToList = (description: string) => {
  if (!description) return [];
  return description.split('\\n').filter(item => item.trim() !== '');
};

// --- NOVO COMPONENTE PARA O SELO DE FINANCIAMENTO ---
const FinancingInfo = () => (
  <div className="mt-6 border-t border-gray-200 pt-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800">Financiamento Fácil</h3>
        <p className="text-gray-600 mt-1">Pretende Financiar? <span className="font-bold">SIMULE AS MELHORES TAXAS EM UM SÓ LUGAR</span></p>
        <p className="text-sm text-gray-500 mt-2">Simule seu financiamento em minutos com todos os bancos e consiga a melhor proposta.</p>
      </div>
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/imob-crm.firebasestorage.app/o/cross_sell.svg?alt=media&token=b8157962-827d-44ad-9c0f-378bb14a74a9" 
        alt="Ícone de Financiamento"
        className="w-20 h-20 ml-4"
      />
    </div>
  </div>
);


const PropertyInfo = ({ property }: { property: any }) => {
  if (!property) {
    return null;
  }

  const descriptionItems = parseDescriptionToList(property.description);
  const location = [property.address?.city, property.address?.state].filter(Boolean).join(', ');
  
  const getDate = (dateValue: any): Date | null => {
      if (dateValue instanceof Date) return dateValue;
      if (dateValue && typeof dateValue.seconds === 'number') return new Date(dateValue.seconds * 1000);
      return null;
  };

  const creationDate = getDate(property.createdAt);
  const updateDate = getDate(property.updatedAt);
  
  let displayDate = 'Data não informada';
  let dateLabel = 'Publicado em';

  if (creationDate) {
    displayDate = format(creationDate, 'dd/MM/yyyy');
    dateLabel = 'Publicado em';
  } else if (updateDate) {
    displayDate = format(updateDate, 'dd/MM/yyyy');
    dateLabel = 'Atualizado em';
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Container principal ajustado para ser responsivo */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
        {/* Bloco do Título e Localização */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{property.title || 'Título não informado'}</h1>
          {location && (
            <p className="text-gray-500 flex items-center mt-1">
              <MapPin className="mr-2 h-4 w-4" />
              {location}
            </p>
          )}
        </div>
        {/* Bloco do Preço e Data (com margem e alinhamento responsivos) */}
        <div className="mt-4 md:mt-0 md:text-right md:flex-shrink-0 md:ml-4">
          {/* Tamanho da fonte ajustado para ser responsivo */}
          <p className="text-2xl md:text-3xl font-bold text-brand-blue">{formatCurrency(property.price)}</p>
          <p className="text-sm text-gray-500">{dateLabel} {displayDate}</p>
        </div>
      </div>

      {descriptionItems.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Descrição do Imóvel</h2>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            {descriptionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Renderiza o componente de financiamento se a propriedade for verdadeira */}
      {property.financingAvailable && <FinancingInfo />}
    </div>
  );
};

export default PropertyInfo;
