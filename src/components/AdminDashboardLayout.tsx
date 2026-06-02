"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

const AdminDashboardLayout = ({ user, children }: { user: AdminUser; children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("admin-theme")
    if (stored === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("admin-theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("admin-theme", "light")
      }
      return next
    })
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? "bg-slate-950" : "bg-gray-50"
    }`}>
      <AdminHeader user={user} onMenuClick={() => setSidebarOpen(true)} isDark={isDark} onToggleDark={toggleDark} />

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} isDark={isDark} />

      <main className={`md:ml-64 pt-16 min-h-screen transition-colors duration-200 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

export default AdminDashboardLayout
