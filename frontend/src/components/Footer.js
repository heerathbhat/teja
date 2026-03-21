"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
  Product: [
    { name: "Translation", href: "#" },
    { name: "Transcription", href: "#" },
    { name: "Dubbing & Voiceover", href: "#" },
    { name: "API Access", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Press", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Status", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Security", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-green-700 border-t border-green-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Top Section */}
        <div className="grid md:grid-cols-5 gap-14">
          
          {/* Brand + Mission */}
          <div className="md:col-span-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-semibold tracking-tight"
            >
              TEJA
            </motion.h2>

            <p className="mt-6 text-white/70 leading-relaxed max-w-md">
              Intelligence that speaks every language. We are building AI-driven
              communication systems that eliminate linguistic barriers and make
              global collaboration effortless.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm uppercase tracking-widest text-white/50 mb-5">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-20 border-t border-green-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} TEJA. All rights reserved.
          </p>

          <div className="flex gap-6 text-white/60">
            <Link href="#" className="hover:text-white transition">Twitter</Link>
            <Link href="#" className="hover:text-white transition">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition">GitHub</Link>
          </div>
        </div>
      </div>

      {/* Glow Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </footer>
  );
}
