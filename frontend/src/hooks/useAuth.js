"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function useAuth(requiredRole) {
  const router = useRouter();

  // ✅ Read user safely (no state needed)
  const user = useMemo(() => {
    if (typeof window === "undefined") return null;

    const storedUser = localStorage.getItem("tejaUser");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }, []);

  // ✅ Only handle redirects in effect
  useEffect(() => {
    if (!user || !user.loggedIn) {
      router.replace("/try-teja");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/try-teja");
    }
  }, [user, requiredRole, router]);

  return user;
}