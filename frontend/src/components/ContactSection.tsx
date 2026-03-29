import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 section-alt">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Contact</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's Build <span className="gradient-text">Together</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Reach out and let's explore how Teja can accelerate your AI pipeline.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.form
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Your Name" className="bg-card" />
              <Input type="email" placeholder="Your Email" className="bg-card" />
            </div>
            <Input placeholder="Subject" className="bg-card" />
            <Textarea placeholder="Your Message" rows={5} className="bg-card resize-none" />
            <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
              Send Message <Send size={18} />
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {[
              { icon: Mail, label: "Email Us", value: "contact@teja.com" },
              { icon: Phone, label: "Call Us", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Visit Us", value: "San Francisco, CA 94105" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-primary-foreground" size={18} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.value}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
