import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './DriftWall.css';

const DEFAULT_ITEMS = [
  {
    image: '/images/promethean-first-prize.jpg',
    title: 'Promethean — 1st Prize Winner Felicitation',
    category: 'HACKATHONS & AWARDS',
    date: '2026',
    description: 'Awarded First Prize at Promethean, B V Raju Institute of Technology. Honored on stage with the official winner certificate for outstanding innovation and presentation.'
  },
  {
    image: '/images/promethean-team-pitch.jpg',
    title: 'Promethean Champions — Strategy & Pitch Arena',
    category: 'CAMPUS & EVENTS',
    date: '2026',
    description: 'The winning team assembled in the presentation arena following our First Prize victory at Promethean, BVRIT campus.'
  },
  {
    image: '/images/hackathon-certificate.jpg',
    title: 'Certificate of Appreciation • TechSurge 2k26',
    category: 'HACKATHONS & AWARDS',
    date: '2026',
    description: 'Recognized with team C-FORCE for outstanding innovation in Healthcare & Biotech at Kalachakra Hackathon, BVRIT.'
  },
  {
    image: '/images/hackathon-trophy.jpg',
    title: '36-Hour Hackathon 3rd Prize Trophy',
    category: 'HACKATHONS & AWARDS',
    date: 'Feb 2026',
    description: 'Awarded 3rd Prize at B V Raju Institute of Technology 36-Hour Vishnu Perimeter Trail Hackathon.'
  },
  {
    image: '/images/hackathon-swag-certificates.jpg',
    title: 'HackIndia Swag, Medals & BVRIT Certificates',
    category: 'HACKATHONS & AWARDS',
    date: '2026',
    description: 'Official HackIndia merchandise, medals, and team participation & appreciation certificates.'
  },
  {
    image: '/images/hackathon-ceremony.jpg',
    title: 'Award Ceremony Presentation at BVRIT',
    category: 'CAMPUS & EVENTS',
    date: 'Feb 2026',
    description: 'Stage felicitation and certificate handover ceremony at BVRIT Tuljaraopet campus.'
  },
  {
    image: '/images/hackathon-mentorship.jpg',
    title: 'Hackathon Sprint & Mentorship Session',
    category: 'CAMPUS & EVENTS',
    date: 'Feb 2026',
    description: 'Live architecture pitch and code review with department heads and mentors at the innovation lab.'
  },
  {
    image: '/images/hackathon-techsurge-stage.jpg',
    title: 'TechSurge 2k26 Kalachakra Stage Honors',
    category: 'HACKATHONS & AWARDS',
    date: '2026',
    description: 'Honored on stage by dignitaries and faculty coordinators during TechSurge 2k26.'
  },
  {
    image: '/images/hackathon-techsurge-awards.jpg',
    title: 'Auditorium Felicitation Ceremony',
    category: 'CAMPUS & EVENTS',
    date: '2026',
    description: 'Team award presentation and felicitation at BVRIT Narsapur main auditorium.'
  }
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

// Seedable pseudo-random generator
function pseudoRandom(seed) {
  let s = Math.abs(seed) % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleList(list, rng) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 220,
  tileHeight = 146,
  gap = 18,
  radius = 16,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 40,
  direction = 'up',
  variance = 0.45,
  parallax = 0.65,
  pauseOnHover = false,
  lift = 70,
  fade = 0.6,
  dim = 0.6,
  grayscale = false,
  overlayColor = '#060010',
  shuffleSeed = 1,
  className = '',
  style,
  onTileClick
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Generate randomized photo columns with high entropy
  const columnItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    const rng = pseudoRandom(shuffleSeed * 1000 + 42);
    const cols = [];

    for (let c = 0; c < columns; c++) {
      let colSeq = shuffleList(items, rng);
      // Double or expand if small to prevent obvious loop repeating
      if (colSeq.length <= 7) {
        colSeq = [...colSeq, ...shuffleList(items, rng)];
      }
      cols.push(colSeq);
    }
    return cols;
  }, [items, columns, shuffleSeed]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    const rng = pseudoRandom(shuffleSeed * 999 + 88);
    offsetsRef.current = columnMeta.map((meta) => meta.copyHeight * rng());
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems, shuffleSeed]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = ts => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id, index) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);
  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    e => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style
    }),
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  );

  const renderTile = (item, id, colIndex) => {
    const inner = (
      <span className="drift-wall__inner">
        <img src={item.image} alt={item.title ?? ''} loading="lazy" decoding="async" draggable={false} />
        <span className="drift-wall__overlay" aria-hidden="true" />
        
        {/* Floating Tile Meta Badge on Hover */}
        <span className="drift-wall__badge" aria-hidden="true">
          <span className="drift-wall__badge-tag">{item.category || 'EVENT'}</span>
          <span className="drift-wall__badge-title">{item.title}</span>
        </span>

        {/* Hover Inspect Pill */}
        <span className="drift-wall__zoom-pill" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          <span>Inspect</span>
        </span>
      </span>
    );
    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
      onClick: () => onTileClick?.(item)
    };
    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    );
  };

  const rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div className="drift-wall__track" ref={el => (trackRefs.current[c] = el)}>
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
