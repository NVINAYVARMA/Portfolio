import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FallingDotsBackground from "./FallingDotsBackground";
import "./IntroLoader.css";

/* =========================================================
   LUXURY TITANIUM & OBSIDIAN MONOCHROME PALETTE
   ========================================================= */

const COLORS = {
  U: "#ffffff", // Pure Platinum White
  D: "#1c1c24", // Carbon Graphite
  F: "#e4e4e7", // Brushed Titanium
  B: "#2e2e38", // Dark Slate
  R: "#a1a1aa", // Frosted Chrome
  L: "#141418", // Deep Obsidian
};

/* =========================================================
   PRECISION KINETIC SOLVE SEQUENCE
   ========================================================= */

const SCRAMBLE = ["R", "U", "F'", "L", "D'"];
const SOLVE = ["D", "L'", "F", "U'", "R'"];

/* =========================================================
   CUBE GEOMETRY CONSTANTS
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

/* =========================================================
   ROTATION HELPERS
   ========================================================= */

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
  const rotation = new THREE.Quaternion().setFromAxisAngle(
    axis,
    (data.direction * Math.PI) / 2
  );

  return cube.map((piece) => {
    if (piece[data.axis] !== data.layer) return piece;

    const newPosition = rotatePosition(
      { x: piece.x, y: piece.y, z: piece.z },
      data.axis,
      data.direction
    );
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
      <meshStandardMaterial
        color={COLORS[color]}
        roughness={0.24}
        metalness={0.03}
        toneMapped={false}
      />
    </mesh>
  );
}

/* =========================================================
   CUBIE WITH PERFECT CIRCULAR ARC ROTATION (NO CLIPPING)
   ========================================================= */

function Cubie({ piece, activeMoveRef }) {
  const groupRef = useRef(null);
  const startPos = useRef(new THREE.Vector3());

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const active = activeMoveRef.current;

    // Check if this cubie is on the currently turning layer
    if (active && piece[active.axisName] === active.layer) {
      const now = performance.now();
      const progress = Math.min((now - active.startTime) / active.duration, 1.0);

      // Buttery-smooth sinusoidal easing (zero acceleration discontinuity)
      const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      const angle = active.totalAngle * eased;

      // 1. Rotate position along a PERFECT circle around the rotation axis:
      startPos.current.set(piece.x * SPACING, piece.y * SPACING, piece.z * SPACING);
      group.position
        .copy(startPos.current)
        .applyAxisAngle(active.axisVector, angle);

      // 2. Rotate orientation around the rotation axis:
      const rotQuat = new THREE.Quaternion().setFromAxisAngle(active.axisVector, angle);
      group.quaternion.copy(rotQuat).multiply(piece.quaternion);
      return;
    }

    // Default static position when not rotating:
    group.position.set(piece.x * SPACING, piece.y * SPACING, piece.z * SPACING);
    group.quaternion.copy(piece.quaternion);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
        <meshStandardMaterial color="#0b0b0e" roughness={0.3} metalness={0.08} />
      </mesh>

      {Object.entries(piece.stickers).map(([face, color]) => (
        <Sticker key={face} face={face} color={color} />
      ))}
    </group>
  );
}

/* =========================================================
   RUBIK'S CUBE (SMOOTH PRESENTATION + FLOATING DYNAMICS)
   ========================================================= */

function RubiksCube({ cube, activeMoveRef, solving, solved }) {
  const cubeRef = useRef(null);

  useFrame((state) => {
    const group = cubeRef.current;
    if (!group) return;

    const time = state.clock.getElapsedTime();

    // Natural breathing float
    group.position.x = 0;
    group.position.z = 0;
    group.position.y = Math.sin(time * 1.2) * 0.015;

    // Iconic 3-face perspective angle: ~30° tilt with ~45° turn
    const targetRotationX = -0.52;
    const targetRotationY = 0.78;

    group.rotation.x += (targetRotationX - group.rotation.x) * 0.04;
    group.rotation.y += (targetRotationY - group.rotation.y) * 0.04;

    if (solving) {
      group.rotation.y += Math.sin(time * 2.2) * 0.0008;
    }

    if (solved) {
      group.rotation.x += (-0.62 - group.rotation.x) * 0.035;
      group.rotation.y += (0.9 - group.rotation.y) * 0.035;
    }
  });

  return (
    <group ref={cubeRef}>
      {cube.map((piece) => (
        <Cubie key={piece.id} piece={piece} activeMoveRef={activeMoveRef} />
      ))}
    </group>
  );
}

