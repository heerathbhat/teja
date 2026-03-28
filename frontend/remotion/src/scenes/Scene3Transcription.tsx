import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const transcriptLines = [
  { time: "00:01", text: "Welcome to the future of AI data processing..." },
  { time: "00:04", text: "Our platform handles translation seamlessly across..." },
  { time: "00:08", text: "...fifty languages with context-aware accuracy." },
  { time: "00:11", text: "Real-time transcription powered by Solvimate AI." },
  { time: "00:15", text: "Voiceover generation in seconds, not hours." },
];

const WaveBar = ({ index, frame }: { index: number; frame: number }) => {
  const phase = (frame * 0.15 + index * 0.8);
  const height = 20 + Math.sin(phase) * 18 + Math.cos(phase * 1.3) * 10;
  return (
    <div style={{
      width: 4,
      height,
      borderRadius: 2,
      background: `linear-gradient(180deg, #2DB87A, rgba(45,184,122,0.3))`,
    }} />
  );
};

export const Scene3Transcription = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingS = spring({ frame, fps, config: { damping: 18 } });

  // Which line is currently being "typed"
  const activeLineIndex = Math.min(
    Math.floor(interpolate(frame, [25, 120], [0, transcriptLines.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
    transcriptLines.length - 1
  );

  return (
    <AbsoluteFill style={{ padding: "80px 120px" }}>
      <div style={{ display: "flex", gap: 80, height: "100%", alignItems: "center" }}>
        {/* Left: Terminal-style transcription */}
        <div style={{
          flex: 1.2,
          background: "rgba(0,0,0,0.4)",
          borderRadius: 20,
          border: "1px solid rgba(45,184,122,0.2)",
          overflow: "hidden",
          opacity: interpolate(spring({ frame: frame - 10, fps, config: { damping: 20 } }), [0, 1], [0, 1]),
          transform: `scale(${interpolate(spring({ frame: frame - 10, fps, config: { damping: 15 } }), [0, 1], [0.9, 1])})`,
        }}>
          {/* Terminal header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.3)",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ marginLeft: 16, fontSize: 13, fontFamily: "monospace", color: "rgba(255,255,255,0.35)" }}>
              solvimate-transcribe
            </div>
          </div>

          {/* Audio waveform */}
          <div style={{
            display: "flex", alignItems: "center", gap: 3, padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4444", marginRight: 10,
              opacity: interpolate(Math.sin(frame * 0.2), [-1, 1], [0.4, 1]),
            }} />
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.4)", marginRight: 16 }}>REC</span>
            {Array.from({ length: 32 }).map((_, i) => (
              <WaveBar key={i} index={i} frame={frame} />
            ))}
          </div>

          {/* Transcript lines */}
          <div style={{ padding: "20px 24px" }}>
            {transcriptLines.map((line, i) => {
              const isVisible = i <= activeLineIndex;
              const isActive = i === activeLineIndex;
              const lineStart = 25 + i * 19;
              const charProgress = isActive
                ? interpolate(frame, [lineStart, lineStart + 18], [0, line.text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                : isVisible ? line.text.length : 0;
              const visibleText = line.text.slice(0, Math.floor(charProgress));

              return (
                <div key={i} style={{
                  display: "flex", gap: 12, marginBottom: 14,
                  opacity: isVisible ? 1 : 0.15,
                }}>
                  <span style={{ fontSize: 13, fontFamily: "monospace", color: "#2DB87A", minWidth: 50 }}>
                    {line.time}
                  </span>
                  <span style={{ fontSize: 16, fontFamily: "sans-serif", color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}>
                    {visibleText}
                    {isActive && (
                      <span style={{ 
                        display: "inline-block", width: 2, height: 18, background: "#2DB87A",
                        marginLeft: 2, verticalAlign: "middle",
                        opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                      }} />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: heading */}
        <div style={{
          flex: 0.8,
          opacity: interpolate(headingS, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(headingS, [0, 1], [60, 0])}px)`,
        }}>
          <div style={{
            fontSize: 16, fontWeight: 600, fontFamily: "sans-serif",
            color: "#2DB87A", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20,
          }}>
            Transcription
          </div>
          <div style={{
            fontSize: 52, fontWeight: 800, fontFamily: "sans-serif",
            color: "#fff", lineHeight: 1.15, marginBottom: 24,
          }}>
            Audio to Text{"\n"}
            <span style={{ color: "#2DB87A" }}>Instantly</span>
          </div>
          <div style={{
            fontSize: 19, fontFamily: "sans-serif", color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
          }}>
            Whisper-grade accuracy across 50+ languages. Real-time processing with speaker detection and timestamps.
          </div>

          <div style={{
            marginTop: 40,
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "sans-serif", color: "#2DB87A" }}>10x</div>
            <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "rgba(255,255,255,0.4)" }}>Faster Than Manual</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
