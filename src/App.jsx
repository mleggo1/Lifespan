import { useState, useMemo } from "react";

// Lifespan – simple life timeline & insight dashboard
// Drop this straight into src/App.jsx in your Vite + React app.

// Add CSS animations (only once)
if (!document.getElementById('lifespan-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'lifespan-styles';
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(96, 165, 250, 0.4); }
      50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(96, 165, 250, 0.6); }
    }
    .fade-in {
      animation: fadeIn 0.6s ease-out forwards;
    }
    .fade-in-delay-1 {
      animation: fadeIn 0.6s ease-out 0.1s forwards;
      opacity: 0;
    }
    .fade-in-delay-2 {
      animation: fadeIn 0.6s ease-out 0.2s forwards;
      opacity: 0;
    }
    .pulse {
      animation: pulse 2s ease-in-out infinite;
    }
  .glow {
    animation: glow 2s ease-in-out infinite;
  }
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      background: white !important;
      color: black !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    button {
      display: none !important;
    }
    @page {
      margin: 0.5cm;
      size: A4 landscape;
    }
    .print-compact {
      padding: 12px 16px !important;
      margin-bottom: 8px !important;
    }
    .print-compact h1 {
      font-size: 24px !important;
      margin-bottom: 4px !important;
    }
    .print-compact h2 {
      font-size: 14px !important;
      margin-bottom: 6px !important;
    }
    .print-compact p {
      font-size: 12px !important;
      margin: 2px 0 !important;
    }
    .print-compact section {
      padding: 8px !important;
      margin-bottom: 8px !important;
    }
    .print-compact .chart-container {
      margin-bottom: 16px !important;
    }
    .print-compact .phase-labels {
      height: 50px !important;
      margin-bottom: 16px !important;
    }
    .print-compact .age-scale {
      height: 40px !important;
    }
  }
