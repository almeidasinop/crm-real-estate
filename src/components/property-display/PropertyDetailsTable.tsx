
interface PropertyDetails {
  builtArea?: string | number;
  landArea?: string | number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  parkingSpaces?: string | number;
}

interface PropertyDetailsTableProps {
  details: PropertyDetails;
}

const PropertyDetailsTable = ({ details }: PropertyDetailsTableProps) => {
  if (!details) {
    return null; 
  }

  const detailItems = [
    { label: 'Área Construída', value: details.builtArea, unit: 'm²' },
    { label: 'Área do Terreno', value: details.landArea, unit: 'm²' },
    { label: 'Quartos', value: details.bedrooms },
    { label: 'Banheiros', value: details.bathrooms },
    { label: 'Vagas', value: details.parkingSpaces },
  ];

  const availableDetails = detailItems.filter(item => item.value !== undefined && item.value !== null && item.value !== '');

  if (availableDetails.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Detalhes</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
        {availableDetails.map(item => (
          <div key={item.label} className="bg-gray-100 p-4 rounded-lg">
            <p className="font-bold text-xl text-brand-blue">
              {item.value}
              {item.unit && <span className="text-base"> {item.unit}</span>}
            </p>
            <p className="text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyDetailsTable;
