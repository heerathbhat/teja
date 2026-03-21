"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function InternDashboard() {
  const user = useAuth("intern");
  const router = useRouter();

  const [selectedTask, setSelectedTask] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [filter, setFilter] = useState("All");
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  /* ================= READ LOCAL STORAGE ================= */
  const translationStatus =
    typeof window !== "undefined"
      ? localStorage.getItem("translationStatus") || "In Progress"
      : "In Progress";

  const transcriptionStatus =
    typeof window !== "undefined"
      ? localStorage.getItem("transcriptionStatus") || "Pending"
      : "Pending";

  /* ================= TASK DATA ================= */
  const tasks = [
    {
      title: "English to Hindi Translation",
      service: "Translation",
      status: translationStatus,
      date: "2024-01-15",
    },
    {
      title: "Podcast Transcription",
      service: "Transcription",
      status: transcriptionStatus,
      date: "2024-01-15",
    },
    {
      title: "Website Translation",
      service: "Translation",
      status: "Completed",
      date: "2024-01-14",
    },
  ];

  /* ================= NOTIFICATIONS ================= */
  const notifications = [];
  if (translationStatus === "Completed")
    notifications.push("Translation task completed ✅");

  if (transcriptionStatus === "Completed")
    notifications.push("Transcription task completed ✅");

  /* ================= FILTER ================= */
  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  const totalTasks = tasks.length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;
  const completedCount = tasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const pendingCount = tasks.filter(
    (t) => t.status === "Pending"
  ).length;

  /* ================= ACTIONS ================= */

  function logout() {
    localStorage.removeItem("tejaUser");
    window.location.href = "/try-teja";
  }

  function submitFeedback() {
    alert("Feedback submitted successfully ✅");
    setSelectedTask(null);
    setFeedback("");
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white text-black px-10 py-14">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-3xl font-semibold">
            Intern Dashboard
          </h1>
          <p className="text-black/60 mt-2">
            Welcome back, {user.email}
          </p>
        </div>

        <div className="flex items-center gap-6">

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="text-2xl"
            >
              🔔
            </button>

            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-4 w-72 bg-black text-white rounded-2xl shadow-2xl p-4 z-50"
                >
                  <h3 className="font-semibold mb-3">
                    Notifications
                  </h3>

                  {notifications.length === 0 ? (
                    <p className="text-white/60 text-sm">
                      No new notifications
                    </p>
                  ) : (
                    notifications.map((note, i) => (
                      <div
                        key={i}
                        className="text-sm border-b border-white/10 py-2"
                      >
                        {note}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={logout}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-8 mb-20">
        <StatCard title="Total Tasks" value={totalTasks} />
        <StatCard title="In Progress" value={inProgressCount} />
        <StatCard title="Completed" value={completedCount} />
        <StatCard title="Pending" value={pendingCount} />
      </div>

      {/* SERVICES */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <ServiceCard
          title="Translation"
          desc="Work on assigned translation tasks."
          onClick={() =>
            router.push("/try-teja/intern/translation")
          }
        />

        <ServiceCard
          title="Transcription"
          desc="Access transcription assignments."
          onClick={() =>
            router.push("/try-teja/intern/transcription")
          }
        />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }) {
  return (
    <div className="bg-black text-white rounded-3xl p-8">
      <p className="text-white/60 text-sm">{title}</p>
      <h2 className="text-4xl font-semibold mt-3">{value}</h2>
    </div>
  );
}

function ServiceCard({ title, desc, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="bg-black text-white rounded-3xl p-10 cursor-pointer"
    >
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-white/60">{desc}</p>
    </motion.div>
  );
}