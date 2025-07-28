import { ChevronLeft, ChevronRight } from "lucide-react";

const GalleryTab = ({
  galleryImages = [],
  currentImageIndex,
  setCurrentImageIndex,
  nextImage,
  prevImage,
}) => {
  if (!galleryImages.length) {
    return <p className="text-center text-gray-500">No images available.</p>;
  }
  const currentImage = galleryImages[currentImageIndex] || {};

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Photo Gallery</h2>
        <p className="text-gray-600">
          Take a look at our facilities, operations, and team in action
        </p>
      </div>

      {/* Main Image Display */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="relative">
          <img
            src={currentImage.image}
            alt={currentImage.alt || "Gallery image"}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-between p-4">
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
              tabIndex={0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
              tabIndex={0}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {currentImage.caption && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 text-white p-3 rounded-lg">
                <h3 className="font-semibold">{currentImage.caption}</h3>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
              index === currentImageIndex
                ? "ring-4 ring-blue-600"
                : "hover:ring-2 hover:ring-blue-300"
            }`}
            onClick={() => setCurrentImageIndex(index)}
            role="button"
            tabIndex={0}
            aria-label={`View image ${index + 1}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setCurrentImageIndex(index);
              }
            }}
          >
            <img
              src={image.image}
              alt={image.alt || `Thumbnail image ${index + 1}`}
              loading="lazy"
              className="w-full h-20 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryTab;
