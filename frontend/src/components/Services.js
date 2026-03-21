"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Translation Service",
    description:
      "AI-powered translation that preserves meaning, tone, and cultural nuance across languages — enabling truly natural global communication.",
  },
  {
    title: "Transcription and Recording",
    description:
      "Accurate real-time transcription with intelligent speaker detection and structured recordings designed for clarity and accessibility.",
  },
  {
    title: "Dubbing and Voiceover",
    description:
      "Human-like AI voice synthesis delivering emotionally aligned dubbing and voiceovers tailored for global audiences.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25 } },
};

const card = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Services() {
  return (
    <section className="relative bg-white py-32 px-6">
      {/* Section Heading */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-black text-4xl md:text-6xl font-semibold tracking-tight">
          Our Capabilities
        </h2>
        <p className="text-black/60 mt-6 text-lg max-w-2xl mx-auto">
          Intelligent language technologies designed to remove barriers and
          redefine how the world communicates.
        </p>
      </div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={card}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative p-10 rounded-2xl bg-green-600 border border-green-500 backdrop-blur-xl transition-all duration-300 hover:border-green-400"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-white/10 via-transparent to-transparent" />

            <h3 className="text-white text-2xl font-semibold mb-4">
              {service.title}
            </h3>

            <p className="text-white/85 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
