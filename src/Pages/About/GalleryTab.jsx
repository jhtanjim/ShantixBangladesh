import { ChevronLeft, ChevronRight } from "lucide-react";

const GalleryTab = ({
  galleryImages = [],
  currentImageIndex,
  setCurrentImageIndex,
  nextImage,
  prevImage,
}) => {
  if (!galleryImages.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No images available.
        </p>
      </div>
    );
  }

  const currentImage = galleryImages[currentImageIndex] || {};

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
          Photo Gallery
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">
          Take a look at our facilities, operations, and team in action
        </p>
      </div>

      {/* Main Image Display */}
      <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4">
        <div className="relative">
          <div className="aspect-video sm:aspect-[4/3] lg:aspect-[16/9] w-full overflow-hidden rounded-lg">
            <img
              src={currentImage.image}
              alt={currentImage.alt || "Gallery image"}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4">
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full transition-colors shadow-lg"
              tabIndex={0}
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full transition-colors shadow-lg"
              tabIndex={0}
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
            <div className="bg-black/60 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Caption */}
          {currentImage.caption && (
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
              <div className="bg-black/60 text-white p-2 sm:p-3 rounded-lg">
                <h3 className="font-semibold text-xs sm:text-sm lg:text-base">
                  {currentImage.caption}
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3 lg:gap-4">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all aspect-square ${
              index === currentImageIndex
                ? "ring-2 sm:ring-4 ring-blue-600 scale-105"
                : "hover:ring-2 hover:ring-blue-300 hover:scale-105"
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
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Mobile Swipe Indicator */}
      <div className="flex justify-center sm:hidden">
        <p className="text-xs text-gray-500 text-center">
          Swipe or use arrows to navigate
        </p>
      </div>
    </div>
  );
};

export default GalleryTab;
