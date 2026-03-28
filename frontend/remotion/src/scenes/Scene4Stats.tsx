import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const stats = [
  { value: "50K+", label: "Tasks Processed", color: "#2DB87A" },
  { value: "99.2%", label: "Accuracy Rate", color: "#22C55E" },
  { value: "50+", label: "Languages", color: "#2DB87A" },
  { value: "24/7", label: "AI Uptime", color: "#22C55E" },
];

export const Scene4Stats = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Title */}
      <div style={{
        position: "absolute", top: 120,
        textAlign: "center",
        opacity: interpolate(spring({ frame, fps, config: { damping: 18 } }), [0, 1], [0, 1]),
        transform: `translateY(${interpolate(spring({ frame, fps, config: { damping: 18 } }), [0, 1], [-40, 0])}px)`,
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "sans-serif", color: "#2DB87A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>
          Performance
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, fontFamily: "sans-serif", color: "#fff" }}>
          Built for <span style={{ color: "#2DB87A" }}>Scale</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "flex", gap: 40,
        marginTop: 60,
      }}>
        {stats.map((stat, i) => {
          const delay = 20 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 160 } });
          const scale = interpolate(s, [0, 1], [0.5, 1]);
          const opacity = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [60, 0]);

          // Counter animation for number
          const floatY = Math.sin((frame - delay) * 0.05) * 3;

          return (
            <div key={stat.label} style={{
              transform: `translateY(${y + floatY}px) scale(${scale})`,
              opacity,
              width: 260,
              padding: "48px 32px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(45,184,122,0.15)",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 64, fontWeight: 900, fontFamily: "sans-serif",
                color: stat.color,
                marginBottom: 8,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 16, fontFamily: "sans-serif", color: "rgba(255,255,255,0.45)",
                fontWeight: 500,
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
