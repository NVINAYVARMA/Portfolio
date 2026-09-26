import { useState, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Trophy, Award, TrendingUp, Activity, GitCommit, Flame, Calendar } from "lucide-react";
import "./CodingStatsGraph.css";

/* =========================================================
   COMPETITIVE PROGRAMMING & GITHUB BENCHMARK DATA
   Real, verified activity data across GitHub, LeetCode, CodeChef
   ========================================================= */

const GITHUB_CONFIG = {
  username: "NVINAYVARMA",
  profileUrl: "https://github.com/NVINAYVARMA",
  publicRepos: 2,
  // Baseline real activity grounded in repository commit logs
  fallbackContributions: {
    "2026-09-26": 8, // Recent portfolio features, gallery updates & optimizations
    "2026-09-25": 5, // Architecture refinements & performance tuning
    "2026-09-20": 2, // Project release commits
    "2025-05-15": 1, // Account genesis
  },
};

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
   CALENDAR GENERATION HELPER
   Creates 52 weeks of day cells up to the present date
   ========================================================= */

function generateContributionCalendar(contributionsMap) {
  const weeks = [];
  // Reference date: Sep 26, 2026 (Saturday)
  const endDate = new Date(2026, 8, 26);
  const totalDays = 52 * 7;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (totalDays - 1));

  // Align start to the preceding Sunday
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

    const count = contributionsMap[dateStr] || 0;
    let level = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count >= 3 && count <= 5) level = 2;
    else if (count >= 6 && count <= 8) level = 3;
    else if (count >= 9) level = 4;

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

function calculateContributionStats(weeks) {
  const allDays = weeks.flat();
  let totalContributions = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < allDays.length; i++) {
    const day = allDays[i];
    totalContributions += day.count;
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Current streak (working backwards from the most recent day)
  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i].count > 0) {
      currentStreak++;
    } else {
      if (i === allDays.length - 1) continue;
      break;
    }
  }

  return { totalContributions, currentStreak, longestStreak };
}

