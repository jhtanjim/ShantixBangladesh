// AdminSidebar.jsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  Store, 
  User, 
  X, 
  Menu, 
  Home, 
  ArrowBigLeft, 
  Subscript, 
  Upload, 
  LogOut, 
  Heart, 
  Grid3X3,
  Car,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [openDropdowns, setOpenDropdowns] = useState({})

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Cars",
      icon: Car,
      key: "cars",
      items: [
        { title: "All Cars", path: "/admin/cars" },
        { title: "Create Car", path: "/admin/cars/create" },
      ],
    },
    {
      title: "All Users",
      icon: Users,
      key: "users",
      path: "/admin/users"
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      key: "orders",
      path: "/admin/orders" 
    },
    {
      title: "Back TO Home",
      icon: Home,
      key: "home",
      path: "/" 
    },
  ]

  const isActive = (path) => location.pathname === path
  
  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }
  
  const renderNavItem = (item, isMobile = false) => {
    const hasDropdown = item.items && item.items.length > 0
    const isDropdownOpen = openDropdowns[item.key]
    
    if (hasDropdown) {
      return (
        <div key={item.key}>
          <button
            onClick={() => toggleDropdown(item.key)}
            className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg text-left ${
              item.items.some(child => isActive(child.path))
                ? 'bg-[#1a2639] text-white' 
                : 'text-gray-300 hover:bg-[#1a2639] hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </div>
            {isDropdownOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {isDropdownOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {item.items.map((child) => (
                <Link
                  key={child.title}
                  to={child.path}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive(child.path) 
                      ? 'bg-[#1a2639] text-white' 
                      : 'text-gray-300 hover:bg-[#1a2639] hover:text-white'
                  }`}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    // Regular navigation items
    return (
      <div key={item.key || item.title}>
        <Link
          to={item.path}
          onClick={() => isMobile && setSidebarOpen(false)}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
            isActive(item.path) 
              ? 'bg-[#1a2639] text-white' 
              : 'text-gray-300 hover:bg-[#1a2639] hover:text-white'
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.title}
        </Link>
      </div>
    )
  }
  
  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-[#131e2c] text-white">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <span className="text-xl font-bold">Admin Panel</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {menuItems.map((item) => renderNavItem(item, true))}
              
              {/* Logout button */}
              <button
                onClick={() => {
                  // Add your logout logic here
                  navigate('/login')
                }}
                className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-[#1a2639] hover:text-white mt-8 border-t border-gray-700 pt-4"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 min-h-0 bg-[#131e2c] text-white">
            <div className="flex items-center h-16 px-6 border-b border-gray-700">
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            
            <div className="flex-1 px-4 py-4 overflow-y-auto">
              <nav className="space-y-1">
                {menuItems.map((item) => renderNavItem(item, false))}
                
                {/* Logout button */}
                <button
                  onClick={() => {
                    // Add your logout logic here
                    navigate('/login')
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-[#1a2639] hover:text-white mt-8 border-t border-gray-700 pt-4"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
