import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const translations = [
  { lang: "English", text: "Hello, World!", flag: "🇺🇸" },
  { lang: "Spanish", text: "¡Hola, Mundo!", flag: "🇪🇸" },
  { lang: "French", text: "Bonjour le Monde!", flag: "🇫🇷" },
  { lang: "Japanese", text: "こんにちは世界！", flag: "🇯🇵" },
  { lang: "Arabic", text: "!مرحبا بالعالم", flag: "🇸🇦" },
  { lang: "Korean", text: "안녕하세요 세계!", flag: "🇰🇷" },
];

const TranslationCard = ({ lang, text, flag, index }: { lang: string; text: string; flag: string; index: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterDelay = index * 8;
  const s = spring({ frame: frame - enterDelay, fps, config: { damping: 14, stiffness: 180 } });
  const x = interpolate(s, [0, 1], [120, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.85, 1]);

  // Subtle float
  const floatY = interpolate(frame, [enterDelay + 20, enterDelay + 120], [0, -4]);

  const isActive = index === Math.floor(((frame - 40) / 18) % translations.length);

  return (
    <div style={{
      transform: `translateX(${x}px) translateY(${floatY}px) scale(${scale})`,
      opacity,
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "18px 28px",
      borderRadius: 16,
      background: isActive ? "rgba(45,184,122,0.15)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${isActive ? "rgba(45,184,122,0.4)" : "rgba(255,255,255,0.08)"}`,
      marginBottom: 10,
    }}>
      <span style={{ fontSize: 36 }}>{flag}</span>
      <div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
          {lang}
        </div>
        <div style={{ fontSize: 26, color: "#fff", fontFamily: "sans-serif", fontWeight: 600 }}>
          {text}
        </div>
      </div>
    </div>
  );
};

export const Scene2Translation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingS = spring({ frame, fps, config: { damping: 18 } });
  const headingY = interpolate(headingS, [0, 1], [-50, 0]);
  const headingOpacity = interpolate(headingS, [0, 1], [0, 1]);

  // Animated connecting lines
  const lineProgress = interpolate(frame, [30, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: "80px 120px" }}>
      {/* Left: heading */}
      <div style={{ display: "flex", gap: 80, height: "100%", alignItems: "center" }}>
        <div style={{ flex: 1, transform: `translateY(${headingY}px)`, opacity: headingOpacity }}>
          <div style={{
            fontSize: 16, fontWeight: 600, fontFamily: "sans-serif",
            color: "#2DB87A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20,
          }}>
            Translation
          </div>
          <div style={{
            fontSize: 56, fontWeight: 800, fontFamily: "sans-serif",
            color: "#fff", lineHeight: 1.1, marginBottom: 24,
          }}>
            Break Language{"\n"}
            <span style={{ color: "#2DB87A" }}>Barriers</span>
          </div>
          <div style={{
            fontSize: 20, fontFamily: "sans-serif", color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6, maxWidth: 440,
          }}>
            Translate content across 50+ languages with context-aware AI that preserves meaning and tone.
          </div>

          {/* Animated stat */}
          <div style={{
            marginTop: 40, display: "flex", gap: 40,
            opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <div>
              <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "sans-serif", color: "#2DB87A" }}>50+</div>
              <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "rgba(255,255,255,0.4)" }}>Languages</div>
            </div>
            <div>
              <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "sans-serif", color: "#2DB87A" }}>99.2%</div>
              <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "rgba(255,255,255,0.4)" }}>Accuracy</div>
            </div>
          </div>
        </div>

        {/* Right: translation cards */}
        <div style={{ flex: 1 }}>
          {translations.map((t, i) => (
            <TranslationCard key={t.lang} {...t} index={i} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
