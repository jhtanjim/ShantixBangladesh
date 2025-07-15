import { AlertCircle, RefreshCw } from "lucide-react";

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
        <span className="text-red-800">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </button>
      )}
    </div>
  </div>
);
