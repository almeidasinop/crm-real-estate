
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  imageUrls: string[];
}

const ImageGallery = ({ imageUrls }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // --- Defensive Coding: Check for valid imageUrls ---
  if (!imageUrls || imageUrls.length === 0) {
    // Display a placeholder or simply nothing if no images are available
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      {/* Main Image Display */}
      <div className="relative mb-4">
        <div
          style={{ backgroundImage: `url('${imageUrls[activeIndex]}')` }}
          className="relative w-full pt-[56.25%] bg-cover bg-center bg-no-repeat rounded-lg"
        >
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`w-full h-auto object-cover rounded-md cursor-pointer border-2 transition-all
              ${activeIndex === index ? 'border-brand-blue shadow-md' : 'border-transparent hover:border-gray-300'}`
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
