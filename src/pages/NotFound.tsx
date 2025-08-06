
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Frown, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-xl mx-auto p-8">
        {/* Vídeo centralizado, com tamanho controlado */}
        <div className="w-full max-w-md mx-auto mb-6">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-lg"
          >
            <source
              src="https://static.vecteezy.com/system/resources/previews/026/147/099/mp4/investment-property-business-bw-error-404-animation-investor-house-error-message-gif-motion-graphic-real-estate-agent-selling-home-animated-character-outline-4k-isolated-on-white-background-video.mp4"
              type="video/mp4"
            />
            Seu navegador não suporta vídeos em HTML5.
          </video>
        </div>
        <p className="text-xl text-muted-foreground mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/"><ArrowLeft className="h-4 w-4 mr-2"/>Voltar para a página inicial</Link>
      </div>
    </div>
  );
};
export default NotFound;
