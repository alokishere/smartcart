"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"
import { Menu, ShoppingCart, UserIcon, LogOut } from "lucide-react"

interface HeaderUser {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

const AdminHeader = ({ user, onMenuClick }: { user: HeaderUser; onMenuClick: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-linear-to-r from-green-500 to-green-700 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-white" />
            <span className="text-white font-extrabold text-xl tracking-wide">SmartCart</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 relative">
          <div
            ref={buttonRef}
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
          >
            {user.image ? (
              <Image src={user.image} alt={user.name} fill className="rounded-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 text-green-600" />
            )}
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-14 right-0 w-56 bg-white rounded-xl shadow-xl border border-green-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-green-600 font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      signOut({ callbackUrl: "/login" })
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
    </header>
  )
}

export default AdminHeader
