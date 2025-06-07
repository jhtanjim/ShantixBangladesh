"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Car, Users, ChevronDown, ChevronRight, Menu, Home } from "lucide-react"
import { GoListOrdered } from "react-icons/go"

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = React.useState<string[]>(["cars", "users"])

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

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
      title: "Users",
      icon: Users,
      key: "users",
      items: [
        { title: "All Users", path: "/admin/users" },
        { title: "Create User", path: "/admin/users/create" },
      ],
    },
    {
      title: "Orders",
      icon: GoListOrdered,
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

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className={`flex items-center gap-2 ${!isOpen && "justify-center"}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          {isOpen && <span className="font-semibold text-gray-900">Admin Panel</span>}
        </div>
        <button onClick={onToggle} className="p-1 rounded-md hover:bg-gray-100">
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.items ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.key!)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors ${
                      !isOpen && "justify-center"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {expandedItems.includes(item.key!) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {isOpen && expandedItems.includes(item.key!) && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            to={subItem.path}
                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                              location.pathname === subItem.path
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path!}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  } ${!isOpen && "justify-center"}`}
                >
                  <item.icon className="h-5 w-5" />
                  {isOpen && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
