import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingComponent";
export const ImagePreview = ({
  src,
  alt,
  className = "",
  showOverlay = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <LoadingSpinner size="sm" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${showOverlay ? "hover:scale-105" : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}

      {showOverlay && loaded && !error && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Eye className="h-8 w-8 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
