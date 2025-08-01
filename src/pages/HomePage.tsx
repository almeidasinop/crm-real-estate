
import { useEffect } from "react";
import { useTheme } from "next-themes";
import HeroCarousel from "@/components/home/HeroCarousel";
import PropertyList from "@/components/home/PropertyList";
import PropertySearchForm from "@/components/home/PropertySearchForm";
import PageLayout from "@/components/layout/PageLayout";

const HomePage = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <PageLayout showNavbar={false}>
      <div className="space-y-8">
        <HeroCarousel />
        <div className="-translate-y-20">
          <PropertySearchForm />
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Imóveis em Destaque</h2>
          <PropertyList />
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
