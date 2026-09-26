import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Trophy,
  ExternalLink,
  Award,
  Zap,
  CheckCircle2,
  Code2,
  Sparkles,
} from "lucide-react";
import "./CodingStatsGraph.css";

// Real, verified data from user's live accounts
const LEETCODE_DATA = {
  platform: "LeetCode",
  username: "nvssvinay2348",
  profileUrl: "https://leetcode.com/u/nvssvinay2348/",
  rating: 1706,
  peakRating: 1706,
  badge: "Top 13.6% Worldwide",
  globalRank: "118,161",
  totalParticipants: "884,439",
  totalSolved: 176,
  contestsAttended: 4,
  solvedBreakdown: [
    { label: "Easy", count: 123, color: "#00b8a3" },
    { label: "Medium", count: 51, color: "#ffc01e" },
    { label: "Hard", count: 2, color: "#ff375f" },
  ],
  accentColor: "#FFA116",
  gradientStart: "rgba(255, 161, 22, 0.35)",
  gradientEnd: "rgba(255, 161, 22, 0.0)",
  minY: 1450,
  maxY: 1750,
  history: [
    {
      contest: "Starting Baseline",
      short: "Initial",
      date: "Aug 2026",
      rating: 1500,
      delta: 0,
      rank: "Baseline",
      solved: "Initial Entry",
    },
    {
      contest: "Weekly Contest 517",
      short: "WC 517",
      date: "Aug 2026",
      rating: 1591,
      delta: 91,
      rank: "#4,581",
      solved: "2 / 4 Solved",
    },
    {
      contest: "Weekly Contest 518",
      short: "WC 518",
      date: "Aug 2026",
      rating: 1640,
      delta: 49,
      rank: "#4,299",
      solved: "3 / 4 Solved",
    },
    {
      contest: "Biweekly Contest 191",
      short: "BC 191",
      date: "Sep 2026",
      rating: 1706,
      delta: 66,
      rank: "#1,908",
      solved: "3 / 4 Solved",
    },
  ],
};

const CODECHEF_DATA = {
  platform: "CodeChef",
  username: "ideal_voice_80",
  profileUrl: "https://www.codechef.com/users/ideal_voice_80",
  rating: 1493,
  peakRating: 1493,
  badge: "Division 3 • 2★",
  globalRank: "#797 Best",
  totalContests: 6,
  totalSolved: 60,
  accentColor: "#60A5FA",
  gradientStart: "rgba(96, 165, 250, 0.35)",
  gradientEnd: "rgba(96, 165, 250, 0.0)",
  minY: 1000,
  maxY: 1550,
  history: [
    {
      contest: "Starters 250",
      short: "START 250",
      date: "Aug 05",
      rating: 1065,
      delta: 0,
      rank: "#8,989",
      solved: "1 / 4 Solved",
    },
    {
      contest: "Starters 251",
      short: "START 251",
      date: "Aug 12",
      rating: 1272,
      delta: 207,
      rank: "#3,140",
      solved: "2 / 4 Solved",
    },
    {
      contest: "Starters 252",
      short: "START 252",
      date: "Aug 19",
      rating: 1356,
      delta: 84,
      rank: "#3,183",
      solved: "3 / 5 Solved",
    },
    {
      contest: "Starters 253",
      short: "START 253",
      date: "Aug 26",
      rating: 1439,
      delta: 83,
      rank: "#1,402",
      solved: "3 / 5 Solved",
    },
    {
      contest: "Starters 254",
      short: "START 254",
      date: "Sep 02",
      rating: 1455,
      delta: 16,
      rank: "#1,842",
      solved: "3 / 6 Solved",
    },
    {
      contest: "Starters 256",
      short: "START 256",
      date: "Sep 16",
      rating: 1493,
      delta: 38,
      rank: "#797",
      solved: "4 / 6 Solved",
    },
  ],
};

function getSmoothSvgPath(points) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

