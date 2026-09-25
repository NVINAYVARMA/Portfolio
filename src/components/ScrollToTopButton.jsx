import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import "./ScrollToTopButton.css";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const shouldShow = latest > 320;
      setVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Scroll back to top"
          title="Scroll to top"
        >
          {/* Hardware-accelerated SVG Progress Ring */}
          <svg className="scroll-progress-ring" width="40" height="40" viewBox="0 0 40 40">
            <circle
              className="scroll-progress-bg"
              cx="20"
              cy="20"
              r="16"
              strokeWidth="2"
            />
            <motion.circle
              className="scroll-progress-indicator"
              cx="20"
              cy="20"
              r="16"
              strokeWidth="2"
              style={{
                pathLength: scrollYProgress,
              }}
            />
          </svg>

          {/* Up Arrow Icon */}
          <span className="scroll-arrow-icon" aria-hidden="true">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
