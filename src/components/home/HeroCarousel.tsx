
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HeroCarousel = () => {
  const banners = [
    {
      id: 1,
      title: "Encontre o Imóvel dos Seus Sonhos",
      description: "As melhores propriedades da cidade, selecionadas para você.",
      imageUrl: "https://via.placeholder.com/1200x500/1E40AF/FFFFFF?text=Banner+1",
    },
    {
      id: 2,
      title: "Consultoria Especializada",
      description: "Nossos corretores estão prontos para te ajudar a fazer o melhor negócio.",
      imageUrl: "https://via.placeholder.com/1200x500/3B82F6/FFFFFF?text=Banner+2",
    },
    {
      id: 3,
      title: "Venda ou Alugue com Agilidade",
      description: "Anuncie seu imóvel conosco e alcance milhares de interessados.",
      imageUrl: "https://via.placeholder.com/1200x500/1E3A8A/FFFFFF?text=Banner+3",
    },
  ];

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="p-1">
              <Card className="overflow-hidden">
                <CardContent className="relative flex aspect-video items-center justify-center p-0">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
                    <h2 className="text-4xl font-bold">{banner.title}</h2>
                    <p className="text-lg mt-2">{banner.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
};

export default HeroCarousel;
