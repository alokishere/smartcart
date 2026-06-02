"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  PackagePlus,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react"

interface SidebarUser {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/add-grocery", label: "Add Product", icon: PackagePlus },
  { href: "/admin/manage-products", label: "Manage Products", icon: ShoppingCart },
  { href: "/admin/manage-users", label: "Manage Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: SidebarUser
  isDark?: boolean
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, user, isDark }: AdminSidebarProps) => {
  const pathname = usePathname()

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <Link href="/admin/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight">SmartCart</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 capitalize">{user.role}</p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-linear-to-b from-green-500 to-emerald-500"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <link.icon className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"
                    }`} />
                    <span>{link.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-green-500 dark:text-green-400" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-gray-100 dark:border-slate-800 p-3">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <aside className={`hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col border-r z-30 transition-colors duration-200 ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center gap-2.5 px-5 h-16 border-b shrink-0 transition-colors duration-200"
          style={{ borderColor: isDark ? "#1e293b" : "#e5e7eb" }}>
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <span className={`font-extrabold text-xl tracking-tight transition-colors duration-200 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>SmartCart</span>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-b shrink-0 transition-colors duration-200"
          style={{ borderColor: isDark ? "#1e293b" : "#e5e7eb" }}>
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold truncate transition-colors duration-200 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>{user.name}</p>
            <p className="text-xs font-medium text-green-600 dark:text-green-400 capitalize">{user.role}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicatorDesktop"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-linear-to-b from-green-500 to-emerald-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <link.icon className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"
                }`} />
                <span>{link.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-green-500 dark:text-green-400" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-100 dark:border-slate-800 p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
