"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const navItems = [
    { name: "Services", href: "/services" },
    { name: "Career", href: "/career" },
    { name: "Contact Us", href: "/contact" },
  ];

  if (mounted) {
    if (user) {
      if (user.role === "admin") {
        navItems.push({ name: "Dashboard", href: "/admin" });
      } else {
        navItems.push({ name: "My Tasks", href: "/intern" });
      }
    } else {
      navItems.push({ name: "Login", href: "/login" });
    }
  }


  return (
    <nav className="w-full fixed top-0 z-50 bg-[#f0f9f1]/80 backdrop-blur-md text-black border-b border-green-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" onClick={() => setOpen(false)}>
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <div className="bg-gray-800 p-2 rounded-full">
              <span className="text-white font-black text-xl tracking-tighter">TEJA</span>
            </div>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-4 items-center">
          {navItems.map((item) => {
            const isDashboard = item.name === "Dashboard" || item.name === "My Tasks";
            const active = pathname === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <button
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      isDashboard
                        ? "bg-[#00a859] text-white hover:bg-[#008f4c] shadow-sm"
                        : "border border-green-200 text-gray-600 hover:bg-green-50"
                    }
                  `}
                >
                  {item.name}
                </button>
              </Link>
            );
          })}
          
          {mounted && user && (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-green-800 transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-green-800 transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-green-800 transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-green-100 p-6 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setOpen(false)} className="w-full">
                <button className="w-full py-3 rounded-full border border-green-100 text-gray-700 hover:bg-green-50">
                  {item.name}
                </button>
              </Link>
            ))}
            {mounted && user && (
              <button 
                onClick={handleLogout}
                className="w-full py-3 text-red-500 font-bold"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