`;
  document.head.appendChild(styleSheet);
}

const MAX_AGE = 100;

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function formatYears(n) {
  const v = Math.round(n);
  if (v <= 0) return "0 years";
  if (v === 1) return "1 year";
  return `${v} years`;
}

function percent(n) {
  if (!Number.isFinite(n) || n <= 0) return "0%";
  return `${Math.round(n)}%`;
}

export default function App() {
  const [currentAge, setCurrentAge] = useState(42);
  const [freedomAge, setFreedomAge] = useState(55);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);

  const [labelName, setLabelName] = useState("Michael");
  const [bigGoal, setBigGoal] = useState("Freedom to live life on your terms — every day, not someday.");
  const [theme, setTheme] = useState("dark"); // 'dark' or 'light'

  const data = useMemo(() => {
    const cur = clamp(currentAge, 0, MAX_AGE);
    const life = clamp(lifeExpectancy, cur + 1, MAX_AGE);
    const freedom = clamp(freedomAge, cur + 1, life - 1);

    const totalSpan = life;
    const yearsLived = cur;
    const yearsToFreedom = Math.max(0, freedom - cur);
    const yearsAfterFreedom = Math.max(0, life - freedom);

    const livedPct = (yearsLived / totalSpan) * 100;
    const toFreedomPct = (yearsToFreedom / totalSpan) * 100;
    const afterFreedomPct = (yearsAfterFreedom / totalSpan) * 100;

    return {
      cur,
      life,
      freedom,
      yearsLived,
      yearsToFreedom,
      yearsAfterFreedom,
      livedPct,
      toFreedomPct,
      afterFreedomPct,
      totalSpan,
    };
  }, [currentAge, freedomAge, lifeExpectancy]);

  const {
    cur,
    life,
    freedom,
    yearsLived,
    yearsToFreedom,
    yearsAfterFreedom,
    livedPct,
    toFreedomPct,
    afterFreedomPct,
    totalSpan,
  } = data;

  const yearsRemaining = yearsToFreedom + yearsAfterFreedom;
  const remainingPct = (yearsRemaining / totalSpan) * 100;

  const lifeStage =
    cur < 30
      ? "Early Game – skill-building & foundations."
      : cur < 45
      ? "Prime Building Years – income, assets, compounding."
      : cur < freedom
      ? "Last Big Push – maximise contribution & investing."
      : cur < life
      ? "Freedom Phase – live off the machine you built."
      : "Legacy Phase – time, wisdom and impact.";

  // Theme colors
  const themeColors = {
    dark: {
      bg: "radial-gradient(ellipse at top, #0f172a 0%, #020617 40%, #000 100%)",
      containerBg: "radial-gradient(ellipse at center, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.99) 50%, rgba(8,47,73,0.97) 100%)",
      text: "#e5e7eb",
      textSecondary: "#d1d5db",
      textMuted: "#9ca3af",
      border: "rgba(148,163,184,0.25)",
      cardBg: "rgba(15,23,42,0.9)",
    },
    light: {
      bg: "radial-gradient(ellipse at top, #ffffff 0%, #f8fafc 40%, #f1f5f9 100%)",
      containerBg: "linear-gradient(145deg, rgba(255,255,255,0.99) 0%, rgba(255,255,255,1) 50%, rgba(248,250,252,0.98) 100%)",
      text: "#0f172a",
      textSecondary: "#1e293b",
      textMuted: "#475569",
      border: "rgba(71,85,105,0.2)",
      cardBg: "rgba(255,255,255,1)",
    },
  };

  const colors = themeColors[theme];

  // PDF Export function
  const exportToPDF = () => {
    window.print();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        padding: 20,
        background: colors.bg,
        color: colors.text,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      }}
    >
      <div
        className="print-compact"
        style={{
          width: "100%",
          maxWidth: 1400,
          padding: "32px 36px 40px",
          borderRadius: 32,
          border: `1px solid ${colors.border}`,
          background: colors.containerBg,
          boxShadow: theme === "dark" 
            ? "0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 200px rgba(0,0,0,0.3)"
            : "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.02)",
          position: "relative",
          color: colors.text,
        }}
      >
        {/* Header with controls */}
        <header
          style={{
            marginBottom: 24,
            position: "relative",
          }}
        >
          {/* Theme toggle and PDF export buttons */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              gap: 8,
            }}
          >
            <button
              onClick={toggleTheme}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.cardBg,
                color: colors.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"} {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              onClick={exportToPDF}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                background: colors.cardBg,
                color: colors.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              📄 Export PDF
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              paddingRight: 0,
            }}
          >
            <div
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: 6,
                color: colors.textMuted,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              LifeSpan
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 52,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
                background: theme === "dark"
                  ? "linear-gradient(120deg, #e5e7eb, #f97316, #facc15)"
                  : "linear-gradient(120deg, #0f172a, #2563eb, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              The Time You Have Left
            </h1>
            <p
              style={{
                marginTop: 10,
                fontSize: 20,
                color: colors.textSecondary,
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              You have{" "}
              <span
                style={{
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                {formatYears(yearsToFreedom + yearsAfterFreedom)} ({percent(remainingPct)})
              </span>{" "}
              left. What will you do with it?
            </p>
          </div>
        </header>

        {/* Goal */}
        <section
          style={{
            marginBottom: 18,
            padding: "12px 16px",
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            background: theme === "dark" 
              ? "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(15,23,42,0.95))"
              : "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(255,255,255,1))",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: colors.textMuted,
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            What are you building toward?
          </div>
          <input
            value={bigGoal}
            onChange={(e) => setBigGoal(e.target.value)}
            placeholder="What does your ideal life look like?"
            style={{
              width: "100%",
              maxWidth: 800,
              margin: "0 auto",
              padding: "16px 20px",
              borderRadius: 16,
              border: `2px solid ${colors.border}`,
              background: colors.cardBg,
              color: colors.text,
              fontSize: 18,
              outline: "none",
              textAlign: "center",
              fontWeight: 600,
            }}
          />
        </section>

        {/* Layout grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1.1fr)",
            gap: 20,
          }}
        >
          {/* Left: Timeline + sliders */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Main bar */}
            <section
              style={{
                padding: 24,
                borderRadius: 20,
                border: theme === "dark" 
                  ? "1px solid rgba(148,163,184,0.45)"
                  : "1px solid rgba(71,85,105,0.2)",
                background: theme === "dark"
                  ? "radial-gradient(circle at top left, rgba(248,250,252,0.08), rgba(15,23,42,0.9))"
                  : "#FFFFFF",
                boxShadow: theme === "dark"
                  ? "none"
                  : "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                <div style={{ 
                  fontSize: 18, 
                  color: theme === "dark" ? colors.textMuted : "#2B2B2B", 
                  marginBottom: 8,
                  fontWeight: 600,
                }}>
                  Age {cur} of {life}
                </div>
                <div style={{ 
                  fontSize: 36, 
                  fontWeight: 900, 
                  color: theme === "dark" ? colors.text : "#1A1A1A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}>
                  {formatYears(yearsToFreedom + yearsAfterFreedom)} ({percent(remainingPct)}) remaining
                </div>
              </div>

              {/* Chart container with flex column layout */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* The bar */}
                <div
                  className="chart-container"
                  style={{
                    position: "relative",
                    height: 96,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: theme === "dark"
                      ? "rgba(15,23,42,0.95)"
                      : "rgba(255,255,255,1)",
                    border: theme === "dark"
                      ? "2px solid rgba(148,163,184,0.5)"
                      : "2px solid rgba(71,85,105,0.5)",
                    boxShadow: theme === "dark"
                      ? `
                        inset 0 2px 4px rgba(255,255,255,0.1),
                        inset 0 -2px 4px rgba(0,0,0,0.8),
                        0 8px 32px rgba(0,0,0,0.4),
                        0 0 0 1px rgba(255,255,255,0.05)
                      `
                      : `
                        0 2px 8px rgba(0,0,0,0.06),
                        0 1px 2px rgba(0,0,0,0.03),
                        inset 0 1px 0 rgba(255,255,255,0.8)
                      `,
                  }}
                >
                  {/* Lived - Childhood */}
                  <div
                    style={{
                      width: `${livedPct}%`,
                      height: "100%",
                      background: theme === "dark"
                        ? "linear-gradient(90deg, rgba(30,41,59,0.8), rgba(51,65,85,0.7), rgba(71,85,105,0.6))"
                        : "linear-gradient(90deg, #64748b, #475569, #334155)",
                      opacity: theme === "dark" ? 0.75 : 1,
                    }}
                  />

                  {/* To freedom - Work Phase */}
                  {toFreedomPct > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${livedPct}%`,
                        width: `${toFreedomPct}%`,
                        top: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(90deg, #3818A8, #4B1DB0, #6C34F8)",
                        boxShadow: "inset 0 0 25px rgba(56, 24, 168, 0.5), 0 0 20px rgba(108, 52, 248, 0.3)",
                      }}
                    />
                  )}

                  {/* After freedom - Golden Years */}
                  {afterFreedomPct > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${livedPct + toFreedomPct}%`,
                        width: `${afterFreedomPct}%`,
                        top: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(90deg, #FAD961, #F9B84A, #F76B1C)",
                        boxShadow: "inset 0 0 35px rgba(250, 217, 97, 0.6), 0 0 25px rgba(247, 107, 28, 0.4)",
                      }}
                    />
                  )}

                  {/* Markers */}
                  {/* Current age marker */}
                  <CurrentAgeMarker positionPct={(livedPct / totalSpan) * totalSpan} age={cur} theme={theme} />

                  {/* Freedom marker */}
                  <Marker
                    positionPct={((freedom / totalSpan) * 100)}
                    label={`Retirement (${freedom})`}
                    color="#6C34F8"
                    theme={theme}
                  />

                  {/* Life expectancy marker */}
                  <Marker
                    positionPct={100}
                    label={`Life (${life})`}
                    color={theme === "dark" ? "#e5e7eb" : "#1A1A1A"}
                    align="right"
                    theme={theme}
                  />
                </div>

                {/* Age scale tight to the bar */}
                <div
                  className="age-scale"
                  style={{
                    position: "relative",
                    height: 40,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  {Array.from({ length: Math.floor(life / 10) + 1 }, (_, i) => {
                    const age = i * 10;
                    if (age > life) return null;
                    const positionPct = (age / totalSpan) * 100;
                    const isMajor = age % 10 === 0;
                    return (
                      <div
                        key={age}
                        style={{
                          position: "absolute",
                          left: `${positionPct}%`,
                          transform: "translateX(-50%)",
                          textAlign: "center",
                          width: "auto",
                        }}
                      >
                        <div
                          style={{
                            width: 2,
                            height: isMajor ? 14 : 10,
                            background: theme === "dark"
                              ? "rgba(255, 255, 255, 0.55)"
                              : "#8A8A8A",
                            margin: "0 auto 6px",
                            borderRadius: 999,
                          }}
                        />
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: theme === "dark" ? "#e5e7eb" : "#1A1A1A",
                            whiteSpace: "nowrap",
                            lineHeight: 1.2,
                          }}
                        >
                          {age}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Phase labels below chart */}
                <div
                  className="phase-labels"
                  style={{
                    position: "relative",
                    height: 90,
                    marginTop: 0,
                    marginBottom: 12,
                  }}
                >
                  {/* Childhood phase */}
                  <div
                    className="fade-in"
                    style={{
                      position: "absolute",
                      left: `${(0 / totalSpan) * 100}%`,
                      width: `${(Math.min(19, life) / totalSpan) * 100}%`,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: theme === "dark" ? "#9ca3af" : "#2B2B2B",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: 8,
                        lineHeight: 1.2,
                      }}
                    >
                      Childhood
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        color: theme === "dark" ? "#6b7280" : "#1A1A1A",
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      0-18 years
                    </div>
                  </div>

                  {/* Working phase */}
                  <div
                    className="fade-in-delay-1"
                    style={{
                      position: "absolute",
                      left: `${(19 / totalSpan) * 100}%`,
                      width: `${((freedom - 19) / totalSpan) * 100}%`,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #3818A8, #6C34F8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: 8,
                        lineHeight: 1.2,
                      }}
                    >
                      Work
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        color: theme === "dark" ? "#6b7280" : "#1A1A1A",
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      19-{freedom} years
                    </div>
                  </div>

                  {/* Retirement phase - Golden Years */}
                  <div
                    className="fade-in-delay-2"
                    style={{
                      position: "absolute",
                      left: `${(freedom / totalSpan) * 100}%`,
                      width: `${(yearsAfterFreedom / totalSpan) * 100}%`,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #FAD961, #F76B1C)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: 8,
                        lineHeight: 1.2,
                      }}
                    >
                      Golden Years
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        color: theme === "dark" ? "#6b7280" : "#1A1A1A",
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      {freedom}-{life} years
                    </div>
                  </div>
                </div>

              </div>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 4,
                  fontSize: 12,
                  color: theme === "dark" ? colors.textSecondary : "#1A1A1A",
                  justifyContent: "center",
                }}
              >
                <LegendPill 
                  color="linear-gradient(90deg, rgba(30,41,59,0.9), rgba(51,65,85,0.8), rgba(71,85,105,0.7))"
                  theme={theme}
                >
                  Past: {formatYears(yearsLived)}
                </LegendPill>
                <LegendPill 
                  color="linear-gradient(90deg, #3818A8, #4B1DB0, #6C34F8)"
                  theme={theme}
                >
                  Building: {formatYears(yearsToFreedom)}
                </LegendPill>
                <LegendPill 
                  color="linear-gradient(90deg, #FAD961, #F9B84A, #F76B1C)"
                  theme={theme}
                >
                  Golden Years: {formatYears(yearsAfterFreedom)}
                </LegendPill>
              </div>
            </section>

            {/* Controls */}
            <section
              style={{
                padding: 14,
                borderRadius: 18,
                border: `1px solid ${colors.border}`,
                background: colors.cardBg,
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: 24,
                  fontWeight: 800,
                  color: colors.text,
                  letterSpacing: "-0.01em",
                }}
              >
                Your Timeline
              </h2>
              <p style={{ margin: "0 0 20px", fontSize: 16, color: colors.textMuted, lineHeight: 1.6, fontWeight: 500 }}>
                Adjust these numbers to see how your choices change the rest of your life.
              </p>

              <SliderRow
                label="Current age"
                value={cur}
                min={0}
                max={life - 1}
                onChange={(v) => setCurrentAge(Number(v))}
                theme={theme}
              />
              <SliderRow
                label="Target retirement - financial freedom"
                value={freedom}
                min={cur + 1}
                max={life - 1}
                onChange={(v) => setFreedomAge(Number(v))}
                theme={theme}
              />
              <SliderRow
                label="Life expectancy"
                value={life}
                min={freedom + 1}
                max={MAX_AGE}
                onChange={(v) => setLifeExpectancy(Number(v))}
                theme={theme}
              />
            </section>
          </div>

          {/* Right: insights */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Snapshot cards */}
            <section
              style={{
                padding: 24,
                borderRadius: 20,
                border: `1px solid ${colors.border}`,
                background: theme === "dark"
                  ? "radial-gradient(circle at top, rgba(248,250,252,0.04), rgba(15,23,42,0.97))"
                  : "radial-gradient(circle at top, rgba(255,255,255,0.6), rgba(248,250,252,0.98))",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: 24,
                  fontWeight: 800,
                  color: colors.text,
                  letterSpacing: "-0.01em",
                }}
              >
                The Numbers
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: 10,
                  fontSize: 12,
                }}
              >
                <InfoCard
                  label="Years lived"
                  main={formatYears(yearsLived)}
                  sub={`${percent(livedPct)} of your life`}
                  theme={theme}
                />
                <InfoCard
                  label="Years remaining"
                  main={formatYears(yearsRemaining)}
                  sub={`${percent(remainingPct)} of your life`}
                  theme={theme}
                />
                <InfoCard
                  label="Years to freedom"
                  main={formatYears(yearsToFreedom)}
                  sub={`${percent(toFreedomPct)} of your life`}
                  theme={theme}
                />
                <InfoCard
                  label="Golden Years"
                  main={formatYears(yearsAfterFreedom)}
                  sub={`${percent(afterFreedomPct)} of your life`}
                  theme={theme}
                />
              </div>
            </section>

            {/* Coaching / prompts */}
            <section
              style={{
                padding: 28,
                borderRadius: 20,
                border: `1px solid ${colors.border}`,
                background: theme === "dark"
                  ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,58,138,0.3))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(241,245,249,0.5))",
                fontSize: 16,
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px",
                  fontSize: 17,
                  fontWeight: 700,
                  color: colors.text,
                }}
              >
                Questions to Consider
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ 
                    fontSize: 14, 
                    textTransform: "uppercase", 
                    letterSpacing: 1.5, 
                    color: "#a5b4fc",
                    fontWeight: 700,
                    marginBottom: 10,
                  }}>
                    Right Now
                  </div>
                  <p style={{ margin: 0, color: colors.textSecondary, lineHeight: 1.7, fontSize: 16, fontWeight: 500 }}>
                    If you only had {formatYears(yearsToFreedom)} to build the life you want, what would you start today?
                  </p>
                </div>
                <div>
                  <div style={{ 
                    fontSize: 14, 
                    textTransform: "uppercase", 
                    letterSpacing: 1.5, 
                    color: "#f97316",
                    fontWeight: 700,
                    marginBottom: 10,
                  }}>
                    The Next {formatYears(yearsToFreedom)}
                  </div>
                  <p style={{ margin: 0, color: colors.textSecondary, lineHeight: 1.7, fontSize: 16, fontWeight: 500 }}>
                    What needs to happen between now and age {freedom} so you can truly live free?
                  </p>
                </div>
                <div>
                  <div style={{ 
                    fontSize: 11, 
                    textTransform: "uppercase", 
                    letterSpacing: 1.2, 
                    color: "#22c55e",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}>
                    Your {formatYears(yearsAfterFreedom)} Golden Years
                  </div>
                  <p style={{ margin: 0, color: colors.textSecondary, lineHeight: 1.6 }}>
                    When you're free at {freedom}, what will you do with your time? Who will you become?
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Age tick mark for 10-year increments */
function AgeTick({ positionPct, age, isMajor = false }) {
  const left = Math.min(Math.max(positionPct, 0), 100);
  const barTop = 40;
  const barHeight = 48;
  
  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        top: barTop,
        height: barHeight,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: isMajor ? -28 : -20,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: isMajor ? 9 : 8,
          color: "#9ca3af",
          whiteSpace: "nowrap",
          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          fontWeight: isMajor ? 600 : 400,
        }}
      >
        {age}
      </div>
      <div
        style={{
          position: "absolute",
          top: isMajor ? 0 : 8,
          bottom: isMajor ? 0 : 8,
          left: "50%",
          width: isMajor ? 2 : 1,
          borderRadius: 999,
          background: "#6b7280",
          opacity: isMajor ? 0.8 : 0.5,
        }}
      />
    </div>
  );
}

/** Phase divider with labels */
function PhaseDivider({ positionPct, label, topLabel }) {
  const left = Math.min(Math.max(positionPct, 0), 100);
  const barTop = 40;
  const barHeight = 48;
  
  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        top: barTop,
        height: barHeight,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -35,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 8,
          color: "#6b7280",
          whiteSpace: "nowrap",
          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          fontWeight: 500,
        }}
      >
        {topLabel}
      </div>
      <div
        style={{
          position: "absolute",
          top: barHeight,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 8,
          color: "#6b7280",
          whiteSpace: "nowrap",
          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 2,
          borderRadius: 999,
          background: "rgba(148, 163, 184, 0.4)",
          borderLeft: "1px dashed rgba(148, 163, 184, 0.6)",
        }}
      />
    </div>
  );
}

/** Current age marker with glow and pulse */
function CurrentAgeMarker({ positionPct, age, theme = "dark" }) {
  const left = Math.min(Math.max(positionPct, 0), 100);

  return (
    <div
      className="glow pulse"
      style={{
        position: "absolute",
        left: `${left}%`,
        top: 0,
        bottom: 0,
        pointerEvents: "none",
        transform: "translateX(-50%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 4,
          borderRadius: 999,
          background: theme === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(96,165,250,0.8))"
            : "linear-gradient(180deg, rgba(56,24,168,0.9), rgba(108,52,248,0.8))",
          boxShadow: theme === "dark"
            ? `
              0 0 12px rgba(255, 255, 255, 0.6),
              0 0 24px rgba(96, 165, 250, 0.5),
              0 0 36px rgba(96, 165, 250, 0.3)
            `
            : `
              0 0 12px rgba(56, 24, 168, 0.4),
              0 0 24px rgba(108, 52, 248, 0.3),
              0 0 36px rgba(108, 52, 248, 0.2)
            `,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: theme === "dark"
            ? "rgba(15,23,42,0.95)"
            : "rgba(255,255,255,0.95)",
          borderRadius: 999,
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 700,
          color: theme === "dark" ? "#e5e7eb" : "#1f2933",
          whiteSpace: "nowrap",
          boxShadow: theme === "dark"
            ? "0 0 10px rgba(15,23,42,0.9)"
            : "0 0 6px rgba(15,23,42,0.25)",
        }}
      >
        {age}
      </div>
    </div>
  );
}

/** Marker on the main bar - just vertical line, no labels */
function Marker({ positionPct, label, color = "#e5e7eb", align = "center", theme = "dark" }) {
  const left = Math.min(Math.max(positionPct, 0), 100);

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        top: 0,
        bottom: 0,
        pointerEvents: "none",
        transform: "translateX(-50%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 2,
          borderRadius: 999,
          background: theme === "dark"
            ? color
            : (color === "#e5e7eb" ? "#8A8A8A" : color),
          boxShadow: theme === "dark"
            ? `0 0 8px ${color}, 0 0 12px ${color}`
            : `0 0 4px ${color === "#e5e7eb" ? "#8A8A8A" : color}`,
        }}
      />
    </div>
  );
}

/** Small coloured pill for legend */
function LegendPill({ color, children, theme = "dark" }) {
  // Extract base colors for light mode backgrounds
  const getBackgroundColor = () => {
    if (theme === "light") {
      if (color.includes("30,41,59")) {
        // Past - navy
        return "#1e293b";
      } else if (color.includes("3818A8")) {
        // Building - purple
        return "#4B1DB0";
      } else if (color.includes("FAD961")) {
        // Golden Years - gold
        return "#F76B1C";
      }
    }
    return theme === "dark" ? "rgba(15,23,42,0.9)" : "#FFFFFF";
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        borderRadius: 999,
        background: getBackgroundColor(),
        border: theme === "dark" 
          ? "1px solid rgba(148,163,184,0.4)"
          : "1px solid rgba(255,255,255,0.2)",
        boxShadow: theme === "dark"
          ? "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: color,
          boxShadow: theme === "dark"
            ? "0 0 8px rgba(148,163,184,0.6), 0 2px 4px rgba(0,0,0,0.2)"
            : "0 0 4px rgba(0,0,0,0.2)",
        }}
      />
      <span style={{ 
        fontSize: 16, 
        fontWeight: 700,
        color: theme === "dark" ? "#e5e7eb" : "#FFFFFF",
      }}>
        {children}
      </span>
    </div>
  );
}

/** Slider + number input row */
function SliderRow({ label, value, min, max, onChange, theme = "dark" }) {
  const themeColors = {
    dark: {
      text: "#d1d5db",
      textMuted: "#6b7280",
      border: "rgba(148,163,184,0.7)",
      bg: "rgba(15,23,42,0.9)",
    },
    light: {
      text: "#1e293b",
      textMuted: "#475569",
      border: "rgba(71,85,105,0.4)",
      bg: "rgba(255,255,255,1)",
    },
  };
  const colors = themeColors[theme];
  
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 15,
          marginBottom: 6,
          color: colors.text,
          fontWeight: 600,
        }}
      >
        <span>{label}</span>
        <span style={{ opacity: 0.85 }}>
          {value} yrs{" "}
          <span style={{ color: colors.textMuted, fontSize: 11 }}>
            (range {min}–{max})
          </span>
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: 8,
          alignItems: "center",
        }}
      >
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(clamp(n, min, max));
          }}
          style={{
            width: 60,
            padding: "4px 6px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            color: colors.text,
            fontSize: 12,
            textAlign: "center",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}
/** Small info card */
function InfoCard({ label, main, sub, theme = "dark" }) {
  // Check if this is a key metric (Years lived or Years remaining) to make it stand out
  const isKeyMetric = label === "Years lived" || label === "Years remaining";
  
  const themeColors = {
    dark: {
      border: "rgba(148,163,184,0.45)",
      cardBg: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.96))",
      labelColor: "#9ca3af",
      mainColor: isKeyMetric ? "#ffffff" : "#e5e7eb",
      subColor: "#6b7280",
    },
    light: {
      border: "rgba(71,85,105,0.3)",
      cardBg: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.98))",
      labelColor: "#475569",
      mainColor: isKeyMetric ? "#0f172a" : "#1e293b",
      subColor: "#475569",
    },
  };
  
  const colors = themeColors[theme];
  
  return (
    <div
      style={{
        borderRadius: 16,
        padding: "16px 18px",
        border: `1px solid ${colors.border}`,
        background: colors.cardBg,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: colors.labelColor,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: isKeyMetric ? 32 : 24,
          fontWeight: isKeyMetric ? 900 : 800,
          marginBottom: 4,
          color: colors.mainColor,
          textShadow: isKeyMetric && theme === "dark" ? "0 0 8px rgba(255,255,255,0.3)" : "none",
          letterSpacing: isKeyMetric ? "-0.02em" : "-0.01em",
        }}
      >
        {main}
      </div>
      {sub && (
        <div style={{ fontSize: 13, color: colors.subColor, fontWeight: 500 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

