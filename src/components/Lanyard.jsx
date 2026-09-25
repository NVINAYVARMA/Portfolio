import React, { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

class LanyardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err, info) {
    console.warn("3D Lanyard error caught, rendering interactive fallback:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <LanyardFallbackCard
          frontImage={this.props.frontImage}
          backImage={this.props.backImage}
        />
      );
    }
    return this.props.children;
  }
}

function LanyardFallbackCard({ frontImage, backImage }) {
  const [flipped, setFlipped] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -y * 20, y: x * 20 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="lanyard-fallback-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setFlipped(!flipped)}
      title="Click to flip ID card"
    >
      <div className="lanyard-fallback-ribbon" />
      <div className="lanyard-fallback-clasp" />
      <div
        className={`lanyard-fallback-card-inner ${flipped ? "flipped" : ""}`}
        style={{
          transform: `perspective(900px) rotateX(${rotate.x}deg) rotateY(${
            rotate.y + (flipped ? 180 : 0)
          }deg)`,
        }}
      >
        <div className="lanyard-fallback-face lanyard-fallback-front">
          <img
            src={frontImage || "/images/id-card-front.png"}
            alt="Vinay Varma ID Card Front"
            className="lanyard-fallback-img"
          />
          <div className="lanyard-fallback-badge-overlay">
            <span className="lanyard-fallback-chip">RFID ✦ BVRIT</span>
          </div>
        </div>
        <div className="lanyard-fallback-face lanyard-fallback-back">
          <img
            src={backImage || "/images/id-card-back.png"}
            alt="Vinay Varma ID Card Back"
            className="lanyard-fallback-img"
          />
        </div>
      </div>
      <div className="lanyard-fallback-hint">Click card to flip ✦</div>
    </div>
  );
}

function StaticCardFallback() {
  return (
    <group position={[0, -0.12, 0]}>
      <RoundedBox args={[1.76, 2.36, 0.12]} radius={0.09} smoothness={4}>
        <meshPhysicalMaterial
          color="#16161a"
          roughness={0.25}
          metalness={0.3}
          clearcoat={1}
        />
      </RoundedBox>
      <mesh position={[0, 1.17, 0]}>
        <boxGeometry args={[0.34, 0.09, 0.16]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function Lanyard(props) {
  return (
    <LanyardErrorBoundary
      frontImage={props.frontImage}
      backImage={props.backImage}
    >
      <LanyardScene {...props} />
    </LanyardErrorBoundary>
  );
}

function LanyardScene({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  lanyardWidth = 0.9,
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.2 : 1.5]}
        gl={{
          alpha: transparent,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 5, 6]} intensity={3} />
        <directionalLight position={[-4, 2, 3]} intensity={1.5} />

        <Suspense fallback={<StaticCardFallback />}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              lanyardWidth={lanyardWidth}
            />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  lanyardWidth = 0.9,
}) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const dragOffset = useRef(new THREE.Vector3());
  const vec = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const ang = useRef(new THREE.Vector3());
  const rot = useRef(new THREE.Vector3());

  const [dragged, setDragged] = useState(false);
  const [hovered, setHovered] = useState(false);

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  // Safe texture loading inside Suspense
  const frontTexture = useTexture(frontImage || BLANK_PIXEL);
  const backTexture = useTexture(backImage || BLANK_PIXEL);

  frontTexture.colorSpace = THREE.SRGBColorSpace;
  backTexture.colorSpace = THREE.SRGBColorSpace;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);

  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.12, 0],
  ]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  useEffect(() => {
    document.body.style.cursor = hovered
      ? dragged
        ? "grabbing"
        : "grab"
      : "auto";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    try {
      if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) {
        return;
      }

      if (dragged) {
        vec.current
          .set(state.pointer.x, state.pointer.y, 0.5)
          .unproject(state.camera);

        dir.current
          .copy(vec.current)
          .sub(state.camera.position)
          .normalize();

        vec.current.add(
          dir.current.multiplyScalar(state.camera.position.length())
        );

        [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

        card.current.setNextKinematicTranslation({
          x: vec.current.x - dragOffset.current.x,
          y: vec.current.y - dragOffset.current.y,
          z: vec.current.z - dragOffset.current.z,
        });
      }

      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }

        const distance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + distance * (maxSpeed - minSpeed))
        );
      });

      curve.curveType = "chordal";

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 12 : 20));
      }

      ang.current.copy(card.current.angvel());
      rot.current.copy(card.current.rotation());

      card.current.setAngvel({
        x: ang.current.x,
        y: ang.current.y - rot.current.y * 0.25,
        z: ang.current.z,
      });
    } catch {
      // Safe fallback on physics frame interruption
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.target.setPointerCapture?.(e.pointerId);

    dragOffset.current
      .copy(e.point)
      .sub(vec.current.copy(card.current.translation()));

    setDragged(true);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.target.releasePointerCapture?.(e.pointerId);
    setDragged(false);
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.11]} />
        </RigidBody>

        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.11]} />
        </RigidBody>

        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.11]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.88, 1.18, 0.08]} />

          <group
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered(false);
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {/* Physical card base */}
            <RoundedBox
              args={[1.76, 2.36, 0.12]}
              radius={0.09}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color="#111111"
                roughness={0.28}
                metalness={0.25}
                clearcoat={1}
                clearcoatRoughness={0.16}
              />
            </RoundedBox>

            {/* Front artwork */}
            <mesh position={[0, 0, 0.066]}>
              <planeGeometry args={[1.58, 2.18]} />
              <meshBasicMaterial
                map={frontTexture}
                transparent
                toneMapped={false}
              />
            </mesh>

            {/* Back artwork */}
            <mesh
              position={[0, 0, -0.066]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[1.58, 2.18]} />
              <meshBasicMaterial
                map={backTexture}
                transparent
                toneMapped={false}
              />
            </mesh>

            {/* Metal clip */}
            <mesh position={[0, 1.17, 0]}>
              <boxGeometry args={[0.34, 0.09, 0.16]} />
              <meshStandardMaterial
                color="#bdbdbd"
                metalness={0.9}
                roughness={0.22}
              />
            </mesh>

            <mesh position={[0, 1.08, 0]}>
              <torusGeometry args={[0.13, 0.025, 12, 24]} />
              <meshStandardMaterial
                color="#a9a9a9"
                metalness={0.95}
                roughness={0.2}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* Flexible lanyard strap */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [800, 1200] : [1200, 1200]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}