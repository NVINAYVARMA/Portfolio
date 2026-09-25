import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lanyard from "../components/Lanyard";
import StackPhysics from "../components/StackPhysics";
import PortraitMorph from "../components/PortraitMorph";
import "./About.css";

// GPU-friendly scroll reveal variants (opacity & translateY only)
const scrollFadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function About() {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  return (
    <main className="about-page">
      <div className="about-layout">
        {/* ===================================================
            LEFT COLUMN — STORY, EDUCATION & METRICS
        =================================================== */}
        <section className="about-left">
          {/* SECTION HEADER */}
          <motion.div
            className="about-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={scrollFadeUp}
          >
            <div className="badge badge-status">
              <span className="status-dot" />
              <span>Background &amp; Expertise</span>
            </div>
            <h1 className="about-title">About Me</h1>
            <p className="about-subtitle">
              Engineering purposeful software with a commitment to clean architecture, intuitive interaction design, and continuous learning.
            </p>
          </motion.div>

          {/* BIO LEAD CARD */}
          <motion.div
            className="about-bio-card card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={scrollFadeUp}
          >
            <p>
              I'm <strong>Vinay Varma</strong>, a 3rd-year Computer Science &amp; Engineering student at <strong>B V Raju Institute of Technology (BVRIT)</strong> in Hyderabad, India. I work at the intersection of frontend engineering, interface design, and product thinking—translating complex requirements into frictionless digital products.
            </p>
          </motion.div>

          {/* EXTENDED NARRATIVE */}
          <motion.div
            className="about-narrative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12 },
              },
            }}
          >
            <motion.p variants={scrollFadeUp}>
              My journey started with raw HTML &amp; CSS, building prototypes that soon grew into full-stack web applications, commercial showcase platforms, and interactive 3D experiences. I place high value on structural simplicity: readable codebases, semantic accessibility, and clean visual hierarchies.
            </motion.p>
            <motion.p variants={scrollFadeUp}>
              Beyond active development, I dedicate time to mastering core algorithms, exploring modern WebGL techniques, and understanding product ergonomics. My goal is to join a forward-thinking engineering team as an intern or junior engineer where I can build software that creates real-world utility.
            </motion.p>
          </motion.div>

          {/* FORMAL EDUCATION CARD */}
          <motion.div
            className="edu-card card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={scrollFadeUp}
          >
            <div className="edu-card-header">
              <div className="edu-icon">🎓</div>
              <div className="edu-header-text">
                <h3>B.Tech in Computer Science &amp; Engineering</h3>
                <span>B V Raju Institute of Technology (BVRIT)</span>
              </div>
            </div>
            <div className="edu-card-details">
              <div className="edu-meta-item">
                <span className="edu-label">Location</span>
                <span className="edu-val">Hyderabad, Telangana</span>
              </div>
              <div className="edu-meta-item">
                <span className="edu-label">Duration</span>
                <span className="edu-val">2024 — 2028</span>
              </div>
              <div className="edu-meta-item">
                <span className="edu-label">Academic Score</span>
                <span className="edu-val">CGPA: 8.93 / 10.0</span>
              </div>
            </div>
          </motion.div>

          {/* QUICK METRICS GRID */}
          <motion.div
            className="about-stats-card card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            <motion.div className="stat-col" variants={statVariants}>
              <strong>3rd</strong>
              <span>Year B.Tech CSE</span>
            </motion.div>
            <motion.div className="stat-col" variants={statVariants}>
              <strong>8.93</strong>
              <span>Academic CGPA</span>
            </motion.div>
            <motion.div className="stat-col" variants={statVariants}>
              <strong>03+</strong>
              <span>Projects Shipped</span>
            </motion.div>
            <motion.div className="stat-col" variants={statVariants}>
              <strong>100%</strong>
              <span>Focus &amp; Delivery</span>
            </motion.div>
          </motion.div>

          {/* GET IN TOUCH ACTION CARD (Balances Left Column) */}
          <motion.div
            className="about-cta-card card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={scrollFadeUp}
          >
            <div className="about-cta-text">
              <strong>Have an opportunity or project?</strong>
              <p>I'm currently open to internships and collaborative software projects.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={goToContact}
            >
              <span>Get in Touch</span>
              <span aria-hidden="true">→</span>
            </button>
          </motion.div>
        </section>

        {/* ===================================================
            RIGHT COLUMN — 3D DIGITAL ID & PROFILE PORTRAIT
        =================================================== */}
        <section className="about-right">
          {/* 3D DIGITAL ID BADGE (FEATURED AT TOP) */}
          <motion.div
            className="lanyard-card card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={scrollFadeUp}
          >
            <div className="lanyard-card-header">
              <span className="lanyard-tag">
                <i className="lanyard-live-dot" />
                <span>Interactive 3D ID Badge</span>
              </span>
              <span className="lanyard-hint">Click &amp; Drag Card</span>
            </div>
            <div className="lanyard-canvas-box">
              <Lanyard
                position={[0, 1.4, 27]}
                fov={20}
                gravity={[0, -40, 0]}
                frontImage="/images/id-card-front.png"
                backImage="/images/id-card-back.png"
              />
            </div>
            <div className="lanyard-card-footer">
              <span>B V Raju Institute of Technology</span>
              <span>2024 — 2028</span>
            </div>
          </motion.div>

          {/* PROFILE PHOTO CARD */}
          <motion.div
            className="profile-card card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={scrollFadeUp}
          >
            <div className="profile-card-top">
              <span className="profile-card-tag">Interactive Portrait</span>
              <span className="profile-card-id">HOVER TO MORPH ✦</span>
            </div>
            <div className="profile-image-container">
              <PortraitMorph
                srcA="/images/profile.png"
                srcB="/images/profile-wave.png"
                alt="Vinay Varma portrait"
                focusY={0.96}
                zoom={1.45}
              />
            </div>
            <div className="profile-card-bottom">
              <div className="profile-meta">
                <strong>N V S S Vinay Varma</strong>
                <span>CSE Student • Developer</span>
              </div>
              <div className="profile-card-badge-wrap">
                <img src="/images/logo.png" alt="Vinay Varma Logo" className="profile-badge-logo" />
                <span className="badge">BVRIT '28</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* FULL-WIDTH INTERACTIVE MATTER.JS PHYSICS TECH STACK */}
      <motion.section
        className="about-physics-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={scrollFadeUp}
      >
        <StackPhysics />
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        className="about-footer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={scrollFadeUp}
      >
        <div className="about-footer-brand">
          <img src="/images/logo.png" alt="Vinay Varma Logo" className="footer-logo-img" />
          <div className="about-footer-copy">
            <span className="about-footer-name">VINAY VARMA</span>
            <span className="about-footer-dot">•</span>
            <span className="about-footer-sub">© 2026 • HYDERABAD, INDIA</span>
          </div>
        </div>

        <div className="about-footer-links" aria-label="Social profiles">
          <a
            href="https://github.com/nvinayvarma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile: @nvinayvarma (opens in new tab)"
            title="GitHub — @nvinayvarma"
            className="footer-social-link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span>LinkedIn</span>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            aria-label="Send direct email to nvssvinayvarma@gmail.com (opens Gmail in new tab)"
            title="Email — nvssvinayvarma@gmail.com"
            className="footer-social-link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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