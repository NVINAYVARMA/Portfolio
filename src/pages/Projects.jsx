import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Projects.css";

const categories = ["ALL", "AI / ML", "INTERACTIVE", "WEB DEVELOPMENT"];

const projects = [
  {
    id: "01",
    title: "Asteroid Impact Simulator",
    subtitle: "Interactive 3D Celestial Observatory & Impact Physics",
    category: "INTERACTIVE",
    description:
      "An interactive celestial observatory that visualizes near-Earth object trajectories, simulates impact physics on a photorealistic 3D globe, and calculates post-impact seismic and crater dynamics.",
    longDescription:
      "Asteroid Impact Simulator is an interactive WebGL celestial observatory and computational physics platform engineered to visualize near-Earth objects (NEOs) and model planetary collision dynamics. Built with Three.js, React, and custom physics calculation engines, the simulator allows users to project orbital trajectories onto an interactive 3D Earth, configure asteroid properties (mass, velocity, trajectory angle, composition), and simulate impact events with scientific rigor. The application computes post-impact planetary consequences in real time, calculating kinetic energy yield (megatons TNT equivalent), crater diameter and depth, seismic Richter magnitude, atmospheric shockwave radius, and potential planetary defense mitigation strategies.",
    features: [
      "Photorealistic 3D Earth & Celestial Sphere with dynamic atmospheric scattering, shaders, and orbit paths via Three.js",
      "Data-driven trajectory simulation modeling near-Earth object orbital velocities and approach vectors",
      "Interactive parameter studio: customize asteroid diameter, mass density, trajectory angle, and velocity",
      "Scientific post-impact analysis: calculates crater dimensions, seismic shockwaves, thermal radiation, and TNT energy yield",
      "Historical impact presets (Chicxulub, Tunguska, Chelyabinsk) and custom planetary collision targeting",
    ],
    role: "3D GRAPHICS & SIMULATION ARCHITECT",
    year: "2026",
    status: "BUILDING",
    technologies: ["Three.js", "WebGL", "React", "GLSL / Shaders", "Physics Engine", "Tailwind CSS"],
    fallback: "SIM",
    image: "/images/simulation.png",
    imagePosition: "center center",
    liveUrl: "#",
  },
  {
    id: "02",
    title: "Varma Creations",
    subtitle: "Architectural Mosquito Mesh & Window Systems",
    category: "WEB DEVELOPMENT",
    description:
      "A modern commercial web platform engineered for a Hyderabad-based architectural mosquito mesh and window systems brand, featuring interactive product showcases and instant quote estimation.",
    longDescription:
      "Varma Creations is a high-performance commercial business website created for a premier mosquito mesh and architectural aluminium installation business serving homes, villas, and apartments across Hyderabad. Designed with an elegant emerald-and-charcoal visual identity, the website features custom-fitted sliding doors, pleated window systems, magnetic insect screens, and weatherproof aluminium framing. The platform incorporates an interactive instant quote calculator, direct WhatsApp inquiry integration (+91 90142 86908), localized SEO architecture, and optimized media delivery to drive customer inquiries and consultations.",
    features: [
      "Architectural product showcase featuring pleated mesh, sliding systems, roller screens, and stainless steel mesh",
      "Interactive Instant Quote Estimator calculating custom frame dimensions, mesh types, and price ranges",
      "One-tap direct WhatsApp inquiry and call booking integration (+91 90142 86908)",
      "Localized Hyderabad SEO strategy with structured business schema and localized keyword landing pages",
      "Responsive, high-conversion UI with 98+ Google PageSpeed score and sub-second asset loading",
    ],
    role: "FULL STACK DESIGN & DEVELOPMENT",
    year: "2025",
    status: "LIVE",
    technologies: ["React", "JavaScript", "Tailwind CSS", "HTML5 / CSS3", "Local SEO", "WhatsApp API"],
    fallback: "VC",
    image: "/images/varma-creations.png",
    imagePosition: "left center",
    liveUrl: "#",
  },
  {
    id: "03",
    title: "RADIX",
    subtitle: "AI-Powered Clinical Triage Suite & Hospital Diagnostic Portal",
    category: "AI / ML",
    description:
      "An FDA & HIPAA-aligned clinical diagnostic radiology intelligence platform that automates emergency scan triage in 0.85s, provides explainable pathology heatmaps, and achieves 99.4% concordance.",
    longDescription:
      "RADIX is an enterprise hospital diagnostic workstation and AI-powered clinical triage suite engineered to alleviate severe hospital radiology backlogs and expedite emergency patient interventions. Integrating deep-learning computer vision models with medical imaging (DICOM) pipelines, RADIX autonomously triages critical anomalies within 0.85 seconds with 99.4% concordance. Features explainable diagnostic heatmaps, automated STAT urgency prioritization, end-to-end TLS 1.3 encryption, and clinical radiologist sign-off workflows designed with HIPAA and responsible AI guardrails.",
    features: [
      "Sub-second STAT triage (0.85s) prioritizing critical emergency trauma and time-sensitive radiological cases",
      "99.4% diagnostic concordance with deep-learning pathology localization & explainable heatmaps",
      "End-to-end TLS 1.3 encrypted DICOM image pipeline with HIPAA-compliant audit trails",
      "Enterprise Hospital Diagnostic Portal with automated study queues, radiologist reports, and sign-offs",
      "Cloud deployment on Render with real-time study caching, secure auth, and zero-latency clinical viewing",
    ],
    role: "FULL STACK & AI SYSTEMS ARCHITECT",
    year: "2026",
    status: "LIVE",
    technologies: ["React", "Python / FastAPI", "Deep Learning / PyTorch", "DICOM", "Tailwind CSS", "TLS 1.3 / HIPAA"],
    fallback: "RADIX",
    image: "/images/radix.png",
    imagePosition: "center top",
    liveUrl: "https://radix-ai-irqh.onrender.com/",
  },
];

