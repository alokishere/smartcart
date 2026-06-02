"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react"

interface HeaderUser {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

interface AdminHeaderProps {
  user: HeaderUser
  onMenuClick: () => void
  isDark: boolean
  onToggleDark: () => void
}

const AdminHeader = ({ user, onMenuClick, isDark, onToggleDark }: AdminHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownOpen])

  return (
    <header className={`fixed top-0 left-0 md:left-64 right-0 z-30 h-16 transition-colors duration-200 ${
      isDark
        ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800"
        : "bg-white/95 backdrop-blur-md border-b border-gray-200"
    }`}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className={`md:hidden rounded-lg p-2 transition-colors ${
              isDark ? "text-slate-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <h1 className={`text-base font-semibold transition-colors duration-200 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>Dashboard</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors duration-200 ${
              isDark ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600"
            }`}>Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden lg:flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-200 w-72 ${
            searchFocused
              ? "ring-2 ring-green-500 dark:ring-green-400"
              : ""
          } ${
            isDark
              ? "bg-slate-800 border border-slate-700"
              : "bg-gray-100 border border-gray-200"
          }`}>
            <Search className={`w-4 h-4 shrink-0 transition-colors ${
              searchFocused ? "text-green-500 dark:text-green-400" : isDark ? "text-slate-500" : "text-gray-400"
            }`} />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`bg-transparent text-sm w-full focus:outline-none transition-colors ${
                isDark ? "text-white placeholder-slate-500" : "text-gray-700 placeholder-gray-400"
              }`}
            />
            <kbd className={`hidden xl:inline-flex text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
              isDark ? "bg-slate-700 text-slate-400" : "bg-gray-200 text-gray-500"
            }`}>⌘K</kbd>
          </div>

          <button
            onClick={onToggleDark}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isDark
                ? "text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-4.5 h-4.5" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-4.5 h-4.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <button className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isDark
              ? "text-slate-400 hover:text-white hover:bg-slate-800"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`} aria-label="Notifications">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          <div className="relative">
            <div
              ref={buttonRef}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200 ${
                isDark
                  ? "hover:bg-slate-800"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="relative w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0 overflow-hidden">
                {user.image ? (
                  <Image src={user.image} alt={user.name} fill className="object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className={`text-sm font-medium max-w-24 truncate transition-colors duration-200 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                } ${isDark ? "text-slate-500" : "text-gray-400"}`} />
              </div>
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`absolute top-full right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden transition-colors duration-200 ${
                    isDark
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className={`p-4 border-b transition-colors duration-200 ${
                    isDark ? "border-slate-800" : "border-gray-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate transition-colors duration-200 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}>{user.name}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium capitalize">{user.role}</p>
                        <p className={`text-xs truncate mt-0.5 transition-colors duration-200 ${
                          isDark ? "text-slate-500" : "text-gray-500"
                        }`}>{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        signOut({ callbackUrl: "/login" })
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isDark
                          ? "text-red-400 hover:bg-red-500/10"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