/* =========================================================
   SCENE / STUDIO LIGHTING
   ========================================================= */

function CubeScene({ cube, activeMoveRef, solving, solved }) {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[6, 8, 8]} intensity={3.8} />
      <directionalLight position={[-6, 3, 5]} intensity={1.8} />
      <directionalLight position={[-4, -3, -5]} intensity={1.2} />
      <pointLight position={[0, 4, 4]} intensity={1.5} />

      <RubiksCube
        cube={cube}
        activeMoveRef={activeMoveRef}
        solving={solving}
        solved={solved}
      />
    </>
  );
}

/* =========================================================
   CANVAS WRAPPER
   ========================================================= */

function RubiksCanvas({ cube, activeMoveRef, solving, solved }) {
  return (
    <Canvas
      className="rubiks-canvas"
      camera={{ position: [9, 8.2, 9.5], fov: 40, near: 0.1, far: 80 }}
      dpr={[1, 2]}
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

          gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          gl.setSize(width, height, false);
        };

        updateCanvasSize();

        const observer = parent ? new ResizeObserver(updateCanvasSize) : null;
        observer?.observe(parent);
        window.addEventListener("resize", updateCanvasSize);
        requestAnimationFrame(updateCanvasSize);

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
        activeMoveRef={activeMoveRef}
        solving={solving}
        solved={solved}
      />
    </Canvas>
  );
}

/* =========================================================
   TIMING CONFIGURATION
   ========================================================= */

const TURN_DURATION_MS = 180; // Fast, fluid precision turn
const TURN_PAUSE_MS = 25; // Tactile rhythm pause
const CURTAIN_DURATION_MS = 1100; // Smooth 1.1s reveal curtain

/* =========================================================
   INTRO LOADER COMPONENT
   ========================================================= */

