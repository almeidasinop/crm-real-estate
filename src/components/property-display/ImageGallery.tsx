import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  imageUrls: string[];
}

const ImageGallery = ({ imageUrls }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="relative w-full pt-[56.25%] bg-gray-200 rounded-lg flex items-center justify-center">
           <p className="text-gray-500">Nenhuma imagem disponível</p>
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
        {/* Main Image Display */}
        <div className="relative mb-2 group">
          <div
            onClick={() => openLightbox(activeIndex)}
            style={{ backgroundImage: `url('${imageUrls[activeIndex]}')` }}
            className="relative w-full pt-[56.25%] bg-cover bg-center bg-no-repeat rounded-lg cursor-pointer border border-gray-200 shadow-sm"
          >
            {/* Navigation Arrows */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Horizontal Scrollable Thumbnails */}
        {imageUrls.length > 1 && (
          <div className="flex overflow-x-auto space-x-2 p-2 -mx-2">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className="flex-shrink-0 cursor-pointer"
              >
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`h-16 w-24 object-cover rounded-md border-2 transition-all
                    ${activeIndex === index ? 'border-brand-blue' : 'border-transparent'}`
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox/Modal with new style */}
      {isLightboxOpen && (
        <div 
          // --- CORREÇÃO AQUI: Alterado o fundo do overlay para branco ---
          className="fixed inset-0 bg-white flex items-center justify-center z-[9999]" 
          onClick={closeLightbox}
        >
          
          {/* The Gallery Component Container */}
          <div 
            className="relative bg-white rounded-lg shadow-2xl flex flex-col w-full h-full max-w-6xl max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-4 -right-4 text-gray-800 bg-white rounded-full p-1 z-50 hover:bg-gray-200 shadow-lg"
            >
              <X size={24} />
            </button>

            {/* Main Image Container */}
            <div className="relative flex-grow flex items-center justify-center overflow-hidden p-4">
              <img
                src={imageUrls[activeIndex]}
                alt={`Imagem ${activeIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-md"
              />
              
              {/* Navigation Arrows */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50"
                  >
                    <ChevronLeft size={40} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50"
                  >
                    <ChevronRight size={40} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {imageUrls.length > 1 && (
              <div className="flex-shrink-0 bg-gray-50 p-2 border-t border-gray-200">
                <div className="flex overflow-x-auto space-x-2 justify-center p-2">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className="flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className={`h-16 w-24 object-cover rounded-md border-2 transition-all
                          ${activeIndex === index ? 'border-brand-blue' : 'border-gray-300'}`
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
