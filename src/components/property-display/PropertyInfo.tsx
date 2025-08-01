
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PropertyInfo = ({ property }: { property: any }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge>{property.type}</Badge>
            <CardTitle className="text-3xl font-bold mt-2">{property.title}</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{property.price}</p>
            <CardDescription>Publicado em {property.publishedDate}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2">Descrição</h3>
        <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
