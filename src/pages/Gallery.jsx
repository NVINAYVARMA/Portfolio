import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DriftWall from "../components/DriftWall";
import PolaroidStrip from "../components/PolaroidStrip";
import "./Gallery.css";

const DRIFT_GALLERY_ITEMS = [
  {
    id: "h1",
    image: "/images/hackathon-certificate.jpg",
    title: "TechSurge 2k26 Certificate of Appreciation",
    category: "HACKATHONS & AWARDS",
    date: "2026",
    description:
      "Presented to team C-FORCE in recognition of outstanding performance and innovative contributions in Healthcare & Biotech during the Kalachakra Hackathon at TechSurge 2k26, hosted by Coding Brigade, BVRIT.",
    aspect: "portrait",
  },
  {
    id: "h2",
    image: "/images/hackathon-trophy.jpg",
    title: "36-Hour Hackathon — Third Prize Trophy",
    category: "HACKATHONS & AWARDS",
    date: "Feb 2026",
    description:
      "Official 3rd Prize gold acrylic shield trophy awarded at B V Raju Institute of Technology during the intensive 36-Hour Vishnu Perimeter Trail Hackathon (9th & 10th February 2026).",
    aspect: "portrait",
  },
  {
    id: "h3",
    image: "/images/hackathon-swag-certificates.jpg",
    title: "HackIndia Swag Kit & Merit Certificates",
    category: "HACKATHONS & AWARDS",
    date: "2026",
    description:
      "Official HackIndia t-shirts, gold medals, and BVRIT department participation and appreciation certificates for breakthrough prototype development.",
    aspect: "landscape",
  },
  {
    id: "h4",
    image: "/images/hackathon-ceremony.jpg",
    title: "Vishnu Perimeter Trail Award Ceremony",
    category: "CAMPUS & EVENTS",
    date: "Feb 2026",
    description:
      "Stage felicitation and certificate handover ceremony at BVRIT campus, Tuljaraopet, celebrating team achievement and technical excellence following the 36-hour sprint.",
    aspect: "landscape",
  },
  {
    id: "h5",
    image: "/images/hackathon-mentorship.jpg",
    title: "Innovation Lab Sprint & Mentorship Review",
    category: "CAMPUS & EVENTS",
    date: "Feb 2026",
    description:
      "Live technical evaluation, architecture pitch, and code review with department heads and mentors at the BVRIT campus engineering workstation.",
    aspect: "landscape",
  },
  {
    id: "h6",
    image: "/images/hackathon-techsurge-stage.jpg",
    title: "TechSurge 2k26 Kalachakra Stage Honors",
    category: "HACKATHONS & AWARDS",
    date: "2026",
    description:
      "Honored on stage by dignitaries and faculty coordinators during TechSurge 2k26 for impactful software engineering and healthcare technology development.",
    aspect: "landscape",
  },
  {
    id: "h7",
    image: "/images/hackathon-techsurge-awards.jpg",
    title: "Auditorium Felicitation & Medal Presentation",
    category: "CAMPUS & EVENTS",
    date: "2026",
    description:
      "Grand stage recognition in front of academic peers, faculty, and industry guests at the BVRIT Narsapur main auditorium.",
    aspect: "landscape",
  },
];

const scrollFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const currentIndex = selectedPhoto
    ? DRIFT_GALLERY_ITEMS.findIndex((it) => it.id === selectedPhoto.id)
    : -1;

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setSelectedPhoto(DRIFT_GALLERY_ITEMS[currentIndex - 1]);
    } else {
      setSelectedPhoto(DRIFT_GALLERY_ITEMS[DRIFT_GALLERY_ITEMS.length - 1]);
    }
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (currentIndex !== -1 && currentIndex < DRIFT_GALLERY_ITEMS.length - 1) {
      setSelectedPhoto(DRIFT_GALLERY_ITEMS[currentIndex + 1]);
    } else {
      setSelectedPhoto(DRIFT_GALLERY_ITEMS[0]);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, currentIndex]);

  return (
    <main className="gallery-page">
      {/* HEADER SECTION */}
      <section className="gallery-header-section">
        <motion.div
          className="gallery-header"
          initial="hidden"
          animate="visible"
          variants={scrollFadeUp}
        >
          <div className="badge badge-status">
            <span className="status-dot" />
            <span>Hackathon Honors &amp; Campus Gallery</span>
          </div>

          <h1 className="gallery-title">Gallery</h1>
          <p className="gallery-subtitle">
            An interactive 3D parallax drifting wall capturing 36-hour hackathons, stage felicitations, award ceremonies, and innovation lab sprints at B V Raju Institute of Technology.
          </p>
        </motion.div>
      </section>

      {/* 3D DRIFT WALL SHOWCASE (CLEAN, NO TOOLBAR BUTTONS) */}
      <motion.section
        className="gallery-drift-section"
        initial="hidden"
        animate="visible"
        variants={scrollFadeUp}
      >
        <div className="gallery-drift-card">
          <div className="gallery-drift-viewport">
            <DriftWall
              items={DRIFT_GALLERY_ITEMS}
              columns={5}
              tileWidth={230}
              tileHeight={152}
              gap={20}
              radius={16}
              tilt={15}
              turn={-12}
              roll={0}
              perspective={1200}
              depth={110}
              speed={38}
              direction="up"
              variance={0.4}
              parallax={0.7}
              pauseOnHover={true}
              lift={72}
              fade={0.65}
              dim={0.7}
              grayscale={false}
              overlayColor="#09090b"
              onTileClick={(item) => setSelectedPhoto(item)}
            />
          </div>
        </div>
      </motion.section>

      {/* FEATURED INTERACTIVE POLAROID STRIP */}
      <motion.section
        className="gallery-polaroid-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={scrollFadeUp}
      >
        <PolaroidStrip />
      </motion.section>

      {/* FULLSCREEN LIGHTBOX MODAL WITH NAVIGATION */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="gallery-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="gallery-lightbox-dialog"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="gallery-lightbox-close"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Previous & Next Lightbox Nav Buttons */}
              {DRIFT_GALLERY_ITEMS.length > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-lightbox-nav prev"
                    onClick={handlePrev}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="gallery-lightbox-nav next"
                    onClick={handleNext}
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}

              <div className="gallery-lightbox-img-box">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="gallery-lightbox-img"
                />
              </div>

              <div className="gallery-lightbox-details">
                <div className="gallery-lightbox-badges">
                  <span className="badge badge-status">
                    <span className="status-dot" />
                    <span>{selectedPhoto.category}</span>
                  </span>
                  <span className="badge badge-subtle">{selectedPhoto.date}</span>
                  {currentIndex !== -1 && (
                    <span className="badge badge-subtle">
                      {currentIndex + 1} / {DRIFT_GALLERY_ITEMS.length}
                    </span>
                  )}
                </div>
                <h2 className="gallery-lightbox-title">{selectedPhoto.title}</h2>
                <p className="gallery-lightbox-desc">{selectedPhoto.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <motion.footer
        className="gallery-footer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={scrollFadeUp}
      >
        <div className="gallery-footer-brand">
          <img src="/images/logo.png" alt="Vinay Varma Logo" className="footer-logo-img" />
          <div className="gallery-footer-copy">
            <span className="footer-name">VINAY VARMA</span>
            <span className="footer-dot">•</span>
            <span className="footer-sub">© 2026 • HYDERABAD, INDIA</span>
          </div>
        </div>

        <div className="gallery-footer-links" aria-label="Social profiles">
          <a
            href="https://github.com/nvinayvarma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile: @nvinayvarma (opens in new tab)"
            title="GitHub — @nvinayvarma"
            className="footer-social-link"
          >
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
            <span>Email</span>
            <span className="footer-link-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </motion.footer>
    </main>
  );
}
