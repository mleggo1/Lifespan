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
    @keyframes pulseAttention {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(108, 52, 248, 0.7);
      }
      50% { 
        transform: scale(1.01);
        box-shadow: 0 0 0 8px rgba(108, 52, 248, 0);
      }
    }
    @keyframes pulseGlow {
      0%, 100% { 
        border-color: rgba(108, 52, 248, 0.6);
        box-shadow: 0 0 20px rgba(108, 52, 248, 0.3), inset 0 1px 2px rgba(255,255,255,0.1);
      }
      50% { 
        border-color: rgba(108, 52, 248, 1);
        box-shadow: 0 0 40px rgba(108, 52, 248, 0.6), 0 0 60px rgba(108, 52, 248, 0.4), inset 0 1px 2px rgba(255,255,255,0.2);
      }
    }
    @keyframes lifeForcePurple {
      0%, 100% { 
        box-shadow: 
          inset 0 0 40px rgba(56, 24, 168, 0.7),
          inset 0 2px 8px rgba(255, 255, 255, 0.2),
          0 0 30px rgba(108, 52, 248, 0.5),
          0 0 60px rgba(108, 52, 248, 0.3);
        filter: brightness(1);
      }
      50% { 
        box-shadow: 
          inset 0 0 60px rgba(56, 24, 168, 1),
          inset 0 2px 12px rgba(255, 255, 255, 0.4),
          0 0 50px rgba(108, 52, 248, 0.9),
          0 0 100px rgba(108, 52, 248, 0.7),
          0 0 150px rgba(108, 52, 248, 0.5);
        filter: brightness(1.2);
      }
    }
    @keyframes lifeForceGolden {
      0%, 100% { 
        box-shadow: 
          inset 0 0 50px rgba(250, 217, 97, 0.8),
          inset 0 2px 8px rgba(255, 255, 255, 0.3),
          0 0 35px rgba(247, 107, 28, 0.6),
          0 0 70px rgba(247, 107, 28, 0.4);
        filter: brightness(1);
      }
      50% { 
        box-shadow: 
          inset 0 0 70px rgba(250, 217, 97, 1),
          inset 0 2px 12px rgba(255, 255, 255, 0.5),
          0 0 60px rgba(251, 191, 36, 1),
          0 0 120px rgba(247, 107, 28, 0.9),
          0 0 180px rgba(247, 107, 28, 0.7);
        filter: brightness(1.25);
      }
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
  .pulse-attention {
    animation: pulseAttention 2s ease-in-out infinite;
  }
  .pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    background: radial-gradient(ellipse at top, #e0f2fe 0%, #bae6fd 20%, #f0f9ff 40%, #f8fafc 70%, #ffffff 100%), radial-gradient(circle at 15% 25%, rgba(147, 197, 253, 0.2) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(191, 219, 254, 0.15) 0%, transparent 40%) !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
  body.dark-mode, html.dark-mode {
    background: radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 30%, #0f172a 60%, #020617 100%), radial-gradient(circle at 20% 30%, rgba(108, 52, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%) !important;
  }
  #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
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
    /* Mobile optimizations */
    .chart-container {
      height: clamp(70px, 10vh, 90px) !important;
    }
    .age-scale {
      height: clamp(36px, 5vh, 44px) !important;
    }
    .phase-labels {
      height: clamp(60px, 8vh, 75px) !important;
    }
    /* Reduce padding on mobile */
    body {
      padding: clamp(8px, 2vw, 12px) clamp(8px, 2vw, 12px) !important;
    }
    /* Smaller font sizes for mobile */
    .mobile-text-sm {
      font-size: clamp(12px, 3vw, 14px) !important;
    }
    .mobile-text-md {
      font-size: clamp(16px, 4vw, 20px) !important;
    }
    .mobile-text-lg {
      font-size: clamp(18px, 4.5vw, 24px) !important;
    }
    /* Reduce gaps on mobile */
    .mobile-gap-sm {
      gap: clamp(8px, 2vw, 12px) !important;
    }
    .mobile-gap-md {
      gap: clamp(12px, 3vw, 16px) !important;
    }
  }
  @media (min-width: 769px) {
    .numbers-grid {
      grid-template-columns: repeat(2, minmax(0,1fr)) !important;
    }
  }
  /* Tablet optimizations (iPad) */
  @media (min-width: 769px) and (max-width: 1024px) {
    .chart-container {
      height: clamp(85px, 11vh, 120px) !important;
    }
    .age-scale {
      height: clamp(42px, 5.5vh, 52px) !important;
    }
    .phase-labels {
      height: clamp(70px, 8.5vh, 90px) !important;
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

function AlreadyRetiredToggle({ checked, onChange, theme, colors, isMobile = false }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "10px" : "12px",
        cursor: "pointer",
        padding: isMobile ? "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 14px)" : "10px 14px",
        borderRadius: "clamp(10px, 1.2vw, 12px)",
        border: `1px solid ${
          checked
            ? theme === "dark"
              ? "rgba(108, 52, 248, 0.45)"
              : "rgba(108, 52, 248, 0.35)"
            : colors.border
        }`,
        background: checked
          ? theme === "dark"
            ? "rgba(108, 52, 248, 0.12)"
            : "rgba(108, 52, 248, 0.06)"
          : "transparent",
        transition: "all 0.2s ease",
        userSelect: "none",
        marginBottom: isMobile ? "clamp(4px, 1.2vw, 6px)" : "clamp(6px, 0.8vw, 8px)",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: isMobile ? 18 : 16,
          height: isMobile ? 18 : 16,
          margin: 0,
          accentColor: theme === "dark" ? "#8B5CF6" : "#6C34F8",
          cursor: "pointer",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: isMobile ? "clamp(13px, 3.2vw, 15px)" : "clamp(14px, 1.6vw, 15px)",
          fontWeight: 600,
          color: colors.text,
          lineHeight: 1.35,
        }}
      >
        Already retired
      </span>
    </label>
  );
}

