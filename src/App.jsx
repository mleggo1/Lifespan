import { useState, useMemo, useEffect } from "react";

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
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: white !important;
    overflow-x: hidden !important;
  }
  body.dark-mode, html.dark-mode {
    background: #000000 !important;
  }
  #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    overflow-y: auto !important;
  }
  @media (min-width: 1025px) {
    #root {
      max-height: 100vh !important;
      overflow-y: hidden !important;
    }
  }
  @media (min-width: 1025px) {
    .lifespan-grid {
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 1.1fr) !important;
    }
  }
  @media (max-width: 1024px) {
    #root {
      max-height: none !important;
      overflow-y: auto !important;
    }
    .lifespan-grid {
      grid-template-columns: 1fr !important;
    }
  }
  @media (max-width: 768px) {
    .lifespan-grid {
      grid-template-columns: 1fr !important;
    }
    .numbers-grid {
      grid-template-columns: 1fr !important;
    }
  }
  @media (min-width: 769px) {
    .numbers-grid {
      grid-template-columns: repeat(2, minmax(0,1fr)) !important;
    }
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

  // Apply dark-mode class to body/html for background
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <div 
      style={{ 
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "clamp(16px, 4vw, 24px) clamp(16px, 2vw, 24px)",
        background: theme === "dark" ? "#000000" : "#FFFFFF",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <div style={{ 
        width: "100%", 
        maxWidth: "1400px",
        padding: 0,
        boxSizing: "border-box",
      }}>
        <div
          className="print-compact"
          style={{
            width: "100%",
            maxWidth: "100%",
            padding: "clamp(16px, 2vw, 24px) clamp(16px, 2vw, 24px)",
            borderRadius: "clamp(16px, 2vw, 24px)",
            border: `1px solid ${colors.border}`,
            background: colors.containerBg,
            boxShadow: theme === "dark" 
              ? "0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 200px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.02)",
            position: "relative",
            color: colors.text,
            boxSizing: "border-box",
          }}
        >
        {/* Header with controls */}
        <header
          style={{
            marginBottom: "clamp(8px, 1vw, 14px)",
            position: "relative",
            background: "transparent",
            zIndex: 1,
          }}
        >
          {/* Theme toggle and PDF export buttons */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              gap: "clamp(6px, 1vw, 8px)",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={toggleTheme}
              style={{
                padding: "clamp(6px, 0.8vw, 8px) clamp(10px, 1.2vw, 12px)",
                borderRadius: "clamp(6px, 0.8vw, 8px)",
                border: `1px solid ${colors.border}`,
                background: colors.cardBg,
                color: colors.text,
                fontSize: "clamp(11px, 1.3vw, 12px)",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "clamp(4px, 0.6vw, 6px)",
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
                padding: "clamp(6px, 0.8vw, 8px) clamp(10px, 1.2vw, 12px)",
                borderRadius: "clamp(6px, 0.8vw, 8px)",
                border: `1px solid ${colors.border}`,
                background: colors.cardBg,
                color: colors.text,
                fontSize: "clamp(11px, 1.3vw, 12px)",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "clamp(4px, 0.6vw, 6px)",
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
              background: "transparent",
            }}
          >
            <div
              style={{
                fontSize: "clamp(11px, 1.2vw, 13px)",
                textTransform: "uppercase",
                letterSpacing: 6,
                color: colors.textMuted,
                marginBottom: "clamp(4px, 0.5vw, 8px)",
                fontWeight: 600,
              }}
            >
              LifeSpan
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(28px, 6vw, 56px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.06em",
                background: "linear-gradient(120deg, #e5e7eb, #f97316, #facc15)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                position: "relative",
                zIndex: 10,
                textShadow: theme === "dark" 
                  ? "0 0 40px rgba(249, 115, 22, 0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              The Time You Have Left
            </h1>
            <div
              style={{
                marginTop: "clamp(10px, 1.2vw, 16px)",
                padding: "clamp(14px, 1.8vw, 20px) clamp(18px, 2.2vw, 24px)",
                background: "transparent",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(18px, 4vw, 28px)",
                  color: theme === "dark" ? "#ffffff" : "#1a1a1a",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  marginBottom: "clamp(8px, 1vw, 12px)",
                  letterSpacing: "-0.02em",
                }}
              >
                You have{" "}
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "clamp(24px, 5vw, 40px)",
                    color: theme === "dark" ? "#ffffff" : "#1a1a1a",
                    letterSpacing: "-0.03em",
                    display: "inline-block",
                  }}
                >
                  {formatYears(yearsToFreedom + yearsAfterFreedom)} ({percent(remainingPct)})
                </span>{" "}
                <span style={{ 
                  color: theme === "dark" ? "#ffffff" : "#1a1a1a",
                  fontWeight: 700,
                }}>left.</span>
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(20px, 4.5vw, 32px)",
                  fontWeight: 900,
                  color: theme === "dark" ? "#ffffff" : "#1a1a1a",
                  lineHeight: 1.2,
                  letterSpacing: "-0.03em",
                }}
              >
                What will you do with it?
              </p>
            </div>
          </div>
        </header>

        {/* Goal */}
        <section
          style={{
            marginBottom: "clamp(8px, 1vw, 12px)",
            padding: "clamp(6px, 0.8vw, 10px) clamp(10px, 1.2vw, 14px)",
            borderRadius: "clamp(10px, 1.3vw, 14px)",
            border: `1px solid ${colors.border}`,
            background: theme === "dark" 
              ? "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(15,23,42,0.95))"
              : "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(255,255,255,1))",
            textAlign: "center",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "clamp(11px, 1.3vw, 13px)",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: colors.textMuted,
              marginBottom: "clamp(6px, 0.8vw, 10px)",
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
              maxWidth: "100%",
              margin: "0 auto",
              padding: "clamp(10px, 1.2vw, 14px) clamp(14px, 1.8vw, 18px)",
              borderRadius: "clamp(12px, 1.5vw, 16px)",
              border: `2px solid ${colors.border}`,
              background: colors.cardBg,
              color: colors.text,
              fontSize: "clamp(14px, 1.8vw, 16px)",
              outline: "none",
              textAlign: "center",
              fontWeight: 600,
              boxSizing: "border-box",
            }}
          />
        </section>

        {/* Layout grid */}
        <div
          className="lifespan-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(16px, 2vw, 20px)",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Left: Timeline + sliders */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "clamp(10px, 1.2vw, 14px)",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}>
            {/* Main bar */}
            <section
              style={{
                padding: "clamp(12px, 1.5vw, 16px)",
                borderRadius: "clamp(14px, 1.8vw, 18px)",
                border: theme === "dark" 
                  ? "1px solid rgba(148,163,184,0.45)"
                  : "1px solid rgba(71,85,105,0.2)",
                background: theme === "dark"
                  ? "radial-gradient(circle at top left, rgba(248,250,252,0.08), rgba(15,23,42,0.9))"
                  : "#FFFFFF",
                boxShadow: theme === "dark"
                  ? "none"
                  : "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "clamp(6px, 0.8vw, 10px)",
                }}
              >
                <div style={{ 
                  fontSize: "clamp(14px, 1.8vw, 16px)", 
                  color: theme === "dark" ? colors.textMuted : "#2B2B2B", 
                  marginBottom: "clamp(4px, 0.6vw, 8px)",
                  fontWeight: 600,
                }}>
                  Age {cur} of {life}
                </div>
                <div style={{ 
                  fontSize: "clamp(24px, 3vw, 32px)", 
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
                  gap: "clamp(10px, 1.2vw, 14px)",
                }}
              >
                {/* The bar */}
                <div
                  className="chart-container"
                  style={{
                    position: "relative",
                    height: "clamp(60px, 8vh, 100px)",
                    width: "100%",
                    maxWidth: "100%",
                    borderRadius: 999,
                    overflow: "hidden",
                    background: theme === "dark"
                      ? "rgba(15,23,42,0.95)"
                      : "rgba(255,255,255,1)",
                    border: theme === "dark"
                      ? "3px solid rgba(148,163,184,0.6)"
                      : "3px solid rgba(71,85,105,0.6)",
                    boxShadow: theme === "dark"
                      ? `
                        inset 0 3px 6px rgba(255,255,255,0.15),
                        inset 0 -3px 6px rgba(0,0,0,0.9),
                        0 12px 48px rgba(0,0,0,0.5),
                        0 0 0 2px rgba(255,255,255,0.08),
                        0 0 60px rgba(108, 52, 248, 0.2)
                      `
                      : `
                        0 4px 16px rgba(0,0,0,0.1),
                        0 2px 4px rgba(0,0,0,0.06),
                        inset 0 2px 0 rgba(255,255,255,0.9),
                        0 0 40px rgba(108, 52, 248, 0.15)
                      `,
                    boxSizing: "border-box",
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
                          "linear-gradient(90deg, #3818A8, #4B1DB0, #6C34F8, #8B5CF6)",
                        boxShadow: `
                          inset 0 0 40px rgba(56, 24, 168, 0.7),
                          inset 0 2px 8px rgba(255, 255, 255, 0.2),
                          0 0 30px rgba(108, 52, 248, 0.5),
                          0 0 60px rgba(108, 52, 248, 0.3)
                        `,
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
                          "linear-gradient(90deg, #FAD961, #F9B84A, #F76B1C, #EA580C)",
                        boxShadow: `
                          inset 0 0 50px rgba(250, 217, 97, 0.8),
                          inset 0 2px 8px rgba(255, 255, 255, 0.3),
                          0 0 35px rgba(247, 107, 28, 0.6),
                          0 0 70px rgba(247, 107, 28, 0.4)
                        `,
                      }}
                    />
                  )}

                  {/* Markers */}
                  {/* Current age marker */}
                  <CurrentAgeMarker positionPct={(livedPct / totalSpan) * totalSpan} age={cur} theme={theme} />

                  {/* Freedom marker - enhanced */}
                  <Marker
                    positionPct={((freedom / totalSpan) * 100)}
                    label={`Retirement (${freedom})`}
                    color="#6C34F8"
                    theme={theme}
                    isHighlighted={true}
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
                    height: "clamp(32px, 4vh, 38px)",
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
                            height: isMajor ? "clamp(12px, 1.5vh, 14px)" : "clamp(8px, 1vh, 10px)",
                            background: theme === "dark"
                              ? "rgba(255, 255, 255, 0.55)"
                              : "#8A8A8A",
                            margin: "0 auto clamp(4px, 0.6vh, 6px)",
                            borderRadius: 999,
                          }}
                        />
                        <div
                          style={{
                            fontSize: "clamp(14px, 1.8vw, 16px)",
                            fontWeight: 700,
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
                    height: "clamp(60px, 7vh, 75px)",
                    marginTop: 0,
                    marginBottom: "clamp(6px, 0.8vw, 10px)",
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
                        fontSize: "clamp(20px, 2.5vw, 24px)",
                        fontWeight: 900,
                        color: theme === "dark" ? "#9ca3af" : "#2B2B2B",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: "clamp(4px, 0.6vw, 8px)",
                        lineHeight: 1.2,
                      }}
                    >
                      Childhood
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(16px, 2vw, 18px)",
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
                        fontSize: "clamp(20px, 2.5vw, 24px)",
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #3818A8, #6C34F8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: "clamp(4px, 0.6vw, 8px)",
                        lineHeight: 1.2,
                      }}
                    >
                      Work
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(16px, 2vw, 18px)",
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
                        fontSize: "clamp(20px, 2.5vw, 24px)",
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #FAD961, #F76B1C)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: "clamp(4px, 0.6vw, 8px)",
                        lineHeight: 1.2,
                      }}
                    >
                      Golden Years
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(16px, 2vw, 18px)",
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
                  gap: "clamp(8px, 1vw, 12px)",
                  marginTop: "clamp(2px, 0.4vw, 4px)",
                  fontSize: "clamp(11px, 1.3vw, 12px)",
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
                padding: "clamp(12px, 1.5vw, 16px)",
                borderRadius: "clamp(16px, 2vw, 20px)",
                border: `2px solid ${colors.border}`,
                background: theme === "dark"
                  ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))"
                  : "linear-gradient(135deg, rgba(255,255,255,1), rgba(248,250,252,0.98))",
                boxShadow: theme === "dark"
                  ? "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  margin: "0 0 clamp(8px, 1vw, 10px)",
                  fontSize: "clamp(18px, 2.2vw, 22px)",
                  fontWeight: 800,
                  color: colors.text,
                  letterSpacing: "-0.01em",
                }}
              >
                Your Timeline
              </h2>
              <p style={{ 
                margin: "0 0 clamp(8px, 1vw, 10px)", 
                fontSize: "clamp(13px, 1.6vw, 15px)", 
                color: colors.textMuted, 
                lineHeight: 1.5, 
                fontWeight: 500 
              }}>
                Adjust these numbers to see how your choices change the rest of your life.
              </p>

              <SliderRow
                label="Current age"
                value={cur}
                min={0}
                max={Math.max(freedom - 1, 0)}
                onChange={(v) => {
                  const newAge = Math.max(0, Number(v));
                  setCurrentAge(newAge);
                  // If new age >= freedom, adjust freedom
                  if (freedom <= newAge) {
                    setFreedomAge(newAge + 1);
                  }
                  // If new age >= life, adjust life
                  if (life <= newAge) {
                    setLifeExpectancy(Math.min(newAge + 2, MAX_AGE));
                    if (freedom <= newAge) {
                      setFreedomAge(newAge + 1);
                    }
                  }
                }}
                theme={theme}
                allowAnyNumber={true}
                minConstraint={0}
                maxConstraint={freedom - 1}
              />
              <SliderRow
                label="Target retirement"
                value={freedom}
                min={cur + 1}
                max={Math.max(life - 1, cur + 1)}
                onChange={(v) => {
                  const newFreedom = Number(v);
                  // Allow any number while typing, will validate on blur
                  if (!Number.isNaN(newFreedom) && newFreedom >= 0) {
                    setFreedomAge(newFreedom);
                    // If new freedom >= life, adjust life
                    if (life <= newFreedom) {
                      setLifeExpectancy(Math.min(newFreedom + 1, MAX_AGE));
                    }
                  }
                }}
                theme={theme}
                isHighlighted={true}
                allowAnyNumber={true}
                minConstraint={cur + 1}
                maxConstraint={life - 1}
              />
              <SliderRow
                label="Life expectancy"
                value={life}
                min={freedom + 1}
                max={MAX_AGE}
                onChange={(v) => {
                  const newLife = Number(v);
                  // Must be greater than freedom
                  if (newLife > freedom && newLife <= MAX_AGE) {
                    setLifeExpectancy(newLife);
                  }
                }}
                theme={theme}
                allowAnyNumber={true}
                minConstraint={freedom + 1}
                maxConstraint={MAX_AGE}
              />
            </section>
          </div>

          {/* Right: insights */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "clamp(10px, 1.2vw, 14px)",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}>
            {/* Snapshot cards */}
            <section
              style={{
                padding: "clamp(12px, 1.5vw, 16px)",
                borderRadius: "clamp(14px, 1.8vw, 18px)",
                border: `1px solid ${colors.border}`,
                background: theme === "dark"
                  ? "radial-gradient(circle at top, rgba(248,250,252,0.04), rgba(15,23,42,0.97))"
                  : "radial-gradient(circle at top, rgba(255,255,255,0.6), rgba(248,250,252,0.98))",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  margin: "0 0 clamp(10px, 1.2vw, 14px)",
                  fontSize: "clamp(18px, 2.2vw, 22px)",
                  fontWeight: 800,
                  color: colors.text,
                  letterSpacing: "-0.01em",
                }}
              >
                The Numbers
              </h2>
              <div
                className="numbers-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: "clamp(8px, 1vw, 10px)",
                  fontSize: 12,
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
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
                  label="Years to retirement"
                  main={formatYears(yearsToFreedom)}
                  sub={`${percent(toFreedomPct)} of your life`}
                  theme={theme}
                  isHighlighted={true}
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
                padding: "clamp(14px, 1.8vw, 20px)",
                borderRadius: "clamp(14px, 1.8vw, 18px)",
                border: `1px solid ${colors.border}`,
                background: theme === "dark"
                  ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,58,138,0.3))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(241,245,249,0.5))",
                fontSize: "clamp(15px, 1.9vw, 17px)",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  margin: "0 0 clamp(10px, 1.2vw, 14px)",
                  fontSize: "clamp(20px, 2.5vw, 24px)",
                  fontWeight: 900,
                  color: colors.text,
                  letterSpacing: "-0.02em",
                }}
              >
                Questions to Consider
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 1.5vw, 16px)" }}>
                {/* Right Now */}
                <div>
                  <div style={{ 
                    fontSize: "clamp(14px, 1.8vw, 16px)", 
                    textTransform: "uppercase", 
                    letterSpacing: 1.5, 
                    color: "#a5b4fc",
                    fontWeight: 800,
                    marginBottom: "clamp(10px, 1.2vw, 12px)",
                  }}>
                    Right Now
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    lineHeight: 1.8, 
                    fontSize: "clamp(18px, 2.3vw, 22px)", 
                    fontWeight: 500 
                  }}>
                    If you only had <strong style={{ 
                      color: "#60a5fa", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" ? "0 0 12px rgba(96, 165, 250, 0.6)" : "none",
                    }}>{formatYears(yearsToFreedom)}</strong> years left to retirement and create the life you truly want… what would you begin today?
                  </p>
                </div>

                {/* Your Path to Freedom */}
                <div>
                  <div style={{ 
                    fontSize: "clamp(14px, 1.8vw, 16px)", 
                    textTransform: "uppercase", 
                    letterSpacing: 1.5, 
                    color: "#f97316",
                    fontWeight: 800,
                    marginBottom: "clamp(10px, 1.2vw, 12px)",
                  }}>
                    Your Path to Freedom
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    lineHeight: 1.8, 
                    fontSize: "clamp(18px, 2.3vw, 22px)", 
                    fontWeight: 500 
                  }}>
                    Between now and age <strong style={{ 
                      color: "#f97316", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" ? "0 0 12px rgba(249, 115, 22, 0.6)" : "none",
                    }}>55</strong>, what must happen so you live life on your terms — financially free, secure, and unburdened?
                  </p>
                </div>

                {/* Your Golden Years */}
                <div>
                  <div style={{ 
                    fontSize: "clamp(14px, 1.8vw, 16px)", 
                    textTransform: "uppercase", 
                    letterSpacing: 1.5, 
                    color: "#22c55e",
                    fontWeight: 800,
                    marginBottom: "clamp(10px, 1.2vw, 12px)",
                  }}>
                    Your Golden Years
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    lineHeight: 1.8, 
                    fontSize: "clamp(18px, 2.3vw, 22px)", 
                    fontWeight: 500 
                  }}>
                    From age <strong style={{ 
                      color: "#f97316", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" ? "0 0 12px rgba(249, 115, 22, 0.6)" : "none",
                    }}>55</strong> to <strong style={{ 
                      color: "#f97316", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" ? "0 0 12px rgba(249, 115, 22, 0.6)" : "none",
                    }}>90</strong>, you have <strong style={{ 
                      color: "#fbbf24", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" ? "0 0 12px rgba(251, 191, 36, 0.6)" : "none",
                    }}>35</strong> precious years left. How will you use them?
                  </p>
                </div>
              </div>
            </section>
          </div>
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
          padding: "clamp(4px, 0.5vw, 5px) clamp(10px, 1.2vw, 12px)",
          fontSize: "clamp(13px, 1.6vw, 15px)",
          fontWeight: 800,
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
function Marker({ positionPct, label, color = "#e5e7eb", align = "center", theme = "dark", isHighlighted = false }) {
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
          width: isHighlighted ? 4 : 2,
          borderRadius: 999,
          background: theme === "dark"
            ? color
            : (color === "#e5e7eb" ? "#8A8A8A" : color),
          boxShadow: isHighlighted
            ? theme === "dark"
              ? `0 0 16px ${color}, 0 0 24px ${color}, 0 0 32px ${color}`
              : `0 0 12px ${color}, 0 0 20px ${color}`
            : theme === "dark"
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
        gap: "clamp(8px, 1vw, 10px)",
        padding: "clamp(8px, 1.2vw, 10px) clamp(14px, 1.8vw, 18px)",
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
          width: "clamp(12px, 1.5vw, 14px)",
          height: "clamp(12px, 1.5vw, 14px)",
          borderRadius: 999,
          background: color,
          boxShadow: theme === "dark"
            ? "0 0 8px rgba(148,163,184,0.6), 0 2px 4px rgba(0,0,0,0.2)"
            : "0 0 4px rgba(0,0,0,0.2)",
        }}
      />
      <span style={{ 
        fontSize: "clamp(13px, 1.6vw, 15px)", 
        fontWeight: 700,
        color: theme === "dark" ? "#e5e7eb" : "#FFFFFF",
      }}>
        {children}
      </span>
    </div>
  );
}

