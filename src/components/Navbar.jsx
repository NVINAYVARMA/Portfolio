import { useLocation } from "react-router-dom";
import PillNav from "./PillNav";

function Navbar() {
  const location = useLocation();

  const handleReplayIntro = () => {
    sessionStorage.removeItem("introShown");
    window.location.reload();
  };

  return (
    <PillNav
      logo="/images/logo.png"
      logoAlt="Vinay Varma Logo"
      onReplayIntro={handleReplayIntro}
      items={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Gallery", href: "/gallery" },
        { label: "Resume", href: "/resume" },
        { label: "Contact", href: "/contact" },
      ]}
      activeHref={location.pathname}
      className="custom-nav"
      ease="power2.easeOut"
      baseColor="#ffffff"
      pillColor="rgba(255, 255, 255, 0.06)"
      hoveredPillTextColor="#000000"
      pillTextColor="#f4f4f5"
      initialLoadAnimation
    />
  );
}

export default Navbar;