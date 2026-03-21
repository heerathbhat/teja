"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function Vision() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section ref={ref} className="relative w-full h-[110vh] overflow-hidden bg-green-900">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/VisionImg.png"
          alt="AI Communication Vision"
          fill
          priority
          className="object-cover opacity-80"
        />
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-t from-green-900 via-green-900/50 to-transparent" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex items-center justify-center text-center px-6"
      >
        <div className="max-w-4xl">
          <h2 className="text-white text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
            Building Intelligence That
            <br />
            <span className="text-green-300">
              Understands Meaning Beyond Language
            </span>
          </h2>

          <p className="mt-8 text-white/80 text-lg md:text-xl leading-relaxed">
            We are creating AI that interprets context, emotion, and intent —
            transforming communication into something natural, adaptive,
            and universally understood.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-green-300/60 to-transparent"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </section>
  );
}
