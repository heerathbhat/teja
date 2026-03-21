"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TryTejaAuth() {
  const router = useRouter();

  const [mode, setMode] = useState("signup");
  const [role, setRole] = useState("intern");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* --------------------------------------------------
     ✅ Auto login if session already exists
  -------------------------------------------------- */
  useEffect(() => {
    const savedUser = localStorage.getItem("tejaUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      if (user?.loggedIn) {
        if (user.role === "admin")
          router.replace("/try-teja/admin");
        else router.replace("/try-teja/intern");
      }
    }
  }, [router]);

  /* --------------------------------------------------
     ✅ Handle Login / Signup
  -------------------------------------------------- */
  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return; // prevent double click
    setLoading(true);

    // simulate auth delay
    await new Promise((res) => setTimeout(res, 800));

    // ✅ Save session (DEV AUTH)
    localStorage.setItem(
      "tejaUser",
      JSON.stringify({
        email,
        role,
        loggedIn: true,
      })
    );

    // ✅ Route based on role
    if (role === "admin") router.push("/try-teja/admin");
    else router.push("/try-teja/intern");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-green-500 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl"
        >
          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="text-3xl font-semibold mb-8 text-center"
            >
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </motion.h2>
          </AnimatePresence>

          {/* Email */}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full mb-4 p-3 bg-white/40 border border-white/20 rounded-lg
            focus:outline-none focus:border-white focus:bg-white/15
            transition-all duration-300"
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full mb-6 p-3 bg-white/40 border border-white/20 rounded-lg
            focus:outline-none focus:border-white focus:bg-white/15
            transition-all duration-300"
          />

          {/* Role */}
          <div className="relative mb-6">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-white/40 border border-white/20 rounded-lg text-black
              focus:outline-none focus:border-white transition-all duration-300"
            >
              <option value="intern">Intern</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg font-medium
            hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <motion.div
                className="h-5 w-5 border-2 border-black border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              />
            ) : (
              "Continue"
            )}
          </motion.button>

          {/* Toggle Mode */}
          <p
            className="mt-6 text-sm text-white/60 text-center cursor-pointer hover:text-white transition"
            onClick={() =>
              setMode(mode === "signup" ? "login" : "signup")
            }
          >
            {mode === "signup"
              ? "Already a member? Login"
              : "New here? Create an account"}
          </p>
        </form>
      </motion.div>
    </div>
  );
}