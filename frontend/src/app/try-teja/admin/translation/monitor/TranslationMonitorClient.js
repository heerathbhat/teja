"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function TranslationMonitorClient() {
  const user = useAuth("admin");
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");
  
  const [status, setStatus] = useState("In Progress");
  const [assignee, setAssignee] = useState("John Doe");
  const [notes, setNotes] = useState("");

  if (!user) return null;

  // Mock task data - in real app, fetch by ID
  const task = {
    id: taskId || 1,
    title: "Website Content Translation",
    sourceLanguage: "English",
    targetLanguage: "Hindi",
    content: "Welcome to our platform. We provide the best services for all your needs. Our team is dedicated to delivering excellence.",
    translatedContent: "हमारे प्लेटफॉर्म पर आपका स्वागत है। हम आपकी सभी जरूरतों के लिए सर्वोत्तम सेवाएं प्रदान करते हैं। हमारी टीम उत्कृष्टता प्रदान करने के लिए समर्पित है।",
    status: "In Progress",
    priority: "High",
    deadline: "2024-01-20",
    createdAt: "2024-01-15",
    assignee: "John Doe",
  };

  const activityLog = [
    { id: 1, action: "Task created", user: "Admin", date: "2024-01-15 10:00 AM" },
    { id: 2, action: "Assigned to John Doe", user: "Admin", date: "2024-01-15 10:30 AM" },
    { id: 3, action: "Status changed to In Progress", user: "John Doe", date: "2024-01-15 11:00 AM" },
    { id: 4, action: "First draft completed", user: "John Doe", date: "2024-01-15 03:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Link href="/try-teja/admin/translation">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-black/60 hover:text-black"
            >
              ← Back
            </motion.button>
          </Link>
          <h1 className="text-3xl font-semibold">Monitor Translation Task</h1>
        </div>
        <p className="text-black/60 mt-1 ml-14">Track progress and manage the translation task</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black text-white rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="text-white/60 text-sm mt-1">{task.sourceLanguage} → {task.targetLanguage}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                task.status === "Completed" ? "bg-green-500/20 text-green-400" :
                task.status === "In Progress" ? "bg-blue-500/20 text-blue-400" :
                "bg-yellow-500/20 text-yellow-400"
              }`}>
                {task.status}
              </span>
            </div>

            {/* Source Content */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 mb-2">Source Content</h3>
              <div className="bg-white/5 rounded-lg p-4 text-white/80">
                {task.content}
              </div>
            </div>

            {/* Translated Content */}
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">Translated Content</h3>
              <div className="bg-white/5 rounded-lg p-4 text-white/80">
                {task.translatedContent}
              </div>
            </div>
          </motion.div>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-black/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
            <div className="space-y-4">
              {activityLog.map((log, index) => (
                <div key={log.id} className="flex gap-4">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 shrink-0" />
                  <div>
                    <p className="text-sm">{log.action}</p>
                    <p className="text-xs text-black/40">
                      {log.user} • {log.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* Task Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-black/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Task Info</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-black/50 uppercase tracking-wide">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1 p-2 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-black/50 uppercase tracking-wide">Assignee</label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full mt-1 p-2 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-black/50 uppercase tracking-wide">Priority</label>
                <p className="mt-1 text-sm">{task.priority}</p>
              </div>

              <div>
                <label className="text-xs text-black/50 uppercase tracking-wide">Deadline</label>
                <p className="mt-1 text-sm">{task.deadline}</p>
              </div>

              <div>
                <label className="text-xs text-black/50 uppercase tracking-wide">Created</label>
                <p className="mt-1 text-sm">{task.createdAt}</p>
              </div>
            </div>
          </motion.div>

          {/* Add Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-black/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Add Note</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note..."
              rows={4}
              className="w-full p-3 bg-black/5 border border-black/10 rounded-lg focus:outline-none focus:border-black resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Add Note
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
