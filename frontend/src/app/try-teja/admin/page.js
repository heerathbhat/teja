"use client";

import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const user = useAuth("admin");
  const router = useRouter();

  if (!user) return null;

  function logout() {
    localStorage.removeItem("tejaUser");
    window.location.href = "/try-teja";
  }

  const services = [
    { name: "Translation", path: "/try-teja/admin/translation", icon: "🌐" },
    { name: "Transcription", path: "/try-teja/admin/transcription", icon: "📝" },
    { name: "Voiceover", path: "/try-teja/admin/voiceover", icon: "🎙️" },
  ];

  const stats = [
    { label: "Total Tasks", value: "24", change: "+12%" },
    { label: "In Progress", value: "8", change: "+3" },
    { label: "Completed", value: "16", change: "+9" },
    { label: "Pending", value: "5", change: "-2" },
  ];

  const recentTasks = [
    { id: 1, title: "English to Hindi Translation", service: "Translation", status: "In Progress", date: "2024-01-15" },
    { id: 2, title: "Podcast Transcription", service: "Transcription", status: "Pending", date: "2024-01-15" },
    { id: 3, title: "Spanish Voiceover", service: "Voiceover", status: "Completed", date: "2024-01-14" },
    { id: 4, title: "French Translation", service: "Translation", status: "Completed", date: "2024-01-14" },
  ];

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            Admin Dashboard
          </h1>
          <p className="text-black/70 mt-1">
            Welcome back, {user.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/try-teja/admin/translation/create">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
            >
              <span>+</span> New Task
            </motion.button>
          </Link>
          <button
            onClick={logout}
            className="border border-black/20 px-5 py-2 rounded-lg hover:bg-black/5 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black text-white rounded-2xl p-6"
          >
            <p className="text-white/60 text-sm">{stat.label}</p>
            <p className="text-3xl font-semibold mt-2">{stat.value}</p>
            <p className="text-green-400 text-sm mt-2">{stat.change} this week</p>
          </motion.div>
        ))}
      </div>

      {/* SERVICE CARDS */}
      <h2 className="text-xl font-semibold mb-4">Services</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {services.map((service) => (
          <motion.div
            key={service.name}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(service.path)}
            className="
              cursor-pointer
              bg-black
              text-white
              border border-white/20
              rounded-2xl
              p-8
              text-center
              transition-all
              hover:border-white
              hover:shadow-[black_10px_10px_20px_-10px]
            "
          >
            <span className="text-4xl mb-4 block">{service.icon}</span>
            <h2 className="text-xl font-medium tracking-wide">
              {service.name}
            </h2>
            <p className="text-white/50 mt-2 text-sm">
              Manage tasks and workflow
            </p>
          </motion.div>
        ))}
      </div>

      {/* RECENT TASKS */}
      <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
      <div className="bg-black rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-black/80 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-white/60">Task</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Service</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Status</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task, index) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4">{task.title}</td>
                  <td className="p-4 text-white/60">{task.service}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      task.status === "Completed" ? "bg-green-500/20 text-green-400" :
                      task.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/60 text-sm">{task.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
