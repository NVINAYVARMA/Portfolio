import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import Matter from "matter-js";
import { TECH_ICONS } from "./TechIcons";
import "./StackPhysics.css";

const CHIPS = [
  { label: "React", slug: "react", bg: "#142533", fg: "#61DAFB" },
  { label: "Three.js", slug: "threejs", bg: "#1e1e24", fg: "#ffffff" },
  { label: "Python", slug: "python", bg: "#1e2a38", fg: "#FFD43B" },
  { label: "FastAPI", slug: "fastapi", bg: "#0d2b27", fg: "#2dd4bf" },
  { label: "WebGL", slug: "webgl", bg: "#2a1515", fg: "#f87171" },
  { label: "Tailwind CSS", slug: "tailwindcss", bg: "#0f2b38", fg: "#38BDF8" },
  { label: "Deep Learning", slug: "pytorch", bg: "#2b1810", fg: "#fb923c" },
  { label: "JavaScript", slug: "javascript", bg: "#2b2915", fg: "#F7DF1E" },
  { label: "Figma", slug: "figma", bg: "#1f1f1f", fg: "#ffffff" },
  { label: "GitHub", slug: "github", bg: "#181717", fg: "#ffffff" },
  { label: "C / C++", slug: "cplusplus", bg: "#0c2033", fg: "#60a5fa" },
  { label: "Node.js", slug: "nodejs", bg: "#162817", fg: "#4ade80" },
  { label: "Firebase", slug: "firebase", bg: "#2c2010", fg: "#facc15" },
  { label: "Git", slug: "git", bg: "#281512", fg: "#f87171" },
  { label: "HTML5 / CSS3", slug: "html5", bg: "#1c2230", fg: "#38bdf8" },
];

const CHIP_RADIUS = 9;
const WALL_PAD = 10;

function ChipPill({ chip }) {
  const iconData = TECH_ICONS[chip.slug];

  return (
    <div
      className="physics-chip-pill"
      style={{
        backgroundColor: chip.bg,
        color: chip.fg,
        borderRadius: `${CHIP_RADIUS}px`,
      }}
    >
      <span className="physics-chip-icon" aria-hidden="true">
        {iconData ? iconData.svg : null}
      </span>
      <span className="physics-chip-label">{chip.label}</span>
    </div>
  );
}

export default function StackPhysics() {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const chipRefs = useRef([]);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    let cancelled = false;
    let cleanup;

    const {
      Engine,
      Runner,
      World,
      Bodies,
      Body,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    const measureChildren = Array.from(measure.children);
    const dims = measureChildren.map((el) => {
      const r = el.getBoundingClientRect();
      return { w: Math.max(76, r.width), h: Math.max(28, r.height) };
    });

    let width = container.clientWidth;
    let height = container.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 0.95;
    const world = engine.world;

    const wallThickness = 300;
    const floor = Bodies.rectangle(
      width / 2,
      height - WALL_PAD + wallThickness / 2,
      width * 3,
      wallThickness,
      { isStatic: true }
    );
    const leftWall = Bodies.rectangle(
      WALL_PAD - wallThickness / 2,
      height / 2,
      wallThickness,
      height * 4,
      { isStatic: true }
    );
    const rightWall = Bodies.rectangle(
      width - WALL_PAD + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 4,
      { isStatic: true }
    );
    World.add(world, [floor, leftWall, rightWall]);

    const states = CHIPS.map((chip, i) => {
      const dim = dims[i] || { w: 120, h: 36 };
      const { w, h } = dim;
      const halfW = w / 2;
      const minX = WALL_PAD + halfW + 6;
      const maxX = Math.max(minX + 10, width - WALL_PAD - halfW - 6);
      const x = minX + Math.random() * (maxX - minX);
      const y = -60 - i * 50 - Math.random() * 80;
      const body = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: CHIP_RADIUS },
        restitution: 0.35,
        friction: 0.45,
        frictionAir: 0.02,
        density: 0.0018,
        angle: (Math.random() - 0.5) * 0.4,
      });
      World.add(world, body);
      return { chip, body, width: w, height: h };
    });

    const mouse = Mouse.create(container);

    // Disable passive scroll hijack
    const wheelTarget = mouse.element;
    if (wheelTarget?.removeEventListener) {
      wheelTarget.removeEventListener("wheel", mouse.mousewheel);
      wheelTarget.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    }

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.25,
        damping: 0.2,
        render: { visible: false },
      },
    });
    World.add(world, mouseConstraint);

    Events.on(mouseConstraint, "startdrag", () => {
      container.style.cursor = "grabbing";
    });
    Events.on(mouseConstraint, "enddrag", () => {
      container.style.cursor = "grab";
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    let raf = 0;
    const tick = () => {
      for (let i = 0; i < states.length; i++) {
        const s = states[i];
        const el = chipRefs.current[i];
        if (!s || !el) continue;
        const { x, y } = s.body.position;
        el.style.transform = `translate3d(${x - s.width / 2}px, ${y - s.height / 2}px, 0) rotate(${s.body.angle}rad)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === width && newH === height) return;
      Body.setPosition(floor, {
        x: newW / 2,
        y: newH - WALL_PAD + wallThickness / 2,
      });
      Body.setPosition(leftWall, {
        x: WALL_PAD - wallThickness / 2,
        y: newH / 2,
      });
      Body.setPosition(rightWall, {
        x: newW - WALL_PAD + wallThickness / 2,
        y: newH / 2,
      });
      width = newW;
      height = newH;
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    cleanup = () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
    };

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [resetKey]);

  return (
    <div className="physics-stack-card card">
      <div className="physics-stack-header">
        <div>
          <span className="physics-stack-tag">INTERACTIVE SANDBOX</span>
          <h3 className="physics-stack-title">Core Technologies &amp; Stack</h3>
        </div>

        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          aria-label="Drop chips again"
          className="physics-stack-reset"
          title="Reset physics chips"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
          <span>Reset</span>
        </button>
      </div>

      <div className="physics-stack-stage">
        {/* Offscreen element to measure chip dimensions */}
        <div
          ref={measureRef}
          aria-hidden="true"
          className="physics-measure-stage"
        >
          {CHIPS.map((chip) => (
            <ChipPill key={`measure-${chip.label}`} chip={chip} />
          ))}
        </div>

        {/* Live Canvas Stage */}
        <div
          ref={containerRef}
          className="physics-interactive-stage"
        >
          {CHIPS.map((chip, i) => (
            <div
              key={`${resetKey}-${chip.label}`}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              className="physics-chip-body"
              style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
            >
              <ChipPill chip={chip} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