export default function CodingStatsGraph() {
  const [activePlatform, setActivePlatform] = useState("leetcode"); // "leetcode" | "codechef" | "overview"
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgWrapRef = useRef(null);

  const activeData = activePlatform === "codechef" ? CODECHEF_DATA : LEETCODE_DATA;

  // Chart Geometry
  const svgWidth = 840;
  const svgHeight = 280;
  const paddingLeft = 56;
  const paddingRight = 40;
  const paddingTop = 36;
  const paddingBottom = 48;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const history = activeData.history;
  const n = history.length;

  const points = history.map((item, idx) => {
    const x = paddingLeft + (idx / (n - 1)) * chartWidth;
    const normalizedY =
      (item.rating - activeData.minY) / (activeData.maxY - activeData.minY);
    const y = paddingTop + (1 - normalizedY) * chartHeight;
    return { x, y, item, idx };
  });

  const pathD = getSmoothSvgPath(points);
  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x},${paddingTop + chartHeight} L ${points[0].x},${paddingTop + chartHeight} Z`
      : "";

  const activePoint =
    hoveredIndex !== null && points[hoveredIndex]
      ? points[hoveredIndex]
      : points[points.length - 1];

  // Fluid scrubber across the entire SVG canvas
  const handlePointerMove = useCallback(
    (e) => {
      if (!svgWrapRef.current) return;
      const rect = svgWrapRef.current.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      if (clientX === undefined) return;

      const relativeX = (clientX - rect.left) / rect.width;
      const svgX = relativeX * svgWidth;

      // Find closest data point
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

  // Grid lines
  const gridSteps = 4;
  const gridLines = Array.from({ length: gridSteps + 1 }).map((_, i) => {
    const val = Math.round(
      activeData.minY + (i / gridSteps) * (activeData.maxY - activeData.minY)
    );
    const y = paddingTop + (1 - i / gridSteps) * chartHeight;
    return { val, y };
  });

  return (
    <div className="coding-stats-section-wrap">
      {/* SECTION HEADER MATCHING HOME / PORTFOLIO STYLE */}
      <div className="coding-stats-header">
        <div className="coding-header-text">
          <div className="badge badge-status">
            <span className="status-dot" />
            <span>ALGORITHMS &amp; DATA STRUCTURES</span>
          </div>
          <h2 className="home-section-title">Contest Performance &amp; Ratings</h2>
          <p className="home-section-sub">
            Verified competitive programming ratings, trajectory curves, and algorithmic solutions across LeetCode and CodeChef.
          </p>
        </div>

        {/* LIQUID TABS SWITCHER */}
        <div className="coding-tabs-control" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activePlatform === "leetcode"}
            className={`coding-tab-btn ${activePlatform === "leetcode" ? "active" : ""}`}
            onClick={() => {
              setActivePlatform("leetcode");
              setHoveredIndex(null);
            }}
          >
            {activePlatform === "leetcode" && (
              <motion.div
                layoutId="activeTabGlow"
                className="tab-active-glow tab-glow-lc"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="tab-icon-wrap lc-icon-wrap" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.593 5.992 5.992 0 0 0 2.215-.246 5.992 5.992 0 0 0 2.062-1.077l3.864-3.714a1.376 1.376 0 0 0-.131-2.062 1.376 1.376 0 0 0-1.931.131l-3.864 3.714a3.242 3.242 0 0 1-1.115.582 3.24 3.24 0 0 1-1.198.133 3.21 3.21 0 0 1-2.607-1.944 2.977 2.977 0 0 1-.189-.55 2.986 2.986 0 0 1-.034-1.278 2.852 2.852 0 0 1 .655-1.139l3.854-4.126 5.406-5.788a1.376 1.376 0 0 0-.978-2.352z" />
              </svg>
            </span>
            <span className="tab-label">LeetCode</span>
            <span className="tab-score-badge">1706</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activePlatform === "codechef"}
            className={`coding-tab-btn ${activePlatform === "codechef" ? "active" : ""}`}
            onClick={() => {
              setActivePlatform("codechef");
              setHoveredIndex(null);
            }}
          >
            {activePlatform === "codechef" && (
              <motion.div
                layoutId="activeTabGlow"
                className="tab-active-glow tab-glow-cc"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="tab-icon-wrap cc-icon-wrap" aria-hidden="true">
              <Code2 className="w-3.5 h-3.5" />
            </span>
            <span className="tab-label">CodeChef</span>
            <span className="tab-score-badge">1493</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activePlatform === "overview"}
            className={`coding-tab-btn ${activePlatform === "overview" ? "active" : ""}`}
            onClick={() => {
              setActivePlatform("overview");
              setHoveredIndex(null);
            }}
          >
            {activePlatform === "overview" && (
              <motion.div
                layoutId="activeTabGlow"
                className="tab-active-glow tab-glow-all"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="tab-icon-wrap all-icon-wrap" aria-hidden="true">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="tab-label">Dual Overview</span>
          </button>
        </div>
      </div>

      {/* DUAL OVERVIEW COMPARISON MODE */}
      <AnimatePresence mode="wait">
        {activePlatform === "overview" ? (
          <motion.div
            key="overview-panel"
            className="coding-dual-overview-grid"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* LEETCODE SUMMARY CARD */}
            <div className="overview-platform-card lc-overview-border">
              <div className="overview-card-header">
                <div className="overview-brand">
                  <div className="platform-avatar lc-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.593 5.992 5.992 0 0 0 2.215-.246 5.992 5.992 0 0 0 2.062-1.077l3.864-3.714a1.376 1.376 0 0 0-.131-2.062 1.376 1.376 0 0 0-1.931.131l-3.864 3.714a3.242 3.242 0 0 1-1.115.582 3.24 3.24 0 0 1-1.198.133 3.21 3.21 0 0 1-2.607-1.944 2.977 2.977 0 0 1-.189-.55 2.986 2.986 0 0 1-.034-1.278 2.852 2.852 0 0 1 .655-1.139l3.854-4.126 5.406-5.788a1.376 1.376 0 0 0-.978-2.352z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="overview-title">LeetCode</h3>
                    <span className="overview-handle">@nvssvinay2348</span>
                  </div>
                </div>

                <a
                  href={LEETCODE_DATA.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overview-visit-link"
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="overview-rating-spotlight">
                <span className="overview-rating-label">CONTEST RATING</span>
                <div className="overview-rating-number">
                  <strong>1706</strong>
                  <span className="overview-badge-tag tag-amber">Top 13.6%</span>
                </div>
              </div>

              <div className="overview-stats-columns">
                <div className="overview-stat-cell">
                  <span>Problems Solved</span>
                  <strong>176 Total</strong>
                </div>
                <div className="overview-stat-cell">
                  <span>Global Rank</span>
                  <strong>#118,161</strong>
                </div>
                <div className="overview-stat-cell">
                  <span>Rated Sprints</span>
                  <strong>4 Active</strong>
                </div>
              </div>

              <div className="leetcode-breakdown-bar">
                <div
                  className="bar-segment easy"
                  style={{ width: `${(123 / 176) * 100}%` }}
                  title="123 Easy"
                />
                <div
                  className="bar-segment medium"
                  style={{ width: `${(51 / 176) * 100}%` }}
                  title="51 Medium"
                />
                <div
                  className="bar-segment hard"
                  style={{ width: `${(2 / 176) * 100}%` }}
                  title="2 Hard"
                />
              </div>
              <div className="leetcode-breakdown-labels">
                <span className="text-teal-400">123 Easy</span>
                <span className="text-amber-400">51 Med</span>
                <span className="text-rose-400">2 Hard</span>
              </div>

              <button
                type="button"
                className="overview-switch-btn"
                onClick={() => setActivePlatform("leetcode")}
              >
                <span>View Full LeetCode Trajectory Graph →</span>
              </button>
            </div>

            {/* CODECHEF SUMMARY CARD */}
            <div className="overview-platform-card cc-overview-border">
              <div className="overview-card-header">
                <div className="overview-brand">
                  <div className="platform-avatar cc-avatar">
                    <Code2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="overview-title">CodeChef</h3>
                    <span className="overview-handle">@ideal_voice_80</span>
                  </div>
                </div>

                <a
                  href={CODECHEF_DATA.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overview-visit-link"
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="overview-rating-spotlight">
                <span className="overview-rating-label">CONTEST RATING</span>
                <div className="overview-rating-number">
                  <strong>1493</strong>
                  <span className="overview-badge-tag tag-blue">Div 3 • 2★</span>
                </div>
              </div>

              <div className="overview-stats-columns">
                <div className="overview-stat-cell">
                  <span>Best Contest Rank</span>
                  <strong>#797 Worldwide</strong>
                </div>
                <div className="overview-stat-cell">
                  <span>Recent Gain</span>
                  <strong className="text-emerald-400">+428 Pts</strong>
                </div>
                <div className="overview-stat-cell">
                  <span>Rated Contests</span>
                  <strong>6 Consecutive</strong>
                </div>
              </div>

              <div className="cc-milestone-box">
                <span className="cc-milestone-title">RECENT CONTEST MILESTONE</span>
                <div className="cc-milestone-body">
                  <span>Starters 256: Placed <strong>#797</strong> with 4 solved problems, boosting rating to peak <strong>1493</strong>.</span>
                </div>
              </div>

              <button
                type="button"
                className="overview-switch-btn"
                onClick={() => setActivePlatform("codechef")}
              >
                <span>View Full CodeChef Trajectory Graph →</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activePlatform}
            className="coding-graph-wrapper"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* THREE METRICS SPOTLIGHT ROW */}
            <div className="coding-metrics-row">
              {/* PRIMARY RATING CARD */}
              <div className="coding-metric-card primary-rating-card">
                <div className="metric-header">
                  <span className="metric-eyebrow">CURRENT CONTEST RATING</span>
                  <TrendingUp
                    className="metric-icon"
                    style={{ color: activeData.accentColor }}
                  />
                </div>
                <div className="metric-main-value">
                  <strong>{activeData.rating}</strong>
                  <span className="metric-peak-badge">
                    <Zap className="w-3 h-3" />
                    <span>Peak: {activeData.peakRating}</span>
                  </span>
                </div>
                <div className="metric-sub-detail">
                  <span className="metric-highlight">{activeData.badge}</span>
                  <span className="metric-dot">•</span>
                  <span className="metric-handle">@{activeData.username}</span>
                </div>
              </div>

              {activePlatform === "leetcode" ? (
                <>
                  <div className="coding-metric-card">
                    <div className="metric-header">
                      <span className="metric-eyebrow">PROBLEMS SOLVED</span>
                      <CheckCircle2 className="metric-icon text-emerald-400" />
                    </div>
                    <div className="metric-main-value">
                      <strong>{activeData.totalSolved}</strong>
                      <span className="metric-unit">Verified Solved</span>
                    </div>
                    <div className="leetcode-breakdown-bar">
                      <div
                        className="bar-segment easy"
                        style={{ width: `${(123 / 176) * 100}%` }}
                        title="123 Easy"
                      />
                      <div
                        className="bar-segment medium"
                        style={{ width: `${(51 / 176) * 100}%` }}
                        title="51 Medium"
                      />
                      <div
                        className="bar-segment hard"
                        style={{ width: `${(2 / 176) * 100}%` }}
                        title="2 Hard"
                      />
                    </div>
                    <div className="leetcode-breakdown-labels">
                      <span className="text-teal-400">123 Easy</span>
                      <span className="text-amber-400">51 Med</span>
                      <span className="text-rose-400">2 Hard</span>
                    </div>
                  </div>

                  <div className="coding-metric-card">
                    <div className="metric-header">
                      <span className="metric-eyebrow">GLOBAL STANDING</span>
                      <Trophy className="metric-icon text-yellow-400" />
                    </div>
                    <div className="metric-main-value">
                      <strong>Top 13.6%</strong>
                    </div>
                    <div className="metric-sub-detail">
                      <span>Global Rank #{activeData.globalRank}</span>
                      <span className="metric-dot">•</span>
                      <span>Active Contender</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="coding-metric-card">
                    <div className="metric-header">
                      <span className="metric-eyebrow">BEST CONTEST RANK</span>
                      <Trophy className="metric-icon text-yellow-400" />
                    </div>
                    <div className="metric-main-value">
                      <strong>#797</strong>
                      <span className="metric-unit">Worldwide Rank</span>
                    </div>
                    <div className="metric-sub-detail">
                      <span>Starters 256</span>
                      <span className="metric-dot">•</span>
                      <span className="text-emerald-400">+38 Rating Gain</span>
                    </div>
                  </div>

                  <div className="coding-metric-card">
                    <div className="metric-header">
                      <span className="metric-eyebrow">DIVISION &amp; STARS</span>
                      <Award className="metric-icon text-blue-400" />
                    </div>
                    <div className="metric-main-value">
                      <strong>Division 3</strong>
                      <span className="metric-stars">★★</span>
                    </div>
                    <div className="metric-sub-detail">
                      <span>6 Rated Sprints</span>
                      <span className="metric-dot">•</span>
                      <span className="text-emerald-400">1065 → 1493 (+428)</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* INTERACTIVE GRAPH CANVAS CARD */}
            <div className="coding-graph-card">
              <div className="graph-card-top">
                <div className="graph-info">
                  <span className="graph-badge">INTERACTIVE RATING CURVE</span>
                  <span className="graph-hint">Move cursor over chart to inspect contest stats</span>
                </div>

                <a
                  href={activeData.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="graph-external-link"
                  title={`View official ${activeData.platform} profile`}
                >
                  <span>Visit {activeData.platform} Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* SVG CANVAS WITH SMOOTH POINTER SCRUBBER */}
              <div
                ref={svgWrapRef}
                className="svg-canvas-wrap"
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onTouchMove={handlePointerMove}
              >
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="coding-svg"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id={`graph-gradient-${activePlatform}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={activeData.accentColor}
                        stopOpacity="0.32"
                      />
                      <stop
                        offset="60%"
                        stopColor={activeData.accentColor}
                        stopOpacity="0.06"
                      />
                      <stop
                        offset="100%"
                        stopColor={activeData.accentColor}
                        stopOpacity="0.0"
                      />
                    </linearGradient>

                    <filter
                      id="glow-filter"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* HORIZONTAL GRID LINES & LABELS */}
                  {gridLines.map((line, i) => (
                    <g key={i}>
                      <line
                        x1={paddingLeft}
                        y1={line.y}
                        x2={svgWidth - paddingRight}
                        y2={line.y}
                        stroke="rgba(255, 255, 255, 0.07)"
                        strokeDasharray="3 4"
                      />
                      <text
                        x={paddingLeft - 12}
                        y={line.y + 4}
                        fill="rgba(255, 255, 255, 0.4)"
                        fontSize="10"
                        textAnchor="end"
                        fontFamily="var(--font-mono, monospace)"
                      >
                        {line.val}
                      </text>
                    </g>
                  ))}

                  {/* AREA UNDER CURVE */}
                  <motion.path
                    d={areaD}
                    fill={`url(#graph-gradient-${activePlatform})`}
                    className="chart-area-path"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* MAIN CURVE PATH (ANIMATED STROKE) */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={activeData.accentColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow-filter)"
                    className="chart-curve-path"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />

                  {/* VERTICAL GUIDELINE ON HOVER */}
                  {activePoint && (
                    <line
                      x1={activePoint.x}
                      y1={paddingTop}
                      x2={activePoint.x}
                      y2={paddingTop + chartHeight}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeDasharray="4 4"
                      strokeWidth="1.2"
                    />
                  )}

                  {/* DATA POINTS */}
                  {points.map((pt, idx) => {
                    const isSelected = activePoint && activePoint.idx === idx;
                    return (
                      <g key={idx} className="graph-point-group">
                        {/* Outer glow ring when selected */}
                        {isSelected && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="13"
                            fill={activeData.accentColor}
                            fillOpacity="0.22"
                          />
                        )}

                        {/* Point Outer Ring */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? "6.5" : "4.5"}
                          fill="#121316"
                          stroke={activeData.accentColor}
                          strokeWidth={isSelected ? "2.5" : "2"}
                          style={{
                            transition: "r 0.15s ease, stroke-width 0.15s ease",
                          }}
                        />

                        {/* Center Dot */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="2.2"
                          fill={isSelected ? activeData.accentColor : "#ffffff"}
                        />

                        {/* Bottom X-Axis Label */}
                        <text
                          x={pt.x}
                          y={paddingTop + chartHeight + 22}
                          fill={isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.45)"}
                          fontSize="10"
                          textAnchor="middle"
                          fontFamily="var(--font-mono, monospace)"
                          fontWeight={isSelected ? "700" : "500"}
                        >
                          {pt.item.short}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* FLOATING HOVER TOOLTIP */}
                <AnimatePresence>
                  {activePoint && (
                    <motion.div
                      className="graph-floating-tooltip"
                      key={activePoint.idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        left: `${(activePoint.x / svgWidth) * 100}%`,
                        top: `${(activePoint.y / svgHeight) * 100}%`,
                      }}
                    >
                      <div className="tooltip-inner">
                        <div className="tooltip-top">
                          <strong>{activePoint.item.contest}</strong>
                          <span className="tooltip-date">{activePoint.item.date}</span>
                        </div>
                        <div className="tooltip-rating-row">
                          <span className="tooltip-rating-val">{activePoint.item.rating}</span>
                          {activePoint.item.delta > 0 && (
                            <span className="tooltip-gain-badge">
                              +{activePoint.item.delta}
                            </span>
                          )}
                        </div>
                        <div className="tooltip-stats-grid">
                          <div>
                            <span>Rank</span>
                            <strong>{activePoint.item.rank}</strong>
                          </div>
                          <div>
                            <span>Solved</span>
                            <strong>{activePoint.item.solved}</strong>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CONTEST RECAP CHIPS / TIMELINE */}
              <div className="contest-timeline-bar">
                <span className="timeline-label">RATED TIMELINE:</span>
                <div className="timeline-chips">
                  {history.map((h, i) => (
                    <button
                      type="button"
                      key={i}
                      className={`timeline-chip ${
                        activePoint && activePoint.idx === i ? "active-chip" : ""
                      }`}
                      onClick={() => setHoveredIndex(i)}
                    >
                      <span className="chip-name">{h.short}</span>
                      <span className="chip-rating">{h.rating}</span>
                      {h.delta > 0 && <span className="chip-delta">+{h.delta}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
