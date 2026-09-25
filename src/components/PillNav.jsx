import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './PillNav.css';

const PillNav = ({
  logo = '/images/logo.png',
  logoAlt = 'Vinay Varma Logo',
  items = [],
  activeHref = '/',
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#ffffff',
  pillColor = 'rgba(255, 255, 255, 0.06)',
  hoveredPillTextColor = '#000000',
  pillTextColor = '#f4f4f5',
  onReplayIntro,
  initialLoadAnimation = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);

  // Setup bubble hover layout
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (w === 0 || h === 0) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, y: -6 });
    }

    if (initialLoadAnimation) {
      const navItems = navItemsRef.current;
      if (navItems) {
        gsap.fromTo(
          navItems,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.5, ease }
        );
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.25, ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.25, ease });
    }

    if (menu) {
      gsap.to(menu, {
        opacity: 0,
        y: -6,
        duration: 0.2,
        ease,
        onComplete: () => {
          gsap.set(menu, { visibility: 'hidden' });
        }
      });
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.25, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.25, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.25, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.25, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.25, ease }
        );
      } else {
        closeMobileMenu();
      }
    }
  };

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    const handleClickOutside = (e) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        closeMobileMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close on route change
  useEffect(() => {
    closeMobileMenu();
  }, [activeHref]);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: pillTextColor
  };

  return (
    <header className="pill-nav-container">
      <div className={`pill-nav-inner ${className}`} style={cssVars}>
        {/* BRAND IDENTITY (LEFT) */}
        <Link to="/" className="nav-brand" title="V2-Portfolio — Vinay Varma" onClick={closeMobileMenu}>
          <div className="nav-brand-logo-wrap">
            <img src={logo} alt={logoAlt} className="nav-brand-img" />
          </div>
          <div className="nav-brand-text">
            <span className="nav-brand-name">V2-PORTFOLIO</span>
            <span className="nav-brand-sub">VINAY VARMA</span>
          </div>
        </Link>

        {/* DESKTOP CENTER NAVIGATION PILL */}
        <nav className="pill-nav-items desktop-only" ref={navItemsRef} aria-label="Main Navigation">
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href || `item-${i}`} role="none">
                <Link
                  role="menuitem"
                  to={item.href}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={el => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ACTION BUTTONS (RIGHT) */}
        <div className="nav-actions">
          {onReplayIntro && (
            <button
              type="button"
              className="nav-replay-btn"
              onClick={onReplayIntro}
              aria-label="Replay intro animation"
              title="Replay intro animation"
            >
              <span className="nav-replay-icon">↻</span>
              <span className="nav-replay-text">REPLAY INTRO</span>
            </button>
          )}

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            className="mobile-menu-button mobile-only"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            ref={hamburgerRef}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN POPOVER */}
      <div
        className="mobile-menu-popover mobile-only"
        ref={mobileMenuRef}
        style={cssVars}
        role="dialog"
        aria-label="Mobile Navigation Menu"
      >
        <ul className="mobile-menu-list">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default PillNav;
