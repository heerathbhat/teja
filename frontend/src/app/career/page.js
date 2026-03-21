"use client";

import { useState } from "react";

const careerData = {
  isHiring: true,
  positions: [
    {
      id: 1,
      role: "Translation Specialist",
      type: "Full-time",
      location: "Remote",
      description:
        "We are looking for a skilled Translation Specialist fluent in multiple languages to deliver accurate and culturally appropriate translations for our clients across diverse industries.",
    },
    {
      id: 2,
      role: "Transcription Analyst",
      type: "Part-time",
      location: "Hybrid",
      description:
        "Join our team as a Transcription Analyst to convert audio and video content into precise written documents. Strong listening skills and attention to detail are essential.",
    },
    {
      id: 3,
      role: "Voice-Over Artist",
      type: "Contract",
      location: "Remote",
      description:
        "We need a talented Voice-Over Artist with a clear, engaging voice to record professional narrations for e-learning modules, advertisements, and corporate videos.",
    },
  ],
};

function StatusBadge({ isHiring }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
        isHiring
          ? "bg-green-100 text-green-700 border border-green-400"
          : "bg-red-500/15 text-red-400 border border-red-500/30"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${isHiring ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
      {isHiring ? "Actively Hiring" : "Not Hiring"}
    </span>
  );
}

function TypeBadge({ type }) {
  const colors = {
    "Full-time": "bg-green-100 text-green-700 border-green-300",
    "Part-time": "bg-emerald-100 text-emerald-700 border-emerald-300",
    Contract: "bg-teal-100 text-teal-700 border-teal-300",
  };
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${colors[type] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
      {type}
    </span>
  );
}

function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-green-200 hover:border-green-400 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-black group-hover:text-green-600 transition-colors">
              {job.role}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <TypeBadge type={job.type} />
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            </div>
          </div>
        </div>

        <p className={`text-gray-700 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
          {job.description}
        </p>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-green-600 hover:text-green-700 transition-colors cursor-pointer"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
          <a
            href={`mailto:careers@projectteja.com?subject=Application for ${encodeURIComponent(job.role)}`}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md"
          >
            Apply Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CareerPage() {
  const { isHiring, positions } = careerData;

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">Careers</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            Join our team and help deliver world-class translation,
            transcription, and voice-over services.
          </p>
          <StatusBadge isHiring={isHiring} />
        </div>

        {isHiring ? (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 uppercase tracking-wider font-medium">
              {positions.length} Open Position{positions.length !== 1 && "s"}
            </p>
            {positions.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-green-50 rounded-2xl border border-green-200 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black mb-3">Currently Not Hiring</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We don&apos;t have any open positions right now, but we&apos;re
              always interested in hearing from talented people.
            </p>
            <a
              href="mailto:careers@projectteja.com"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Send Your Resume
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
