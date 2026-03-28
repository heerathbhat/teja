import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";

export const Scene1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const logoRotate = interpolate(spring({ frame, fps, config: { damping: 20, stiffness: 100 } }), [0, 1], [-180, 0]);
  
  const titleY = interpolate(
    spring({ frame: frame - 20, fps, config: { damping: 18 } }),
    [0, 1], [60, 0]
  );
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const taglineOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = interpolate(
    spring({ frame: frame - 45, fps, config: { damping: 20 } }),
    [0, 1], [40, 0]
  );

  const lineWidth = interpolate(frame, [55, 85], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Floating accent circles
  const circle1Y = interpolate(frame, [0, 120], [0, -15]);
  const circle2Y = interpolate(frame, [0, 120], [0, 12]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Floating accents */}
      <div style={{
        position: "absolute", left: 150, top: 200 + circle1Y,
        width: 80, height: 80, borderRadius: "50%",
        border: "2px solid rgba(45,184,122,0.2)",
        opacity: interpolate(frame, [10, 30], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />
      <div style={{
        position: "absolute", right: 200, bottom: 250 + circle2Y,
        width: 120, height: 120, borderRadius: "20%",
        border: "2px solid rgba(34,197,94,0.15)",
        transform: `rotate(${interpolate(frame, [0, 120], [0, 45])}deg)`,
        opacity: interpolate(frame, [15, 35], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />

      {/* Logo */}
      <div style={{
        transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
        marginBottom: 30,
      }}>
        <Img src={staticFile("images/solvimate-logo.png")} style={{ width: 140, height: 140, objectFit: "contain" }} />
      </div>

      {/* Title */}
      <div style={{
        transform: `translateY(${titleY}px)`,
        opacity: titleOpacity,
        fontSize: 72,
        fontWeight: 800,
        fontFamily: "sans-serif",
        color: "#ffffff",
        letterSpacing: -2,
        textAlign: "center",
      }}>
        Solvimate
      </div>

      {/* Underline */}
      <div style={{
        width: lineWidth,
        height: 4,
        background: "linear-gradient(90deg, transparent, #2DB87A, transparent)",
        borderRadius: 2,
        marginTop: 12,
        marginBottom: 16,
      }} />

      {/* Tagline */}
      <div style={{
        transform: `translateY(${taglineY}px)`,
        opacity: taglineOpacity,
        fontSize: 28,
        fontWeight: 400,
        fontFamily: "sans-serif",
        color: "rgba(255,255,255,0.6)",
        letterSpacing: 4,
        textTransform: "uppercase",
      }}>
        AI-Powered Media Intelligence
      </div>
    </AbsoluteFill>
  );
};
