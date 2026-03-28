// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, Globe, Mic, Headphones } from "lucide-react";
// import heroImg from "@/assets/hero-illustration.png";
// import ParticleField from "@/components/ParticleField";

// const floatingCards = [
//   { icon: Globe, label: "50+ Languages", delay: 1.3, x: -10, y: -40 },
//   { icon: Mic, label: "Live Transcription", delay: 1.0, x: 50, y: 6 },
//   { icon: Headphones, label: "AI Voiceover", delay: 1.2, x: -10, y: 50 },
// ];

// const HeroSection = () => (
//   <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-1 pb-5 gradient-mesh-bg">
//     <ParticleField />

//     {/* Decorative blobs */}
//     <div className="absolute top-30 -right-32 w-[500px] h-[500px] rounded-full bg-primary/[0.08] animate-morph" />
//     <div className="absolute -bottom-10 -left-20 w-[400px] h-[400px] rounded-full bg-accent/[0.06] animate-morph" style={{ animationDelay: "6s" }} />

//     <div className="container mx-auto px-6">
//       <div className="grid lg:grid-cols-2 gap-16 items-center">
//         {/* Left content */}
//         <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//             className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground mb-6 shadow-soft"
//           >
//             <Sparkles size={14} className="text-primary" />
//             AI-Powered Data Solutions
//           </motion.div>

//           <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6 text-balance">
//             <motion.span initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="block text-foreground">
//               Pre-Labeled Datasets &
//             </motion.span>
//             <motion.span initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="block gradient-text">
//               Custom AI Solutions
//             </motion.span>
//             <motion.span initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="block text-foreground text-3xl md:text-4xl mt-1">
//               for Robust Development
//             </motion.span>
//           </h1>

//           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
//             Translation, Transcription & Voiceover — powered by cutting-edge AI. Streamline your media pipeline with Solvimate.
//           </motion.p>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex flex-wrap gap-4">
//             <Button variant="hero" size="lg" className="gap-2">
//               Start Free Trial <ArrowRight size={18} />
//             </Button>
//             <Button variant="hero-outline" size="lg">Watch Demo</Button>
//           </motion.div>

//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex items-center gap-10 mt-10">
//             {[
//               { value: "50K+", label: "Tasks Processed" },
//               { value: "99.2%", label: "Accuracy" },
//               { value: "24/7", label: "AI Uptime" },
//             ].map((stat, i) => (
//               <motion.div key={stat.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 + i * 0.1, type: "spring", stiffness: 200 }}>
//                 <div className="text-2xl font-bold gradient-text">{stat.value}</div>
//                 <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>

//         {/* Right: hero image with floating cards */}
//         <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.3, type: "spring" }} className="relative flex justify-center">
//           <motion.img
//             src={heroImg}
//             alt="AI-powered solutions"
//             className="w-full max-w-md drop-shadow-xl"
//             animate={{ y: [0, -14, 0] }}
//             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//             width={1024} height={1024}
//           />

//           {/* Floating feature cards */}
//           {floatingCards.map((card, i) => (
//             <motion.div
//               key={card.label}
//               initial={{ opacity: 0, scale: 0 }}
//               animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
//               transition={{
//                 opacity: { delay: card.delay },
//                 scale: { delay: card.delay, type: "spring" },
//                 y: { delay: card.delay + 0.5, duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
//               }}
//               className="absolute glass rounded-xl px-4 py-2.5 shadow-soft flex items-center gap-2.5"
//               style={{
//                 top: `${35 + card.y}%`,
//                 left: i === 1 ? "auto" : `${10 + card.x}%`,
//                 right: i === 1 ? "0%" : "auto",
//               }}
//             >
//               <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
//                 <card.icon size={16} className="text-primary-foreground" />
//               </div>
//               <span className="text-xs font-semibold text-foreground whitespace-nowrap">{card.label}</span>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   </section>
// );

// export default HeroSection;



import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-illustration.png";
import ParticleField from "@/components/ParticleField";
import TranslationShowcase from "@/components/TranslationShowcase";
import TranscriptionDemo from "@/components/TranscriptionDemo";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <ParticleField />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-200 h-80 rounded-full bg-primary/5 blur-3xl animate-morph"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-morph"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground mb-6"
            >
              <Sparkles size={14} />
              AI-Powered Data Solutions
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-foreground"
              >
                Pre-Labeled Datasets &
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block gradient-text"
              >
                Custom AI Solutions
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="block text-foreground text-3xl md:text-4xl lg:text-5xl"
              >
                for Robust Development
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-lg text-muted-foreground max-w-lg mb-8"
            >
              Translation, Transcription & Voiceover — powered by cutting-edge AI.
              Streamline your media tasks with Solvimate's intelligent workflow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/signup">
                <Button variant="hero" size="lg" className="gap-2">
                  Start Free Trial <ArrowRight size={18} />
                </Button>
              </Link>
              <Button variant="hero-outline" size="lg">
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="flex items-center gap-8 mt-10"
            >
              {[
                { value: "50K+", label: "Tasks Processed" },
                { value: "99.2%", label: "Accuracy" },
                { value: "24/7", label: "AI Uptime" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + i * 0.15, type: "spring", stiffness: 200 }}
                >
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="relative flex justify-center"
          >
            <motion.img
              src={heroImg}
              alt="AI-powered translation and transcription"
              className="w-full max-w-lg drop-shadow-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              width={1024}
              height={1024}
            />
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full animate-morph" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-6 mt-8"
        >
          <TranslationShowcase />
          <TranscriptionDemo />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

