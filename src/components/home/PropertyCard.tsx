
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Car, MapPin } from "lucide-react";
import "./PropertyCard.css";

const PropertyCard = ({ property }: { property: any }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0 relative">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="h-56 w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-xl font-bold property-price">{property.price}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Badge variant={property.type === 'Venda' ? 'default' : 'secondary'} className="mb-2">
          {property.type}
        </Badge>
        <CardTitle className="text-lg mb-2">{property.title}</CardTitle>
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="mr-1 h-4 w-4" />
          {property.location}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Bed className="mr-2 h-4 w-4" /> {property.bedrooms} Quartos
          </div>
          <div className="flex items-center">
            <Bath className="mr-2 h-4 w-4" /> {property.bathrooms} Banheiros
          </div>
          <div className="flex items-center">
            <Car className="mr-2 h-4 w-4" /> {property.garages} Vagas
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-center p-4 bg-muted">
        <Button>Ver Detalhes</Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
