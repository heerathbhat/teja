import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState, useRef } from "react";

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-semibold text-primary mb-3 uppercase tracking-widest">See It In Action</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Watch Our <span className="gradient-text">AI Demo</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience Solvimate's translation and transcription capabilities in this animated showcase.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border shadow-xl"
          style={{ boxShadow: "var(--card-glow)" }}
        >
          <video
            ref={videoRef}
            src="/solvimate-promo.mp4"
            className="w-full aspect-video bg-background object-cover"
            loop
            playsInline
            muted
            onEnded={() => setIsPlaying(false)}
          />

          {!isPlaying && (
            <motion.button
              onClick={handlePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center bg-foreground/10 backdrop-blur-sm"
            >
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center shadow-xl animate-pulse-glow">
                <Play className="text-primary-foreground ml-1" size={32} />
              </div>
            </motion.button>
          )}

          {isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 cursor-pointer"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
