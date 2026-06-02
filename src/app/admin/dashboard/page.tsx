"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Plus,
  Eye,
  MoreHorizontal,
  CircleDollarSign,
  Loader2,
} from "lucide-react"

const stats = [
  { label: "Total Products", value: "0", change: "+0", trend: "up", icon: Package, color: "from-green-500 to-emerald-600", lightBg: "bg-green-50 dark:bg-green-500/10", iconColor: "text-green-600 dark:text-green-400" },
  { label: "Total Orders", value: "0", change: "+0", trend: "up", icon: ShoppingCart, color: "from-blue-500 to-indigo-600", lightBg: "bg-blue-50 dark:bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400" },
  { label: "Total Users", value: "0", change: "+0%", trend: "up", icon: Users, color: "from-purple-500 to-violet-600", lightBg: "bg-purple-50 dark:bg-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400" },
  { label: "Revenue", value: "$0.00", change: "+0%", trend: "up", icon: CircleDollarSign, color: "from-amber-500 to-orange-600", lightBg: "bg-amber-50 dark:bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400" },
]

const chartData = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
]

const recentOrders = [
  { id: "#ORD-001", customer: "—", product: "—", amount: "$0.00", status: "—" },
]

const topProducts = [
  { name: "No products yet", sales: 0, revenue: "$0", image: null },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const statusStyles: Record<string, string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const AdminDashboard = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {getGreeting()}, Admin
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{formatDate()}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.lightBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                stat.trend === "up"
                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              }`}>
                {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{stat.label}</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
            <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
            />
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Analytics Overview</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Monthly performance</p>
            </div>
            <button className="text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
              View full report →
            </button>
          </div>
          <div className="flex items-end gap-2 h-44 lg:h-52">
            {chartData.map((item) => {
              const height = Math.max(item.value, 4)
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="w-full max-w-10 rounded-lg bg-linear-to-t from-green-500 to-emerald-400 dark:from-green-600 dark:to-green-400 relative group/chart cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-slate-700 text-white text-[10px] font-medium px-2 py-1 rounded-md opacity-0 group-hover/chart:opacity-100 transition-opacity whitespace-nowrap">
                      {item.value} sales
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-medium text-gray-400 dark:text-slate-500">{item.month}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 lg:p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Top Products</h2>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Package className="w-8 h-8 text-gray-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-gray-400 dark:text-slate-500">No products yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{product.sales} sales</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{product.revenue}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between p-5 lg:p-6 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Latest transactions</p>
          </div>
          <button className="text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800">
                {["Order ID", "Customer", "Product", "Amount", "Status", ""].map((header) => (
                  <th key={header} className="text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-5 lg:px-6 py-3.5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 lg:px-6 py-12 text-center">
                    <ShoppingCart className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 dark:text-slate-500">No orders yet</p>
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 lg:px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-5 lg:px-6 py-3.5 text-sm text-gray-600 dark:text-slate-300">{order.customer}</td>
                    <td className="px-5 lg:px-6 py-3.5 text-sm text-gray-600 dark:text-slate-300">{order.product}</td>
                    <td className="px-5 lg:px-6 py-3.5 text-sm font-medium text-gray-900 dark:text-white">{order.amount}</td>
                    <td className="px-5 lg:px-6 py-3.5">
                      <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 lg:px-6 py-3.5">
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Add Product", icon: Package, desc: "Add new grocery items", href: "/admin/add-grocery" },
          { label: "Manage Products", icon: ShoppingCart, desc: "Edit or remove products", href: "/admin/manage-products" },
          { label: "Manage Users", icon: Users, desc: "View and manage users", href: "/admin/manage-users" },
          { label: "Settings", icon: Eye, desc: "Configure your store", href: "/admin/settings" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="group flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-slate-900/50 hover:border-green-200 dark:hover:border-green-500/20 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
              <action.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.label}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{action.desc}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors shrink-0" />
          </a>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default AdminDashboard
