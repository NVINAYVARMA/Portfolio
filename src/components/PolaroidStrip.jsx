import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./PolaroidStrip.css";

const POLAROIDS = [
  {
    id: "p1",
    title: "3rd Prize Trophy",
    sub: "36-Hr Hackathon • BVRIT",
    image: "/images/hackathon-trophy.jpg",
    rotate: -4,
  },
  {
    id: "p2",
    title: "Award Ceremony",
    sub: "Victory Stage • Feb 2026",
    image: "/images/hackathon-ceremony.jpg",
    rotate: 3.5,
  },
  {
    id: "p3",
    title: "Certificate of Honor",
    sub: "Healthcare & Biotech • C-FORCE",
    image: "/images/hackathon-certificate.jpg",
    rotate: -3,
  },
  {
    id: "p4",
    title: "TechSurge 2k26 Stage",
    sub: "Kalachakra Hackathon • BVRIT",
    image: "/images/hackathon-techsurge-stage.jpg",
    rotate: 4.5,
  },
  {
    id: "p5",
    title: "Innovation Lab Sprint",
    sub: "Mentorship & Project Review",
    image: "/images/hackathon-mentorship.jpg",
    rotate: -2.5,
  },
  {
    id: "p6",
    title: "HackIndia Swag & Medals",
    sub: "Merit Kit & BVRIT Certificates",
    image: "/images/hackathon-swag-certificates.jpg",
    rotate: 3.5,
  },
];

function PolaroidCard({ item }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 240, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 240, damping: 20, mass: 0.5 });
  const tx = useTransform(sx, (v) => `${v}px`);
  const ty = useTransform(sy, (v) => `${v}px`);

  const handlePointerMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.15;
    const dy = (e.clientY - cy) * 0.15;
    mx.set(dx);
    my.set(dy);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="polaroid-card"
      style={{
        rotate: item.rotate,
        x: tx,
        y: ty,
      }}
      whileHover={{ scale: 1.08, zIndex: 10, rotate: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="polaroid-photo-frame">
        <img
          src={item.image}
          alt={item.title}
          className="polaroid-photo"
          loading="lazy"
        />
      </div>
      <div className="polaroid-caption">
        <strong>{item.title}</strong>
        <span>{item.sub}</span>
      </div>
    </motion.div>
  );
}

export default function PolaroidStrip() {
  return (
    <div className="polaroid-strip-wrap">
      <div className="polaroid-strip-header">
        <span className="polaroid-strip-tag">GALLERY &amp; SNAPSHOTS</span>
        <span className="polaroid-strip-hint">HOVER TO EXPLORE</span>
      </div>
      <div className="polaroid-strip-track">
        {POLAROIDS.map((p) => (
          <PolaroidCard key={p.id} item={p} />
        ))}
      </div>
    </div>
  );
}
