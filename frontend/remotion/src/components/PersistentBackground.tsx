import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const PersistentBackground = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  const gradientAngle = interpolate(frame, [0, durationInFrames], [135, 200]);
  const blob1X = interpolate(frame, [0, durationInFrames], [-5, 15], { extrapolateRight: "clamp" });
  const blob1Y = interpolate(frame, [0, durationInFrames], [10, -10], { extrapolateRight: "clamp" });
  const blob2X = interpolate(frame, [0, durationInFrames], [60, 75], { extrapolateRight: "clamp" });
  const blob2Y = interpolate(frame, [0, durationInFrames], [70, 50], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${gradientAngle}deg, #0a1a12 0%, #0d2818 40%, #091f10 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${blob1X}%`,
          top: `${blob1Y}%`,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,184,122,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${blob2X}%`,
          top: `${blob2Y}%`,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`v${i}`}
            style={{
              position: "absolute",
              left: `${(i + 1) * (100 / 13)}%`,
              top: 0,
              width: 1,
              height: "100%",
              background: "#2DB87A",
            }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`h${i}`}
            style={{
              position: "absolute",
              top: `${(i + 1) * (100 / 7)}%`,
              left: 0,
              height: 1,
              width: "100%",
              background: "#2DB87A",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
