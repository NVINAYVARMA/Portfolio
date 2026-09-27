import { useState, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Trophy,
  Award,
  Crown,
  TrendingUp,
  BarChart3,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUp,
} from "lucide-react";
import "./CodingStatsGraph.css";

/* =========================================================
   AUTHENTIC COMPETITIVE PROGRAMMING & BENCHMARK DATA
   Verified account statistics for @nvssvinay2348 & @ideal_voice_80
   ========================================================= */

const LEETCODE_CONFIG = {
  username: "nvssvinay2348",
  profileUrl: "https://leetcode.com/u/nvssvinay2348/",
  totalSolved: 178,
  easySolved: 124,
  mediumSolved: 52,
  hardSolved: 2,
  totalQuestions: 4064,
  ranking: "Rank #118,161",
  standing: "Top 13.6%",
  rating: 1706,
  peakRating: 1706,
  badge: "Knight Candidate",
  bestRank: "#1,908",
  // Real daily submissions across past 52 weeks (Dec 2025 - Sep 2026)
  fallbackSubmissions: {
    "2025-12-26": 2,
    "2026-03-08": 16,
    "2026-07-13": 14,
    "2026-07-14": 10,
    "2026-07-15": 2,
    "2026-07-16": 2,
    "2026-07-17": 3,
    "2026-07-18": 2,
    "2026-07-19": 5,
    "2026-07-20": 3,
    "2026-07-21": 9,
    "2026-07-22": 5,
    "2026-07-23": 6,
    "2026-07-24": 4,
    "2026-07-25": 9,
    "2026-07-26": 5,
    "2026-07-27": 5,
    "2026-07-28": 1,
    "2026-07-29": 1,
    "2026-07-30": 2,
    "2026-07-31": 1,
    "2026-08-01": 4,
    "2026-08-02": 3,
    "2026-08-03": 3,
    "2026-08-04": 4,
    "2026-08-05": 1,
    "2026-08-06": 3,
    "2026-08-07": 1,
    "2026-08-08": 1,
    "2026-08-09": 4,
    "2026-08-10": 1,
    "2026-08-11": 4,
    "2026-08-12": 4,
    "2026-08-13": 3,
    "2026-08-14": 3,
    "2026-08-15": 4,
    "2026-08-16": 3,
    "2026-08-17": 1,
    "2026-08-18": 2,
    "2026-08-19": 1,
    "2026-08-20": 1,
    "2026-08-21": 2,
    "2026-08-22": 2,
    "2026-08-23": 4,
    "2026-08-24": 1,
    "2026-08-25": 1,
    "2026-08-26": 9,
    "2026-08-27": 1,
    "2026-08-28": 1,
    "2026-08-29": 4,
    "2026-08-30": 2,
    "2026-08-31": 2,
    "2026-09-01": 1,
    "2026-09-02": 1,
    "2026-09-03": 1,
    "2026-09-04": 1,
    "2026-09-05": 2,
    "2026-09-06": 3,
    "2026-09-07": 1,
    "2026-09-08": 2,
    "2026-09-09": 1,
    "2026-09-10": 2,
    "2026-09-11": 1,
    "2026-09-12": 4,
    "2026-09-13": 2,
    "2026-09-14": 2,
    "2026-09-15": 1,
    "2026-09-16": 2,
    "2026-09-17": 1,
    "2026-09-18": 1,
    "2026-09-19": 1,
    "2026-09-20": 1,
    "2026-09-21": 1,
    "2026-09-22": 3,
    "2026-09-23": 1,
    "2026-09-24": 2,
    "2026-09-25": 1,
    "2026-09-26": 4,
    "2026-09-27": 2,
  },
};

