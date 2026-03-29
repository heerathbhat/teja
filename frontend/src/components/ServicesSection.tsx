import { motion } from "framer-motion";
import { Languages, Mic, Headphones, Database, Brain, Shield } from "lucide-react";

const services = [
  {
    icon: Languages,
    title: "AI Translation",
    description: "Accurate multilingual translation powered by advanced language models with context-aware processing.",
  },
  {
    icon: Mic,
    title: "Transcription",
    description: "Convert audio & video to text with Whisper-grade accuracy. Support for 50+ languages.",
  },
  {
    icon: Headphones,
    title: "Voiceover",
    description: "Natural-sounding AI voiceovers using Google TTS & ElevenLabs for professional media production.",
  },

  {
    icon: Brain,
    title: "Custom AI Models",
    description: "Tailored AI solutions fine-tuned for your domain-specific needs and use cases.",
  },
  {
    icon: Shield,
    title: "Secure Pipeline",
    description: "Enterprise-grade security with JWT auth, encrypted storage, and role-based access control.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 section-alt relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-morph" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-morph" style={{ animationDelay: "4s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-3xl font-semibold text-primary mb-3 uppercase tracking-widest">
            Our Services
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for <span className="gradient-text">AI Data Excellence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            End-to-end AI data solutions — from labeled datasets to production-ready media processing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow: "var(--card-glow)",
                transition: { duration: 0.3 },
              }}
              className="group bg-card rounded-2xl p-6 border border-border cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 gradient-bg opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 relative z-10"
              >
                <service.icon className="text-primary-foreground" size={22} />
              </motion.div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2 relative z-10">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative z-10">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
