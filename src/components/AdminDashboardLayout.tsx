"use client"

import { useState } from "react"
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

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-white">
      <AdminHeader user={user} onMenuClick={() => setSidebarOpen(true)} />
      
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />

      <main className="md:ml-64 pt-16 min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

export default AdminDashboardLayout