/** Welcome Modal Component */
function WelcomeModal({
  currentAge,
  setCurrentAge,
  retirementAge,
  setRetirementAge,
  lifeExpectancy,
  setLifeExpectancy,
  alreadyRetired: initialAlreadyRetired,
  onSubmit,
  theme,
  MAX_AGE,
  clamp,
  isMobile = false,
}) {
  const [localCurrentAge, setLocalCurrentAge] = useState(String(currentAge));
  const [localRetirement, setLocalRetirement] = useState(String(retirementAge));
  const [localLifeExpectancy, setLocalLifeExpectancy] = useState(String(lifeExpectancy));
  const [alreadyRetired, setAlreadyRetired] = useState(initialAlreadyRetired);
  
  const themeColors = {
    dark: {
      bg: "radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 30%, #0f172a 60%, #020617 100%), radial-gradient(circle at 20% 30%, rgba(108, 52, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
      modalBg: "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))",
      text: "#e5e7eb",
      textSecondary: "#d1d5db",
      textMuted: "#9ca3af",
      border: "rgba(148,163,184,0.4)",
      cardBg: "rgba(15,23,42,0.9)",
      inputBg: "rgba(15,23,42,0.95)",
    },
    light: {
      bg: "radial-gradient(ellipse at top, #e0f2fe 0%, #bae6fd 20%, #f0f9ff 40%, #f8fafc 70%, #ffffff 100%), radial-gradient(circle at 15% 25%, rgba(147, 197, 253, 0.2) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(191, 219, 254, 0.15) 0%, transparent 40%)",
      modalBg: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
      text: "#0f172a",
      textSecondary: "#1e293b",
      textMuted: "#475569",
      border: "rgba(71,85,105,0.3)",
      cardBg: "rgba(255,255,255,0.95)",
      inputBg: "rgba(255,255,255,1)",
    },
  };
  
  const colors = themeColors[theme];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const curAge = Math.max(0, Math.min(MAX_AGE - 2, Number(localCurrentAge) || 42));
    const retAge = alreadyRetired
      ? curAge
      : Math.max(curAge + 1, Math.min(MAX_AGE - 1, Number(localRetirement) || 65));
    const lifeExp = alreadyRetired
      ? Math.max(curAge + 1, Math.min(MAX_AGE, Number(localLifeExpectancy) || 80))
      : Math.max(retAge + 1, Math.min(MAX_AGE, Number(localLifeExpectancy) || 80));

    onSubmit(curAge, retAge, lifeExp, alreadyRetired);
  };

  const currentAgeNum = Number(localCurrentAge) || 42;
  const retirementNum = Number(localRetirement) || 65;
  const lifeExpNum = Number(localLifeExpectancy) || 80;

  const isValid = alreadyRetired
    ? currentAgeNum >= 0 &&
      currentAgeNum < MAX_AGE - 1 &&
      lifeExpNum > currentAgeNum &&
      lifeExpNum <= MAX_AGE
    : currentAgeNum >= 0 &&
      currentAgeNum < MAX_AGE - 2 &&
      retirementNum > currentAgeNum &&
      retirementNum < MAX_AGE &&
      lifeExpNum > retirementNum &&
      lifeExpNum <= MAX_AGE;
  
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: colors.bg,
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        padding: isMobile ? "clamp(16px, 4vw, 20px) clamp(12px, 3vw, 16px)" : "clamp(16px, 4vw, 32px)",
        paddingTop: isMobile ? "clamp(20px, 5vw, 28px)" : "clamp(16px, 4vw, 32px)",
        paddingBottom: isMobile ? "clamp(20px, 5vw, 28px)" : "clamp(16px, 4vw, 32px)",
        zIndex: 10000,
        overflowY: "auto",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "600px",
          background: colors.modalBg,
          borderRadius: isMobile ? "clamp(16px, 4vw, 20px)" : "clamp(20px, 3vw, 32px)",
          border: `2px solid ${colors.border}`,
          boxShadow: theme === "dark"
            ? "0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 20px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)",
          padding: isMobile ? "clamp(24px, 6vw, 28px) clamp(16px, 4vw, 20px)" : "clamp(24px, 4vw, 40px)",
          color: colors.text,
          animation: "fadeIn 0.6s ease-out",
          margin: isMobile ? "auto" : "0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: isMobile ? "clamp(20px, 5vw, 24px)" : "clamp(24px, 3vw, 32px)" }}>
          <div
            style={{
              fontSize: isMobile ? "clamp(9px, 2.2vw, 11px)" : "clamp(11px, 1.2vw, 13px)",
              textTransform: "uppercase",
              letterSpacing: isMobile ? 4 : 6,
              color: colors.textMuted,
              marginBottom: isMobile ? "clamp(10px, 2.5vw, 14px)" : "clamp(8px, 1vw, 12px)",
              fontWeight: 600,
            }}
          >
            LifeSpan
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? "clamp(22px, 5.5vw, 28px)" : "clamp(28px, 5vw, 42px)",
              fontWeight: 900,
              lineHeight: isMobile ? 1.2 : 1.1,
              letterSpacing: isMobile ? "-0.02em" : "-0.03em",
              background: "linear-gradient(120deg, #e5e7eb, #f97316, #facc15)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: isMobile ? "clamp(14px, 3.5vw, 18px)" : "clamp(12px, 1.5vw, 16px)",
              padding: isMobile ? "0 clamp(4px, 1vw, 8px)" : "0",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Welcome to Your Life Timeline
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: isMobile ? "clamp(14px, 3.5vw, 16px)" : "clamp(16px, 2vw, 18px)",
              color: colors.textSecondary,
              lineHeight: isMobile ? 1.5 : 1.6,
              fontWeight: 500,
              padding: isMobile ? "0 clamp(4px, 1vw, 8px)" : "0",
            }}
          >
            Let's personalize your timeline to see how your choices shape your future.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "clamp(16px, 4vw, 20px)" : "clamp(20px, 2.5vw, 28px)" }}>
            {/* Current Age - with pulsing animation to draw attention */}
            <div className="pulse-attention" style={{ 
              padding: isMobile ? "clamp(14px, 3.5vw, 16px)" : "clamp(12px, 1.5vw, 16px)",
              borderRadius: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(12px, 1.5vw, 16px)",
              background: theme === "dark"
                ? "linear-gradient(135deg, rgba(56, 24, 168, 0.15), rgba(108, 52, 248, 0.1))"
                : "linear-gradient(135deg, rgba(108, 52, 248, 0.08), rgba(139, 92, 246, 0.05))",
              border: `2px solid ${theme === "dark" ? "rgba(108, 52, 248, 0.4)" : "rgba(108, 52, 248, 0.3)"}`,
              transition: "all 0.3s ease",
            }}>
              <label
                style={{
                  display: "block",
                  fontSize: isMobile ? "clamp(14px, 3.5vw, 16px)" : "clamp(16px, 2vw, 18px)",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(8px, 1vw, 12px)",
                  textShadow: theme === "dark" ? "0 0 10px rgba(255, 255, 255, 0.3)" : "0 1px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                Current age ✨
              </label>
              <WelcomeSliderRow
                value={localCurrentAge}
                setValue={setLocalCurrentAge}
                min={0}
                max={
                  alreadyRetired
                    ? Math.max(lifeExpNum - 1, 0)
                    : Math.max(retirementNum - 1, 0)
                }
                theme={theme}
                colors={colors}
                MAX_AGE={MAX_AGE}
                clamp={clamp}
                isPulsing={true}
                isMobile={isMobile}
              />
            </div>

            <AlreadyRetiredToggle
              checked={alreadyRetired}
              onChange={setAlreadyRetired}
              theme={theme}
              colors={colors}
              isMobile={isMobile}
            />

            {!alreadyRetired && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: isMobile ? "clamp(14px, 3.5vw, 16px)" : "clamp(16px, 2vw, 18px)",
                  fontWeight: 700,
                  color: colors.text,
                  marginBottom: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(8px, 1vw, 12px)",
                }}
              >
                Target retirement
              </label>
              <WelcomeSliderRow
                value={localRetirement}
                setValue={setLocalRetirement}
                min={currentAgeNum + 1}
                max={Math.max(lifeExpNum - 1, currentAgeNum + 1)}
                theme={theme}
                colors={colors}
                MAX_AGE={MAX_AGE}
                clamp={clamp}
                isHighlighted={true}
                isMobile={isMobile}
              />
            </div>
            )}
            
            {/* Quality Life Expectancy */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: isMobile ? "clamp(14px, 3.5vw, 16px)" : "clamp(16px, 2vw, 18px)",
                  fontWeight: 700,
                  color: colors.text,
                  marginBottom: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(8px, 1vw, 12px)",
                }}
              >
                Quality life expectancy
              </label>
              <WelcomeSliderRow
                value={localLifeExpectancy}
                setValue={setLocalLifeExpectancy}
                min={alreadyRetired ? currentAgeNum + 1 : retirementNum + 1}
                max={MAX_AGE}
                theme={theme}
                colors={colors}
                MAX_AGE={MAX_AGE}
                clamp={clamp}
                isMobile={isMobile}
              />
            </div>
          </div>
          
          <div style={{ marginTop: isMobile ? "clamp(24px, 6vw, 32px)" : "clamp(32px, 4vw, 40px)", display: "flex", justifyContent: "center" }}>
            <button
              type="submit"
              disabled={!isValid}
              style={{
                padding: isMobile ? "clamp(12px, 3vw, 14px) clamp(24px, 6vw, 32px)" : "clamp(14px, 1.8vw, 18px) clamp(32px, 4vw, 48px)",
                fontSize: isMobile ? "clamp(14px, 3.5vw, 16px)" : "clamp(16px, 2vw, 18px)",
                fontWeight: 700,
                borderRadius: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(12px, 1.5vw, 16px)",
                border: "none",
                background: isValid
                  ? "linear-gradient(135deg, #3818A8, #6C34F8, #8B5CF6)"
                  : "rgba(148,163,184,0.3)",
                color: "#ffffff",
                cursor: isValid ? "pointer" : "not-allowed",
                boxShadow: isValid
                  ? theme === "dark"
                    ? "0 8px 32px rgba(108, 52, 248, 0.4), 0 0 60px rgba(108, 52, 248, 0.2)"
                    : "0 4px 16px rgba(108, 52, 248, 0.3)"
                  : "none",
                transition: "all 0.3s ease",
                opacity: isValid ? 1 : 0.6,
                width: isMobile ? "100%" : "auto",
                maxWidth: isMobile ? "100%" : "none",
              }}
              onMouseEnter={(e) => {
                if (isValid) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = theme === "dark"
                    ? "0 12px 48px rgba(108, 52, 248, 0.6), 0 0 80px rgba(108, 52, 248, 0.3)"
                    : "0 6px 24px rgba(108, 52, 248, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (isValid) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = isValid
                    ? theme === "dark"
                      ? "0 8px 32px rgba(108, 52, 248, 0.4), 0 0 60px rgba(108, 52, 248, 0.2)"
                      : "0 4px 16px rgba(108, 52, 248, 0.3)"
                    : "none";
                }
              }}
            >
              Create My Timeline →
            </button>
          </div>
        </form>
        
        <p
          style={{
            marginTop: isMobile ? "clamp(16px, 4vw, 20px)" : "clamp(16px, 2vw, 20px)",
            fontSize: isMobile ? "clamp(11px, 2.8vw, 12px)" : "clamp(12px, 1.4vw, 13px)",
            color: colors.textMuted,
            textAlign: "center",
            lineHeight: 1.5,
            padding: isMobile ? "0 clamp(4px, 1vw, 8px)" : "0",
          }}
        >
          You can adjust these values later in your timeline.
        </p>
      </div>
    </div>
  );
}

