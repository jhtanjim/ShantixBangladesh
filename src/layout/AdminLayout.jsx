"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import { AdminSidebar } from "../components/AdminSidebar/AdminSidebar"

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <Outlet />
      </main>
    </div>
  )
}
