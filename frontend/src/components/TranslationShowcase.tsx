import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const languages = [
  { text: "Hello", lang: "English" },
  { text: "Hola", lang: "Spanish" },
  { text: "Bonjour", lang: "French" },
  { text: "こんにちは", lang: "Japanese" },
  { text: "مرحبا", lang: "Arabic" },
  { text: "Привет", lang: "Russian" },
  { text: "你好", lang: "Chinese" },
  { text: "Ciao", lang: "Italian" },
  { text: "안녕하세요", lang: "Korean" },
  { text: "Olá", lang: "Portuguese" },
];

const TranslationShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % languages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative bg-card rounded-2xl border border-border p-8 overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 animate-morph" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 animate-morph" style={{ animationDelay: "4s" }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Live Translation</span>
        </div>

        <div className="flex flex-col items-center gap-6">
          <motion.div
            className="w-full bg-secondary/50 rounded-xl p-5 text-center"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-xs text-muted-foreground mb-2">Source (English)</div>
            <div className="text-xl font-bold text-foreground">Hello, World!</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-0.5 h-6 bg-primary/40" />
            <div className="w-3 h-3 rotate-45 border-b-2 border-r-2 border-primary/60" />
          </motion.div>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full gradient-bg rounded-xl p-5 text-center shadow-lg"
          >
            <div className="text-xs text-primary-foreground/70 mb-2">{languages[currentIndex].lang}</div>
            <div className="text-2xl font-bold text-primary-foreground">{languages[currentIndex].text}</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TranslationShowcase;
