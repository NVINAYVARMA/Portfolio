import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Trophy, Award, TrendingUp, Sparkles, Activity } from "lucide-react";
import "./CodingStatsGraph.css";

/* =========================================================
   COMPETITIVE PROGRAMMING DATA
   Verified profile statistics from LeetCode & CodeChef
   ========================================================= */

const PLATFORM_DATA = {
  leetcode: {
    platform: "LeetCode",
    username: "nvssvinay2348",
    profileUrl: "https://leetcode.com/u/nvssvinay2348/",
    rating: 1706,
    peakRating: 1706,
    standing: "Top 13.6%",
    globalRank: "Rank #118,161",
    percentile: "Top 13.6%",
    badge: "Knight Candidate",
    bestRank: "#1,908",
    totalContests: 4,
    accent: "#FFA116",
    accentLight: "rgba(255, 161, 22, 0.15)",
    minY: 1450,
    maxY: 1750,
    history: [
      { contest: "Baseline", short: "Initial", date: "Aug 2026", rating: 1500, delta: 0, rank: "Baseline", note: "Starting Rating" },
      { contest: "Weekly Contest 517", short: "WC 517", date: "Aug 2026", rating: 1591, delta: 91, rank: "#4,581", note: "3/4 Solved" },
      { contest: "Weekly Contest 518", short: "WC 518", date: "Aug 2026", rating: 1640, delta: 49, rank: "#4,299", note: "3/4 Solved" },
      { contest: "Biweekly Contest 191", short: "BC 191", date: "Sep 2026", rating: 1706, delta: 66, rank: "#1,908", note: "Peak Performance" },
    ],
  },
  codechef: {
    platform: "CodeChef",
    username: "ideal_voice_80",
    profileUrl: "https://www.codechef.com/users/ideal_voice_80",
    rating: 1493,
    peakRating: 1493,
    standing: "Division 3 (2★)",
    globalRank: "Global #797",
    percentile: "Div 3 (2-Star)",
    badge: "2-Star Coder",
    bestRank: "#797",
    totalContests: 6,
    accent: "#60A5FA",
    accentLight: "rgba(96, 165, 250, 0.15)",
    minY: 1000,
    maxY: 1550,
    history: [
      { contest: "Starters 250", short: "START 250", date: "Aug 05", rating: 1065, delta: 0, rank: "#8,989", note: "Initial Rated" },
      { contest: "Starters 251", short: "START 251", date: "Aug 12", rating: 1272, delta: 207, rank: "#3,140", note: "+207 Jump" },
      { contest: "Starters 252", short: "START 252", date: "Aug 19", rating: 1356, delta: 84, rank: "#3,183", note: "+84 Steady" },
      { contest: "Starters 253", short: "START 253", date: "Aug 26", rating: 1439, delta: 83, rank: "#1,402", note: "+83 Top 1.4k" },
      { contest: "Starters 254", short: "START 254", date: "Sep 02", rating: 1455, delta: 16, rank: "#1,842", note: "+16 Consistent" },
      { contest: "Starters 256", short: "START 256", date: "Sep 16", rating: 1493, delta: 38, rank: "#797", note: "Global Peak #797" },
    ],
  },
};

/* =========================================================
   ORGANIC CUBIC BÉZIER SPLINE GENERATOR
   Creates smooth, non-oscillating trajectory curve
   ========================================================= */