/** Welcome Modal Slider Row */
function WelcomeSliderRow({ value, setValue, min, max, theme, colors, MAX_AGE, clamp, isHighlighted = false, isPulsing = false, isMobile = false }) {
  const numValue = Number(value) || min;
  const clampedValue = clamp(numValue, min, max);
  
  return (
    <div
      className={isPulsing ? "pulse-glow" : ""}
      style={{
        padding: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(12px, 1.5vw, 16px)",
        borderRadius: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(12px, 1.5vw, 16px)",
        background: theme === "dark"
          ? "rgba(15,23,42,0.6)"
          : "rgba(248,250,252,0.5)",
        border: `1px solid ${isPulsing || isHighlighted ? (theme === "dark" ? "rgba(108, 52, 248, 0.6)" : "rgba(108, 52, 248, 0.5)") : colors.border}`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(12px, 1.5vw, 16px)",
          alignItems: "center",
        }}
      >
        <input
          type="range"
          min={min}
          max={max}
          value={clampedValue}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: "100%",
            height: isMobile ? "clamp(8px, 2vw, 10px)" : "clamp(10px, 1.2vw, 12px)",
            cursor: "pointer",
            accentColor: theme === "dark" ? "#6C34F8" : "#6C34F8",
          }}
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => {
            const num = Number(e.target.value);
            if (!Number.isNaN(num) && num >= min && num <= max) {
              setValue(String(Math.round(num)));
            } else {
              setValue(String(clamp(num, min, max)));
            }
          }}
          style={{
            width: isMobile ? "clamp(70px, 18vw, 80px)" : "clamp(80px, 10vw, 90px)",
            padding: isMobile ? "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)" : "clamp(10px, 1.2vw, 12px) clamp(14px, 1.8vw, 16px)",
            borderRadius: isMobile ? "clamp(6px, 1.5vw, 8px)" : "clamp(8px, 1vw, 10px)",
            border: `2px solid ${isHighlighted ? (theme === "dark" ? "rgba(108, 52, 248, 0.6)" : "rgba(108, 52, 248, 0.5)") : colors.border}`,
            background: colors.inputBg,
            color: colors.text,
            fontSize: isMobile ? "clamp(16px, 4vw, 18px)" : "clamp(18px, 2.2vw, 20px)",
            fontWeight: isHighlighted ? 900 : 700,
            textAlign: "center",
            outline: "none",
            fontFamily: "inherit",
            boxShadow: isHighlighted
              ? theme === "dark"
                ? "0 0 20px rgba(108, 52, 248, 0.3), inset 0 1px 2px rgba(255,255,255,0.1)"
                : "0 0 15px rgba(108, 52, 248, 0.2), inset 0 1px 2px rgba(255,255,255,0.9)"
              : "none",
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  // Track window size for responsive design
  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  
  // Always show welcome modal on app load - don't check localStorage
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(false);
  
  const [currentAge, setCurrentAge] = useState(() => {
    const saved = localStorage.getItem('lifespan-current-age');
    return saved ? Number(saved) : 42;
  });
  const [freedomAge, setFreedomAge] = useState(() => {
    const saved = localStorage.getItem('lifespan-freedom-age');
    return saved ? Number(saved) : 65;
  });
  const [lifeExpectancy, setLifeExpectancy] = useState(() => {
    const saved = localStorage.getItem('lifespan-life-expectancy');
    return saved ? Number(saved) : 80;
  });
  const [alreadyRetired, setAlreadyRetired] = useState(() => {
    return localStorage.getItem('lifespan-already-retired') === 'true';
  });

  const [labelName, setLabelName] = useState("Michael");
  const [bigGoal, setBigGoal] = useState("Freedom to live life on your terms — every day, not someday.");
  const [theme, setTheme] = useState("dark"); // 'dark' or 'light'
  
  // Welcome modal state - ALWAYS show on load (never check localStorage)
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Force show welcome modal on every page load
  useEffect(() => {
    setShowWelcome(true);
  }, []);
  const [welcomeCurrentAge, setWelcomeCurrentAge] = useState(42);
  const [welcomeRetirement, setWelcomeRetirement] = useState(65);
  const [welcomeLifeExpectancy, setWelcomeLifeExpectancy] = useState(80);

  const data = useMemo(() => {
    const cur = clamp(currentAge, 0, MAX_AGE);
    const life = clamp(lifeExpectancy, cur + 1, MAX_AGE);
    const freedom = alreadyRetired ? cur : clamp(freedomAge, cur + 1, life - 1);

    const totalSpan = life;
    const yearsLived = cur;
    const yearsToFreedom = alreadyRetired ? 0 : Math.max(0, freedom - cur);
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
  }, [currentAge, freedomAge, lifeExpectancy, alreadyRetired]);

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
      bg: "radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 30%, #0f172a 60%, #020617 100%), radial-gradient(circle at 20% 30%, rgba(108, 52, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
      containerBg: "radial-gradient(ellipse at center, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.97) 50%, rgba(8,47,73,0.95) 100%)",
      text: "#e5e7eb",
      textSecondary: "#d1d5db",
      textMuted: "#9ca3af",
      border: "rgba(148,163,184,0.25)",
      cardBg: "rgba(15,23,42,0.9)",
    },
    light: {
      bg: "radial-gradient(ellipse at top, #e0f2fe 0%, #bae6fd 20%, #f0f9ff 40%, #f8fafc 70%, #ffffff 100%), radial-gradient(circle at 15% 25%, rgba(147, 197, 253, 0.2) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(191, 219, 254, 0.15) 0%, transparent 40%)",
      containerBg: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.99) 50%, rgba(241,245,249,0.97) 100%)",
      text: "#0f172a",
      textSecondary: "#1e293b",
      textMuted: "#475569",
      border: "rgba(71,85,105,0.2)",
      cardBg: "rgba(255,255,255,0.95)",
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

  // Handle welcome modal submission
  const handleWelcomeSubmit = (curAge, retAge, lifeExp, isRetired) => {
    setCurrentAge(curAge);
    setFreedomAge(isRetired ? curAge : retAge);
    setLifeExpectancy(lifeExp);
    setAlreadyRetired(isRetired);

    localStorage.setItem('lifespan-current-age', String(curAge));
    localStorage.setItem('lifespan-freedom-age', String(isRetired ? curAge : retAge));
    localStorage.setItem('lifespan-life-expectancy', String(lifeExp));
    localStorage.setItem('lifespan-already-retired', String(isRetired));
    // Note: We intentionally DON'T save 'lifespan-welcome-completed' so modal always shows on reload
    
    // Close modal for this session
    setHasCompletedWelcome(true);
    setShowWelcome(false);
  };
  
  // Reset button handler - resets values and shows welcome modal again
  const handleReset = () => {
    // Clear localStorage
    localStorage.removeItem('lifespan-current-age');
    localStorage.removeItem('lifespan-freedom-age');
    localStorage.removeItem('lifespan-life-expectancy');
    localStorage.removeItem('lifespan-already-retired');

    setCurrentAge(42);
    setFreedomAge(65);
    setLifeExpectancy(80);
    setAlreadyRetired(false);
    setWelcomeCurrentAge(42);
    setWelcomeRetirement(65);
    setWelcomeLifeExpectancy(80);
    
    // Show welcome modal again
    setHasCompletedWelcome(false);
    setShowWelcome(true);
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

  // Welcome Modal Component
  if (showWelcome) {
    return (
      <WelcomeModal
        currentAge={welcomeCurrentAge}
        setCurrentAge={setWelcomeCurrentAge}
        retirementAge={welcomeRetirement}
        setRetirementAge={setWelcomeRetirement}
        lifeExpectancy={welcomeLifeExpectancy}
        setLifeExpectancy={setWelcomeLifeExpectancy}
        alreadyRetired={alreadyRetired}
        onSubmit={handleWelcomeSubmit}
        theme={theme}
        MAX_AGE={MAX_AGE}
        clamp={clamp}
        isMobile={isMobile}
      />
    );
  }

  return (
    <div 
      style={{ 
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: isMobile 
          ? "clamp(8px, 2vw, 12px) clamp(8px, 2vw, 12px)"
          : "clamp(16px, 4vw, 24px) clamp(16px, 2vw, 24px)",
        background: colors.bg,
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
            padding: isMobile
              ? "clamp(12px, 3vw, 16px) clamp(12px, 3vw, 16px)"
              : "clamp(16px, 2vw, 24px) clamp(16px, 2vw, 24px)",
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
            marginBottom: isMobile ? "clamp(20px, 5vw, 28px)" : "clamp(24px, 3vw, 40px)",
            position: "relative",
            background: "transparent",
            zIndex: 1,
            paddingTop: isMobile ? "clamp(12px, 3vw, 16px)" : "clamp(8px, 1vw, 12px)",
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
          padding: isMobile ? "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)" : "clamp(6px, 0.8vw, 8px) clamp(10px, 1.2vw, 12px)",
          borderRadius: "clamp(6px, 0.8vw, 8px)",
          border: `1px solid ${colors.border}`,
          background: colors.cardBg,
          color: colors.text,
          fontSize: isMobile ? "clamp(10px, 2.5vw, 11px)" : "clamp(11px, 1.3vw, 12px)",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "clamp(3px, 1vw, 4px)" : "clamp(4px, 0.6vw, 6px)",
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
          padding: isMobile ? "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)" : "clamp(6px, 0.8vw, 8px) clamp(10px, 1.2vw, 12px)",
          borderRadius: "clamp(6px, 0.8vw, 8px)",
          border: `1px solid ${colors.border}`,
          background: colors.cardBg,
          color: colors.text,
          fontSize: isMobile ? "clamp(10px, 2.5vw, 11px)" : "clamp(11px, 1.3vw, 12px)",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "clamp(3px, 1vw, 4px)" : "clamp(4px, 0.6vw, 6px)",
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
      <a
        href="https://wealthblueprinteducation.vercel.app/contact"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        <button
          style={{
            padding: isMobile ? "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)" : "clamp(8px, 1vw, 10px) clamp(14px, 1.8vw, 18px)",
            borderRadius: "clamp(6px, 0.8vw, 8px)",
            border: "none",
            background: "linear-gradient(135deg, #3818A8, #6C34F8, #8B5CF6)",
            color: "#ffffff",
            fontSize: isMobile ? "clamp(11px, 2.8vw, 12px)" : "clamp(12px, 1.4vw, 13px)",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "clamp(4px, 1vw, 5px)" : "clamp(5px, 0.7vw, 6px)",
            transition: "all 0.3s ease",
            boxShadow: theme === "dark"
              ? "0 4px 16px rgba(108, 52, 248, 0.4), 0 0 30px rgba(108, 52, 248, 0.2)"
              : "0 2px 8px rgba(108, 52, 248, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = theme === "dark"
              ? "0 6px 24px rgba(108, 52, 248, 0.6), 0 0 40px rgba(108, 52, 248, 0.3)"
              : "0 4px 12px rgba(108, 52, 248, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = theme === "dark"
              ? "0 4px 16px rgba(108, 52, 248, 0.4), 0 0 30px rgba(108, 52, 248, 0.2)"
              : "0 2px 8px rgba(108, 52, 248, 0.3)";
          }}
        >
          📞 Book a Call
        </button>
      </a>
      <button
        onClick={handleReset}
        style={{
          padding: isMobile ? "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)" : "clamp(6px, 0.8vw, 8px) clamp(10px, 1.2vw, 12px)",
          borderRadius: "clamp(6px, 0.8vw, 8px)",
          border: `1px solid ${colors.border}`,
          background: colors.cardBg,
          color: colors.text,
          fontSize: isMobile ? "clamp(10px, 2.5vw, 11px)" : "clamp(11px, 1.3vw, 12px)",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "clamp(3px, 1vw, 4px)" : "clamp(4px, 0.6vw, 6px)",
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
              🔄 Reset Timeline
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
                margin: isMobile ? "clamp(48px, 12vw, 60px) 0 clamp(10px, 1.5vw, 18px) 0" : "clamp(32px, 4vw, 48px) 0 clamp(10px, 1.5vw, 18px) 0",
                fontSize: "clamp(28px, 6vw, 56px)",
                fontWeight: 900,
                lineHeight: 1.1,
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
              Life Is Short — What Will You Do With Yours?
            </h1>
            <div
              style={{
                marginTop: 0,
                padding: "clamp(6px, 0.8vw, 10px) clamp(14px, 1.8vw, 24px)",
                background: "transparent",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0 0 clamp(8px, 1.2vw, 14px) 0",
                  fontSize: "clamp(18px, 4vw, 28px)",
                  color: theme === "dark" ? "#ffffff" : "#1a1a1a",
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                }}
              >
                If you have{" "}
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
                }}>left</span>
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(20px, 4.5vw, 32px)",
                  fontWeight: 900,
                  color: theme === "dark" ? "#ffffff" : "#1a1a1a",
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                }}
              >
                What will you do with it?
              </p>
            </div>
          </div>
        </header>

        {/* Layout grid */}
        <div
          className="lifespan-grid"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile || isTablet ? "1fr" : "minmax(0, 1.6fr) minmax(0, 1.1fr)",
            gap: "clamp(16px, 2vw, 20px)",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            alignItems: "start",
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
                padding: "clamp(20px, 2.5vw, 28px)",
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
                overflow: "visible",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  marginBottom: isMobile 
                    ? "clamp(12px, 3vw, 16px)"
                    : "clamp(16px, 2vw, 24px)",
                  marginTop: isMobile
                    ? "clamp(8px, 2vw, 12px)"
                    : "clamp(12px, 1.5vw, 20px)",
                }}
              >
                <div style={{ 
                  fontSize: isMobile
                    ? "clamp(12px, 3vw, 14px)"
                    : "clamp(14px, 1.8vw, 16px)", 
                  color: theme === "dark" ? colors.textMuted : "#2B2B2B", 
                  marginBottom: isMobile
                    ? "clamp(6px, 1.5vw, 8px)"
                    : "clamp(8px, 1vw, 12px)",
                  fontWeight: 600,
                }}>
                  Age {cur} of {life}
                </div>
                <div style={{ 
                  fontSize: isMobile
                    ? "clamp(18px, 4.5vw, 24px)"
                    : "clamp(24px, 3vw, 32px)", 
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
                  gap: isMobile
                    ? "clamp(12px, 3vw, 16px)"
                    : "clamp(20px, 2.5vw, 28px)",
                }}
              >
                {/* The bar */}
                <div
                  className="chart-container"
                  style={{
                    position: "relative",
                    height: isMobile
                      ? "clamp(70px, 10vh, 90px)"
                      : isTablet
                      ? "clamp(85px, 11vh, 120px)"
                      : "clamp(100px, 12vh, 160px)",
                    width: "100%",
                    maxWidth: "100%",
                    borderRadius: 999,
                    overflow: "visible",
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
                      minHeight: 0,
                      borderTopLeftRadius: 9999,
                      borderBottomLeftRadius: 9999,
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
                        minHeight: 0,
                        borderTopRightRadius: afterFreedomPct > 0 ? 0 : 9999,
                        borderBottomRightRadius: afterFreedomPct > 0 ? 0 : 9999,
                        background:
                          "linear-gradient(90deg, #3818A8, #4B1DB0, #6C34F8, #8B5CF6)",
                        boxShadow: `
                          inset 0 0 40px rgba(56, 24, 168, 0.7),
                          inset 0 2px 8px rgba(255, 255, 255, 0.2),
                          0 0 30px rgba(108, 52, 248, 0.5),
                          0 0 60px rgba(108, 52, 248, 0.3)
                        `,
                        animation: "lifeForcePurple 2.5s ease-in-out infinite",
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
                        minHeight: 0,
                        borderTopRightRadius: 9999,
                        borderBottomRightRadius: 9999,
                        background:
                          "linear-gradient(90deg, #FAD961, #F9B84A, #F76B1C, #EA580C)",
                        boxShadow: `
                          inset 0 0 50px rgba(250, 217, 97, 0.8),
                          inset 0 2px 8px rgba(255, 255, 255, 0.3),
                          0 0 35px rgba(247, 107, 28, 0.6),
                          0 0 70px rgba(247, 107, 28, 0.4)
                        `,
                        animation: "lifeForceGolden 2.5s ease-in-out infinite 0.3s",
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
                </div>

                {/* Age scale tight to the bar */}
                <div
                  className="age-scale"
                  style={{
                    position: "relative",
                    height: isMobile
                      ? "clamp(36px, 5vh, 44px)"
                      : isTablet
                      ? "clamp(42px, 5.5vh, 52px)"
                      : "clamp(48px, 6vh, 64px)",
                    marginTop: isMobile
                      ? "clamp(6px, 1.5vw, 8px)"
                      : "clamp(8px, 1vw, 12px)",
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
                            width: isMajor ? 3 : 2,
                            height: isMajor ? "clamp(16px, 2vh, 20px)" : "clamp(10px, 1.3vh, 12px)",
                            background: theme === "dark"
                              ? "rgba(255, 255, 255, 0.7)"
                              : "#8A8A8A",
                            margin: "0 auto clamp(6px, 0.8vh, 10px)",
                            borderRadius: 999,
                          }}
                        />
                        <div
                          style={{
                            fontSize: isMobile
                              ? "clamp(16px, 4vw, 20px)"
                              : isTablet
                              ? "clamp(18px, 2.2vw, 24px)"
                              : "clamp(20px, 2.5vw, 28px)",
                            fontWeight: 900,
                            color: theme === "dark" ? "#ffffff" : "#1A1A1A",
                            whiteSpace: "nowrap",
                            lineHeight: 1.2,
                            textShadow: theme === "dark"
                              ? "0 0 12px rgba(255, 255, 255, 0.6), 0 0 24px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.5)"
                              : "0 2px 8px rgba(0, 0, 0, 0.2)",
                            filter: theme === "dark" ? "brightness(1.2)" : "none",
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
                    height: isMobile
                      ? "clamp(60px, 8vh, 75px)"
                      : isTablet
                      ? "clamp(70px, 8.5vh, 90px)"
                      : "clamp(80px, 9vh, 110px)",
                    marginTop: isMobile
                      ? "clamp(6px, 1.5vw, 8px)"
                      : "clamp(8px, 1vw, 12px)",
                    marginBottom: isMobile
                      ? "clamp(8px, 2vw, 12px)"
                      : "clamp(12px, 1.5vw, 18px)",
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
                        fontSize: isMobile
                          ? "clamp(18px, 4.5vw, 22px)"
                          : "clamp(24px, 3vw, 32px)",
                        fontWeight: 900,
                        color: theme === "dark" ? "#9ca3af" : "#2B2B2B",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: isMobile
                          ? "clamp(6px, 1.5vw, 8px)"
                          : "clamp(8px, 1vw, 12px)",
                        lineHeight: 1.2,
                      }}
                    >
                      {isMobile ? "CHILD" : "Childhood"}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile
                          ? "clamp(14px, 3.5vw, 16px)"
                          : "clamp(18px, 2.3vw, 22px)",
                        color: theme === "dark" ? "#6b7280" : "#1A1A1A",
                        fontWeight: 700,
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
                        fontSize: isMobile
                          ? "clamp(18px, 4.5vw, 22px)"
                          : "clamp(24px, 3vw, 32px)",
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #3818A8, #6C34F8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: window.innerWidth <= 768
                          ? "clamp(6px, 1.5vw, 8px)"
                          : "clamp(8px, 1vw, 12px)",
                        lineHeight: 1.2,
                      }}
                    >
                      WORK
                    </div>
                    <div
                      style={{
                        fontSize: isMobile
                          ? "clamp(14px, 3.5vw, 16px)"
                          : "clamp(18px, 2.3vw, 22px)",
                        color: theme === "dark" ? "#6b7280" : "#1A1A1A",
                        fontWeight: 700,
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
                        fontSize: isMobile
                          ? "clamp(18px, 4.5vw, 22px)"
                          : "clamp(24px, 3vw, 32px)",
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #FAD961, #F76B1C)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: window.innerWidth <= 768
                          ? "clamp(6px, 1.5vw, 8px)"
                          : "clamp(8px, 1vw, 12px)",
                        lineHeight: 1.2,
                      }}
                    >
                      {isMobile ? "RETIREMENT" : "Golden Years?"}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile
                          ? "clamp(14px, 3.5vw, 16px)"
                          : "clamp(18px, 2.3vw, 22px)",
                        color: theme === "dark" ? "#6b7280" : "#1A1A1A",
                        fontWeight: 700,
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
                  gap: "clamp(12px, 1.5vw, 16px)",
                  marginTop: "clamp(8px, 1vw, 12px)",
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
                  Golden Years?: {formatYears(yearsAfterFreedom)}
                </LegendPill>
              </div>
            </section>

            {/* Controls */}
            <section
              style={{
                padding: isMobile
                  ? "clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 14px)"
                  : "clamp(12px, 1.5vw, 16px)",
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
                  margin: isMobile
                    ? "0 0 clamp(4px, 1.2vw, 6px)"
                    : "0 0 clamp(8px, 1vw, 10px)",
                  fontSize: "clamp(18px, 2.2vw, 22px)",
                  fontWeight: 800,
                  color: colors.text,
                  letterSpacing: "-0.01em",
                }}
              >
                Your Timeline
              </h2>
              <p style={{ 
                margin: isMobile
                  ? "0 0 clamp(4px, 1.2vw, 6px)"
                  : "0 0 clamp(8px, 1vw, 10px)", 
                fontSize: "clamp(13px, 1.6vw, 15px)", 
                color: colors.textMuted, 
                lineHeight: isMobile ? 1.4 : 1.5, 
                fontWeight: 500,
              }}>
                Adjust these numbers to see how your choices change the rest of your life.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? "clamp(4px, 1.5vw, 8px)" : 0,
                }}
              >
              <SliderRow
                label="Current age"
                value={cur}
                min={0}
                max={alreadyRetired ? Math.max(life - 1, 0) : Math.max(freedom - 1, 0)}
                onChange={(v) => {
                  const newAge = Math.max(0, Number(v));
                  setCurrentAge(newAge);
                  localStorage.setItem('lifespan-current-age', String(newAge));
                  if (alreadyRetired) {
                    setFreedomAge(newAge);
                    localStorage.setItem('lifespan-freedom-age', String(newAge));
                  } else if (freedom <= newAge) {
                    const newFreedom = newAge + 1;
                    setFreedomAge(newFreedom);
                    localStorage.setItem('lifespan-freedom-age', String(newFreedom));
                  }
                  if (life <= newAge) {
                    const newLife = Math.min(newAge + 2, MAX_AGE);
                    setLifeExpectancy(newLife);
                    localStorage.setItem('lifespan-life-expectancy', String(newLife));
                    if (!alreadyRetired && freedom <= newAge) {
                      const newFreedom = newAge + 1;
                      setFreedomAge(newFreedom);
                      localStorage.setItem('lifespan-freedom-age', String(newFreedom));
                    }
                  }
                }}
                theme={theme}
                allowAnyNumber={true}
                minConstraint={0}
                maxConstraint={alreadyRetired ? life - 1 : freedom - 1}
                isMobile={isMobile}
              />
              <AlreadyRetiredToggle
                checked={alreadyRetired}
                onChange={(checked) => {
                  setAlreadyRetired(checked);
                  localStorage.setItem('lifespan-already-retired', String(checked));
                  if (checked) {
                    setFreedomAge(cur);
                    localStorage.setItem('lifespan-freedom-age', String(cur));
                  } else if (freedom <= cur) {
                    const newFreedom = Math.min(cur + 1, life - 1);
                    setFreedomAge(newFreedom);
                    localStorage.setItem('lifespan-freedom-age', String(newFreedom));
                  }
                }}
                theme={theme}
                colors={colors}
                isMobile={isMobile}
              />
              {!alreadyRetired && (
              <SliderRow
                label="Target retirement"
                value={freedom}
                min={cur + 1}
                max={Math.max(life - 1, cur + 1)}
                onChange={(v) => {
                  const newFreedom = Number(v);
                  if (!Number.isNaN(newFreedom) && newFreedom >= 0) {
                    setFreedomAge(newFreedom);
                    localStorage.setItem('lifespan-freedom-age', String(newFreedom));
                    if (life <= newFreedom) {
                      const newLife = Math.min(newFreedom + 1, MAX_AGE);
                      setLifeExpectancy(newLife);
                      localStorage.setItem('lifespan-life-expectancy', String(newLife));
                    }
                  }
                }}
                theme={theme}
                isHighlighted={true}
                allowAnyNumber={true}
                minConstraint={cur + 1}
                maxConstraint={life - 1}
                isMobile={isMobile}
              />
              )}
              <SliderRow
                label="Quality life expectancy"
                value={life}
                min={alreadyRetired ? cur + 1 : freedom + 1}
                max={MAX_AGE}
                onChange={(v) => {
                  const newLife = Number(v);
                  const minLife = alreadyRetired ? cur + 1 : freedom + 1;
                  if (newLife > minLife - 1 && newLife <= MAX_AGE) {
                    setLifeExpectancy(newLife);
                    localStorage.setItem('lifespan-life-expectancy', String(newLife));
                  }
                }}
                theme={theme}
                allowAnyNumber={true}
                minConstraint={alreadyRetired ? cur + 1 : freedom + 1}
                maxConstraint={MAX_AGE}
                isMobile={isMobile}
              />
              </div>
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
            height: isMobile || isTablet ? "auto" : "100%",
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
                flexShrink: 0,
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
                  label="Golden Years?"
                  main={formatYears(yearsAfterFreedom)}
                  sub={`${percent(afterFreedomPct)} of your life`}
                  theme={theme}
                />
              </div>
            </section>

            {/* True Wealth Philosophy - Emotional Impact Section */}
            <section
              style={{
                padding: "clamp(14px, 1.8vw, 20px)",
                borderRadius: "clamp(14px, 1.8vw, 18px)",
                border: `1px solid ${colors.border}`,
                background: theme === "dark"
                  ? "linear-gradient(135deg, rgba(56, 24, 168, 0.15), rgba(108, 52, 248, 0.1), rgba(15,23,42,0.98))"
                  : "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(108, 52, 248, 0.05), rgba(255,255,255,0.98))",
                fontSize: "clamp(15px, 1.9vw, 17px)",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                flex: isMobile || isTablet ? "0 1 auto" : "1 1 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{
                textAlign: "center",
                marginBottom: "clamp(12px, 1.5vw, 16px)",
              }}>
                <div style={{
                  fontSize: "clamp(11px, 1.3vw, 13px)",
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  color: theme === "dark" ? "#a78bfa" : "#6C34F8",
                  fontWeight: 700,
                  marginBottom: "clamp(6px, 0.8vw, 8px)",
                }}>
                  The Real Blueprint
                </div>
                <h2
                  style={{
                    margin: "0 0 clamp(12px, 1.5vw, 16px)",
                    fontSize: "clamp(20px, 2.5vw, 24px)",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #FBBF24, #F76B1C, #EA580C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  True Wealth
                </h2>
              </div>
              
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(12px, 1.5vw, 16px)",
              }}>
                <div style={{
                  padding: "clamp(14px, 1.8vw, 18px)",
                  borderRadius: "clamp(10px, 1.2vw, 12px)",
                  background: theme === "dark" 
                    ? "rgba(15,23,42,0.6)"
                    : "rgba(248,250,252,0.8)",
                  border: `1px solid ${theme === "dark" ? "rgba(108, 52, 248, 0.3)" : "rgba(108, 52, 248, 0.2)"}`,
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: "clamp(16px, 2.2vw, 20px)",
                    fontWeight: 700,
                    color: colors.text,
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}>
                    True wealth = <span style={{
                      color: theme === "dark" ? "#a78bfa" : "#6C34F8",
                      fontWeight: 900,
                    }}>years</span> you can still do what you love +<br/>
                    the <span style={{
                      color: theme === "dark" ? "#06b6d4" : "#0891b2",
                      fontWeight: 900,
                    }}>health</span> to enjoy it +<br/>
                    the <span style={{
                      color: theme === "dark" ? "#fbbf24" : "#f59e0b",
                      fontWeight: 900,
                    }}>money</span> to afford it.
                  </p>
                </div>

                <div style={{
                  padding: "clamp(14px, 1.8vw, 18px)",
                  borderRadius: "clamp(10px, 1.2vw, 12px)",
                  background: theme === "dark" 
                    ? "rgba(15,23,42,0.6)"
                    : "rgba(248,250,252,0.8)",
                  border: `1px solid ${theme === "dark" ? "rgba(108, 52, 248, 0.3)" : "rgba(108, 52, 248, 0.2)"}`,
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: "clamp(15px, 2vw, 18px)",
                    fontWeight: 600,
                    color: colors.textSecondary,
                    lineHeight: 1.7,
                    textAlign: "center",
                  }}>
                    Your <strong style={{
                      color: theme === "dark" ? "#a78bfa" : "#6C34F8",
                      fontWeight: 800,
                    }}>financial plan</strong> buys freedom.<br/>
                    Your <strong style={{
                      color: theme === "dark" ? "#06b6d4" : "#0891b2",
                      fontWeight: 800,
                    }}>physical plan</strong> protects your ability to experience it.
                  </p>
                </div>

                <div style={{
                  padding: "clamp(16px, 2vw, 20px)",
                  borderRadius: "clamp(10px, 1.2vw, 12px)",
                  background: theme === "dark"
                    ? "linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(247, 107, 28, 0.08))"
                    : "linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(247, 107, 28, 0.06))",
                  border: `1px solid ${theme === "dark" ? "rgba(251, 191, 36, 0.3)" : "rgba(247, 107, 28, 0.25)"}`,
                  textAlign: "center",
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: "clamp(18px, 2.5vw, 24px)",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #FBBF24, #F76B1C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.4,
                    fontStyle: "italic",
                  }}>
                    "In the end, the question isn't<br/>
                    <span style={{ fontSize: "clamp(20px, 2.8vw, 26px)" }}>'How long will I live?'</span><br/>
                    It's <span style={{ fontSize: "clamp(20px, 2.8vw, 26px)", fontWeight: 900 }}>'How long will I live well?'</span>"
                  </p>
                  <div style={{
                    marginTop: "clamp(12px, 1.5vw, 16px)",
                    fontSize: "clamp(15px, 2vw, 18px)",
                    fontWeight: 700,
                    color: colors.text,
                    letterSpacing: "0.05em",
                  }}>
                    That's the real blueprint.
                  </div>
                </div>
                
                {/* Call-to-Action buttons */}
                <div style={{
                  marginTop: "clamp(16px, 2vw, 20px)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "clamp(12px, 1.5vw, 16px)",
                }}>
                  {/* Primary CTA: Wealth-Education Blueprint */}
                  <a
                    href="https://wealthblueprinteducation.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    <button
                      style={{
                        padding: isMobile ? "clamp(10px, 2.5vw, 14px) clamp(20px, 5vw, 28px)" : "clamp(12px, 1.5vw, 14px) clamp(24px, 3vw, 32px)",
                        borderRadius: "clamp(10px, 1.2vw, 12px)",
                        border: "none",
                        background: theme === "dark"
                          ? "linear-gradient(135deg, #4B1DB0, #6C34F8, #8B5CF6)"
                          : "linear-gradient(135deg, #5B21B6, #7C3AED, #A78BFA)",
                        color: "#ffffff",
                        fontSize: isMobile ? "clamp(14px, 3.5vw, 17px)" : "clamp(15px, 1.8vw, 17px)",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: isMobile ? "clamp(6px, 1.5vw, 8px)" : "clamp(8px, 1vw, 10px)",
                        transition: "all 0.25s ease",
                        boxShadow: theme === "dark"
                          ? "0 4px 20px rgba(108, 52, 248, 0.4), 0 2px 8px rgba(0,0,0,0.3)"
                          : "0 4px 16px rgba(124, 58, 237, 0.35), 0 2px 6px rgba(0,0,0,0.1)",
                        margin: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = theme === "dark"
                          ? "0 8px 28px rgba(108, 52, 248, 0.5), 0 4px 12px rgba(0,0,0,0.35)"
                          : "0 8px 24px rgba(124, 58, 237, 0.45), 0 4px 10px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = theme === "dark"
                          ? "0 4px 20px rgba(108, 52, 248, 0.4), 0 2px 8px rgba(0,0,0,0.3)"
                          : "0 4px 16px rgba(124, 58, 237, 0.35), 0 2px 6px rgba(0,0,0,0.1)";
                      }}
                    >
                      ✨ Start Your Wealth-Education Blueprint →
                    </button>
                  </a>
                  {/* Secondary: Goals Blueprint */}
                  <a
                    href="https://goalsblueprint.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    <button
                      style={{
                        padding: isMobile ? "clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)" : "clamp(10px, 1.2vw, 12px) clamp(18px, 2.2vw, 24px)",
                        borderRadius: "clamp(8px, 1vw, 10px)",
                        border: `1px solid ${theme === "dark" ? "rgba(251, 191, 36, 0.3)" : "rgba(247, 107, 28, 0.25)"}`,
                        background: theme === "dark"
                          ? "rgba(251, 191, 36, 0.08)"
                          : "rgba(251, 191, 36, 0.05)",
                        color: theme === "dark" ? "#FBBF24" : "#EA580C",
                        fontSize: isMobile ? "clamp(13px, 3vw, 15px)" : "clamp(14px, 1.7vw, 16px)",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: isMobile ? "clamp(4px, 1vw, 6px)" : "clamp(6px, 0.8vw, 8px)",
                        transition: "all 0.3s ease",
                        boxShadow: "none",
                        margin: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme === "dark"
                          ? "rgba(251, 191, 36, 0.15)"
                          : "rgba(251, 191, 36, 0.1)";
                        e.currentTarget.style.borderColor = theme === "dark"
                          ? "rgba(251, 191, 36, 0.5)"
                          : "rgba(247, 107, 28, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = theme === "dark"
                          ? "rgba(251, 191, 36, 0.08)"
                          : "rgba(251, 191, 36, 0.05)";
                        e.currentTarget.style.borderColor = theme === "dark"
                          ? "rgba(251, 191, 36, 0.3)"
                          : "rgba(247, 107, 28, 0.25)";
                      }}
                    >
                      🎯 Set Some Goals → Go to Goals Blueprint
                    </button>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Questions to Consider - Full Width at Bottom */}
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
            marginTop: "clamp(16px, 2vw, 20px)",
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
                    fontSize: "clamp(18px, 2.4vw, 24px)", 
                    textTransform: "uppercase", 
                    letterSpacing: 1.5, 
                    background: "linear-gradient(135deg, #06b6d4, #3b82f6, #2563eb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
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
                      color: "#06b6d4", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" 
                        ? "0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)" 
                        : "0 2px 8px rgba(6, 182, 212, 0.3)",
                    }}>{formatYears(yearsToFreedom)}</strong> years left to retirement and create the life you truly want… what would you begin today?
                  </p>
                </div>

                {/* Your Path to Retirement */}
                <div>
                  <div style={{ 
                    fontSize: "clamp(18px, 2.4vw, 24px)", 
                    textTransform: "uppercase", 
                    letterSpacing: 1.5, 
                    background: "linear-gradient(135deg, #6C34F8, #8B5CF6, #A78BFA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 800,
                    marginBottom: "clamp(10px, 1.2vw, 12px)",
                    filter: theme === "dark" ? "drop-shadow(0 0 8px rgba(108, 52, 248, 0.5))" : "none",
                  }}>
                    Your Path to Retirement
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    lineHeight: 1.8, 
                    fontSize: "clamp(18px, 2.3vw, 22px)", 
                    fontWeight: 500 
                  }}>
                    Between now and age <strong style={{ 
                      color: "#8B5CF6", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" 
                        ? "0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(108, 52, 248, 0.5)" 
                        : "0 2px 8px rgba(139, 92, 246, 0.4)",
                    }}>{freedom}</strong>, what must happen so you live life on your terms — financially free, secure, and unburdened?
                  </p>
                </div>

                {/* Your Golden Years */}
                <div>
                  <div style={{ 
                    fontSize: "clamp(18px, 2.4vw, 24px)", 
                    textTransform: "uppercase", 
                    letterSpacing: 1.5, 
                    background: "linear-gradient(135deg, #FBBF24, #F76B1C, #EA580C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 800,
                    marginBottom: "clamp(10px, 1.2vw, 12px)",
                    filter: theme === "dark" ? "drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))" : "none",
                  }}>
                    Your Golden Years?
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: colors.textSecondary, 
                    lineHeight: 1.8, 
                    fontSize: "clamp(18px, 2.3vw, 22px)", 
                    fontWeight: 500 
                  }}>
                    From age <strong style={{ 
                      color: "#F76B1C", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" 
                        ? "0 0 20px rgba(247, 107, 28, 0.8), 0 0 40px rgba(247, 107, 28, 0.5)" 
                        : "0 2px 8px rgba(247, 107, 28, 0.4)",
                    }}>{freedom}</strong> to <strong style={{ 
                      color: "#F76B1C", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" 
                        ? "0 0 20px rgba(247, 107, 28, 0.8), 0 0 40px rgba(247, 107, 28, 0.5)" 
                        : "0 2px 8px rgba(247, 107, 28, 0.4)",
                    }}>{life}</strong>, you have <strong style={{ 
                      color: "#FBBF24", 
                      fontWeight: 900, 
                      fontSize: "clamp(22px, 2.8vw, 28px)",
                      textShadow: theme === "dark" 
                        ? "0 0 20px rgba(251, 191, 36, 0.9), 0 0 40px rgba(251, 191, 36, 0.6)" 
                        : "0 2px 8px rgba(251, 191, 36, 0.4)",
                    }}>{yearsAfterFreedom}</strong> precious years left. How will you use them?
                  </p>
                </div>
              </div>
            </section>

        <FiveRegretsReflection theme={theme} colors={colors} />
        </div>
      </div>
    </div>
  );
}

