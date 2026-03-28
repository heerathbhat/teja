import { motion } from "framer-motion";
import { FileText, UserCheck, Play, Upload, CheckCircle, Star } from "lucide-react";

const steps = [
  { icon: FileText, label: "Created", description: "Admin creates tasks with AI parameters" },
  { icon: UserCheck, label: "Assigned", description: "Tasks assigned to qualified interns" },
  { icon: Play, label: "In Progress", description: "AI processing with real-time tracking" },
  { icon: Upload, label: "Submitted", description: "Output uploaded for quality review" },
  { icon: CheckCircle, label: "Reviewed", description: "Admin reviews and provides feedback" },
  { icon: Star, label: "Completed", description: "Final delivery with full audit trail" },
];

const WorkflowSection = () => {
  return (
    <section id="workflow" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary mb-3 uppercase tracking-widest">Workflow</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Streamlined <span className="gradient-text">Task Pipeline</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From creation to completion — every step tracked, every output verified.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 gradient-bg origin-top md:-translate-x-px"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, type: "spring", stiffness: 100 }}
              className={`relative flex items-center gap-6 mb-10 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="hidden md:block md:w-1/2" />
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full gradient-bg flex items-center justify-center shadow-lg animate-pulse-glow"
              >
                <step.icon className="text-primary-foreground" size={20} />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="md:w-1/2 bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-card-foreground mb-1">{step.label}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
