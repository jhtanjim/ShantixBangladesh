import { LogIn } from "lucide-react";
import Button from "./Button";

const LoginRequiredModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Login Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please log in to place an order and start negotiating. You'll need
            an account to track your orders and communicate with our team.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onLogin} className="flex-1">
              <LogIn size={16} className="mr-2" />
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginRequiredModal;
