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
    <nav className="w-full fixed top-0 z-50 bg-white backdrop-blur-md text-black border-b border-green-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" onClick={() => setOpen(false)}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.08 }}
            className="cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="relative"
            >
              <Image
                src="/teja_logo_nobg.png"
                alt="TEJA Logo"
                width={110}
                height={40}
                className="rounded-full"
              />
              <motion.div
                className="absolute inset-0 blur-xl bg-green-100/30 rounded-full"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          </motion.div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.button
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`
                    relative px-5 py-2 rounded-full text-sm tracking-wide
                    overflow-hidden group backdrop-blur-md
                    border transition
                    ${
                      active
                        ? "bg-green-600 text-white border-green-600"
                        : "border-green-300 text-black"
                    }
                  `}
                >
                  <span className="absolute inset-0 bg-green-600 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                  <span
                    className={`
                      relative z-10 transition
                      ${active ? "text-white" : "group-hover:text-white"}
                    `}
                  >
                    {item.name}
                  </span>
                </motion.button>
              </Link>
            );
          })}
          {mounted && user && (
            <motion.button
              onClick={handleLogout}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full text-sm border-red-300 text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </motion.button>
          )}
        </div>


        {/* MOBILE BUTTON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <motion.div animate={open ? "open" : "closed"} className="space-y-1">
            <motion.span
              variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } }}
              className="block w-6 h-0.5 bg-green-700"
            />
            <motion.span
              variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
              className="block w-6 h-0.5 bg-green-700"
            />
            <motion.span
              variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -6 } }}
              className="block w-6 h-0.5 bg-green-700"
            />
          </motion.div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="md:hidden bg-white border-t border-green-100"
          >
            <div className="flex flex-col items-center py-8 gap-6">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      px-8 py-3 rounded-full transition
                      ${
                        pathname === item.href
                          ? "bg-green-600 text-white"
                          : "hover:bg-green-100 text-black"
                      }
                    `}
                  >
                    {item.name}
                  </motion.button>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
