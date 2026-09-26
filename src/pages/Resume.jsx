import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodingStatsGraph from "../components/CodingStatsGraph";
import "./Resume.css";

function AnimatedSection({ className = "", children }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

function AnimatedCard({ className = "", children, delay = 0 }) {
  return (
    <motion.article
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      {children}
    </motion.article>
  );
}

export default function Resume() {
  const [copyToast, setCopyToast] = useState("");

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopyToast(""), 2200);
  };

  return (
    <main className="resume-page">
      {/* Toast Notification */}
      <AnimatePresence>
        {copyToast && (
          <motion.div
            className="resume-copy-toast"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ duration: 0.25 }}
          >
            <span>✓</span>
            <span>{copyToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.section
        className="resume-header"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="resume-header-left">
          <div className="resume-eyebrow">PORTFOLIO / 03</div>
          <h1>RESUME</h1>
          <div className="resume-name">N V S S VINAY VARMA</div>
          <p className="resume-role">
            Computer Science &amp; Engineering Student
            <span aria-hidden="true">|</span>
            Software Developer
            <span aria-hidden="true">|</span>
            UI/UX Designer
          </p>
        </div>

        <div className="resume-header-right">
          <motion.a
            href="/resume.pdf"
            download
            className="resume-download"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>DOWNLOAD RESUME</span>
            <span className="download-arrow" aria-hidden="true">↗</span>
          </motion.a>

          <div className="resume-contact">
            <button
              type="button"
              className="resume-copy-btn"
              onClick={() => copyToClipboard("+91 90142 86908", "Phone number")}
              title="Click to copy phone number"
            >
              <span>+91 90142 86908</span>
              <span className="copy-icon">⎘</span>
            </button>

            <span aria-hidden="true">•</span>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=nvssvinayvarma@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-copy-btn"
              title="Open Gmail to email nvssvinayvarma@gmail.com (opens in new tab)"
            >
              <span>nvssvinayvarma@gmail.com</span>
              <span className="copy-icon" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="resume-profiles">
            <a
              href="https://github.com/nvinayvarma"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-profile-link"
              title="GitHub — @nvinayvarma (opens in new tab)"
              aria-label="GitHub Profile: @nvinayvarma"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>GitHub</span>
              <span className="ext-icon" aria-hidden="true">↗</span>
            </a>

            <a
              href="https://linkedin.com/in/nvssvinayvarma"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-profile-link"
              title="LinkedIn — Vinay Varma (opens in new tab)"
              aria-label="LinkedIn Profile: Vinay Varma"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>LinkedIn</span>
              <span className="ext-icon" aria-hidden="true">↗</span>
            </a>

            <a
              href="https://leetcode.com/u/nvssvinay2348/"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-profile-link"
              title="LeetCode Profile: @nvssvinay2348 (Rating: 1706 • Top 13.6%)"
              aria-label="LeetCode Profile: @nvssvinay2348"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.593 5.992 5.992 0 0 0 2.215-.246 5.992 5.992 0 0 0 2.062-1.077l3.864-3.714a1.376 1.376 0 0 0-.131-2.062 1.376 1.376 0 0 0-1.931.131l-3.864 3.714a3.242 3.242 0 0 1-1.115.582 3.24 3.24 0 0 1-1.198.133 3.21 3.21 0 0 1-2.607-1.944 2.977 2.977 0 0 1-.189-.55 2.986 2.986 0 0 1-.034-1.278 2.852 2.852 0 0 1 .655-1.139l3.854-4.126 5.406-5.788a1.376 1.376 0 0 0-.978-2.352z" />
              </svg>
              <span>LeetCode (1706)</span>
              <span className="ext-icon" aria-hidden="true">↗</span>
            </a>

            <a
              href="https://www.codechef.com/users/ideal_voice_80"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-profile-link"
              title="CodeChef Profile: @ideal_voice_80 (Rating: 1493 • Div 3)"
              aria-label="CodeChef Profile: @ideal_voice_80"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 18l6-6-6-6" />
                <path d="M8 6l-6 6 6 6" />
              </svg>
              <span>CodeChef (1493)</span>
              <span className="ext-icon" aria-hidden="true">↗</span>
            </a>

            <a
              href="https://figma.com/@nvssvinayvarma"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-profile-link"
              title="Figma — @nvssvinayvarma (opens in new tab)"
              aria-label="Figma Community Profile: @nvssvinayvarma"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
              </svg>
              <span>Figma</span>
              <span className="ext-icon" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="resume-location">
            Hyderabad, Telangana, India
          </div>
        </div>
      </motion.section>


      {/* =====================================================
          MAIN RESUME GRID
      ===================================================== */}

      <div className="resume-grid">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="resume-main">


          {/* =================================================
              SUMMARY
          ================================================= */}

          <AnimatedSection className="resume-section summary-section">

            <SectionTitle
              number="01"
              title="SUMMARY"
            />

            <p className="summary-text">
              Computer Science and Engineering student with a
              strong interest in software development, frontend
              engineering, and UI/UX design. Experienced in
              designing interfaces with Figma and building
              responsive web applications using HTML, CSS,
              JavaScript, and React. Interested in solving
              real-world problems through well-designed,
              user-focused technology products while
              continuously developing skills in data structures,
              full-stack development, and modern web technologies.
            </p>

          </AnimatedSection>


          {/* =================================================
              EDUCATION
          ================================================= */}

          <AnimatedSection className="resume-section">

            <SectionTitle
              number="02"
              title="EDUCATION"
            />


            <div className="education-list">

              {/* BTECH */}

              <AnimatedCard className="resume-education-card" delay={0.04}>

                <div className="education-marker">
                  <span></span>
                </div>

                <div className="education-card-content">

                  <div className="education-top">

                    <div>
                      <div className="education-degree">
                        B.Tech
                      </div>

                      <div className="education-institute">
                        B V Raju Institute of Technology
                        (BVRIT)
                      </div>
                    </div>

                    <div className="education-score">
                      <small>CGPA</small>
                      <strong>8.93</strong>
                      <span>/ 10</span>
                    </div>

                  </div>

                  <div className="education-meta">

                    <span>
                      09/2024 — 2028
                    </span>

                    <span>
                      Hyderabad, Telangana
                    </span>

                    <span>
                      Computer Science & Engineering
                    </span>

                  </div>

                </div>

              </AnimatedCard>


              {/* CLASS XII */}

              <AnimatedCard className="resume-education-card" delay={0.1}>

                <div className="education-marker">
                  <span></span>
                </div>

                <div className="education-card-content">

                  <div className="education-top">

                    <div>

                      <div className="education-degree">
                        Class XII
                      </div>

                      <div className="education-institute">
                        Vinjee Junior College
                      </div>

                    </div>

                    <div className="education-score">

                      <small>MARKS</small>

                      <strong>981</strong>

                      <span>/ 1000</span>

                    </div>

                  </div>

                  <div className="education-meta">

                    <span>
                      06/2022 — 06/2024
                    </span>

                    <span>
                      Hyderabad, Telangana
                    </span>

                  </div>

                </div>

              </AnimatedCard>

            </div>

          </AnimatedSection>


          {/* =================================================
              PROJECTS
          ================================================= */}

          <AnimatedSection className="resume-section">

            <SectionTitle
              number="03"
              title="PROJECTS"
            />


            <div className="projects-list">

              {/* ASTEROID IMPACT SIMULATOR */}

              <AnimatedCard className="project-card" delay={0.04}>

                <div className="project-number">
                  01
                </div>

                <div className="project-content">

                  <div className="project-heading-row">

                    <h3>
                      Asteroid Impact Simulator
                    </h3>

                    <span className="project-type">
                      INTERACTIVE / 3D
                    </span>

                  </div>

                  <p className="project-subtitle">
                    Interactive 3D Celestial Observatory &amp; Impact Physics
                  </p>

                  <div className="project-tech">
                    React.js
                    <span aria-hidden="true">•</span>
                    Three.js / WebGL
                    <span aria-hidden="true">•</span>
                    GLSL Shaders
                    <span aria-hidden="true">•</span>
                    Physics Engine
                    <span aria-hidden="true">•</span>
                    Tailwind CSS
                  </div>

                  <ul>

                    <li>
                      Engineered an interactive 3D celestial observatory visualizing near-Earth object orbital trajectories and planetary atmospheric entries on a photorealistic Three.js Earth globe.
                    </li>

                    <li>
                      Implemented real-time mathematical physics modeling computing post-impact kinetic energy release (megatons TNT), seismic Richter scale magnitude, and crater dimensions.
                    </li>

                    <li>
                      Built an interactive parameter customization studio allowing users to dynamically modify asteroid mass density, velocity vectors, targeting coordinates, and mitigation defenses.
                    </li>

                  </ul>

                </div>

              </AnimatedCard>


              {/* VARMA CREATIONS */}

              <AnimatedCard className="project-card" delay={0.08}>

                <div className="project-number">
                  02
                </div>

                <div className="project-content">

                  <div className="project-heading-row">

                    <h3>
                      Varma Creations
                    </h3>

                    <span className="project-type">
                      WEB DEVELOPMENT
                    </span>

                  </div>

                  <p className="project-subtitle">
                    Architectural Mosquito Mesh &amp; Window Systems Platform
                  </p>

                  <div className="project-tech">
                    React.js
                    <span aria-hidden="true">•</span>
                    JavaScript
                    <span aria-hidden="true">•</span>
                    Tailwind CSS
                    <span aria-hidden="true">•</span>
                    Local SEO Schema
                    <span aria-hidden="true">•</span>
                    WhatsApp API
                  </div>

                  <ul>

                    <li>
                      Designed and launched a modern commercial web application for a premier Hyderabad architectural mosquito mesh and aluminium installation brand.
                    </li>

                    <li>
                      Engineered an interactive Instant Quote Estimator calculating custom frame dimensions, sliding mesh types, and real-time cost estimates.
                    </li>

                    <li>
                      Integrated seamless one-click WhatsApp inquiries (+91 90142 86908) and structured local SEO schema, driving high conversion rates and sub-second page loads.
                    </li>

                  </ul>

                </div>

              </AnimatedCard>


              {/* RADIX */}

              <AnimatedCard className="project-card" delay={0.12}>

                <div className="project-number">
                  03
                </div>

                <div className="project-content">

                  <div className="project-heading-row">

                    <h3>
                      RADIX
                    </h3>

                    <span className="project-type">
                      FULL STACK / AI
                    </span>

                  </div>

                  <p className="project-subtitle">
                    AI-Powered Clinical Triage Suite &amp; Hospital Diagnostic Portal
                  </p>

                  <div className="project-tech">
                    React.js
                    <span aria-hidden="true">•</span>
                    Python / FastAPI
                    <span aria-hidden="true">•</span>
                    Deep Learning AI
                    <span aria-hidden="true">•</span>
                    DICOM / Medical Imaging
                    <span aria-hidden="true">•</span>
                    TLS 1.3 / HIPAA
                  </div>

                  <ul>

                    <li>
                      Architected an enterprise clinical radiology workstation and deep-learning triage platform automating emergency scan prioritization in 0.85s with 99.4% concordance.
                    </li>

                    <li>
                      Integrated computer vision models generating explainable pathology heatmaps and probability metrics for clinical anomaly detection and radiologist review.
                    </li>

                    <li>
                      Engineered end-to-end TLS 1.3 encrypted DICOM pipelines, automated STAT urgency queues, and radiologist diagnostic sign-off workflows.
                    </li>

                    <li>
                      Deployed live production application on Render with cloud storage, real-time study caching, and responsive medical workstation layouts.
                    </li>

                  </ul>

                </div>

              </AnimatedCard>

            </div>

          </AnimatedSection>


          {/* =================================================
              ACHIEVEMENTS
          ================================================= */}

          <AnimatedSection className="resume-section">

            <SectionTitle
              number="04"
              title="ACHIEVEMENTS"
            />

            <div className="achievement-list">

              <div className="achievement-item">

                <span className="achievement-icon" aria-hidden="true">
                  01
                </span>

                <p>
                  <strong>1st Place</strong> —
                  Promethean Competition, contributing to a
                  solution that addressed a business/company
                  problem.
                </p>

              </div>


              <div className="achievement-item">

                <span className="achievement-icon" aria-hidden="true">
                  02
                </span>

                <p>
                  Participated in technology and
                  hackathon-oriented projects focused on
                  solving real-world problems.
                </p>

              </div>


              <div className="achievement-item">

                <span className="achievement-icon" aria-hidden="true">
                  03
                </span>

                <p>
                  Continuously developing skills across software
                  development, UI/UX, and problem solving.
                </p>

              </div>

            </div>

          </AnimatedSection>

        </div>


        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <aside className="resume-sidebar">


          {/* =================================================
              TECHNICAL SKILLS
          ================================================= */}

          <AnimatedSection className="sidebar-section">

            <SectionTitle
              number="05"
              title="TECHNICAL SKILLS"
              compact
            />


            <SkillGroup
              title="Programming Languages"
              skills={[
                "C",
                "Python",
                "Java",
                "JavaScript",
              ]}
            />

            <SkillGroup
              title="Frontend"
              skills={[
                "HTML",
                "CSS",
                "JavaScript",
                "React.js",
              ]}
            />

            <SkillGroup
              title="Backend & Database"
              skills={[
                "Node.js",
                "Firebase",
                "Firestore",
              ]}
            />

            <SkillGroup
              title="UI/UX"
              skills={[
                "Figma",
                "Wireframing",
                "Prototyping",
                "User Interface Design",
                "Design Systems",
              ]}
            />

            <SkillGroup
              title="Tools & Technologies"
              skills={[
                "Git",
                "GitHub",
                "VS Code",
                "Canva",
                "Blender",
              ]}
            />

            <SkillGroup
              title="Other"
              skills={[
                "Data Structures & Algorithms",
                "Responsive Web Design",
                "API Integration",
              ]}
            />

          </AnimatedSection>


          {/* =================================================
              CERTIFICATIONS
          ================================================= */}

          <AnimatedSection className="sidebar-section">

            <SectionTitle
              number="06"
              title="CERTIFICATIONS"
              compact
            />

            <ul className="certification-list">

              <li className="certification-item">
                <span aria-hidden="true">✓</span>
                Figma UI/UX Design Essentials
              </li>

              <li className="certification-item">
                <span aria-hidden="true">✓</span>
                Figma UI/UX Design Advanced
              </li>

            </ul>

          </AnimatedSection>


          {/* =================================================
              DESIGN & PRODUCT
          ================================================= */}

          <AnimatedSection className="sidebar-section">

            <SectionTitle
              number="07"
              title="DESIGN & PRODUCT SKILLS"
              compact
            />

            <ul className="bullet-grid">

              <li>User Research</li>
              <li>Empathy Mapping</li>
              <li>Problem Definition</li>
              <li>Ideation</li>
              <li>Wireframing</li>
              <li>Prototyping</li>
              <li>User Interface Design</li>
              <li>Design Systems</li>
              <li>Responsive Design</li>
              <li>Usability-focused Design</li>

            </ul>

          </AnimatedSection>


          {/* =================================================
              COURSEWORK
          ================================================= */}

          <AnimatedSection className="sidebar-section">

            <SectionTitle
              number="08"
              title="RELEVANT COURSEWORK"
              compact
            />

            <ul className="coursework-list">

              <li>Data Structures & Algorithms</li>
              <li>Object-Oriented Programming</li>
              <li>Database Management Systems</li>
              <li>Operating Systems</li>
              <li>Computer Networks</li>
              <li>Software Engineering</li>
              <li>Web Development</li>

            </ul>

          </AnimatedSection>


          {/* =================================================
              INTERESTS
          ================================================= */}

          <AnimatedSection className="sidebar-section interests-section">

            <SectionTitle
              number="09"
              title="INTERESTS"
              compact
            />

            <ul className="interest-tags">

              <li>Software Development</li>
              <li>UI/UX Design</li>
              <li>Product Development</li>
              <li>Artificial Intelligence</li>
              <li>Web Applications</li>
              <li>Problem Solving</li>

            </ul>

          </AnimatedSection>


          {/* =================================================
              FOOTER CARD
          ================================================= */}

          <motion.div
            className="resume-sidebar-note"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >

            <span className="note-symbol" aria-hidden="true">
              ✦
            </span>

            <p>
              Constantly learning.
              <br />
              Constantly improving.
              <br />
              Always building.
            </p>

          </motion.div>

        </aside>
      </div>

      {/* COMPETITIVE PROGRAMMING & ALGORITHMIC RATINGS */}
      <motion.section
        className="resume-coding-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <CodingStatsGraph />
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        className="resume-footer"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="resume-footer-brand">
          <img src="/images/logo.png" alt="Vinay Varma Logo" className="footer-logo-img" />
          <div className="resume-footer-copy">
            <span className="resume-footer-name">VINAY VARMA</span>
            <span className="resume-footer-dot">•</span>
            <span className="resume-footer-sub">CURRICULUM VITAE • © 2026</span>
          </div>
        </div>

        <div className="resume-footer-links" aria-label="Professional profiles">
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
            href="https://leetcode.com/u/nvssvinay2348/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LeetCode Profile: @nvssvinay2348 (opens in new tab)"
            title="LeetCode — @nvssvinay2348 (Rating: 1706)"
            className="footer-social-link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        </div>
      </motion.footer>
    </main>
  );
}


/* =========================================================
   SECTION TITLE COMPONENT
========================================================= */

function SectionTitle({
  number,
  title,
  compact = false,
}) {
  return (
    <div
      className={`resume-section-title ${
        compact ? "compact-title" : ""
      }`}
    >

      <span className="section-number" aria-hidden="true">
        {number}
      </span>

      <h2>
        {title}
      </h2>

      <span className="section-line" aria-hidden="true"></span>

    </div>
  );
}


/* =========================================================
   SKILL GROUP COMPONENT
========================================================= */

function SkillGroup({
  title,
  skills,
}) {
  return (
    <motion.div
      className="skill-group"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3>
        {title}
      </h3>

      <ul className="skill-tags">
        {skills.map((skill) => (
          <motion.li
            key={skill}
            className="skill-tag"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}