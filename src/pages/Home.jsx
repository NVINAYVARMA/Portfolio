import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RBPContactCard from "../components/RBPContactCard";
import PortraitMorph from "../components/PortraitMorph";
import CodingStatsGraph from "../components/CodingStatsGraph";
import "./Home.css";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Home() {
  return (
    <main className="home-page">
      <motion.section
        className="home-hero"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* TWO-COLUMN HERO GRID (RBP TEMPLATE SIGNATURE) */}
        <div className="home-hero-grid">
          {/* LEFT COLUMN: HERO CONTENT */}
          <div className="home-hero-content">
            {/* AVAILABILITY STATUS BADGE */}
            <motion.div className="availability-badge" variants={itemVariants}>
              <img src="/images/logo.png" alt="Vinay Varma Logo" className="hero-logo-img" />
              <span className="availability-dot" />
              <span>Available for Internships &amp; Full-Time Roles</span>
            </motion.div>

            {/* HERO TITLE & IDENTITY */}
            <motion.div className="home-title-group" variants={itemVariants}>
              <span className="home-kicker">PORTFOLIO &amp; WORKS</span>
              <h1 className="home-name">Vinay Varma</h1>
              <h2 className="home-role">Software Developer &amp; UI/UX Designer</h2>
            </motion.div>

            {/* VALUE PROPOSITION / DESCRIPTION */}
            <motion.p className="home-description" variants={itemVariants}>
              Engineering high-performance web applications and crafting intuitive, accessible digital product experiences. 3rd-year Computer Science student at BVRIT, based in Hyderabad, India.
            </motion.p>

            {/* CALL TO ACTIONS */}
            <motion.div className="home-actions" variants={itemVariants}>
              <Link to="/projects" className="btn btn-primary btn-lg">
                <span>Explore Projects</span>
                <span className="btn-arrow" aria-hidden="true">→</span>
              </Link>

              <a
                href="/resume.pdf"
                download
                className="btn btn-secondary btn-lg"
              >
                <span>Download Resume</span>
                <span className="btn-icon" aria-hidden="true">↓</span>
              </a>

              <Link to="/contact" className="btn btn-ghost btn-lg">
                <span>Get in Touch</span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: SIGNATURE RBP PICTURE ANIMATION (PORTRAIT MORPH) */}
          <motion.div className="home-hero-portrait-wrap" variants={itemVariants}>
            <div className="home-hero-portrait-card">
              <div className="home-portrait-header">
                <span className="home-portrait-badge">
                  <span className="home-portrait-badge-dot" />
                  <span>Interactive Portrait</span>
                </span>
                <span className="home-portrait-hint">Hover to morph ✦</span>
              </div>

              <div className="home-portrait-canvas-box">
                <PortraitMorph
                  srcA="/images/profile.png"
                  srcB="/images/profile-wave.png"
                  alt="Vinay Varma portrait"
                  focusY={0.96}
                  zoom={1.45}
                />
              </div>

              <div className="home-portrait-footer">
                <div className="home-portrait-meta">
                  <strong>N V S S Vinay Varma</strong>
                  <span>Software Developer &amp; Designer</span>
                </div>
                <div className="badge badge-subtle">BVRIT '28</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* PROFILES & SOCIAL CHIPS (HERO QUICK ACCESS) */}
        <motion.div
          className="home-hero-socials"
          variants={itemVariants}
        >
          <span className="hero-socials-label">PROFILES &amp; SOCIAL:</span>

          <div className="hero-socials-grid">
            {/* GITHUB */}
            <a
              href="https://github.com/nvinayvarma"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-card"
              title="GitHub — @nvinayvarma (Repositories & Code)"
              aria-label="GitHub Profile: @nvinayvarma (opens in new tab)"
            >
              <div className="hero-social-icon github-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </div>
              <div className="hero-social-info">
                <div className="hero-social-title">
                  <strong>GitHub</strong>
                  <span className="external-arrow" aria-hidden="true">↗</span>
                </div>
                <span className="hero-social-meta">@nvinayvarma</span>
              </div>
            </a>

            {/* LINKEDIN */}
            <a
              href="https://linkedin.com/in/nvssvinayvarma"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-card"
              title="LinkedIn — Vinay Varma (Professional Network)"
              aria-label="LinkedIn Profile: Vinay Varma (opens in new tab)"
            >
              <div className="hero-social-icon linkedin-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div className="hero-social-info">
                <div className="hero-social-title">
                  <strong>LinkedIn</strong>
                  <span className="external-arrow" aria-hidden="true">↗</span>
                </div>
                <span className="hero-social-meta">in/nvssvinayvarma</span>
              </div>
            </a>

            {/* LEETCODE */}
            <a
              href="https://leetcode.com/u/nvssvinay2348/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-card"
              title="LeetCode — @nvssvinay2348 (Rating: 1706 • Top 13.6%)"
              aria-label="LeetCode Profile: @nvssvinay2348 (opens in new tab)"
            >
              <div className="hero-social-icon leetcode-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.593 5.992 5.992 0 0 0 2.215-.246 5.992 5.992 0 0 0 2.062-1.077l3.864-3.714a1.376 1.376 0 0 0-.131-2.062 1.376 1.376 0 0 0-1.931.131l-3.864 3.714a3.242 3.242 0 0 1-1.115.582 3.24 3.24 0 0 1-1.198.133 3.21 3.21 0 0 1-2.607-1.944 2.977 2.977 0 0 1-.189-.55 2.986 2.986 0 0 1-.034-1.278 2.852 2.852 0 0 1 .655-1.139l3.854-4.126 5.406-5.788a1.376 1.376 0 0 0-.978-2.352z" />
                </svg>
              </div>
              <div className="hero-social-info">
                <div className="hero-social-title">
                  <strong>LeetCode</strong>
                  <span className="external-arrow" aria-hidden="true">↗</span>
                </div>
                <span className="hero-social-meta">@nvssvinay2348 • 1706</span>
              </div>
            </a>

            {/* CODECHEF */}
            <a
              href="https://www.codechef.com/users/ideal_voice_80"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-card"
              title="CodeChef — @ideal_voice_80 (Rating: 1493 • Div 3)"
              aria-label="CodeChef Profile: @ideal_voice_80 (opens in new tab)"
            >
              <div className="hero-social-icon codechef-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 18l6-6-6-6" />
                  <path d="M8 6l-6 6 6 6" />
                </svg>
              </div>
              <div className="hero-social-info">
                <div className="hero-social-title">
                  <strong>CodeChef</strong>
                  <span className="external-arrow" aria-hidden="true">↗</span>
                </div>
                <span className="hero-social-meta">@ideal_voice_80 • 1493</span>
              </div>
            </a>

            {/* FIGMA */}
            <a
              href="https://figma.com/@nvssvinayvarma"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-card"
              title="Figma — @nvssvinayvarma (Design Systems & Prototypes)"
              aria-label="Figma Community Profile: @nvssvinayvarma (opens in new tab)"
            >
              <div className="hero-social-icon figma-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                  <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                  <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                  <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                  <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
                </svg>
              </div>
              <div className="hero-social-info">
                <div className="hero-social-title">
                  <strong>Figma</strong>
                  <span className="external-arrow" aria-hidden="true">↗</span>
                </div>
                <span className="hero-social-meta">@nvssvinayvarma</span>
              </div>
            </a>

            {/* EMAIL */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=nvssvinayvarma@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-card"
              title="Email — nvssvinayvarma@gmail.com (Opens Gmail compose in new tab)"
              aria-label="Send email to nvssvinayvarma@gmail.com via Gmail (opens in new tab)"
            >
              <div className="hero-social-icon mail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="hero-social-info">
                <div className="hero-social-title">
                  <strong>Email</strong>
                  <span className="external-arrow" aria-hidden="true">↗</span>
                </div>
                <span className="hero-social-meta">nvssvinayvarma@gmail.com</span>
              </div>
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* IMPACT & CREDIBILITY HIGHLIGHTS */}
      <motion.section
        className="home-metrics-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="home-metrics-bar">
          <div className="home-metric-item">
            <strong>03+</strong>
            <span>Projects Built</span>
          </div>
          <div className="home-metric-divider" />
          <div className="home-metric-item">
            <strong>8.93</strong>
            <span>Academic CGPA</span>
          </div>
          <div className="home-metric-divider" />
          <div className="home-metric-item">
            <strong>3rd</strong>
            <span>Year B.Tech CSE</span>
          </div>
          <div className="home-metric-divider" />
          <div className="home-metric-item">
            <strong>HYD</strong>
            <span>Hyderabad, India</span>
          </div>
        </div>
      </motion.section>

      {/* CORE COMPETENCIES SECTION */}
      <motion.section
        className="home-competencies-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* SECTION HEADER FOR CAPABILITIES */}
        <motion.div
          className="home-section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="badge badge-status">
            <span className="status-dot" />
            <span>DISCIPLINES &amp; CRAFT</span>
          </div>
          <h2 className="home-section-title">Core Competencies</h2>
        </motion.div>

        {/* CORE COMPETENCIES */}
        <motion.div
          className="home-capabilities"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.35 }}
        >
          {/* UI/UX DESIGN */}
          <motion.div
            className="capability card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
          >
            <div className="capability-header">
              <div className="capability-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <span className="capability-tag">Design System</span>
            </div>
            <h3>UI/UX Design</h3>
            <p>User research, interactive wireframing, high-fidelity Figma prototypes, and scalable component systems.</p>
          </motion.div>

          {/* FRONTEND DEVELOPMENT */}
          <motion.div
            className="capability card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
          >
            <div className="capability-header">
              <div className="capability-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span className="capability-tag">Engineering</span>
            </div>
            <h3>Frontend Development</h3>
            <p>Component-driven web apps built with modern React, JavaScript, TypeScript, and clean, efficient styling.</p>
          </motion.div>

          {/* CREATIVE TECHNOLOGY */}
          <motion.div
            className="capability card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.19, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
          >
            <div className="capability-header">
              <div className="capability-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <span className="capability-tag">Interactive</span>
            </div>
            <h3>Creative Technology</h3>
            <p>Interactive 3D scenes with Three.js, WebGL shader experiments, physics integration, and fluid animations.</p>
          </motion.div>

          {/* PROBLEM SOLVING */}
          <motion.div
            className="capability card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
          >
            <div className="capability-header">
              <div className="capability-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <span className="capability-tag">Hyderabad, IN</span>
            </div>
            <h3>Computer Science</h3>
            <p>Strong core fundamentals in Data Structures, Algorithms, object-oriented design, and database modeling.</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* COMPETITIVE PROGRAMMING & DSA RATING SECTION */}
      <motion.section
        className="home-coding-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="home-section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="badge badge-status">
            <span className="status-dot" />
            <span>ALGORITHMS &amp; BENCHMARKS</span>
          </div>
          <h2 className="home-section-title">Contest Performance</h2>
          <p className="home-section-sub">
            Verified competitive programming ratings, global standing, and contest trajectory
          </p>
        </motion.div>
        <CodingStatsGraph />
      </motion.section>

      {/* SIGNATURE RBP SHADER CONTACT CARD */}
      <motion.section
        className="home-contact-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <RBPContactCard />
      </motion.section>

      {/* FOOTER SOCIALS & CONNECTIVITY */}
      <motion.footer
        className="home-footer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="home-footer-brand">
          <img src="/images/logo.png" alt="Vinay Varma Logo" className="footer-logo-img" />
          <div className="home-footer-copy">
            <span className="home-footer-name">VINAY VARMA</span>
            <span className="home-footer-dot">•</span>
            <span className="home-footer-year">© 2026</span>
            <span className="home-footer-sub">Software Developer &amp; UI/UX Designer</span>
          </div>
        </div>

        <div className="home-footer-links" aria-label="Social and professional links">
          <a
            href="https://github.com/nvinayvarma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile: @nvinayvarma (opens in new tab)"
            title="GitHub — @nvinayvarma"
            className="footer-social-link"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span>GitHub</span>
            <span className="footer-link-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href="https://linkedin.com/in/nvssvinayvarma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile: Vinay Varma (opens in new tab)"
            title="LinkedIn — Vinay Varma"
            className="footer-social-link"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span>LinkedIn</span>
            <span className="footer-link-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href="https://leetcode.com/u/nvssvinay2348/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LeetCode Profile: @nvssvinay2348 (opens in new tab)"
            title="LeetCode — @nvssvinay2348 (Rating: 1706)"
            className="footer-social-link"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.593 5.992 5.992 0 0 0 2.215-.246 5.992 5.992 0 0 0 2.062-1.077l3.864-3.714a1.376 1.376 0 0 0-.131-2.062 1.376 1.376 0 0 0-1.931.131l-3.864 3.714a3.242 3.242 0 0 1-1.115.582 3.24 3.24 0 0 1-1.198.133 3.21 3.21 0 0 1-2.607-1.944 2.977 2.977 0 0 1-.189-.55 2.986 2.986 0 0 1-.034-1.278 2.852 2.852 0 0 1 .655-1.139l3.854-4.126 5.406-5.788a1.376 1.376 0 0 0-.978-2.352z" />
            </svg>
            <span>LeetCode</span>
            <span className="footer-link-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href="https://www.codechef.com/users/ideal_voice_80"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CodeChef Profile: @ideal_voice_80 (opens in new tab)"
            title="CodeChef — @ideal_voice_80 (Rating: 1493)"
            className="footer-social-link"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 18l6-6-6-6" />
              <path d="M8 6l-6 6 6 6" />
            </svg>
            <span>CodeChef</span>
            <span className="footer-link-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href="https://figma.com/@nvssvinayvarma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Figma Profile: @nvssvinayvarma (opens in new tab)"
            title="Figma — @nvssvinayvarma"
            className="footer-social-link"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
              <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
              <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
              <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
              <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
            </svg>
            <span>Figma</span>
            <span className="footer-link-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=nvssvinayvarma@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Send direct email to nvssvinayvarma@gmail.com (opens Gmail in a new tab)"
            title="Email — nvssvinayvarma@gmail.com"
            className="footer-social-link"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Email</span>
            <span className="footer-link-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </motion.footer>
    </main>
  );
}