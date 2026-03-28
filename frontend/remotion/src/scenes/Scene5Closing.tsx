import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";

export const Scene5Closing = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 120 } });
  const textS = spring({ frame: frame - 30, fps, config: { damping: 18 } });
  const tagS = spring({ frame: frame - 50, fps, config: { damping: 20 } });

  // Expanding ring
  const ringScale = interpolate(frame, [0, 80], [0, 8], { extrapolateRight: "clamp" });
  const ringOpacity = interpolate(frame, [0, 40, 80], [0.3, 0.15, 0], { extrapolateRight: "clamp" });

  // Second ring
  const ring2Scale = interpolate(frame, [15, 95], [0, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring2Opacity = interpolate(frame, [15, 55, 95], [0.2, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle pulse on logo
  const logoPulse = 1 + Math.sin(frame * 0.08) * 0.03;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Expanding rings */}
      <div style={{
        position: "absolute",
        width: 120, height: 120,
        borderRadius: "50%",
        border: "2px solid #2DB87A",
        transform: `scale(${ringScale})`,
        opacity: ringOpacity,
      }} />
      <div style={{
        position: "absolute",
        width: 120, height: 120,
        borderRadius: "50%",
        border: "1px solid #22C55E",
        transform: `scale(${ring2Scale})`,
        opacity: ring2Opacity,
      }} />

      {/* Logo */}
      <div style={{
        transform: `scale(${interpolate(logoS, [0, 1], [0.3, 1]) * logoPulse})`,
        opacity: interpolate(logoS, [0, 1], [0, 1]),
        marginBottom: 24,
      }}>
        <Img src={staticFile("images/solvimate-logo.png")} style={{ width: 160, height: 160, objectFit: "contain" }} />
      </div>

      {/* Brand name */}
      <div style={{
        fontSize: 80, fontWeight: 900, fontFamily: "sans-serif",
        color: "#fff", letterSpacing: -3,
        opacity: interpolate(textS, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(textS, [0, 1], [40, 0])}px)`,
      }}>
        Solvimate
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 22, fontFamily: "sans-serif",
        color: "rgba(255,255,255,0.5)",
        letterSpacing: 6,
        textTransform: "uppercase",
        marginTop: 12,
        opacity: interpolate(tagS, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(tagS, [0, 1], [30, 0])}px)`,
      }}>
        Grow Together
      </div>

      {/* Bottom services */}
      <div style={{
        position: "absolute", bottom: 100,
        display: "flex", gap: 60,
        opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {["Translation", "Transcription", "Voiceover", "AI Datasets"].map((s, i) => (
          <div key={s} style={{
            fontSize: 15, fontFamily: "sans-serif", color: "rgba(255,255,255,0.35)",
            fontWeight: 500, letterSpacing: 2, textTransform: "uppercase",
            transform: `translateY(${interpolate(
              spring({ frame: frame - 65 - i * 5, fps, config: { damping: 20 } }),
              [0, 1], [20, 0]
            )}px)`,
          }}>
            {s}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
