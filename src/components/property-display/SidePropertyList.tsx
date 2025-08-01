
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const SidePropertyList = ({ title, properties }: { title: string, properties: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {properties.map(property => (
            <li key={property.id}>
              <Link to={`/imovel/${property.id}`} className="hover:text-primary">
                <p className="font-semibold">{property.title}</p>
                <p className="text-sm text-muted-foreground">{property.price}</p>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SidePropertyList;