/** Slider + number input row */
function SliderRow({ label, value, min, max, onChange, theme = "dark", isHighlighted = false, allowAnyNumber = false, minConstraint, maxConstraint }) {
  const [localValue, setLocalValue] = useState(String(value));
  
  // Sync local value when prop value changes (from slider or external updates)
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);
  
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
    <div style={{ 
      marginBottom: "clamp(8px, 1vw, 12px)",
      padding: "clamp(6px, 0.8vw, 10px)",
      borderRadius: "clamp(12px, 1.5vw, 16px)",
      background: theme === "dark"
        ? "rgba(15,23,42,0.6)"
        : "rgba(248,250,252,0.5)",
      border: `1px solid ${colors.border}`,
    }}>
      <div
        style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        fontSize: "clamp(18px, 2.2vw, 22px)",
        marginBottom: "clamp(6px, 0.8vw, 8px)",
        color: colors.text,
        fontWeight: isHighlighted ? 900 : 700,
        }}
      >
        <span>{label}</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: "clamp(10px, 1.2vw, 14px)",
          alignItems: "center",
        }}
      >
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ 
            width: "100%",
            height: "clamp(12px, 1.5vw, 14px)",
            cursor: "pointer",
          }}
        />
        <input
          type="number"
          min={allowAnyNumber ? undefined : min}
          max={allowAnyNumber ? undefined : max}
          value={localValue}
          onChange={(e) => {
            const inputValue = e.target.value;
            // Update local state immediately to allow free typing
            setLocalValue(inputValue);
            // Parse and update parent state if it's a valid number
            if (inputValue !== "" && inputValue !== "-") {
              const n = Number(inputValue);
              if (!Number.isNaN(n)) {
                if (allowAnyNumber) {
                  // Allow any number while typing
                  onChange(n);
                } else {
                  onChange(clamp(n, min, max));
                }
              }
            }
          }}
          style={{
            width: "clamp(80px, 10vw, 90px)",
            padding: "clamp(8px, 1vw, 10px) clamp(12px, 1.5vw, 14px)",
            borderRadius: "clamp(8px, 1vw, 10px)",
            border: `2px solid ${isHighlighted ? (theme === "dark" ? "rgba(108, 52, 248, 0.6)" : "rgba(108, 52, 248, 0.5)") : colors.border}`,
            background: theme === "dark"
              ? (isHighlighted ? "rgba(15,23,42,1)" : colors.bg)
              : (isHighlighted ? "rgba(255,255,255,1)" : colors.bg),
            color: colors.text,
            fontSize: "clamp(18px, 2.2vw, 20px)",
            fontWeight: isHighlighted ? 900 : 700,
            textAlign: "center",
            outline: "none",
            fontFamily: "inherit",
            boxShadow: isHighlighted
              ? theme === "dark"
                ? "0 0 20px rgba(108, 52, 248, 0.3), inset 0 1px 2px rgba(255,255,255,0.1)"
                : "0 0 15px rgba(108, 52, 248, 0.2), inset 0 1px 2px rgba(255,255,255,0.9)"
              : theme === "dark"
              ? "inset 0 1px 2px rgba(255,255,255,0.05)"
              : "inset 0 1px 2px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = isHighlighted
              ? theme === "dark"
                ? "0 0 30px rgba(108, 52, 248, 0.5), inset 0 1px 2px rgba(255,255,255,0.15)"
                : "0 0 25px rgba(108, 52, 248, 0.35), inset 0 1px 2px rgba(255,255,255,1)"
              : theme === "dark"
              ? "0 0 15px rgba(148,163,184,0.4), inset 0 1px 2px rgba(255,255,255,0.1)"
              : "0 0 12px rgba(71,85,105,0.2), inset 0 1px 2px rgba(0,0,0,0.05)";
          }}
          onBlur={(e) => {
            // On blur, ensure the value meets constraints and reset shadow
            const inputValue = e.target.value;
            if (inputValue === "" || inputValue === "-") {
              setLocalValue(String(value));
            } else {
              const n = Number(inputValue);
              if (!Number.isNaN(n) && n >= 0) {
                if (allowAnyNumber && minConstraint !== undefined && maxConstraint !== undefined) {
                  const adjustedValue = Math.max(minConstraint, Math.min(n, maxConstraint));
                  onChange(adjustedValue);
                  setLocalValue(String(adjustedValue));
                } else if (!allowAnyNumber) {
                  const clampedValue = clamp(n, min, max);
                  onChange(clampedValue);
                  setLocalValue(String(clampedValue));
                } else {
                  onChange(n);
                  setLocalValue(String(n));
                }
              } else {
                setLocalValue(String(value));
              }
            }
            // Reset shadow
            e.currentTarget.style.boxShadow = isHighlighted
              ? theme === "dark"
                ? "0 0 20px rgba(108, 52, 248, 0.3), inset 0 1px 2px rgba(255,255,255,0.1)"
                : "0 0 15px rgba(108, 52, 248, 0.2), inset 0 1px 2px rgba(255,255,255,0.9)"
              : theme === "dark"
              ? "inset 0 1px 2px rgba(255,255,255,0.05)"
              : "inset 0 1px 2px rgba(0,0,0,0.05)";
          }}
        />
      </div>
    </div>
  );
}
/** Small info card */
function InfoCard({ label, main, sub, theme = "dark", isHighlighted = false }) {
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
        borderRadius: "clamp(12px, 1.5vw, 16px)",
        padding: "clamp(12px, 1.5vw, 14px) clamp(14px, 1.8vw, 16px)",
        border: `1px solid ${colors.border}`,
        background: colors.cardBg,
      }}
    >
      <div
        style={{
          fontSize: "clamp(11px, 1.3vw, 12px)",
          color: colors.labelColor,
          marginBottom: "clamp(4px, 0.6vw, 6px)",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          fontWeight: isHighlighted ? 700 : 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: isHighlighted ? "clamp(28px, 3.5vw, 32px)" : (isKeyMetric ? "clamp(24px, 3vw, 28px)" : "clamp(20px, 2.5vw, 22px)"),
          fontWeight: isHighlighted ? 900 : (isKeyMetric ? 900 : 800),
          marginBottom: "clamp(2px, 0.4vw, 4px)",
          color: colors.mainColor,
          textShadow: isHighlighted && theme === "dark" 
            ? "0 0 12px rgba(255,255,255,0.4)"
            : (isKeyMetric && theme === "dark" ? "0 0 8px rgba(255,255,255,0.3)" : "none"),
          letterSpacing: isHighlighted ? "-0.03em" : (isKeyMetric ? "-0.02em" : "-0.01em"),
        }}
      >
        {main}
      </div>
      {sub && (
        <div style={{ 
          fontSize: "clamp(11px, 1.3vw, 12px)", 
          color: colors.subColor, 
          fontWeight: isHighlighted ? 600 : 500 
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

