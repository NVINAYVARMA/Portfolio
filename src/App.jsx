import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import IntroLoader from "./components/IntroLoader";
import FallingDotsBackground from "./components/FallingDotsBackground";
import ShaderFlow from "./components/ShaderFlow";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTopButton from "./components/ScrollToTopButton";

import { lazy, Suspense } from "react";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Resume = lazy(() => import("./pages/Resume"));
const Contact = lazy(() => import("./pages/Contact"));

import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="page-wrapper"
      >
        <Suspense fallback={<div className="page-suspense-fallback" style={{ minHeight: "80vh" }} />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure intro always plays when user reloads or enters the site
    sessionStorage.removeItem("introShown");
  }, []);

  const handleIntroComplete = () => {
    setLoading(false);
  };

  return (
    <BrowserRouter>
      {/* Universal Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Floating Scroll To Top with Progress Ring */}
      <ScrollToTopButton />

      {/* Signature WebGL Ambient Flow Waves (rbp-portfolio) */}
      <div className="ambient-flow-shader-layer" aria-hidden="true">
        <ShaderFlow
          flowSpeed={[0.06, 0.12]}
          iterations={12}
          scale={5.0}
          brightness={0.85}
          colorLow={[0.1, 0.12, 0.18]}
          colorHigh={[0.35, 0.32, 0.28]}
          bgColor={[0.035, 0.035, 0.04]}
        />
      </div>

      {/* Falling Cosmic Particles */}
      <FallingDotsBackground />

      {/* Intro */}
      {loading && (
        <IntroLoader onComplete={handleIntroComplete} />
      )}

      {/* Main application */}
      <div className="app-root">
        {/* Navigation */}
        <Navbar />

        {/* Pages with smooth transitions */}
        <main className="portfolio">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;