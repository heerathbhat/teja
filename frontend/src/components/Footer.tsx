import { motion } from "framer-motion";
import solvimateLogo from "@/assets/solvimate-logo.png";

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="border-t border-border py-10"
  >
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src={solvimateLogo} alt="Solvimate logo" className="h-20 w-15 object-contain" />
        <span className="text-sm font-semibold text-foreground">Solvimate</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Solvimate. All rights reserved.
      </p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
      </div>
    </div>
  </motion.footer>
);

export default Footer;