const FIVE_REGRETS = [
  {
    regret:
      "I wish I had the courage to live a life true to myself, not the life others expected of me.",
    reflection: "Where in your life are you still performing, pleasing, or pretending?",
    action:
      "What is one decision you already know is true for you, but you keep delaying because of fear, guilt, or other people’s opinions?",
  },
  {
    regret: "I wish I had not worked so hard.",
    reflection:
      "What are you currently trading your health, peace, family, friendships, or freedom for?",
    action: "If you kept living at your current pace for the next 10 years, what would it cost you?",
  },
  {
    regret: "I wish I had the courage to express my feelings.",
    reflection: "What truth have you been carrying but not saying?",
    action:
      "Who needs to hear something from you while there is still time — love, thanks, apology, forgiveness, or honesty?",
  },
  {
    regret: "I wish I had stayed in touch with my friends.",
    reflection: "Who mattered to you once, but slowly disappeared from your life?",
    action:
      "Who could you message today with no agenda, just because life is short and connection matters?",
  },
  {
    regret: "I wish I had let myself be happier.",
    reflection:
      "Where are you postponing joy until some future version of life finally arrives?",
    action:
      "What simple thing could you allow yourself to enjoy now — not after the mortgage is paid, not after the body is perfect, not after everything is sorted?",
  },
];

