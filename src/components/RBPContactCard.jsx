import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Check, Copy, ArrowUpRight, Phone } from "lucide-react";
import ShaderFlow from "./ShaderFlow";
import "./RBPContactCard.css";

export default function RBPContactCard() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("nvssvinayvarma@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="rbp-contact-section">
      <div className="rbp-contact-card">
        {/* Background Embedded Shader */}
        <div className="rbp-contact-shader-wrap" aria-hidden="true">
          <ShaderFlow
            iterations={10}
            scale={4}
            brightness={1.1}
            colorLow={[0.15, 0.18, 0.26]}
            colorHigh={[0.5, 0.45, 0.42]}
            bgColor={[0.05, 0.05, 0.06]}
          />
        </div>

        {/* Card Content Grid */}
        <div className="rbp-contact-inner">
          <div className="rbp-contact-left">
            <div className="rbp-contact-badge">
              <span className="rbp-contact-dot" />
              <span>OPEN FOR WORK &amp; COLLABORATION</span>
            </div>

            <h2 className="rbp-contact-headline">
              Let&rsquo;s connect &amp; build something <em>extraordinary.</em>
            </h2>

            <p className="rbp-contact-desc">
              Whether you need full-stack engineering, interactive 3D WebGL experiences, or clinical AI integration—reach out anytime.
            </p>

            <div className="rbp-contact-actions">
              <button
                type="button"
                className="rbp-copy-email-btn"
                onClick={handleCopyEmail}
                title="Click to copy email address"
              >
                <div className="rbp-email-icon-box">
                  {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </div>
                <div className="rbp-email-text-box">
                  <span className="rbp-email-label">EMAIL ME</span>
                  <span className="rbp-email-val">nvssvinayvarma@gmail.com</span>
                </div>
                <span className="rbp-copy-badge">
                  {copied ? "COPIED!" : <Copy className="w-3.5 h-3.5" />}
                </span>
              </button>

              <Link to="/contact" className="rbp-send-message-btn">
                <span>Direct Contact Form</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="rbp-contact-right">
            <div className="rbp-contact-channel-card">
              <div className="channel-icon">
                <Phone className="w-4 h-4" />
              </div>
              <div className="channel-info">
                <span className="channel-title">Direct Line</span>
                <a href="tel:+919014286908" className="channel-val">
                  +91 90142 86908
                </a>
              </div>
              <span className="channel-action">CALL ↗</span>
            </div>

            <div className="rbp-contact-channel-card">
              <div className="channel-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-title">LinkedIn</span>
                <a
                  href="https://linkedin.com/in/nvssvinayvarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-val"
                >
                  in/nvssvinayvarma
                </a>
              </div>
              <span className="channel-action">CONNECT ↗</span>
            </div>

            <div className="rbp-contact-channel-card">
              <div className="channel-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-title">GitHub</span>
                <a
                  href="https://github.com/nvinayvarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-val"
                >
                  @nvinayvarma
                </a>
              </div>
              <span className="channel-action">FOLLOW ↗</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
