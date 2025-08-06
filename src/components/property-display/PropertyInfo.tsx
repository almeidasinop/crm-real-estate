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

const PropertyInfo = ({ property }: { property: any }) => {
  // --- Verificação de Segurança ---
  if (!property) {
    return null;
  }

  const descriptionItems = parseDescriptionToList(property.description);
  const location = [property.address?.city, property.address?.state].filter(Boolean).join(', ');
  
  // --- Lógica de data atualizada para ser mais robusta ---
  const getDate = (dateValue: any): Date | null => {
      // Caso 1: O valor já é um objeto Date do JavaScript (confirmado pelo console)
      if (dateValue instanceof Date) {
          return dateValue;
      }
      // Caso 2: O valor é um Timestamp do Firestore (para garantir compatibilidade)
      if (dateValue && typeof dateValue.seconds === 'number') {
          return new Date(dateValue.seconds * 1000);
      }
      // Se não for nenhum dos formatos esperados, retorna null
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
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{property.title || 'Título não informado'}</h1>
          {location && (
            <p className="text-gray-500 flex items-center mt-1">
              <MapPin className="mr-2 h-4 w-4" />
              {location}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-3xl font-bold text-brand-blue">{formatCurrency(property.price)}</p>
          {/* Exibe a data e o rótulo corretos */}
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
    </div>
  );
};

export default PropertyInfo;
