// AdminHeader.jsx
import { Menu, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";

const AdminHeader = ({ setSidebarOpen }) => {
  const { user, token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate("/");
    // Force update auth state immediately
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
    });
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="ml-4 text-lg font-semibold text-gray-900 md:ml-0">
            Dashboard
          </h1>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-4">
          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button className="flex items-center p-2 text-white hover:text-white hover:bg-blue bg-red-600 rounded-full">
              <User className="w-6 h-6" />

              <button
                onClick={handleLogout}
                className=" transition-colors px-2 py-1 rounded"
              >
                Logout
              </button>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
