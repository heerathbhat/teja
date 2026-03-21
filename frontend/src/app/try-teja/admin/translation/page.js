"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TranslationList() {
  const user = useAuth("admin");
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  if (!user) return null;

  const tasks = [
    { id: 1, title: "Website Content Translation", source: "English", target: "Hindi", status: "In Progress", assignee: "John Doe", date: "2024-01-15" },
    { id: 2, title: "Marketing Materials", source: "English", target: "Spanish", status: "Pending", assignee: "Unassigned", date: "2024-01-15" },
    { id: 3, title: "Legal Document", source: "English", target: "French", status: "Completed", assignee: "Jane Smith", date: "2024-01-14" },
    { id: 4, title: "App UI Strings", source: "English", target: "German", status: "In Progress", assignee: "Mike Johnson", date: "2024-01-14" },
    { id: 5, title: "Product Descriptions", source: "English", target: "Japanese", status: "Completed", assignee: "Sarah Lee", date: "2024-01-13" },
    { id: 6, title: "Customer Support Docs", source: "English", target: "Chinese", status: "Pending", assignee: "Unassigned", date: "2024-01-13" },
  ];

  const filteredTasks = filter === "all" ? tasks : tasks.filter(task => task.status.toLowerCase().replace(" ", "") === filter.toLowerCase());

  const statusCounts = {
    all: tasks.length,
    inprogress: tasks.filter(t => t.status === "In Progress").length,
    pending: tasks.filter(t => t.status === "Pending").length,
    completed: tasks.filter(t => t.status === "Completed").length,
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-4">
            <Link href="/try-teja/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-black/60 hover:text-black"
              >
                ← Back
              </motion.button>
            </Link>
            <h1 className="text-3xl font-semibold">Translation Tasks</h1>
          </div>
          <p className="text-black/60 mt-1 ml-14">Manage and monitor translation tasks</p>
        </div>

        <Link href="/try-teja/admin/translation/create">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
          >
            <span>+</span> New Task
          </motion.button>
        </Link>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-6">
        {["all", "inprogress", "pending", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === status
                ? "bg-black text-white"
                : "bg-black/5 text-black/60 hover:bg-black/10"
            }`}
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* TASKS GRID */}
      <div className="grid gap-4">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-black text-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition"
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium">{task.title}</h3>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/60">
                <span>{task.source} → {task.target}</span>
                <span>•</span>
                <span>Assigned: {task.assignee}</span>
                <span>•</span>
                <span>{task.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs ${
                task.status === "Completed" ? "bg-green-500/20 text-green-400" :
                task.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                "bg-yellow-500/20 text-yellow-400"
              }`}>
                {task.status}
              </span>
              
              <Link href={`/try-teja/admin/translation/monitor?id=${task.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-white/20 px-4 py-1 rounded-lg text-sm hover:bg-white/10 transition"
                >
                  View
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-20 text-black/40">
          <p>No tasks found</p>
        </div>
      )}
    </div>
  );
}
