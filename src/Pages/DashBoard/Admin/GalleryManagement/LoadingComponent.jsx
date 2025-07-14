import { Loader2 } from "lucide-react";

// Loading Component
export const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-blue-600`} />
    </div>
  );
};
export default LoadingSpinner;
