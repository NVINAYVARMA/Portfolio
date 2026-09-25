export const TECH_ICONS = {
  react: {
    name: "React",
    color: "#61DAFB",
    bg: "rgba(97, 218, 251, 0.12)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
      </svg>
    ),
  },
  threejs: {
    name: "Three.js",
    color: "#ffffff",
    bg: "rgba(255, 255, 255, 0.12)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 20h20L12 2z" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 2v18" stroke="#ffffff" strokeWidth="1.4" />
        <path d="M7 11l10 9" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M17 11L7 20" stroke="#ffffff" strokeWidth="1.2" />
      </svg>
    ),
  },
  python: {
    name: "Python",
    color: "#FFD43B",
    bg: "rgba(255, 212, 59, 0.12)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2c-5.2 0-4.9 2.2-4.9 2.2l.01 2.3h5V7.2H5.1S2 6.8 2 12c0 5.2 2.8 5.1 2.8 5.1h1.7v-2.4s-.1-2.8 2.8-2.8h4.9s2.7.05 2.7-2.6V4.6S17.2 2 11.9 2zm-2.7 1.5c.5 0 .9.4.9.9 0 .5-.4.9-.9.9s-.9-.4-.9-.9c0-.5.4-.9.9-.9z" fill="#387EB8" />
        <path d="M12.1 22c5.2 0 4.9-2.2 4.9-2.2l-.01-2.3h-5v-.7h6.9s3.1.35 3.1-4.8c0-5.2-2.8-5.1-2.8-5.1h-1.7v2.4s.1 2.8-2.8 2.8h-4.9s-2.7-.05-2.7 2.6v4.7s-.3 2.6 5 2.6zm2.7-1.5c-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9s.9.4.9.9c0 .5-.4.9-.9.9z" fill="#FFE873" />
      </svg>
    ),
  },
  fastapi: {
    name: "FastAPI",
    color: "#009688",
    bg: "rgba(0, 150, 136, 0.14)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#009688" />
        <path d="M13 3L6 13h5l-1 8 8-11h-5l1-7z" fill="#ffffff" />
      </svg>
    ),
  },
  webgl: {
    name: "WebGL",
    color: "#990000",
    bg: "rgba(153, 0, 0, 0.15)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" stroke="#EE2A24" strokeWidth="1.6" fill="rgba(238, 42, 36, 0.15)" />
        <path d="M7 9l5 3 5-3M12 12v7" stroke="#ffffff" strokeWidth="1.4" />
      </svg>
    ),
  },
  tailwindcss: {
    name: "Tailwind CSS",
    color: "#38BDF8",
    bg: "rgba(56, 189, 248, 0.12)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 12c1.3-2.7 3.3-3.7 6-3 1.8.5 3 1.7 4.2 3 1.8 1.8 3.8 2.7 6.8 2 1.3-.3 2.3-.9 3-1.8-1.3 2.7-3.3 3.7-6 3-1.8-.5-3-1.7-4.2-3-1.8-1.8-3.8-2.7-6.8-2-1.3.3-2.3.9-3 1.8zm-6 6c1.3-2.7 3.3-3.7 6-3 1.8.5 3 1.7 4.2 3 1.8 1.8 3.8 2.7 6.8 2 1.3-.3 2.3-.9 3-1.8-1.3 2.7-3.3 3.7-6 3-1.8-.5-3-1.7-4.2-3-1.8-1.8-3.8-2.7-6.8-2-1.3.3-2.3.9-3 1.8z" fill="#38BDF8" />
      </svg>
    ),
  },
  pytorch: {
    name: "PyTorch / DL",
    color: "#EE4C2C",
    bg: "rgba(238, 76, 44, 0.14)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M13.5 2.5a.7.7 0 00-.9.2l-1.3 2.2a9 9 0 106.6 3.8l-1.7.9A7 7 0 1111 6.5l.9-1.5a.7.7 0 00-.2-.9l-.2-.1z" fill="#EE4C2C" />
        <circle cx="16.5" cy="5.5" r="1.5" fill="#EE4C2C" />
      </svg>
    ),
  },
  javascript: {
    name: "JavaScript",
    color: "#F7DF1E",
    bg: "rgba(247, 223, 30, 0.12)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M7 17.5c.6.9 1.4 1.4 2.6 1.4 1.4 0 2.2-.7 2.2-2.3v-6.3h-2v6.2c0 .7-.3 1-1 1-.4 0-.8-.2-1-.6l-.8.6zm7.2-.1c.7 1.1 1.9 1.6 3.4 1.6 2 0 3.3-1 3.3-2.6 0-1.5-.9-2.2-2.6-2.9l-.6-.3c-1.1-.5-1.5-.8-1.5-1.4 0-.6.5-1 1.4-1 .8 0 1.4.3 1.8.9l1.4-.9c-.7-1.1-1.8-1.6-3.2-1.6-2.1 0-3.3 1.1-3.3 2.6 0 1.5 1 2.2 2.6 2.8l.6.3c1.1.5 1.6.9 1.6 1.5 0 .7-.6 1.1-1.6 1.1-1.1 0-1.8-.5-2.2-1.3l-1.2.9z" fill="#000000" />
      </svg>
    ),
  },
  figma: {
    name: "Figma",
    color: "#ffffff",
    bg: "rgba(255, 255, 255, 0.1)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83" />
        <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF" />
        <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="#F24E1E" />
        <path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="#FF7262" />
        <circle cx="16" cy="12" r="4" fill="#1ABCFE" />
      </svg>
    ),
  },
  github: {
    name: "GitHub",
    color: "#ffffff",
    bg: "rgba(255, 255, 255, 0.1)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#ffffff" />
      </svg>
    ),
  },
  cplusplus: {
    name: "C / C++",
    color: "#00599C",
    bg: "rgba(0, 89, 156, 0.15)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l8.5 5v10L12 22 3.5 17V7L12 2z" fill="#00599C" />
        <path d="M10.5 8.5h-1a3.5 3.5 0 000 7h1m4-4.5v2m-1-1h2m3-1v2m-1-1h2" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  nodejs: {
    name: "Node.js",
    color: "#5FA04E",
    bg: "rgba(95, 160, 78, 0.14)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l8.5 5v10L12 22 3.5 17V7L12 2z" stroke="#5FA04E" strokeWidth="1.6" fill="rgba(95, 160, 78, 0.15)" />
        <path d="M9 16V8l6 8V8" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  firebase: {
    name: "Firebase",
    color: "#FFCA28",
    bg: "rgba(255, 202, 40, 0.14)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4.5 18.5L6.8 3.8a.5.5 0 01.9-.2l3.4 6.3L4.5 18.5z" fill="#FFA000" />
        <path d="M4.5 18.5L12 22.5l7.5-4L14.7 4.2a.5.5 0 00-.9-.1L4.5 18.5z" fill="#FFCA28" />
        <path d="M12 15.2l-2.4-4.5-5.1 7.8 7.5 4 7.5-4-7.5-3.3z" fill="#F57C00" />
      </svg>
    ),
  },
  html5: {
    name: "HTML5",
    color: "#E34F26",
    bg: "rgba(227, 79, 38, 0.14)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 2l1.6 18.2L12 22.5l7.4-2.3L21 2H3z" fill="#E34F26" />
        <path d="M12 3.8v16.9l5.9-1.8L19.3 3.8H12z" fill="#EF652A" />
        <path d="M12 7.5H7.7l.3 3.2h4V7.5zm0 5.4h-2.1l-.2-1.9H7.6l.4 4.1h4v-2.2z" fill="#EBEBEB" />
        <path d="M12 7.5h4.3l-.4 4.3h-3.9v2.1h2.2l-.2 2.3-2 .6v2.3l4.1-1.2.6-6.1.1-1.1.1-1.2H12V7.5z" fill="#ffffff" />
      </svg>
    ),
  },
  css3: {
    name: "CSS3",
    color: "#1572B6",
    bg: "rgba(21, 114, 182, 0.14)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 2l1.6 18.2L12 22.5l7.4-2.3L21 2H3z" fill="#1572B6" />
        <path d="M12 3.8v16.9l5.9-1.8L19.3 3.8H12z" fill="#33A9DC" />
        <path d="M12 7.5H7.7l.3 3.2h4V7.5zm0 5.4h-2.1l-.2-1.9H7.6l.4 4.1h4v-2.2z" fill="#EBEBEB" />
        <path d="M12 7.5h4.3l-.4 4.3h-3.9v2.1h2.2l-.2 2.3-2 .6v2.3l4.1-1.2.6-6.1.1-1.1.1-1.2H12V7.5z" fill="#ffffff" />
      </svg>
    ),
  },
  git: {
    name: "Git",
    color: "#F05032",
    bg: "rgba(240, 80, 50, 0.14)",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21.6 10.7l-8.3-8.3a2.4 2.4 0 00-3.4 0L8.2 4.1l3.5 3.5a2.5 2.5 0 013.1 3.1l3.3 3.3a2.5 2.5 0 11-1.7 1.7L13.1 12.4v4.5a2.5 2.5 0 11-2.4 0V11a2.5 2.5 0 011.3-4.5l-3.5-3.5L2.4 9.1a2.4 2.4 0 000 3.4l8.3 8.3a2.4 2.4 0 003.4 0l7.5-7.5a2.4 2.4 0 000-3.4z" fill="#F05032" />
      </svg>
    ),
  },
};