function ProjectPreview({ project }) {
  const displayAddress =
    project.liveUrl && project.liveUrl !== "#" && !project.liveUrl.includes("github.com")
      ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : `${project.title.toLowerCase().replaceAll(" ", "-")}.dev`;

  return (
    <div className="project-preview">
      <div className="preview-grid" />

      <div className="browser-window">
        <div className="browser-bar">
          <div className="browser-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="browser-address">
            {displayAddress}
          </div>
        </div>

        <div className="browser-content">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} Preview`}
              className="project-image"
              style={{ objectPosition: project.imagePosition || "center" }}
              loading="lazy"
            />
          ) : (
            <div className="project-fallback">
              <div className="project-fallback-inner">
                <span className="project-fallback-abbr">{project.fallback}</span>
                <span className="project-fallback-title">{project.title}</span>
                <span className="project-fallback-tag">{project.category}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="preview-number">{project.id}</div>
      <div className="preview-arrow" aria-hidden="true">↗</div>
    </div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState(null);

  // Close modal on Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // Filter projects by category
  const filteredProjects =
    activeCategory === "ALL"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="projects-page">
      {/* HEADER */}
      <motion.section
        className="projects-header"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="badge badge-status">
          <span className="status-dot" />
          <span>PORTFOLIO / 02 • WORK</span>
        </div>

        <div className="projects-title-wrap">
          <h1>Featured Projects</h1>
          <span className="projects-title-number">
            ({String(filteredProjects.length).padStart(2, "0")})
          </span>
        </div>

        <p className="projects-intro">
          A curated collection of selected work spanning full-stack web applications,
          interactive 3D graphics, and user-centric SaaS interfaces.
        </p>
      </motion.section>

      {/* CATEGORY FILTER TABS */}
      <motion.div
        className="projects-filters"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-btn ${activeCategory === cat ? "is-active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {activeCategory === cat && (
              <motion.div
                className="filter-active-pill"
                layoutId="activeFilter"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="filter-label">{cat}</span>
          </button>
        ))}
      </motion.div>

      {/* PROJECT SHOWCASE LIST */}
      <section className="projects-list">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              className="project-showcase"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              {/* LEFT NUMBER */}
              <div className="project-number">{project.id}</div>

              {/* BROWSER PREVIEW */}
              <ProjectPreview project={project} />

              {/* PROJECT INFORMATION */}
              <div className="project-information">
                <div className="project-meta">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>

                <div className="project-heading">
                  <h2>{project.title}</h2>
                  <span>{project.subtitle}</span>
                </div>

                <p className="project-description">{project.description}</p>

                {/* ROLE */}
                <div className="project-role">
                  <span>ROLE</span>
                  <strong>{project.role}</strong>
                </div>

                {/* TECHNOLOGIES */}
                <div className="project-tags">
                  {project.technologies.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="project-card-footer">
                  <div className="project-status">
                    <i />
                    <span>{project.status}</span>
                  </div>

                  <div className="project-card-actions">
                    {project.liveUrl && project.liveUrl !== "#" && !project.liveUrl.includes("github.com") && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-live-link"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Open live site for ${project.title}`}
                      >
                        <span>LIVE SITE</span>
                        <span>↗</span>
                      </a>
                    )}

                    <motion.button
                      type="button"
                      className="project-view"
                      onClick={() => setSelectedProject(project)}
                      whileHover={{ scale: 1.04, x: 2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span>VIEW CASE</span>
                      <span>↗</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </section>

      {/* BOTTOM CTA */}
      <motion.section
        className="projects-bottom"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <span className="bottom-eyebrow">HAVE AN IDEA?</span>
          <h2>
            Let's build something<em> meaningful.</em>
          </h2>
        </div>

        <Link to="/contact" className="projects-contact-button">
          <span>LET'S TALK</span>
          <strong>→</strong>
        </Link>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        className="projects-footer"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="projects-footer-brand">
          <img src="/images/logo.png" alt="Vinay Varma Logo" className="footer-logo-img" />
          <div className="projects-footer-copy">
            <span className="projects-footer-name">VINAY VARMA</span>
            <span className="projects-footer-dot">•</span>
            <span className="projects-footer-sub">WORKS &amp; CASE STUDIES • © 2026</span>
          </div>
        </div>

        <div className="projects-footer-links" aria-label="Social profiles">
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

      {/* =====================================================
          CASE STUDY MODAL (Framer Motion)
      ===================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <div className="project-modal-backdrop" onClick={() => setSelectedProject(null)}>
            <motion.div
              className="project-modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Modal Header */}
              <div className="modal-header">
                <div>
                  <div className="modal-eyebrow">
                    <span>{selectedProject.category}</span>
                    <span>•</span>
                    <span>{selectedProject.year}</span>
                  </div>
                  <h2 className="modal-title">{selectedProject.title}</h2>
                  <p className="modal-subtitle">{selectedProject.subtitle}</p>
                </div>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {selectedProject.image && (
                  <div className="modal-image-preview">
                    <img src={selectedProject.image} alt={selectedProject.title} />
                  </div>
                )}

                <div className="modal-section">
                  <h3>OVERVIEW</h3>
                  <p>{selectedProject.longDescription}</p>
                </div>

                {selectedProject.features && (
                  <div className="modal-section">
                    <h3>KEY FEATURES</h3>
                    <ul className="modal-feature-list">
                      {selectedProject.features.map((feat, i) => (
                        <li key={i}>
                          <span className="feat-check">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="modal-section">
                  <h3>ROLE &amp; RESPONSIBILITIES</h3>
                  <p className="modal-role-text">{selectedProject.role}</p>
                </div>

                <div className="modal-section">
                  <h3>TECHNOLOGY STACK</h3>
                  <div className="modal-tech-pills">
                    {selectedProject.technologies.map((t) => (
                      <span key={t} className="modal-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <div className="modal-status-badge">
                  <span className="status-dot" />
                  <span>STATUS: {selectedProject.status}</span>
                </div>

                <div className="modal-actions">
                  {selectedProject.liveUrl && selectedProject.liveUrl !== "#" ? (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link-btn"
                    >
                      <span>
                        {selectedProject.liveUrl.includes("github.com")
                          ? "View Repository / Live Demo"
                          : "Open Live Website"}
                      </span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <span className="modal-link-btn is-disabled">
                      <span>Link Coming Soon</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}