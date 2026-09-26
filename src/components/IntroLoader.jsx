import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./IntroLoader.css";

/* =========================================================
   INTRO BACKGROUND MOVING DOTS CANVAS
   (Solid black dark-theme background with falling particles)
   ========================================================= */

function IntroDots() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame = null;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const isMobile = width < 768;
    const dotCount = isMobile ? 25 : 48;

    const dots = Array.from({ length: dotCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.35 + Math.random() * 0.75,
      size: 1.0 + Math.random() * 1.6,
      opacity: 0.15 + Math.random() * 0.45,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      pulseDir: 1,
    }));

    const resize = () => {
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", resize, { passive: true });

    let lastTime = performance.now();

    const draw = (now) => {
      const delta = Math.min((now - lastTime) / 16.667, 2.0);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        d.y += d.speed * delta;
        if (d.y > height + 10) {
          d.y = -10;
          d.x = Math.random() * width;
        }

        d.opacity += d.pulseDir * d.pulseSpeed * delta;
        if (d.opacity > 0.6) {
          d.opacity = 0.6;
          d.pulseDir = -1;
        } else if (d.opacity < 0.15) {
          d.opacity = 0.15;
          d.pulseDir = 1;
        }

        ctx.fillStyle = `rgba(255,255,255,${d.opacity})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (animFrame) cancelAnimationFrame(animFrame);
      } else {
        lastTime = performance.now();
        animFrame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    animFrame = requestAnimationFrame(draw);

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="intro-dots-canvas" />;
}

/* =========================================================
   RUBIK'S CUBE COLORS (PRESERVED EXACTLY)
   ========================================================= */

const COLORS = {
  U: "#ffffff", // Top
  D: "#ffd500", // Bottom
  F: "#00a651", // Front
  B: "#0057b8", // Back
  R: "#d00000", // Right
  L: "#ff7200", // Left
};

/* =========================================================
   SCRAMBLE / SOLVE SEQUENCES (PRESERVED EXACTLY)
   ========================================================= */

const SCRAMBLE = ["R", "U", "R'", "F", "D", "L'", "U", "F'", "R", "D'", "B", "L"];
const SOLVE = ["L'", "B'", "D", "R'", "F", "U'", "L", "D'", "F'", "R", "U'", "R'"];

/* =========================================================
   CUBE SETTINGS (PRESERVED EXACTLY)
   ========================================================= */

const CUBIE_SIZE = 0.94;
const GAP = 0.045;
const SPACING = CUBIE_SIZE + GAP;
const STICKER_SIZE = 0.76;

const FACES = {
  U: { position: [0, 0.482, 0], size: [STICKER_SIZE, 0.018, STICKER_SIZE] },
  D: { position: [0, -0.482, 0], size: [STICKER_SIZE, 0.018, STICKER_SIZE] },
  F: { position: [0, 0, 0.482], size: [STICKER_SIZE, STICKER_SIZE, 0.018] },
  B: { position: [0, 0, -0.482], size: [STICKER_SIZE, STICKER_SIZE, 0.018] },
  R: { position: [0.482, 0, 0], size: [0.018, STICKER_SIZE, STICKER_SIZE] },
  L: { position: [-0.482, 0, 0], size: [0.018, STICKER_SIZE, STICKER_SIZE] },
};

const MOVE_DEFINITIONS = {
  R: { axis: "x", layer: 1, direction: -1 },
  L: { axis: "x", layer: -1, direction: 1 },
  U: { axis: "y", layer: 1, direction: 1 },
  D: { axis: "y", layer: -1, direction: -1 },
  F: { axis: "z", layer: 1, direction: -1 },
  B: { axis: "z", layer: -1, direction: 1 },
};

const AXIS_VECTORS = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

function getMove(move) {
  const face = move.replace("'", "");
  const definition = MOVE_DEFINITIONS[face];
  if (!definition) return null;

  return {
    ...definition,
    direction: move.includes("'") ? -definition.direction : definition.direction,
  };
}

function rotatePosition({ x, y, z }, axis, direction) {
  if (axis === "x") {
    return direction === 1 ? { x, y: -z, z: y } : { x, y: z, z: -y };
  }

  if (axis === "y") {
    return direction === 1 ? { x: z, y, z: -x } : { x: -z, y, z: x };
  }

  return direction === 1 ? { x: -y, y: x, z } : { x: y, y: -x, z };
}

function createSolvedCube() {
  const pieces = [];
  let id = 0;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const stickers = {};

        if (x === 1) stickers.R = "R";
        if (x === -1) stickers.L = "L";
        if (y === 1) stickers.U = "U";
        if (y === -1) stickers.D = "D";
        if (z === 1) stickers.F = "F";
        if (z === -1) stickers.B = "B";

        pieces.push({ id, x, y, z, stickers, quaternion: new THREE.Quaternion() });
        id++;
      }
    }
  }

  return pieces;
}

function applyMove(cube, move) {
  const data = getMove(move);
  if (!data) return cube;

  const axis = AXIS_VECTORS[data.axis];
  const rotation = new THREE.Quaternion().setFromAxisAngle(axis, (data.direction * Math.PI) / 2);

  return cube.map((piece) => {
    if (piece[data.axis] !== data.layer) return piece;

    const newPosition = rotatePosition({ x: piece.x, y: piece.y, z: piece.z }, data.axis, data.direction);
    const newQuaternion = rotation.clone().multiply(piece.quaternion);

    return { ...piece, ...newPosition, quaternion: newQuaternion };
  });
}

function createScrambledCube() {
  return SCRAMBLE.reduce((cube, move) => applyMove(cube, move), createSolvedCube());
}

/* =========================================================
   STICKER
   ========================================================= */

function Sticker({ face, color }) {
  const data = FACES[face];
  if (!data) return null;

  return (
    <mesh position={data.position}>
      <boxGeometry args={data.size} />
      <meshStandardMaterial color={COLORS[color]} roughness={0.28} metalness={0.02} toneMapped={false} />
    </mesh>
  );
}

/* =========================================================
   CUBIE
   ========================================================= */

function Cubie({ piece, animation }) {
  const groupRef = useRef(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    if (animation) {
      const { startPosition, endPosition, startQuaternion, endQuaternion, progress } = animation;

      // Cubic ease-in-out
      const eased =
        progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      group.position.lerpVectors(startPosition, endPosition, eased);
      group.quaternion.slerpQuaternions(startQuaternion, endQuaternion, eased);
      return;
    }

    group.position.set(piece.x * SPACING, piece.y * SPACING, piece.z * SPACING);
    group.quaternion.copy(piece.quaternion);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.08} />
      </mesh>

      {Object.entries(piece.stickers).map(([face, color]) => (
        <Sticker key={face} face={face} color={color} />
      ))}
    </group>
  );
}

/* =========================================================
   RUBIK'S CUBE (MOTION & PRESENTATION)
   ========================================================= */

function RubiksCube({ cube, activeMove, moveId, animationProgress, solving, solved }) {
  const cubeRef = useRef(null);

  const animations = useMemo(() => {
    const move = activeMove ? getMove(activeMove) : null;
    if (!move) return {};

    const axis = AXIS_VECTORS[move.axis];
    const rotation = new THREE.Quaternion().setFromAxisAngle(axis, (move.direction * Math.PI) / 2);
    const result = {};

    cube.forEach((piece) => {
      if (piece[move.axis] !== move.layer) return;

      const startPosition = new THREE.Vector3(piece.x * SPACING, piece.y * SPACING, piece.z * SPACING);
      const rotated = rotatePosition({ x: piece.x, y: piece.y, z: piece.z }, move.axis, move.direction);
      const endPosition = new THREE.Vector3(rotated.x * SPACING, rotated.y * SPACING, rotated.z * SPACING);
      const startQuaternion = piece.quaternion.clone();
      const endQuaternion = rotation.clone().multiply(startQuaternion);

      result[piece.id] = { startPosition, endPosition, startQuaternion, endQuaternion, progress: animationProgress };
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cube, activeMove, moveId, animationProgress]);

  useFrame((state) => {
    const group = cubeRef.current;
    if (!group) return;

    const time = state.clock.getElapsedTime();

    // Subtle natural floating buoyancy
    group.position.x = 0;
    group.position.z = 0;
    group.position.y = Math.sin(time * 0.95) * 0.018;

    // Architectural presentation angle
    const targetRotationX = -0.52;
    const targetRotationY = 0.78;

    group.rotation.x += (targetRotationX - group.rotation.x) * 0.04;
    group.rotation.y += (targetRotationY - group.rotation.y) * 0.04;

    if (solving) {
      group.rotation.y += Math.sin(time * 1.8) * 0.0006;
    }

    if (solved) {
      group.rotation.x += (-0.62 - group.rotation.x) * 0.03;
      group.rotation.y += (0.9 - group.rotation.y) * 0.03;
    }
  });

  return (
    <group ref={cubeRef}>
      {cube.map((piece) => (
        <Cubie key={piece.id} piece={piece} animation={animations[piece.id]} />
      ))}
    </group>
  );
}

/* =========================================================
   SCENE & STUDIO LIGHTING
   ========================================================= */

function CubeScene({ cube, activeMove, moveId, animationProgress, solving, solved }) {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 7, 8]} intensity={4.2} />
      <directionalLight position={[-5, 3, 5]} intensity={1.8} />
      <directionalLight position={[-4, 2, -5]} intensity={1.2} />
      <pointLight position={[0, 5, 4]} intensity={1.8} />

      <RubiksCube
        cube={cube}
        activeMove={activeMove}
        moveId={moveId}
        animationProgress={animationProgress}
        solving={solving}
        solved={solved}
      />
    </>
  );
}

function RubiksCanvas({ cube, activeMove, moveId, animationProgress, solving, solved }) {
  return (
    <Canvas
      className="rubiks-canvas"
      camera={{ position: [9, 8.2, 9.5], fov: 40, near: 0.1, far: 80 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera, gl }) => {
        const canvas = gl.domElement;
        const parent = canvas.parentElement;

        const updateCanvasSize = () => {
          const width = parent?.clientWidth || window.innerWidth;
          const height = parent?.clientHeight || window.innerHeight;

          camera.aspect = width / Math.max(height, 1);
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();

          gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
          gl.setSize(width, height, false);
        };

        updateCanvasSize();

        const observer = parent ? new ResizeObserver(updateCanvasSize) : null;
        observer?.observe(parent);
        window.addEventListener("resize", updateCanvasSize);

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";

        return () => {
          observer?.disconnect();
          window.removeEventListener("resize", updateCanvasSize);
        };
      }}
    >
      <CubeScene
        cube={cube}
        activeMove={activeMove}
        moveId={moveId}
        animationProgress={animationProgress}
        solving={solving}
        solved={solved}
      />
    </Canvas>
  );
}

/* =========================================================
   TIMING CONFIGURATION
   ========================================================= */

const TURN_DURATION_MS = 260;
const TURN_PAUSE_MS = 30;
// Curtains fall and glide over 3 seconds directly revealing the website with zero black-screen lag
const CURTAIN_DURATION_MS = 3200;

/* =========================================================
   INTRO LOADER COMPONENT (PROFESSIONAL LUXURY EDITORIAL UI)
   ========================================================= */

export default function IntroLoader({ onComplete }) {
  const [cube, setCube] = useState(createScrambledCube);
  const [phase, setPhase] = useState("intro"); // intro | scrambled | solving | solved
  const [activeMove, setActiveMove] = useState(null);
  const [moveId, setMoveId] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [moveNumber, setMoveNumber] = useState(0);
  const [cubeVisible, setCubeVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const skipTriggeredRef = useRef(false);

  const handleSkip = () => {
    if (skipTriggeredRef.current) return;
    skipTriggeredRef.current = true;
    onComplete?.();
  };

  // Keyboard shortcut [Escape] to skip instantly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function performMove(move, index, total) {
      if (cancelled) return;

      setActiveMove(move);
      setMoveNumber(index + 1);
      setMoveId((value) => value + 1);

      const start = performance.now();

      await new Promise((resolve) => {
        function animate(now) {
          if (cancelled) {
            resolve();
            return;
          }

          const value = Math.min((now - start) / TURN_DURATION_MS, 1);
          setAnimationProgress(value);

          if (value < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        }

        requestAnimationFrame(animate);
      });

      if (cancelled) return;

      setCube((current) => applyMove(current, move));
      setAnimationProgress(0);
      setActiveMove(null);
      setProgress(Math.round(((index + 1) / total) * 100));

      await wait(TURN_PAUSE_MS);
    }

    async function runIntro() {
      // 1. Initial fade-in
      setPhase("intro");
      await wait(350);
      if (cancelled) return;

      // 2. Cube enters
      setCubeVisible(true);
      setPhase("scrambled");
      await wait(700);
      if (cancelled) return;

      // 3. Solving sequence
      setPhase("solving");
      for (let i = 0; i < SOLVE.length; i++) {
        await performMove(SOLVE[i], i, SOLVE.length);
        if (cancelled) return;
      }

      // 4. Hero solved hold
      setPhase("solved");
      setProgress(100);
      setMoveNumber(SOLVE.length);
      await wait(600);
      if (cancelled) return;

      // 5. Cinematic curtain cascades smoothly over the stage and reveals the site
      setClosing(true);
      await wait(CURTAIN_DURATION_MS);
      if (cancelled) return;

      // 6. Complete handoff to application
      if (!skipTriggeredRef.current) {
        skipTriggeredRef.current = true;
        onComplete?.();
      }
    }

    runIntro();

    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  const statusLabel =
    phase === "intro"
      ? "INITIALIZING"
      : phase === "scrambled"
      ? "SIMULATING"
      : phase === "solving"
      ? "SOLVING ALGORITHM"
      : "OPTIMAL STATE REACHED";

  return (
    <div className={`intro-loader ${closing ? "intro-closing" : ""}`}>
      {/* SOLID DARK BACKGROUND WITH MOVING PARTICLES */}
      <div className="intro-paper" />
      <div className="intro-grid" />
      <div className="intro-vignette" />
      <IntroDots />

      {/* REFINED ARCHITECTURAL HEADER */}
      <header className="intro-header">
        <div className="intro-brand-group">
          <img src="/images/logo.png" alt="Vinay Varma" className="intro-brand-logo" />
          <div className="intro-brand-text">
            <span className="intro-brand-name">VINAY VARMA</span>
            <span className="intro-brand-sub">PORTFOLIO // 2026</span>
          </div>
        </div>

        <div className="intro-header-status">
          <span className="intro-live-dot" />
          <span className="intro-live-text">{statusLabel}</span>
        </div>

        <button
          type="button"
          className="intro-skip-btn"
          onClick={handleSkip}
          aria-label="Skip introductory animation"
        >
          <span>SKIP</span>
          <span className="intro-skip-kbd">ESC</span>
          <span className="intro-skip-arrow" aria-hidden="true">&rarr;</span>
        </button>
      </header>

      {/* 3D CUBE STAGE (PRESERVED EXACT CUBE RENDERING) */}
      <div
        className={[
          "intro-cube",
          cubeVisible ? "cube-visible" : "cube-hidden",
          phase === "solved" ? "cube-solved" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <RubiksCanvas
          cube={cube}
          activeMove={activeMove}
          moveId={moveId}
          animationProgress={animationProgress}
          solving={phase === "solving"}
          solved={phase === "solved"}
        />
      </div>

      {/* PROFESSIONAL TELEMETRY & MICRO-STEPPER */}
      <div className={`intro-cube-badge ${cubeVisible ? "badge-visible" : "badge-hidden"}`}>
        <div className="intro-cube-badge-inner">
          <div className="cube-badge-header">
            <span className="cube-badge-kicker">ALGORITHM</span>
            <span className="cube-badge-title">
              {phase === "solving"
                ? `STEP ${moveNumber} OF ${SOLVE.length}`
                : phase === "solved"
                ? "SOLVED"
                : "3D SIMULATION"}
            </span>
            {activeMove && <span className="cube-badge-move">{activeMove}</span>}
          </div>

          <div className="cube-stepper" aria-hidden="true">
            {SOLVE.map((_, i) => (
              <span
                key={i}
                className={`cube-stepper-tick ${i < moveNumber ? "tick-active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* LUXURY EDITORIAL FOOTER */}
      <footer className="intro-footer">
        <div className="intro-footer-col">
          <span className="intro-footer-label">EXPERIENCE</span>
          <span className="intro-footer-val">SOFTWARE &bull; UI/UX</span>
        </div>

        <div className="intro-progress-hub">
          <div className="intro-progress-meta">
            <span className="intro-progress-status">SYSTEM INITIALIZATION</span>
            <span className="intro-progress-num">{String(progress).padStart(3, "0")}%</span>
          </div>
          <div className="intro-progress-track">
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="intro-footer-col intro-footer-right">
          <span className="intro-footer-label">LOCATION</span>
          <span className="intro-footer-val">HYDERABAD, INDIA</span>
        </div>
      </footer>

      {/* FOUR-PANEL CINEMATIC CURTAIN */}
      <div className="intro-exit" aria-hidden="true">
        <div className="intro-exit-panel" />
        <div className="intro-exit-panel" />
        <div className="intro-exit-panel" />
        <div className="intro-exit-panel" />

        <div className="intro-exit-center">
          <img className="intro-exit-logo" src="/images/logo.png" alt="Vinay Varma" />
          <div className="intro-exit-lightline">
            <div className="intro-exit-lightline-beam" />
          </div>
        </div>
      </div>
    </div>
  );
}