function FiveRegretsReflection({ theme, colors }) {
  const isDark = theme === "dark";
  const blockGap = "clamp(12px, 1.5vw, 16px)";
  const regretDivider = isDark ? "1px solid rgba(148, 163, 184, 0.2)" : "1px solid rgba(71, 85, 105, 0.12)";
  const regretHeadingColor = isDark ? "#FBBF24" : "#C2410C";
  const regretHeadingAccent = isDark ? "#F76B1C" : "#EA580C";

  return (
    <section
      className="fade-in"
      style={{
        marginTop: "clamp(16px, 2vw, 20px)",
        padding: "clamp(14px, 1.8vw, 20px)",
        borderRadius: "clamp(14px, 1.8vw, 18px)",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        border: `1px solid ${colors.border}`,
        background: isDark
          ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,58,138,0.3))"
          : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(241,245,249,0.5))",
        fontSize: "clamp(15px, 1.9vw, 17px)",
      }}
    >
      <div
        style={{
          fontSize: "clamp(12px, 3.1vw, 16px)",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontWeight: 800,
          color: regretHeadingColor,
          marginBottom: "clamp(10px, 1.2vw, 12px)",
          whiteSpace: "nowrap",
        }}
      >
        Pause & reflect
      </div>
      <h2
        style={{
          margin: "0 0 clamp(14px, 1.8vw, 18px)",
          paddingBottom: "clamp(10px, 1.2vw, 12px)",
          borderBottom: `2px solid ${regretHeadingAccent}`,
          fontSize: "clamp(22px, 3vw, 28px)",
          fontWeight: 900,
          color: regretHeadingColor,
          letterSpacing: "-0.025em",
          lineHeight: 1.2,
        }}
      >
        The Five Regrets Reflection
      </h2>
      <p
        style={{
          margin: "0 0 clamp(14px, 1.8vw, 18px)",
          width: "100%",
          maxWidth: "100%",
          fontSize: "clamp(18px, 2.3vw, 22px)",
          lineHeight: 1.8,
          color: colors.textSecondary,
          fontWeight: 500,
        }}
      >
        Inspired by the work of Australian author and former palliative carer{" "}
        <strong style={{ color: colors.text, fontWeight: 800 }}>
          Bronnie Ware
        </strong>
        , who captured the most common regrets she heard from people nearing the end of life.
      </p>

      <p
        style={{
          margin: "0 0 clamp(6px, 0.8vw, 8px)",
          fontSize: "clamp(18px, 2.3vw, 22px)",
          color: colors.textSecondary,
          fontWeight: 500,
        }}
      >
        This reflection asks one simple question:
      </p>
      <p
        style={{
          margin: "0 0 clamp(18px, 2.2vw, 24px)",
          fontSize: "clamp(18px, 2.3vw, 22px)",
          fontWeight: 700,
          lineHeight: 1.55,
          color: colors.text,
        }}
      >
        What can you do <em style={{ fontStyle: "italic", fontWeight: 800, color: colors.text }}>now</em>{" "}
        so these do not become your regrets?
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          marginTop: "clamp(4px, 0.6vw, 8px)",
        }}
      >
        {FIVE_REGRETS.map((item, i) => (
          <article
            key={i}
            style={{
              paddingTop: i === 0 ? 0 : "clamp(16px, 2vw, 22px)",
              marginTop: i === 0 ? 0 : "clamp(16px, 2vw, 22px)",
              borderTop: i === 0 ? "none" : regretDivider,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(10px, 1.2vw, 12px)",
                marginBottom: "clamp(12px, 1.5vw, 14px)",
                paddingLeft: "clamp(10px, 1.2vw, 12px)",
                borderLeft: `3px solid ${regretHeadingAccent}`,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(17px, 2.2vw, 21px)",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: regretHeadingColor,
                  lineHeight: 1.2,
                }}
              >
                Regret {i + 1}
              </span>
            </div>
            <p
              style={{
                margin: "0 0 clamp(14px, 1.8vw, 18px)",
                fontSize: "clamp(18px, 2.3vw, 22px)",
                fontWeight: 600,
                fontStyle: "italic",
                lineHeight: 1.65,
                color: colors.text,
              }}
            >
              {item.regret}
            </p>
            <div style={{ marginBottom: blockGap }}>
              <div
                style={{
                  fontSize: "clamp(15px, 1.85vw, 18px)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 800,
                  color: isDark ? "#7dd3fc" : "#0369a1",
                  marginBottom: "clamp(10px, 1.2vw, 12px)",
                }}
              >
                Reflection
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(18px, 2.3vw, 22px)",
                  lineHeight: 1.8,
                  color: colors.textSecondary,
                  fontWeight: 500,
                }}
              >
                {item.reflection}
              </p>
            </div>
            <div>
              <div
                style={{
                  fontSize: "clamp(15px, 1.85vw, 18px)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 800,
                  color: isDark ? "#ddd6fe" : "#5b21b6",
                  marginBottom: "clamp(10px, 1.2vw, 12px)",
                }}
              >
                Action
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(18px, 2.3vw, 22px)",
                  lineHeight: 1.8,
                  color: colors.text,
                  fontWeight: 500,
                }}
              >
                {item.action}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div
        style={{
          marginTop: "clamp(20px, 2.5vw, 28px)",
          paddingTop: "clamp(18px, 2.2vw, 24px)",
          borderTop: regretDivider,
        }}
      >
        <div
          style={{
            fontSize: "clamp(17px, 2.2vw, 21px)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 900,
            color: regretHeadingColor,
            marginBottom: "clamp(12px, 1.5vw, 14px)",
            paddingLeft: "clamp(10px, 1.2vw, 12px)",
            borderLeft: `3px solid ${regretHeadingAccent}`,
            lineHeight: 1.2,
          }}
        >
          Closing reflection
        </div>
        <p
          style={{
            margin: "0 0 clamp(14px, 1.8vw, 18px)",
            width: "100%",
            maxWidth: "100%",
            fontSize: "clamp(18px, 2.3vw, 22px)",
            lineHeight: 1.8,
            color: colors.text,
            fontWeight: 600,
          }}
        >
          That figure on your timeline is not who you are — it is only the time you may still have.
        </p>
        <p
          style={{
            margin: "0 0 clamp(14px, 1.8vw, 18px)",
            width: "100%",
            maxWidth: "100%",
            fontSize: "clamp(18px, 2.3vw, 22px)",
            lineHeight: 1.8,
            color: colors.textSecondary,
            fontWeight: 500,
          }}
        >
          It is a narrowing window for truth you have not spoken, love you have not shown, risks you keep postponing, repairs you keep avoiding, and joy you keep trading for “someday.”
        </p>
        <p
          style={{
            margin: "0 0 clamp(6px, 0.8vw, 8px)",
            fontSize: "clamp(18px, 2.3vw, 22px)",
            color: colors.textSecondary,
            fontWeight: 500,
          }}
        >
          The question is not only:
        </p>
        <p
          style={{
            margin: "0 0 clamp(12px, 1.5vw, 16px)",
            fontSize: "clamp(18px, 2.3vw, 22px)",
            fontWeight: 800,
            color: colors.text,
          }}
        >
          How long might I live?
        </p>
        <p
          style={{
            margin: "0 0 clamp(6px, 0.8vw, 8px)",
            fontSize: "clamp(18px, 2.3vw, 22px)",
            color: colors.textSecondary,
            fontWeight: 700,
          }}
        >
          The better question is:
        </p>
        <p
          style={{
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            fontSize: "clamp(18px, 2.3vw, 22px)",
            fontWeight: 700,
            lineHeight: 1.55,
            letterSpacing: "-0.02em",
            color: colors.text,
          }}
        >
          What would I regret not living, not saying, or not trying while I still can?
        </p>
      </div>
    </section>
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
        top: "-12px",
        bottom: 0,
        pointerEvents: "none",
        transform: "translateX(-50%)",
        zIndex: 100,
      }}
    >
      {/* Downward pointing arrow on top - larger and more visible */}
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "12px solid #ffffff",
          filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))",
          zIndex: 101,
        }}
      />
      
      {/* Clear white vertical line - thicker and more prominent */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          bottom: 0,
          left: "50%",
          width: 4,
          transform: "translateX(-50%)",
          background: "#ffffff",
          boxShadow: theme === "dark"
            ? `
              0 0 10px rgba(255, 255, 255, 1),
              0 0 20px rgba(255, 255, 255, 0.8),
              0 0 30px rgba(255, 255, 255, 0.6)
            `
            : `
              0 0 6px rgba(255, 255, 255, 1),
              0 0 12px rgba(0, 0, 0, 0.3),
              0 2px 4px rgba(0, 0, 0, 0.2)
            `,
          zIndex: 100,
        }}
      />
      
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: theme === "dark"
            ? "rgba(15,23,42,0.98)"
            : "rgba(255,255,255,0.98)",
          borderRadius: 999,
          padding: "clamp(6px, 0.8vw, 8px) clamp(14px, 1.8vw, 18px)",
          fontSize: "clamp(18px, 2.3vw, 24px)",
          fontWeight: 900,
          color: theme === "dark" ? "#ffffff" : "#1f2933",
          whiteSpace: "nowrap",
          boxShadow: theme === "dark"
            ? "0 0 20px rgba(15,23,42,0.95), 0 0 40px rgba(96, 165, 250, 0.3)"
            : "0 0 12px rgba(15,23,42,0.3), 0 0 24px rgba(108, 52, 248, 0.2)",
          textShadow: theme === "dark"
            ? "0 0 8px rgba(255, 255, 255, 0.5)"
            : "0 2px 4px rgba(0, 0, 0, 0.2)",
          filter: theme === "dark" ? "brightness(1.1)" : "none",
          zIndex: 102,
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
function SliderRow({ label, value, min, max, onChange, theme = "dark", isHighlighted = false, allowAnyNumber = false, minConstraint, maxConstraint, isMobile = false }) {
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
      marginBottom: isMobile ? 0 : "clamp(8px, 1vw, 12px)",
      padding: isMobile ? "clamp(4px, 1.2vw, 8px)" : "clamp(6px, 0.8vw, 10px)",
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
        marginBottom: isMobile ? "clamp(3px, 0.8vw, 5px)" : "clamp(6px, 0.8vw, 8px)",
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
          gap: isMobile ? "clamp(6px, 1.5vw, 10px)" : "clamp(10px, 1.2vw, 14px)",
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
            height: isMobile ? "clamp(10px, 2.5vw, 12px)" : "clamp(12px, 1.5vw, 14px)",
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