export default function IntroLoader({ onComplete }) {
  const [cube, setCube] = useState(createScrambledCube);
  const [phase, setPhase] = useState("intro"); // intro | scrambled | solving | solved
  const [activeMove, setActiveMove] = useState(null);
  const [progress, setProgress] = useState(0);
  const [moveNumber, setMoveNumber] = useState(0);
  const [cubeVisible, setCubeVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Ref driving Three.js 60-120fps rotation without ANY React state thrashing
  const activeMoveRef = useRef(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function performMove(move, index, total) {
      if (isCancelledRef.current) return;

      const data = getMove(move);
      if (!data) return;

      setActiveMove(move);
      setMoveNumber(index + 1);

      // Set active move parameters for the Three.js useFrame loop
      activeMoveRef.current = {
        move,
        axisName: data.axis,
        axisVector: AXIS_VECTORS[data.axis],
        layer: data.layer,
        totalAngle: (data.direction * Math.PI) / 2,
        startTime: performance.now(),
        duration: TURN_DURATION_MS,
      };

      // Wait exactly TURN_DURATION_MS while Three.js animates the turn smoothly
      await wait(TURN_DURATION_MS);
      if (isCancelledRef.current) return;

      // Commit the completed move to the cube state
      activeMoveRef.current = null;
      setCube((current) => applyMove(current, move));
      setActiveMove(null);
      setProgress(Math.round(((index + 1) / total) * 100));

      await wait(TURN_PAUSE_MS);
    }

    async function runIntro() {
      // 1. Initial fade-in
      setPhase("intro");
      await wait(350);
      if (isCancelledRef.current) return;

      // 2. Cube emerges in scrambled state
      setCubeVisible(true);
      setPhase("scrambled");
      await wait(400);
      if (isCancelledRef.current) return;

      // 3. Solve sequence
      setPhase("solving");
      for (let i = 0; i < SOLVE.length; i++) {
        await performMove(SOLVE[i], i, SOLVE.length);
        if (isCancelledRef.current) return;
      }

      // 4. Solved hero moment
      setPhase("solved");
      setProgress(100);
      setMoveNumber(SOLVE.length);
      await wait(400);
      if (isCancelledRef.current) return;

      // 5. Cinematic curtain cascades smoothly over screen, displays logo, reveals site
      setClosing(true);
      await wait(CURTAIN_DURATION_MS);
      if (isCancelledRef.current) return;

      // 6. Transition complete
      onComplete?.();
    }

    runIntro();

    // Allow user to skip immediately with Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        isCancelledRef.current = true;
        onComplete?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isCancelledRef.current = true;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    isCancelledRef.current = true;
    onComplete?.();
  };

  const statusText =
    phase === "intro"
      ? "INITIALIZING SYSTEM"
      : phase === "scrambled"
      ? "CALIBRATING 3D MATRICES"
      : phase === "solving"
      ? "COMPUTING RESOLUTION"
      : "SYSTEMS OPTIMIZED [100%]";

  return (
    <div className={`intro-loader ${closing ? "intro-closing" : ""}`}>
      {/* IDENTICAL WEBSITE FALLING DOTS BACKGROUND */}
      <FallingDotsBackground />
      <div className="intro-orbit intro-orbit-one" />
      <div className="intro-orbit intro-orbit-two" />
      <div className="intro-orbit intro-orbit-three" />
      <div className="intro-noise" />

      {/* HEADER */}
      <header className="intro-header">
        <div className="intro-brand">NVV</div>
        <div className="intro-header-title">PORTFOLIO</div>
        <button
          type="button"
          className="intro-skip-btn"
          onClick={handleSkip}
          aria-label="Skip introductory animation"
        >
          Skip [Esc] ↗
        </button>
      </header>

      {/* TOP META */}
      <div className="intro-meta intro-meta-left">
        <span>01</span>
        <span>PERSONAL PORTFOLIO</span>
      </div>

      <div className="intro-meta intro-meta-right">
        <span>3D / INTERACTION</span>
        <span>RUBIK'S CUBE</span>
      </div>

      {/* CENTERED CUBE */}
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
          activeMoveRef={activeMoveRef}
          solving={phase === "solving"}
          solved={phase === "solved"}
        />
      </div>

      {/* CUBE STATUS */}
      <div className={`intro-cube-info ${cubeVisible ? "info-visible" : "info-hidden"}`}>
        <div className="intro-info-line">
          <span className="intro-info-dot" />
          <span>{statusText}</span>
        </div>

        <div className="intro-info-move">
          <span>MOVE</span>
          <strong>{activeMove || "—"}</strong>
        </div>
      </div>

      {/* SOLUTION SEQUENCE */}
      <div className={`intro-notation ${cubeVisible ? "notation-visible" : "notation-hidden"}`}>
        <span className="notation-label">SOLUTION SEQUENCE</span>

        <div className="notation-list">
          {SOLVE.map((move, index) => (
            <span
              key={`${move}-${index}`}
              className={[
                "notation-move",
                index < moveNumber ? "notation-complete" : "",
                index === moveNumber - 1 ? "notation-current" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {move}
            </span>
          ))}
        </div>
      </div>

      {/* SIDE LABELS */}
      <div className="intro-side-label intro-side-left">DESIGN / CODE / CURIOSITY</div>
      <div className="intro-side-label intro-side-right">HYDERABAD / INDIA</div>

      {/* FOOTER */}
      <footer className="intro-footer">
        <span>HYDERABAD, INDIA</span>

        <div className="intro-progress">
          <div className="intro-progress-label">
            <span>EXPERIENCE</span>
            <strong>{String(progress).padStart(3, "0")}%</strong>
          </div>

          <div className="intro-progress-track">
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>

        <span>2026</span>
      </footer>

      {/* DECORATIVE MARKS */}
      <span className="intro-dot intro-dot-one" />
      <span className="intro-dot intro-dot-two" />
      <span className="intro-dot intro-dot-three" />
      <span className="intro-cross intro-cross-one">+</span>
      <span className="intro-cross intro-cross-two">+</span>

      <div className="intro-coordinate intro-coordinate-tl">17.3850° N</div>
      <div className="intro-coordinate intro-coordinate-tr">78.4867° E</div>
      <div className="intro-coordinate intro-coordinate-bl">NVV / 001</div>
      <div className="intro-coordinate intro-coordinate-br">BUILD / CREATE</div>

      {/* FIVE-PANEL CINEMATIC CURTAIN */}
      <div className="intro-exit" aria-hidden="true">
        <div className="intro-exit-panel" />
        <div className="intro-exit-panel" />
        <div className="intro-exit-panel" />
        <div className="intro-exit-panel" />
        <div className="intro-exit-panel" />

        <div className="intro-exit-center">
          <img className="intro-exit-logo" src="/images/logo.png" alt="Vinay Varma Logo" />
          <div className="intro-exit-loader">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}