"use client";

import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <main className="bg-white text-black overflow-hidden">

      {/* HERO */}
      <section className="text-center py-28 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-6 tracking-tight text-black"
        >
          Our Language Solutions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
        >
          Professional translation, transcription, and voice solutions
          focused on Indian languages with accuracy, speed,
          and cultural understanding.
        </motion.p>
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto px-6 pb-28 grid md:grid-cols-3 gap-10">
        {[
          {
            title: "Translation Services",
            desc: "Accurate and context-aware translation across major Indian languages. Ideal for business documents, websites, and multilingual communication."
          },
          {
            title: "Transcription Services",
            desc: "Convert audio and video into clean, structured text across regional languages. Perfect for interviews, podcasts, and meetings."
          },
          {
            title: "Dubbing & Voiceover",
            desc: "Professional voiceover and dubbing services tailored for regional audiences across films, advertisements, and digital platforms."
          }
        ].map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-green-600 text-white p-10 rounded-3xl shadow-2xl hover:-translate-y-3 hover:shadow-green-300/40 transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold mb-5">{service.title}</h2>
            <p className="text-white/85 leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-green-700 text-white py-28 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-12">Why Choose Project Teja?</h2>

          <div className="grid md:grid-cols-2 gap-8 text-lg text-white/85">
            <p>✔ Focused expertise in Indian languages</p>
            <p>✔ High accuracy with contextual understanding</p>
            <p>✔ Fast turnaround time</p>
            <p>✔ Secure and confidential data handling</p>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="text-center py-28 px-6 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6 text-black"
        >
          Need Language Support?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 mb-10"
        >
          Contact our team to discuss your requirements and get started.
        </motion.p>

        <motion.a
          href="/contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:bg-green-700 transition"
        >
          Contact Us
        </motion.a>
      </section>

    </main>
  );
}
