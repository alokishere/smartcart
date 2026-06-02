"use client"

import { LayoutGrid } from "lucide-react"

const AdminDashboard = () => {
  return (
    <div className="bg-green rounded-2xl shadow-md p-6 md:p-8 border border-green-100">
      <div className="flex items-center gap-3 mb-6">
        <LayoutGrid className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin</h1>
      </div>
      <p className="text-gray-500">Manage your store from here. Use the sidebar to navigate between sections.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div className="bg-linear-to-br from-green-400 to-green-600 rounded-xl p-5 text-white shadow-md">
          <p className="text-sm opacity-90">Total Products</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-xl p-5 text-white shadow-md">
          <p className="text-sm opacity-90">Total Orders</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="bg-linear-to-br from-purple-400 to-purple-600 rounded-xl p-5 text-white shadow-md">
          <p className="text-sm opacity-90">Total Users</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
