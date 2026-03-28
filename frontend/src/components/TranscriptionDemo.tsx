import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const transcriptLines = [
  "Welcome to the future of AI data processing...",
  "Our platform handles translation seamlessly...",
  "Transcription accuracy of 99.2% across languages...",
  "Real-time voiceover generation in seconds...",
];

const TranscriptionDemo = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (visibleLines >= transcriptLines.length) {
      const resetTimer = setTimeout(() => {
        setVisibleLines(0);
        setCharIndex(0);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }

    const currentLine = transcriptLines[visibleLines];
    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex(charIndex + 1), 30);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisibleLines(visibleLines + 1);
        setCharIndex(0);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, charIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative bg-card rounded-2xl border border-border p-8 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-3 h-3 rounded-full bg-destructive"
        />
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">Live Transcription</span>
        <div className="ml-auto flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary rounded-full"
              animate={{ height: [8, 20 + Math.random() * 16, 8] }}
              transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 min-h-[180px] font-mono text-sm">
        {transcriptLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.6, x: 0 }}
            className="text-muted-foreground"
          >
            <span className="text-primary/60 mr-2">[{String(i + 1).padStart(2, "0")}]</span>
            {line}
          </motion.div>
        ))}
        {visibleLines < transcriptLines.length && (
          <div className="text-foreground">
            <span className="text-primary/60 mr-2">[{String(visibleLines + 1).padStart(2, "0")}]</span>
            {transcriptLines[visibleLines].slice(0, charIndex)}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TranscriptionDemo;