function getSmoothSvgPath(points, tension = 0.22, minY = 20, maxY = 220) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const pPrev = points[i === 0 ? 0 : i - 1];
    const pCurr = points[i];
    const pNext = points[i + 1];
    const pAfter = points[i + 2 < points.length ? i + 2 : i + 1];

    let cp1x = pCurr.x + (pNext.x - pPrev.x) * tension;
    let cp1y = pCurr.y + (pNext.y - pPrev.y) * tension;
    let cp2x = pNext.x - (pAfter.x - pCurr.x) * tension;
    let cp2y = pNext.y - (pAfter.y - pCurr.y) * tension;

    // Clamp control points within chart bounds to eliminate clipping
    cp1y = Math.max(minY, Math.min(maxY, cp1y));
    cp2y = Math.max(minY, Math.min(maxY, cp2y));

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${pNext.x.toFixed(2)},${pNext.y.toFixed(2)}`;
  }
  return d;
}

/* =========================================================
   ANIMATED NUMBER COUNTER HOOK
   Smoothly interpolates rating values on mount & tab changes
   ========================================================= */

function useAnimatedCounter(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const prevRef = useRef(targetValue);

  useEffect(() => {
    const startVal = prevRef.current;
    const endVal = targetValue;
    prevRef.current = targetValue;

    if (startVal === endVal) return;

    let startTime = null;
    let animFrame = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Fast-out, gentle settle easing (cubic-bezier approximation)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [targetValue, duration]);

  return displayValue;
}

export default function CodingStatsGraph() {
  const [platform, setPlatform] = useState("leetcode");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgWrapRef = useRef(null);

  const data = PLATFORM_DATA[platform];
  const history = data.history;
  const animatedRating = useAnimatedCounter(data.rating, 800);

  // SVG Geometry Constants
  const svgWidth = 860;
  const svgHeight = 250;
  const paddingLeft = 58;
  const paddingRight = 50;
  const paddingTop = 36;
  const paddingBottom = 42;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const n = history.length;

  // Compute normalized point positions
  const points = useMemo(() => {
    return history.map((item, idx) => {
      const x = paddingLeft + (idx / (n - 1)) * chartWidth;
      const normalizedY = (item.rating - data.minY) / (data.maxY - data.minY);
      const y = paddingTop + (1 - normalizedY) * chartHeight;
      return { x, y, item, idx };
    });
  }, [history, n, chartWidth, chartHeight, data.minY, data.maxY, paddingLeft, paddingTop]);

  const pathD = useMemo(
    () => getSmoothSvgPath(points, 0.22, paddingTop - 4, paddingTop + chartHeight + 4),
    [points, paddingTop, chartHeight]
  );

  const areaD = useMemo(() => {
    return points.length > 0
      ? `${pathD} L ${points[points.length - 1].x.toFixed(2)},${(paddingTop + chartHeight).toFixed(2)} L ${points[0].x.toFixed(2)},${(paddingTop + chartHeight).toFixed(2)} Z`
      : "";
  }, [points, pathD, paddingTop, chartHeight]);

  // Find Peak Point for badge pin
  const peakPoint = useMemo(() => {
    return points.reduce((max, pt) => (pt.item.rating > max.item.rating ? pt : max), points[0]);
  }, [points]);

  // Pointer hover scrubber
  const handlePointerMove = useCallback(
    (e) => {
      if (!svgWrapRef.current) return;
      const rect = svgWrapRef.current.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      if (clientX === undefined) return;

      const relativeX = (clientX - rect.left) / rect.width;
      const svgX = relativeX * svgWidth;

      let closestIdx = 0;
      let minDistance = Infinity;
      points.forEach((pt, idx) => {
        const dist = Math.abs(pt.x - svgX);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      setHoveredIndex(closestIdx);
    },
    [points, svgWidth]
  );

  const handlePointerLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Grid steps (horizontal lines)
  const gridSteps = 3;
  const gridLines = Array.from({ length: gridSteps + 1 }).map((_, i) => {
    const val = Math.round(data.minY + (i / gridSteps) * (data.maxY - data.minY));
    const y = paddingTop + (1 - i / gridSteps) * chartHeight;
    return { val, y };
  });

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];
  const isCustomHover = hoveredIndex !== null;
  const latestContest = history[history.length - 1];

  return (
    <div className="coding-card">
      {/* 1. TOP CARD HEADER BAR: BRAND LOCKUP + PILL NAV SWITCHER */}
      <div className="coding-card-header">
        <div className="coding-brand-lockup">
          <div
            className={`coding-brand-icon-box ${platform === "leetcode" ? "leetcode-box" : "codechef-box"}`}
          >
            {platform === "leetcode" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.593 5.992 5.992 0 0 0 2.215-.246 5.992 5.992 0 0 0 2.062-1.077l3.864-3.714a1.376 1.376 0 0 0-.131-2.062 1.376 1.376 0 0 0-1.931.131l-3.864 3.714a3.242 3.242 0 0 1-1.115.582 3.24 3.24 0 0 1-1.198.133 3.21 3.21 0 0 1-2.607-1.944 2.977 2.977 0 0 1-.189-.55 2.986 2.986 0 0 1-.034-1.278 2.852 2.852 0 0 1 .655-1.139l3.854-4.126 5.406-5.788a1.376 1.376 0 0 0-.978-2.352z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 18l6-6-6-6" />
                <path d="M8 6l-6 6 6 6" />
              </svg>
            )}
          </div>

          <div className="coding-brand-meta">
            <div className="coding-brand-title-row">
              <strong className="coding-brand-title">{data.platform} Performance</strong>
              <a
                href={data.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="coding-profile-link"
                title={`Open ${data.platform} profile (@${data.username}) in new tab`}
              >
                <span>@{data.username}</span>
                <ArrowUpRight className="coding-profile-arrow" />
              </a>
            </div>
            <div className="coding-brand-subtitle">
              <span className="coding-standing-tag">{data.standing}</span>
              <span className="coding-dot-sep">•</span>
              <span className="coding-rank-tag">{data.globalRank}</span>
            </div>
          </div>
        </div>

        {/* Website-Style Pill Segmented Control */}
        <div className="coding-tabs-pill-wrap" role="tablist" aria-label="Platform selection">
          {["leetcode", "codechef"].map((key) => {
            const isActive = platform === key;
            const p = PLATFORM_DATA[key];
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`coding-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                  setPlatform(key);
                  setHoveredIndex(null);
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCodingTabPill"
                    className="coding-tab-active-bg"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  />
                )}
                <span className="coding-tab-text">
                  <span
                    className="coding-tab-indicator"
                    style={{ backgroundColor: p.accent }}
                  />
                  <span>{p.platform}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. STATS BAR (MIRRORS .home-metrics-bar) */}
      <div className="coding-metrics-bar">
        {/* CURRENT RATING */}
        <div className="coding-metric-item">
          <div className="coding-metric-header">
            <span className="metric-status-dot" />
            <span>CURRENT RATING</span>
          </div>
          <div className="coding-rating-num-wrap">
            <strong className="coding-rating-number">{animatedRating.toLocaleString()}</strong>
            {latestContest.delta > 0 && (
              <span className="coding-delta-badge">+{latestContest.delta} pts</span>
            )}
          </div>
        </div>

        <div className="coding-metric-divider" />

        {/* ALL-TIME PEAK */}
        <div className="coding-metric-item">
          <div className="coding-metric-header">
            <Trophy className="metric-header-icon" />
            <span>ALL-TIME PEAK</span>
          </div>
          <strong className="coding-metric-val">{data.peakRating}</strong>
          <span className="coding-metric-sub">Highest Rating Achieved</span>
        </div>

        <div className="coding-metric-divider" />

        {/* GLOBAL STANDING */}
        <div className="coding-metric-item">
          <div className="coding-metric-header">
            <Award className="metric-header-icon" />
            <span>GLOBAL STANDING</span>
          </div>
          <strong className="coding-metric-val">{data.standing}</strong>
          <span className="coding-metric-sub">{data.globalRank}</span>
        </div>

        <div className="coding-metric-divider" />

        {/* BEST CONTEST FINISH */}
        <div className="coding-metric-item">
          <div className="coding-metric-header">
            <TrendingUp className="metric-header-icon" />
            <span>BEST CONTEST RANK</span>
          </div>
          <strong className="coding-metric-val">{data.bestRank}</strong>
          <span className="coding-metric-sub">{data.badge}</span>
        </div>
      </div>

      {/* 3. INTERACTIVE CHART STAGE */}
      <div
        ref={svgWrapRef}
        className="coding-chart-stage"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="coding-svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradient Area Fill */}
            <linearGradient id={`area-grad-${platform}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={data.accent} stopOpacity="0.20" />
              <stop offset="70%" stopColor={data.accent} stopOpacity="0.03" />
              <stop offset="100%" stopColor={data.accent} stopOpacity="0.0" />
            </linearGradient>

            {/* Stroke Progression Gradient */}
            <linearGradient id={`stroke-grad-${platform}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={data.accent} stopOpacity="0.75" />
              <stop offset="60%" stopColor={data.accent} stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            {/* Laser Line Glow Filter */}
            <filter id="chartGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Crosshair Laser Guideline Gradient */}
            <linearGradient id="crosshairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="75%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {gridLines.map((line, i) => (
            <g key={`grid-line-${i}`}>
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={svgWidth - paddingRight}
                y2={line.y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 14}
                y={line.y + 3.5}
                fill="rgba(255, 255, 255, 0.35)"
                fontSize="10"
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {line.val}
              </text>
            </g>
          ))}

          {/* Animated Area Fill */}
          <motion.path
            key={`area-${platform}`}
            d={areaD}
            fill={`url(#area-grad-${platform})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Ambient Diffused Glow Path */}
          <motion.path
            key={`glow-${platform}`}
            d={pathD}
            fill="none"
            stroke={data.accent}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.25}
            filter="url(#chartGlowFilter)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.25 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Crisp Primary Trajectory Stroke */}
          <motion.path
            key={`path-${platform}`}
            d={pathD}
            fill="none"
            stroke={`url(#stroke-grad-${platform})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Interactive Crosshair Guideline */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingTop - 10}
              x2={activePoint.x}
              y2={paddingTop + chartHeight + 10}
              stroke="url(#crosshairGrad)"
              strokeDasharray="3 3"
              strokeWidth="1.2"
            />
          )}

          {/* Static Peak Pill Pin (Shows peak rating at a glance) */}
          {peakPoint && (
            <g className="peak-pin-marker">
              <rect
                x={peakPoint.x - 34}
                y={peakPoint.y - 28}
                width="68"
                height="20"
                rx="5"
                fill="rgba(17, 17, 22, 0.92)"
                stroke={data.accent}
                strokeWidth="1"
              />
              <text
                x={peakPoint.x}
                y={peakPoint.y - 14.5}
                fill="#ffffff"
                fontSize="9.5"
                fontFamily="var(--font-mono)"
                fontWeight="700"
                textAnchor="middle"
              >
                ★ {peakPoint.item.rating}
              </text>
            </g>
          )}

          {/* Contest Data Points with Staggered Elastic Pop-In */}
          {points.map((pt, idx) => {
            const isActive = activePoint && activePoint.idx === idx;
            const isLatest = idx === points.length - 1;
            const isPeak = pt.idx === peakPoint.idx;

            return (
              <g key={`point-${platform}-${idx}`}>
                {/* Sonar Ripple on Active Node */}
                {isActive && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={14}
                    fill={data.accent}
                    opacity={0.2}
                    className="sonar-ripple-wave"
                  />
                )}

                {/* Outer Shell Circle */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 6.5 : isPeak ? 5 : isLatest ? 4.5 : 3.5}
                  fill="#111116"
                  stroke={isPeak ? "#ffffff" : data.accent}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.3 + (idx / Math.max(n - 1, 1)) * 0.45,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                />

                {/* Inner Core Dot */}
                {(isActive || isLatest || isPeak) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 2.5 : 1.5}
                    fill={isPeak ? data.accent : "#ffffff"}
                  />
                )}

                {/* X Axis Contest Label */}
                <text
                  x={pt.x}
                  y={paddingTop + chartHeight + 22}
                  fill={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.45)"}
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontWeight={isActive ? "700" : "400"}
                >
                  {pt.item.short}
                </text>
              </g>
            );
          })}
        </svg>

        {/* FLOATING GLASS HUD TOOLTIP */}
        <AnimatePresence>
          {activePoint && (
            <motion.div
              key={`tooltip-${platform}-${activePoint.idx}`}
              className={`coding-chart-tooltip ${isCustomHover ? "is-hovered" : "is-active"}`}
              style={{
                left: `${(activePoint.x / svgWidth) * 100}%`,
                top: `${(activePoint.y / svgHeight) * 100}%`,
                borderColor: isCustomHover ? data.accent : "var(--border-medium)",
              }}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <div className="tooltip-top-row">
                <div className="tooltip-title-wrap">
                  <span
                    className="tooltip-accent-dot"
                    style={{ backgroundColor: data.accent }}
                  />
                  <strong>{activePoint.item.contest}</strong>
                </div>
                <span className="tooltip-date-tag">{activePoint.item.date}</span>
              </div>

              <div className="tooltip-rating-row">
                <span className="tooltip-val">{activePoint.item.rating}</span>
                {activePoint.item.delta > 0 && (
                  <span className="tooltip-gain-pill">
                    +{activePoint.item.delta} pts
                  </span>
                )}
              </div>

              <div className="tooltip-meta-row">
                <span className="tooltip-rank-tag">Rank: {activePoint.item.rank}</span>
                {activePoint.item.note && (
                  <span className="tooltip-note-tag">{activePoint.item.note}</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. BOTTOM INTERACTIVE CONTEST TIMELINE SCRUBBER */}
      <div className="coding-card-timeline">
        <span className="timeline-header-label">CONTEST TIMELINE:</span>
        <div className="timeline-pills-row">
          {history.map((item, idx) => {
            const isSelected = activePoint && activePoint.idx === idx;
            return (
              <button
                key={idx}
                type="button"
                className={`timeline-contest-pill ${isSelected ? "selected" : ""}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(idx)}
              >
                <span className="pill-contest-title">{item.short}</span>
                <span
                  className="pill-contest-rating"
                  style={{ color: isSelected ? data.accent : "rgba(255, 255, 255, 0.75)" }}
                >
                  {item.rating}
                </span>
                {item.delta > 0 && (
                  <span className="pill-contest-gain">+{item.delta}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
