import { useEffect, useRef } from "react";
import "./FallingDotsBackground.css";

export default function FallingDotsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const dotCount = isMobile ? 25 : 48;

    // Create particles (pure black & white monochromatic)
    const dots = Array.from({ length: dotCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.35 + Math.random() * 0.75, // Downward velocity
      size: 1.0 + Math.random() * 1.6, // Dot diameter
      opacity: 0.15 + Math.random() * 0.45,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      pulseDir: 1,
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize, { passive: true });

    let lastTime = performance.now();

    const draw = (currentTime) => {
      // Calculate delta to keep animation smooth across different refresh rates (60Hz, 120Hz, 144Hz)
      const delta = Math.min((currentTime - lastTime) / 16.667, 2.0);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Draw each falling dot
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Move downward
        dot.y += dot.speed * delta;

        // Reset to top when off screen
        if (dot.y > height + 10) {
          dot.y = -10;
          dot.x = Math.random() * width;
        }

        // Subtle opacity pulsing
        dot.opacity += dot.pulseDir * dot.pulseSpeed * delta;
        if (dot.opacity > 0.6) {
          dot.opacity = 0.6;
          dot.pulseDir = -1;
        } else if (dot.opacity < 0.15) {
          dot.opacity = 0.15;
          dot.pulseDir = 1;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    // Pause when tab is not active to save battery & CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      } else {
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(draw);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="falling-dots-container" aria-hidden="true">
      {/* Background radial glow */}
      <div className="falling-dots-vignette" />
      {/* Subtle grid pattern */}
      <div className="falling-dots-grid" />
      {/* Canvas for downward moving dots */}
      <canvas ref={canvasRef} className="falling-dots-canvas" />
    </div>
  );
}
