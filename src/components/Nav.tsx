"use client";
import {
  Delete,
  LogOut,
  Package,
  Search,
  ShoppingCartIcon,
  UserIcon,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { User } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
const Nav = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [openSearch, setopenSearch] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const handleClearInput = () => {
    setSearchInput("");
    setopenSearch(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close profile dropdown if clicked outside the dropdown and outside the profile toggle button
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(target)
      ) {
        setOpen(false);
      }

      // Close search dropdown if clicked outside the dropdown and outside the search toggle button
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(target)
      ) {
        setopenSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    //  left tittle center search input and right cart icon and user avater icon should be on top bar
    <div className="">
      <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500  to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50">
        <Link
          href={"/"}
          className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide
        hover:scale-105 transition-transform"
        >
          Snapcart
        </Link>

        <form className="hidden md:flex items-center bg-white  backdrop-blur-md rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent text-gray-700 placeholder-gray-500 w-48 md:w-64 lg:w-96 focus:outline-none px-2 py-1"
          />
        </form>

        <div className="flex items-center gap-3 md:gap-6 relative">
          <div
            ref={searchButtonRef}
            className="md:hidden relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-100 cursor-pointer"
            onClick={() => {
              setopenSearch((prev) => !prev);
            }}
          >
            <Search key={"search1"} className="text-green-600 w-6 h-6" />
          </div>
          <Link
            href={"/cart"}
            className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-100 cursor-pointer"
          >
            <ShoppingCartIcon className="text-green-600 w-6 h-6" />
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              0
            </span>
          </Link>
          <div
            ref={profileButtonRef}
            onClick={() => setOpen((prev) => !prev)}
            className="relative bg-white text-green-600 font-bold w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                sizes="full"
                className="rounded-full shadow-md hover:scale-105 transition-transform duration-100 cursor-pointer "
              />
            ) : (
              <UserIcon className="w-6 h-6" />
            )}
          </div>
        </div>
        {/* now menu bar should be there  */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-24 right-0 w-64 bg-white rounded-lg shadow-lg z-999"
              ref={profileDropdownRef}
            >
              <div className="p-4">
                <Link
                  href={"/profile"}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 mb-2 hover:bg-green-100 rounded-lg p-2 cursor-pointer transition-transform duration-100 "
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={50}
                      height={50}
                      className="rounded-full shadow-md hover:scale-105 transition-transform duration-100 cursor-pointer "
                    />
                  ) : (
                    <UserIcon className="w-6 h-6" />
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="text-gray-700 font-medium">
                      {user.name}
                    </span>
                    <span className="text-gray-700 font-mono text-xs">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <Link
                  onClick={() => setOpen(false)}
                  href="/orders"
                  className="flex items-center  text-gray-700 gap-2 px-3 py-3 hover:bg-green-100 rounded-lg"
                >
                  <Package />
                  Orders
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="flex w-full items-center text-gray-700 gap-2 px-3 py-3 hover:bg-green-100 rounded-lg"
                >
                  <LogOut className=" w-5 h-5 text-red-600" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {openSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute w-[90%] top-24 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg z-50 flex items-center px-4 py-2"
              ref={searchDropdownRef}
            >
              <Search className="text-gray-700 w-5 h-5 mr-2" />
              <form className="grow">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  className=" focus:outline-none focus:border-none "
                  placeholder="search products"
                />
              </form>
              <button
                className={`${searchInput ? "" : "hidden"} text-gray-500 h-5 w-5 mr-3`}
                onClick={() => {
                  setopenSearch(true);
                  setSearchInput("");
                }}
              >
                <Delete className="font-thin text-sm" />
              </button>
              <button
                className="text-gray-500 h-5 w-5"
                onClick={() => setopenSearch(false)}
              >
                <X fill="currentColor" className="font-thin text-sm" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Nav;