const PLATFORM_DATA = {
  "leetcode-contests": {
    platform: "LeetCode",
    title: "LeetCode Contest Trajectory",
    subtitle: "Track your progress • Keep solving • Keep growing",
    chartTitle: "Rating Progress Over Contests",
    chartSubtitle: "Your LeetCode contest rating journey",
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
    accent: "#ff7a00",
    accentGlow: "rgba(255, 122, 0, 0.28)",
    minY: 1450,
    maxY: 1750,
    stepY: 50,
    history: [
      { contest: "Baseline", short: "Initial", date: "Jan 2025", rating: 1500, delta: 0, rank: "Baseline", note: "Starting Rating" },
      { contest: "Weekly Contest 517", short: "WC 517", date: "Mar 2025", rating: 1591, delta: 91, rank: "#4,581", note: "3/4 Solved" },
      { contest: "Weekly Contest 518", short: "WC 518", date: "May 2025", rating: 1640, delta: 49, rank: "#4,299", note: "3/4 Solved" },
      { contest: "Biweekly Contest 191", short: "BC 191", date: "Sep 2025", rating: 1706, delta: 66, rank: "#1,908", note: "Peak Performance" },
    ],
  },
  codechef: {
    platform: "CodeChef",
    title: "CodeChef Contest Trajectory",
    subtitle: "Track your progress • Keep solving • Keep growing",
    chartTitle: "Rating Progress Over Starters",
    chartSubtitle: "Your CodeChef division advancement journey",
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
    accentGlow: "rgba(96, 165, 250, 0.28)",
    minY: 1000,
    maxY: 1550,
    stepY: 100,
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
   52-WEEK LEETCODE CALENDAR GENERATION HELPER
   ========================================================= */

function generateContributionCalendar(submissionsMap) {
  const weeks = [];
  const endDate = new Date(2026, 8, 27);
  const totalDays = 52 * 7;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (totalDays - 1));

  const dayOffset = startDate.getDay();
  const alignedStart = new Date(startDate);
  alignedStart.setDate(startDate.getDate() - dayOffset);

  let current = new Date(alignedStart);
  let currentWeek = [];

  while (current <= endDate) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    const count = submissionsMap[dateStr] || 0;
    let level = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count >= 3 && count <= 5) level = 2;
    else if (count >= 6 && count <= 9) level = 3;
    else if (count >= 10) level = 4;

    currentWeek.push({
      date: dateStr,
      count,
      level,
      dayOfWeek: current.getDay(),
      month: current.toLocaleString("en-US", { month: "short" }),
      day: current.getDate(),
      year: y,
      rawDate: new Date(current),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    current.setDate(current.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function calculateSubmissionStats(weeks) {
  const allDays = weeks.flat();
  let totalSubmissions = 0;
  let activeDays = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < allDays.length; i++) {
    const day = allDays[i];
    totalSubmissions += day.count;
    if (day.count > 0) {
      activeDays++;
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i].count > 0) {
      currentStreak++;
    } else {
      if (i === allDays.length - 1) continue;
      break;
    }
  }

  return { totalSubmissions, activeDays, currentStreak, longestStreak };
}

/* =========================================================
   CUBIC BÉZIER SPLINE FOR SMOOTH CONTEST TRAJECTORY
   ========================================================= */

function getSmoothSvgPath(points, tension = 0.22, minY = 20, maxY = 260) {
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

    cp1y = Math.max(minY, Math.min(maxY, cp1y));
    cp2y = Math.max(minY, Math.min(maxY, cp2y));

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${pNext.x.toFixed(2)},${pNext.y.toFixed(2)}`;
  }
  return d;
}

/* Animated number counter */
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
  // Default to "leetcode-contests" to match user's target screenshot
  const [platform, setPlatform] = useState("leetcode-contests"); // "leetcode-submissions" | "leetcode-contests" | "codechef"
  const [timeRange, setTimeRange] = useState("ALL"); // "ALL" | "6M" | "3M" | "1M"
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [submissionsData, setSubmissionsData] = useState(LEETCODE_CONFIG.fallbackSubmissions);
  const [solvedStats, setSolvedStats] = useState({
    total: LEETCODE_CONFIG.totalSolved,
    easy: LEETCODE_CONFIG.easySolved,
    medium: LEETCODE_CONFIG.mediumSolved,
    hard: LEETCODE_CONFIG.hardSolved,
  });
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  const svgWrapRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Background live sync with LeetCode API
  useEffect(() => {
    let isCancelled = false;

    async function fetchLeetCodeData() {
      try {
        const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_CONFIG.username}`);
        if (!res.ok || isCancelled) return;
        const data = await res.json();

        if (isCancelled) return;

        if (typeof data.totalSolved === "number") {
          setSolvedStats({
            total: data.totalSolved,
            easy: data.easySolved ?? LEETCODE_CONFIG.easySolved,
            medium: data.mediumSolved ?? LEETCODE_CONFIG.mediumSolved,
            hard: data.hardSolved ?? LEETCODE_CONFIG.hardSolved,
          });
        }

        if (data.submissionCalendar && typeof data.submissionCalendar === "object") {
          const newMap = { ...LEETCODE_CONFIG.fallbackSubmissions };
          Object.entries(data.submissionCalendar).forEach(([ts, count]) => {
            const d = new Date(parseInt(ts) * 1000);
            const y = d.getUTCFullYear();
            const m = String(d.getUTCMonth() + 1).padStart(2, "0");
            const day = String(d.getUTCDate()).padStart(2, "0");
            newMap[`${y}-${m}-${day}`] = Math.max(newMap[`${y}-${m}-${day}`] || 0, count);
          });
          setSubmissionsData(newMap);
          setIsLiveSynced(true);
        }
      } catch {
        // Fallback cleanly
      }
    }

    fetchLeetCodeData();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Calendar for submissions view
  const calendarWeeks = useMemo(() => {
    return generateContributionCalendar(submissionsData);
  }, [submissionsData]);

  const { totalSubmissions, activeDays, currentStreak, longestStreak } = useMemo(() => {
    return calculateSubmissionStats(calendarWeeks);
  }, [calendarWeeks]);

  const animatedSubmissions = useAnimatedCounter(totalSubmissions, 800);
  const animatedStreak = useAnimatedCounter(currentStreak, 800);

  useLayoutEffect(() => {
    if (platform === "leetcode-submissions" && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [platform]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = "";
    calendarWeeks.forEach((week, weekIdx) => {
      const firstDay = week[0];
      if (firstDay && firstDay.month !== lastMonth) {
        lastMonth = firstDay.month;
        labels.push({ month: firstDay.month, weekIdx });
      }
    });
    return labels;
  }, [calendarWeeks]);

  // Contest datasets (LeetCode / CodeChef)
  const isContestTab = platform !== "leetcode-submissions";
  const activeContestData = PLATFORM_DATA[platform] || PLATFORM_DATA["leetcode-contests"];

  // Filter history based on time range selector
  const rawHistory = activeContestData.history;
  const history = useMemo(() => {
    if (timeRange === "1M") return rawHistory.slice(-2);
    if (timeRange === "3M") return rawHistory.slice(-3);
    if (timeRange === "6M") return rawHistory.slice(-4);
    return rawHistory;
  }, [rawHistory, timeRange]);

  const animatedRating = useAnimatedCounter(activeContestData.rating, 800);

  // SVG Chart Geometry: compact, balanced and proportional
  const svgWidth = 840;
  const svgHeight = 205;
  const paddingLeft = 52;
  const paddingRight = 44;
  const paddingTop = 28;
  const paddingBottom = 34;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const n = history.length;

  const points = useMemo(() => {
    return history.map((item, idx) => {
      const x = paddingLeft + (n > 1 ? (idx / (n - 1)) * chartWidth : chartWidth / 2);
      const normalizedY = (item.rating - activeContestData.minY) / (activeContestData.maxY - activeContestData.minY);
      const y = paddingTop + (1 - normalizedY) * chartHeight;
      return { x, y, item, idx };
    });
  }, [history, n, chartWidth, chartHeight, activeContestData.minY, activeContestData.maxY, paddingLeft, paddingTop]);

  const pathD = useMemo(
    () => getSmoothSvgPath(points, 0.24, paddingTop - 6, paddingTop + chartHeight + 6),
    [points, paddingTop, chartHeight]
  );

  const areaD = useMemo(() => {
    return points.length > 0
      ? `${pathD} L ${points[points.length - 1].x.toFixed(2)},${(paddingTop + chartHeight).toFixed(2)} L ${points[0].x.toFixed(2)},${(paddingTop + chartHeight).toFixed(2)} Z`
      : "";
  }, [points, pathD, paddingTop, chartHeight]);

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

  // Y-axis grid levels matching screenshot: 1750, 1700, 1650, 1600, 1550, 1500, 1450
  const gridLines = useMemo(() => {
    const lines = [];
    const step = activeContestData.stepY || 50;
    for (let val = activeContestData.maxY; val >= activeContestData.minY; val -= step) {
      const normalized = (val - activeContestData.minY) / (activeContestData.maxY - activeContestData.minY);
      const y = paddingTop + (1 - normalized) * chartHeight;
      lines.push({ val, y });
    }
    return lines;
  }, [activeContestData.minY, activeContestData.maxY, activeContestData.stepY, paddingTop, chartHeight]);

  // Default selected/active point is the last (peak) point if not hovered
  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];
  const isCustomHover = hoveredIndex !== null;
  const latestContest = history[history.length - 1] || rawHistory[rawHistory.length - 1];

  const formatCellDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="studio-coding-card">
      {/* 1. TOP HEADER BAR MATCHING SCREENSHOT */}
      <div className="studio-card-header">
        <div className="studio-brand-group">
          {/* SQUIRCLE ICON BOX */}
          <div className={`studio-brand-icon-box ${platform.startsWith("leetcode") ? "leetcode-accent" : "codechef-accent"}`}>
            {platform.startsWith("leetcode") ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.593 5.992 5.992 0 0 0 2.215-.246 5.992 5.992 0 0 0 2.062-1.077l3.864-3.714a1.376 1.376 0 0 0-.131-2.062 1.376 1.376 0 0 0-1.931.131l-3.864 3.714a3.242 3.242 0 0 1-1.115.582 3.24 3.24 0 0 1-1.198.133 3.21 3.21 0 0 1-2.607-1.944 2.977 2.977 0 0 1-.189-.55 2.986 2.986 0 0 1-.034-1.278 2.852 2.852 0 0 1 .655-1.139l3.854-4.126 5.406-5.788a1.376 1.376 0 0 0-.978-2.352z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 18l6-6-6-6" />
                <path d="M8 6l-6 6 6 6" />
              </svg>
            )}
          </div>

          <div className="studio-brand-meta">
            <div className="studio-brand-title-row">
              <h2 className="studio-brand-title">
                {platform === "leetcode-submissions"
                  ? "LeetCode Submission Activity"
                  : platform === "leetcode-contests"
                  ? "LeetCode Contest Trajectory"
                  : "CodeChef Contest Trajectory"}
              </h2>
              <a
                href={platform.startsWith("leetcode") ? LEETCODE_CONFIG.profileUrl : activeContestData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-handle-pill"
                title="Open profile in new tab"
              >
                <span>{platform.startsWith("leetcode") ? `@${LEETCODE_CONFIG.username}` : `@${activeContestData.username}`}</span>
                <ArrowUpRight size={13} className="handle-arrow" />
              </a>
            </div>
            <p className="studio-brand-sub">Track your progress • Keep solving • Keep growing</p>
          </div>
        </div>

        {/* 3 PILL SEGMENTED TOGGLE (RIGHT HEADER) */}
        <div className="studio-pill-nav" role="tablist" aria-label="Platform selection">
          {[
            { key: "leetcode-submissions", label: "LeetCode Submissions", accent: "#ff7a00" },
            { key: "leetcode-contests", label: "LeetCode Contests", accent: "#ff7a00" },
            { key: "codechef", label: "CodeChef", accent: "#60A5FA" },
          ].map(({ key, label, accent }) => {
            const isActive = platform === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`studio-pill-btn ${isActive ? "active" : ""}`}
                style={isActive ? { borderColor: accent } : {}}
                onClick={() => {
                  setPlatform(key);
                  setHoveredIndex(null);
                  setHoveredCell(null);
                }}
              >
                <span
                  className="studio-pill-dot"
                  style={{ backgroundColor: isActive ? accent : "rgba(255, 255, 255, 0.3)" }}
                />
                <span className="studio-pill-text">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 4 DISTINCT SEPARATE METRIC CARDS MATCHING SCREENSHOT */}
      <div className="studio-metrics-grid">
        {platform === "leetcode-submissions" ? (
          <>
            {/* CARD 1 (HIGHLIGHTED WITH ACCENT BORDER & GLOW) */}
            <div className="studio-metric-card is-highlight">
              <div className="studio-card-icon-box">
                <BarChart3 size={15} />
              </div>
              <div className="studio-card-data">
                <span className="studio-metric-label">TOTAL SUBMISSIONS</span>
                <div className="studio-metric-val-row">
                  <strong className="studio-metric-number">{animatedSubmissions}</strong>
                  <span className="studio-metric-delta">↑ Past 52 Weeks</span>
                </div>
                <span className="studio-metric-sub">Verified LeetCode Activity</span>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="studio-metric-card">
              <div className="studio-card-icon-box">
                <Flame size={15} />
              </div>
              <div className="studio-card-data">
                <span className="studio-metric-label">ACTIVE STREAK</span>
                <strong className="studio-metric-number">{animatedStreak} days</strong>
                <span className="studio-metric-sub">Daily Problem Solving</span>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="studio-metric-card">
              <div className="studio-card-icon-box">
                <CheckCircle2 size={15} />
              </div>
              <div className="studio-card-data">
                <span className="studio-metric-label">PROBLEMS SOLVED</span>
                <strong className="studio-metric-number">{solvedStats.total}</strong>
                <span className="studio-metric-sub">
                  {solvedStats.easy} Easy • {solvedStats.medium} Med • {solvedStats.hard} Hard
                </span>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="studio-metric-card">
              <div className="studio-card-icon-box">
                <Calendar size={15} />
              </div>
              <div className="studio-card-data">
                <span className="studio-metric-label">ACTIVE DAYS</span>
                <strong className="studio-metric-number">{activeDays} days</strong>
                <span className="studio-metric-sub">Max Continuous: {longestStreak} days</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* CARD 1: CURRENT RATING (HIGHLIGHTED WITH ACCENT BORDER & GLOW) */}
            <div className="studio-metric-card is-highlight" style={{ borderColor: activeContestData.accent }}>
              <div className="studio-card-icon-box">
                <BarChart3 size={15} />
              </div>
              <div className="studio-card-data">
                <span className="studio-metric-label">CURRENT RATING</span>
                <div className="studio-metric-val-row">
                  <strong className="studio-metric-number">{animatedRating.toLocaleString()}</strong>
                  {latestContest.delta > 0 && (
                    <span className="studio-metric-delta" style={{ color: activeContestData.accent }}>
                      ↑ +{latestContest.delta} pts
                    </span>
                  )}
                </div>
                <span className="studio-metric-sub">Verified Contest Rating</span>
              </div>
            </div>

            {/* CARD 2: ALL-TIME PEAK */}
            <div className="studio-metric-card">
              <div className="studio-card-icon-box">
                <Trophy size={15} />
              </div>
              <div className="studio-card-data">
                <span className="studio-metric-label">ALL-TIME PEAK</span>
                <strong className="studio-metric-number">{activeContestData.peakRating.toLocaleString()}</strong>
                <span className="studio-metric-sub">Highest Rating Achieved</span>
              </div>
            </div>

            {/* CARD 3: GLOBAL STANDING */}
            <div className="studio-metric-card">
              <div className="studio-card-icon-box">
                <Award size={15} />
              </div>
              <div className="studio-card-data">
                <span className="studio-metric-label">GLOBAL STANDING</span>
                <strong className="studio-metric-number">{activeContestData.standing}</strong>
                <span className="studio-metric-sub">{activeContestData.globalRank}</span>
              </div>
            </div>

            {/* CARD 4: BEST CONTEST RANK */}
            <div className="studio-metric-card">
              <div className="studio-card-icon-box">
                <Crown size={15} />
              </div>
              <div className="studio-card-data">
                <span className="studio-metric-label">BEST CONTEST RANK</span>
                <strong className="studio-metric-number">{activeContestData.bestRank}</strong>
                <span className="studio-metric-sub">{activeContestData.badge}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. MIDDLE SECTION: CHART HEADER & TIME FILTER */}
      <div className="studio-chart-header">
        <div className="studio-chart-title-wrap">
          <TrendingUp size={16} className="studio-chart-trend-icon" style={{ color: activeContestData.accent }} />
          <div>
            <h3 className="studio-chart-title">
              {isContestTab ? activeContestData.chartTitle : "52-Week Submission Matrix"}
            </h3>
            <p className="studio-chart-sub">
              {isContestTab ? activeContestData.chartSubtitle : "Daily LeetCode problem solving consistency"}
            </p>
          </div>
        </div>

        {/* TIME FILTER PILLS: ALL, 6M, 3M, 1M */}
        {isContestTab ? (
          <div className="studio-range-filters">
            {["ALL", "6M", "3M", "1M"].map((range) => {
              const isSelected = timeRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  className={`range-filter-btn ${isSelected ? "selected" : ""}`}
                  style={isSelected ? { backgroundColor: activeContestData.accent, borderColor: activeContestData.accent } : {}}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="studio-submissions-diff-chips">
            <span className="studio-chip easy">{solvedStats.easy} Easy</span>
            <span className="studio-chip medium">{solvedStats.medium} Med</span>
            <span className="studio-chip hard">{solvedStats.hard} Hard</span>
          </div>
        )}
      </div>

      {/* 4. MAIN CHART STAGE (CONTEST TRAJECTORY OR SUBMISSIONS CALENDAR) */}
      {isContestTab ? (
        <div
          ref={svgWrapRef}
          className="studio-chart-stage"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="studio-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`studio-area-grad-${platform}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeContestData.accent} stopOpacity="0.25" />
                <stop offset="65%" stopColor={activeContestData.accent} stopOpacity="0.04" />
                <stop offset="100%" stopColor={activeContestData.accent} stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id={`studio-stroke-grad-${platform}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={activeContestData.accent} stopOpacity="0.85" />
                <stop offset="60%" stopColor={activeContestData.accent} stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>

              <filter id="studioGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Y-Axis Sideways Label ("Rating") */}
            <text
              x={14}
              y={paddingTop + chartHeight / 2}
              fill="#8a8f98"
              fontSize="9.5"
              fontFamily="var(--font-mono)"
              fontWeight="500"
              textAnchor="middle"
              transform={`rotate(-90 14 ${paddingTop + chartHeight / 2})`}
            >
              Rating
            </text>

            {/* Horizontal Gridlines & Values */}
            {gridLines.map((line, i) => (
              <g key={`grid-line-${i}`}>
                <line
                  x1={paddingLeft}
                  y1={line.y}
                  x2={svgWidth - paddingRight}
                  y2={line.y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={line.y + 3}
                  fill="#8a8f98"
                  fontSize="9"
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                >
                  {line.val.toLocaleString()}
                </text>
              </g>
            ))}

            {/* Animated Area Fill */}
            <motion.path
              key={`area-${platform}-${timeRange}`}
              d={areaD}
              fill={`url(#studio-area-grad-${platform})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Diffused Glow Path */}
            <motion.path
              key={`glow-${platform}-${timeRange}`}
              d={pathD}
              fill="none"
              stroke={activeContestData.accent}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.3}
              filter="url(#studioGlowFilter)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Primary Crisp Line */}
            <motion.path
              key={`line-${platform}-${timeRange}`}
              d={pathD}
              fill="none"
              stroke={`url(#studio-stroke-grad-${platform})`}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Vertical Dropped Lines & Rating Badges Above Each Point */}
            {points.map((pt, idx) => {
              const isActive = activePoint && activePoint.idx === idx;
              const isLatest = idx === points.length - 1;

              return (
                <g key={`point-group-${idx}`}>
                  {/* Vertical dashed line to baseline */}
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={paddingTop + chartHeight}
                    stroke={activeContestData.accent}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity={isActive ? 0.6 : 0.28}
                  />

                  {/* Rating pill badge ABOVE the point */}
                  <g className="studio-point-badge">
                    <rect
                      x={pt.x - 18}
                      y={pt.y - 23}
                      width="36"
                      height="15"
                      rx="4"
                      fill="#14151a"
                      stroke={activeContestData.accent}
                      strokeWidth={isActive ? "1.5" : "1"}
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 12.5}
                      fill="#ffffff"
                      fontSize="8.5"
                      fontFamily="var(--font-mono)"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {pt.item.rating.toLocaleString()}
                    </text>
                  </g>

                  {/* Sonar ripple wave if active */}
                  {isActive && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={11}
                      fill={activeContestData.accent}
                      opacity={0.25}
                      className="sonar-ripple-wave"
                    />
                  )}

                  {/* Outer circle node */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 5 : 3.8}
                    fill="#16171d"
                    stroke={activeContestData.accent}
                    strokeWidth={isActive ? 2 : 1.5}
                  />

                  {/* Inner solid white dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 2.2 : 1.6}
                    fill="#ffffff"
                  />

                  {/* X-Axis Contest Short Name */}
                  <text
                    x={pt.x}
                    y={paddingTop + chartHeight + 14}
                    fill={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.75)"}
                    fontSize="9.5"
                    fontFamily="var(--font-mono)"
                    fontWeight={isActive ? "700" : "600"}
                    textAnchor="middle"
                  >
                    {pt.item.short}
                  </text>

                  {/* X-Axis Date Below */}
                  <text
                    x={pt.x}
                    y={paddingTop + chartHeight + 25}
                    fill="#8a8f98"
                    fontSize="8.5"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {pt.item.date}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Centered Label ("Contests") */}
            <text
              x={paddingLeft + chartWidth / 2}
              y={paddingTop + chartHeight + 35}
              fill="#8a8f98"
              fontSize="9"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              Contests
            </text>
          </svg>

          {/* FLOATING HUD CARD MATCHING SCREENSHOT */}
          <AnimatePresence>
            {activePoint && (
              <motion.div
                key={`hud-${platform}-${activePoint.idx}`}
                className="studio-hud-card"
                style={{
                  left: `${Math.min(Math.max((activePoint.x / svgWidth) * 100, 20), 82)}%`,
                  top: `${Math.max((activePoint.y / svgHeight) * 100 - 15, 12)}%`,
                  borderColor: activeContestData.accent,
                }}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                <div className="hud-title-row">
                  <span className="hud-cal-icon">📅</span>
                  <strong>{activePoint.item.contest}</strong>
                </div>

                <div className="hud-rating-row">
                  <span className="hud-label">Rating</span>
                  <div className="hud-val-group">
                    <strong className="hud-val">{activePoint.item.rating}</strong>
                    {activePoint.item.delta > 0 && (
                      <span className="hud-delta" style={{ color: activeContestData.accent }}>
                        +{activePoint.item.delta} pts
                      </span>
                    )}
                  </div>
                </div>

                <div className="hud-meta-row">
                  <span className="hud-label">Rank</span>
                  <span className="hud-meta-val">{activePoint.item.rank}</span>
                </div>

                <div className="hud-meta-row">
                  <span className="hud-label">Percentile</span>
                  <span className="hud-meta-val">{activeContestData.percentile || "Top 13.6%"}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* SUBMISSIONS 52-WEEK HEATMAP CALENDAR */
        <div className="activity-calendar-wrapper">
          <div ref={scrollContainerRef} className="activity-calendar-scroll-area">
            <div className="activity-calendar-grid-wrap">
              <div className="activity-months-row">
                <div className="activity-day-label-placeholder" />
                <div className="activity-months-track">
                  {monthLabels.map(({ month, weekIdx }, i) => (
                    <span key={i} className="activity-month-tag" style={{ left: `${weekIdx * 11}px` }}>
                      {month}
                    </span>
                  ))}
                </div>
              </div>

              <div className="activity-calendar-body">
                <div className="activity-weekdays-col" aria-hidden="true">
                  <span className="activity-day-tag">Sun</span>
                  <span className="activity-day-tag visible">Mon</span>
                  <span className="activity-day-tag">Tue</span>
                  <span className="activity-day-tag visible">Wed</span>
                  <span className="activity-day-tag">Thu</span>
                  <span className="activity-day-tag visible">Fri</span>
                  <span className="activity-day-tag">Sat</span>
                </div>

                <div className="activity-weeks-track">
                  {calendarWeeks.map((week, wIdx) => (
                    <div key={`w-${wIdx}`} className="activity-week-col">
                      {week.map((cell, dIdx) => (
                        <div
                          key={`c-${wIdx}-${dIdx}`}
                          className={`activity-cell level-${cell.level}`}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCell({
                              date: cell.date,
                              count: cell.count,
                              rect,
                            });
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                          aria-label={`${cell.count} submissions on ${cell.date}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {hoveredCell && (
              <motion.div
                className="activity-cell-tooltip"
                style={{
                  position: "fixed",
                  left: `${hoveredCell.rect.left + hoveredCell.rect.width / 2}px`,
                  top: `${hoveredCell.rect.top - 8}px`,
                }}
                initial={{ opacity: 0, y: 4, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 3, scale: 0.94 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <span className="tooltip-contrib-count">
                  {hoveredCell.count === 0
                    ? "No submissions"
                    : `${hoveredCell.count} ${hoveredCell.count === 1 ? "submission" : "submissions"}`}
                </span>
                <span className="tooltip-contrib-date">{formatCellDate(hoveredCell.date)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="activity-calendar-footer">
            <div className="activity-footer-left">
              <div className="activity-sync-status">
                <span className={`sync-status-dot ${isLiveSynced ? "synced" : "cached"}`} />
                <span className="sync-status-text">
                  {isLiveSynced ? "Live synced with LeetCode API" : "LeetCode Submissions (Past 1 Year)"}
                </span>
              </div>
            </div>

            <div className="activity-legend-group">
              <span className="legend-label">Less</span>
              <div className="legend-cells">
                <span className="activity-cell level-0" />
                <span className="activity-cell level-1" />
                <span className="activity-cell level-2" />
                <span className="activity-cell level-3" />
                <span className="activity-cell level-4" />
              </div>
              <span className="legend-label">More</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. BOTTOM CONTEST TIMELINE SCRUBBER MATCHING SCREENSHOT */}
      {isContestTab && (
        <div className="studio-timeline-footer">
          <div className="studio-timeline-label-group">
            <div className="timeline-clock-icon-wrap">
              <Clock size={13} />
            </div>
            <span className="studio-timeline-title">Contest Timeline</span>
          </div>

          <div className="studio-timeline-track">
            {history.map((item, idx) => {
              const isSelected = activePoint && activePoint.idx === idx;
              return (
                <div key={idx} className="studio-timeline-node">
                  {idx > 0 && (
                    <div
                      className="studio-timeline-dotted-line"
                      style={{ borderColor: activeContestData.accent }}
                    />
                  )}
                  <button
                    type="button"
                    className={`studio-timeline-card ${isSelected ? "selected" : ""}`}
                    style={isSelected ? { borderColor: activeContestData.accent } : {}}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setHoveredIndex(idx)}
                  >
                    <span
                      className="studio-timeline-dot"
                      style={{ backgroundColor: activeContestData.accent }}
                    />
                    <div className="studio-timeline-card-info">
                      <span className="timeline-item-short">{item.short}</span>
                      <div className="timeline-item-val-group">
                        <strong className="timeline-item-val">{item.rating}</strong>
                        {item.delta > 0 && (
                          <span className="timeline-item-gain" style={{ color: activeContestData.accent }}>
                            +{item.delta}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
