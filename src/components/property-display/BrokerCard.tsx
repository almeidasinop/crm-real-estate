
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

const BrokerCard = ({ broker }: { broker: any }) => {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={broker.imageUrl} alt={broker.name} />
          <AvatarFallback>{broker.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{broker.name}</CardTitle>
        <p className="text-sm text-muted-foreground">Corretor de Imóveis</p>
        <p className="text-sm text-muted-foreground">CRECI: {broker.creci}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full">
          <Phone className="mr-2 h-4 w-4" /> {broker.phone}
        </Button>
        <Button variant="secondary" className="w-full">
          <Mail className="mr-2 h-4 w-4" /> Enviar E-mail
        </Button>
      </CardContent>
    </Card>
  );
};

export default BrokerCard;