/* =========================================================
   ORGANIC CUBIC BÉZIER SPLINE (FOR LEETCODE & CODECHEF)
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

    cp1y = Math.max(minY, Math.min(maxY, cp1y));
    cp2y = Math.max(minY, Math.min(maxY, cp2y));

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${pNext.x.toFixed(2)},${pNext.y.toFixed(2)}`;
  }
  return d;
}

/* =========================================================
   ANIMATED NUMBER COUNTER HOOK
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
  const [platform, setPlatform] = useState("github"); // "github" | "leetcode" | "codechef"
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [githubData, setGithubData] = useState(GITHUB_CONFIG.fallbackContributions);
  const [publicRepos, setPublicRepos] = useState(GITHUB_CONFIG.publicRepos);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  const svgWrapRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Fetch live GitHub contributions and repo statistics
  useEffect(() => {
    let isCancelled = false;

    async function fetchGitHubData() {
      try {
        const [contribRes, userRes] = await Promise.allSettled([
          fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_CONFIG.username}`),
          fetch(`https://api.github.com/users/${GITHUB_CONFIG.username}`),
        ]);

        if (isCancelled) return;

        // Parse user profile repo count
        if (userRes.status === "fulfilled" && userRes.value.ok) {
          const userData = await userRes.value.json();
          if (typeof userData.public_repos === "number") {
            setPublicRepos(userData.public_repos);
          }
        }

        // Parse contributions calendar
        if (contribRes.status === "fulfilled" && contribRes.value.ok) {
          const contribData = await contribRes.value.json();
          if (Array.isArray(contribData.contributions)) {
            const map = { ...GITHUB_CONFIG.fallbackContributions };
            contribData.contributions.forEach((item) => {
              if (item.date && typeof item.count === "number") {
                map[item.date] = Math.max(map[item.date] || 0, item.count);
              }
            });
            setGithubData(map);
            setIsLiveSynced(true);
          }
        }
      } catch {
        // Fallback gracefully to baseline without showing broken UI
      }
    }

    fetchGitHubData();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Generate 52-week calendar grid
  const calendarWeeks = useMemo(() => {
    return generateContributionCalendar(githubData);
  }, [githubData]);

  // Compute live contribution statistics
  const { totalContributions, currentStreak, longestStreak } = useMemo(() => {
    return calculateContributionStats(calendarWeeks);
  }, [calendarWeeks]);

  // Auto-scroll calendar to the right on mobile so latest activity is in view
  useLayoutEffect(() => {
    if (platform === "github" && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [platform]);

  // Month label positions for GitHub calendar
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

  // LeetCode / CodeChef active dataset
  const activeContestData = PLATFORM_DATA[platform] || PLATFORM_DATA.leetcode;
  const history = activeContestData.history;
  const animatedRating = useAnimatedCounter(activeContestData.rating, 800);

  // SVG Geometry Constants for Contest Graphs
  const svgWidth = 860;
  const svgHeight = 250;
  const paddingLeft = 58;
  const paddingRight = 50;
  const paddingTop = 36;
  const paddingBottom = 42;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const n = history.length;

  const points = useMemo(() => {
    return history.map((item, idx) => {
      const x = paddingLeft + (idx / (n - 1)) * chartWidth;
      const normalizedY = (item.rating - activeContestData.minY) / (activeContestData.maxY - activeContestData.minY);
      const y = paddingTop + (1 - normalizedY) * chartHeight;
      return { x, y, item, idx };
    });
  }, [history, n, chartWidth, chartHeight, activeContestData.minY, activeContestData.maxY, paddingLeft, paddingTop]);

  const pathD = useMemo(
    () => getSmoothSvgPath(points, 0.22, paddingTop - 4, paddingTop + chartHeight + 4),
    [points, paddingTop, chartHeight]
  );

  const areaD = useMemo(() => {
    return points.length > 0
      ? `${pathD} L ${points[points.length - 1].x.toFixed(2)},${(paddingTop + chartHeight).toFixed(2)} L ${points[0].x.toFixed(2)},${(paddingTop + chartHeight).toFixed(2)} Z`
      : "";
  }, [points, pathD, paddingTop, chartHeight]);

  const peakPoint = useMemo(() => {
    return points.reduce((max, pt) => (pt.item.rating > max.item.rating ? pt : max), points[0]);
  }, [points]);

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

  const gridSteps = 3;
  const gridLines = Array.from({ length: gridSteps + 1 }).map((_, i) => {
    const val = Math.round(activeContestData.minY + (i / gridSteps) * (activeContestData.maxY - activeContestData.minY));
    const y = paddingTop + (1 - i / gridSteps) * chartHeight;
    return { val, y };
  });

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];
  const isCustomHover = hoveredIndex !== null;
  const latestContest = history[history.length - 1];

  // Format tooltip date nicely: "Wednesday, Sep 25, 2026"
  const formatCellDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="coding-card">
      {/* 1. HEADER BAR: BRAND LOCKUP & PILL SEGMENTED CONTROLS */}
      <div className="coding-card-header">
        <div className="coding-brand-lockup">
          <div className={`coding-brand-icon-box ${platform}-box`}>
            {platform === "github" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            ) : platform === "leetcode" ? (
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
              <strong className="coding-brand-title">
                {platform === "github" ? "GitHub Contribution Activity" : `${activeContestData.platform} Performance`}
              </strong>
              <a
                href={platform === "github" ? GITHUB_CONFIG.profileUrl : activeContestData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="coding-profile-link"
                title={`Open profile in new tab`}
              >
                <span>{platform === "github" ? "View GitHub →" : `@${activeContestData.username}`}</span>
                {platform !== "github" && <ArrowUpRight className="coding-profile-arrow" />}
              </a>
            </div>

            <div className="coding-brand-subtitle">
              {platform === "github" ? (
                <>
                  <span className="coding-standing-tag">CODE ACTIVITY</span>
                  <span className="coding-dot-sep">•</span>
                  <span className="coding-rank-tag">@{GITHUB_CONFIG.username}</span>
                </>
              ) : (
                <>
                  <span className="coding-standing-tag">{activeContestData.standing}</span>
                  <span className="coding-dot-sep">•</span>
                  <span className="coding-rank-tag">{activeContestData.globalRank}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Segmented Platform Toggle Pills */}
        <div className="coding-tabs-pill-wrap" role="tablist" aria-label="Platform selection">
          {[
            { key: "github", label: "GitHub", dotColor: "#10b981" },
            { key: "leetcode", label: "LeetCode", dotColor: "#FFA116" },
            { key: "codechef", label: "CodeChef", dotColor: "#60A5FA" },
          ].map(({ key, label, dotColor }) => {
            const isActive = platform === key;
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
                  setHoveredCell(null);
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
                  <span className="coding-tab-indicator" style={{ backgroundColor: dotColor }} />
                  <span>{label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. STATS OVERVIEW BAR (MIRRORS .home-metrics-bar) */}
      <div className="coding-metrics-bar">
        {platform === "github" ? (
          <>
            {/* TOTAL CONTRIBUTIONS */}
            <div className="coding-metric-item">
              <div className="coding-metric-header">
                <span className="metric-status-dot" />
                <span>TOTAL CONTRIBUTIONS</span>
              </div>
              <div className="coding-rating-num-wrap">
                <strong className="coding-rating-number">{totalContributions}</strong>
                <span className="coding-delta-badge">Last 52 Weeks</span>
              </div>
            </div>

            <div className="coding-metric-divider" />

            {/* CURRENT STREAK */}
            <div className="coding-metric-item">
              <div className="coding-metric-header">
                <Flame className="metric-header-icon" />
                <span>CURRENT STREAK</span>
              </div>
              <strong className="coding-metric-val">{currentStreak} {currentStreak === 1 ? "day" : "days"}</strong>
              <span className="coding-metric-sub">Active Shipping</span>
            </div>

            <div className="coding-metric-divider" />

            {/* REPOSITORIES */}
            <div className="coding-metric-item">
              <div className="coding-metric-header">
                <GitCommit className="metric-header-icon" />
                <span>REPOSITORIES</span>
              </div>
              <strong className="coding-metric-val">{publicRepos}</strong>
              <span className="coding-metric-sub">Public Repositories</span>
            </div>

            <div className="coding-metric-divider" />

            {/* LONGEST STREAK */}
            <div className="coding-metric-item">
              <div className="coding-metric-header">
                <Calendar className="metric-header-icon" />
                <span>LONGEST STREAK</span>
              </div>
              <strong className="coding-metric-val">{longestStreak} {longestStreak === 1 ? "day" : "days"}</strong>
              <span className="coding-metric-sub">Maximum Continuous</span>
            </div>
          </>
        ) : (
          <>
            {/* CURRENT CONTEST RATING */}
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
              <strong className="coding-metric-val">{activeContestData.peakRating}</strong>
              <span className="coding-metric-sub">Highest Rating Achieved</span>
            </div>

            <div className="coding-metric-divider" />

            {/* GLOBAL STANDING */}
            <div className="coding-metric-item">
              <div className="coding-metric-header">
                <Award className="metric-header-icon" />
                <span>GLOBAL STANDING</span>
              </div>
              <strong className="coding-metric-val">{activeContestData.standing}</strong>
              <span className="coding-metric-sub">{activeContestData.globalRank}</span>
            </div>

            <div className="coding-metric-divider" />

            {/* BEST FINISH */}
            <div className="coding-metric-item">
              <div className="coding-metric-header">
                <TrendingUp className="metric-header-icon" />
                <span>BEST CONTEST RANK</span>
              </div>
              <strong className="coding-metric-val">{activeContestData.bestRank}</strong>
              <span className="coding-metric-sub">{activeContestData.badge}</span>
            </div>
          </>
        )}
      </div>

      {/* 3. MAIN GRAPH BODY (GITHUB CALENDAR vs CONTEST TRAJECTORY) */}
      {platform === "github" ? (
        <div className="github-activity-wrapper">
          {/* CONTROLLED HORIZONTAL SCROLL AREA (NEVER OVERFLOWS PAGE ON MOBILE) */}
          <div ref={scrollContainerRef} className="github-calendar-scroll-area">
            <div className="github-calendar-grid-wrap">
              {/* MONTHS LABELS ROW */}
              <div className="github-months-row">
                <div className="github-day-label-placeholder" />
                <div className="github-months-track">
                  {monthLabels.map(({ month, weekIdx }, i) => (
                    <span
                      key={i}
                      className="github-month-tag"
                      style={{ left: `${weekIdx * 14}px` }}
                    >
                      {month}
                    </span>
                  ))}
                </div>
              </div>

              {/* CALENDAR BODY: DAYS LABELS + 52 WEEKS MATRIX */}
              <div className="github-calendar-body">
                {/* WEEKDAY LABELS (MON, WED, FRI) */}
                <div className="github-weekdays-col" aria-hidden="true">
                  <span className="github-day-tag">Sun</span>
                  <span className="github-day-tag visible">Mon</span>
                  <span className="github-day-tag">Tue</span>
                  <span className="github-day-tag visible">Wed</span>
                  <span className="github-day-tag">Thu</span>
                  <span className="github-day-tag visible">Fri</span>
                  <span className="github-day-tag">Sat</span>
                </div>

                {/* MATRIX OF 52 WEEKS */}
                <div className="github-weeks-track">
                  {calendarWeeks.map((week, wIdx) => (
                    <div key={`w-${wIdx}`} className="github-week-col">
                      {week.map((cell, dIdx) => (
                        <div
                          key={`c-${wIdx}-${dIdx}`}
                          className={`github-cell level-${cell.level}`}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCell({
                              date: cell.date,
                              count: cell.count,
                              rect,
                            });
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                          aria-label={`${cell.count} contributions on ${cell.date}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ELEGANT COMPACT TOOLTIP (BOUNDED & PREVENTED FROM CLIPPING) */}
          <AnimatePresence>
            {hoveredCell && (
              <motion.div
                className="github-cell-tooltip"
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
                    ? "No contributions"
                    : `${hoveredCell.count} ${hoveredCell.count === 1 ? "contribution" : "contributions"}`}
                </span>
                <span className="tooltip-contrib-date">{formatCellDate(hoveredCell.date)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GITHUB FOOTER BAR: LIVE STATUS & ACTIVITY LEVEL LEGEND */}
          <div className="github-activity-footer">
            <div className="github-sync-status">
              <span className={`sync-status-dot ${isLiveSynced ? "synced" : "cached"}`} />
              <span className="sync-status-text">
                {isLiveSynced ? "Live synced with GitHub API" : "GitHub Contribution Activity"}
              </span>
            </div>

            <div className="github-legend-group">
              <span className="legend-label">Less</span>
              <div className="legend-cells">
                <span className="github-cell level-0" />
                <span className="github-cell level-1" />
                <span className="github-cell level-2" />
                <span className="github-cell level-3" />
                <span className="github-cell level-4" />
              </div>
              <span className="legend-label">More</span>
            </div>
          </div>
        </div>
      ) : (
        /* CONTEST PERFORMANCE SPLINE (LEETCODE / CODECHEF) */
        <div
          ref={svgWrapRef}
          className="coding-chart-stage"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="coding-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`area-grad-${platform}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeContestData.accent} stopOpacity="0.20" />
                <stop offset="70%" stopColor={activeContestData.accent} stopOpacity="0.03" />
                <stop offset="100%" stopColor={activeContestData.accent} stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id={`stroke-grad-${platform}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={activeContestData.accent} stopOpacity="0.75" />
                <stop offset="60%" stopColor={activeContestData.accent} stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>

              <filter id="chartGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <linearGradient id="crosshairGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
                <stop offset="25%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="75%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
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
              stroke={activeContestData.accent}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.25}
              filter="url(#chartGlowFilter)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.25 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Primary Crisp Trajectory Stroke */}
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

            {/* Laser Crosshair Line */}
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

            {/* Peak Pin Marker */}
            {peakPoint && (
              <g className="peak-pin-marker">
                <rect
                  x={peakPoint.x - 34}
                  y={peakPoint.y - 28}
                  width="68"
                  height="20"
                  rx="5"
                  fill="rgba(17, 17, 22, 0.92)"
                  stroke={activeContestData.accent}
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

            {/* Points */}
            {points.map((pt, idx) => {
              const isActive = activePoint && activePoint.idx === idx;
              const isLatest = idx === points.length - 1;
              const isPeak = pt.idx === peakPoint.idx;

              return (
                <g key={`point-${platform}-${idx}`}>
                  {isActive && (
                    <circle cx={pt.x} cy={pt.y} r={14} fill={activeContestData.accent} opacity={0.2} className="sonar-ripple-wave" />
                  )}

                  <motion.circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isActive ? 6.5 : isPeak ? 5 : isLatest ? 4.5 : 3.5}
                    fill="#111116"
                    stroke={isPeak ? "#ffffff" : activeContestData.accent}
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

                  {(isActive || isLatest || isPeak) && (
                    <circle cx={pt.x} cy={pt.y} r={isActive ? 2.5 : 1.5} fill={isPeak ? activeContestData.accent : "#ffffff"} />
                  )}

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
                  borderColor: isCustomHover ? activeContestData.accent : "var(--border-medium)",
                }}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                <div className="tooltip-top-row">
                  <div className="tooltip-title-wrap">
                    <span className="tooltip-accent-dot" style={{ backgroundColor: activeContestData.accent }} />
                    <strong>{activePoint.item.contest}</strong>
                  </div>
                  <span className="tooltip-date-tag">{activePoint.item.date}</span>
                </div>

                <div className="tooltip-rating-row">
                  <span className="tooltip-val">{activePoint.item.rating}</span>
                  {activePoint.item.delta > 0 && (
                    <span className="tooltip-gain-pill">+{activePoint.item.delta} pts</span>
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
      )}

      {/* 4. CONTEST TIMELINE SCRUBBER (FOR LEETCODE & CODECHEF) */}
      {platform !== "github" && (
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
                    style={{ color: isSelected ? activeContestData.accent : "rgba(255, 255, 255, 0.75)" }}
                  >
                    {item.rating}
                  </span>
                  {item.delta > 0 && <span className="pill-contest-gain">+{item.delta}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
