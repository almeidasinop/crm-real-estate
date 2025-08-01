
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ImageGallery = ({ imageUrls }: { imageUrls: string[] }) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {imageUrls.map((url, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden">
              <CardContent className="relative flex aspect-video items-center justify-center p-0">
                <img src={url} alt={`Imagem do imóvel ${index + 1}`} className="h-full w-full object-cover" />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
};

export default ImageGallery;
