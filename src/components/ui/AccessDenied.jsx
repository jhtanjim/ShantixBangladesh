import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from "../../Context/AuthContext";

const AccessDenied = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldX className="h-12 w-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          You don't have permission to access the admin dashboard. Admin privileges are required to view this page.
        </p>

        {/* Current Role */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Current Role:</p>
          <p className="font-semibold text-gray-900 uppercase">
            {user?.role || "USER"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button
            onClick={handleReturnHome}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home size={16} />
            Return to Home
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need admin access?{" "}
            <a 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
