
// AdminHeader.jsx
import React from 'react'
import { Menu, Bell, User } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext';
import { useCurrentUser } from '../../hooks/useUsers';

const AdminHeader = ({ setSidebarOpen }) => {
     const { data: user, isLoading: userLoading, error: userError } = useCurrentUser()
      console.log(user, "user data in profile page")
    
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
          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5" />
          </button>

          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button className="flex items-center p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
