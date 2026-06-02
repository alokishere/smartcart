"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import {
  Menu,
  X,
  PackagePlus,
  LayoutGrid,
  Users,
  Settings,
  LogOut,
  UserIcon,
  ShoppingCart,
} from "lucide-react"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/add-grocery", label: "Add Product", icon: PackagePlus },
  { href: "/admin/manage-products", label: "Manage Products", icon: ShoppingCart },
  { href: "/admin/manage-users", label: "Manage Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

const AdminDashboardLayout = ({ user }: { user: AdminUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-linear-to-r from-green-500 to-green-700 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <ShoppingCart className="w-7 h-7 text-white" />
              <span className="text-white font-extrabold text-xl tracking-wide">
                SmartCart
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-green-600" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            ref={sidebarRef}
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-2xl md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-green-100">
              <span className="text-green-700 font-extrabold text-lg">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:bg-green-50 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-green-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
            <div className="border-t border-green-100 p-3">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg flex-col border-r border-green-100">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-green-100">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 truncate max-w-36">
              {user.name}
            </span>
            <span className="text-xs text-green-600 font-medium capitalize">
              {user.role}
            </span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-green-100 p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64 pt-16 min-h-screen p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <LayoutGrid className="w-6 h-6 text-green-600" />
                  <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {user.name}
                  </h1>
                </div>
                <p className="text-gray-500">
                  Manage your store from here. Use the sidebar to navigate
                  between sections.
                </p>

                {/* Stats cards */}
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
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default AdminDashboardLayout
