import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import "./Contact.css";

export default function Contact() {
  const form = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [copyToast, setCopyToast] = useState("");

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopyToast(""), 2200);
  };

  /* =========================================================
     HANDLE INPUT
  ========================================================= */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    if (error) {
      setError("");
    }
  };

  /* =========================================================
     SEND MESSAGE VIA EMAILJS
  ========================================================= */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sending) return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    setSending(true);
    setError("");

    try {
      await emailjs.sendForm(
        "service_t9ojm8o",
        "template_yifext7",
        form.current,
        {
          publicKey: "0hnPUEBTxyHImW2zg",
        }
      );

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        message: "",
        subject: "",
      });
    } catch (err) {
      console.error("EMAILJS FAILED:", err);
      setError(
        err?.text ||
          "Message could not be sent. Please email directly at nvssvinayvarma@gmail.com"
      );
    } finally {
      setSending(false);
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const sendAnotherMessage = () => {
    setSubmitted(false);
    setError("");
  };

  const currentTime = new Date().toLocaleString();

  return (
    <main className="contact-page">
      {/* Toast Notification */}
      <AnimatePresence>
        {copyToast && (
          <motion.div
            className="contact-copy-toast"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ duration: 0.25 }}
          >
            <span>✓</span>
            <span>{copyToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}
      <div className="contact-container">
        {/* TOP BAR */}
        <motion.div
          className="contact-topbar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="contact-page-number">PORTFOLIO / 04</div>
          <button type="button" className="contact-back" onClick={goBack}>
            <span className="back-arrow">←</span>
            <span>BACK</span>
          </button>
        </motion.div>

        {/* MAIN TWO-COLUMN ROW */}
        <div className="contact-main-row">
          {/* LEFT COLUMN: HERO & CONTACT INFO */}
          <motion.div
            className="contact-left-col"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <section className="contact-heading-section">
              <div className="contact-heading">
                <span className="heading-word heading-word-one">Let's</span>
                <strong className="heading-word heading-word-two">
                  connect
                </strong>
              </div>

              <div className="contact-heading-side">
                <span className="contact-eyebrow">
                  GREAT IDEAS START WITH A CONVERSATION.
                </span>
                <p>
                  I'm always open to new internships, full-time opportunities,
                  freelance collaborations, or just a friendly chat.
                </p>
                <span className="contact-heading-tag">
                  BASED IN HYDERABAD • OPEN WORLDWIDE
                </span>
              </div>
            </section>

            {/* CONTACT INFO CARDS */}
            <div className="info-card">
              {/* EMAIL */}
              <motion.div
                className="info-item"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="info-icon" aria-hidden="true">
                  ✉
                </span>
                <div className="info-item-text">
                  <span className="info-label">EMAIL ADDRESS</span>
                  <div className="info-item-row">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=nvssvinayvarma@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-value info-email"
                      title="Open Gmail compose in new tab"
                    >
                      nvssvinayvarma@gmail.com
                    </a>
                    <button
                      type="button"
                      className="contact-copy-inline-btn"
                      onClick={() =>
                        copyToClipboard("nvssvinayvarma@gmail.com", "Email")
                      }
                      title="Copy email address"
                    >
                      ⎘
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* PHONE */}
              <motion.div
                className="info-item"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="info-icon" aria-hidden="true">
                  ☎
                </span>
                <div className="info-item-text">
                  <span className="info-label">PHONE NUMBER</span>
                  <div className="info-item-row">
                    <a href="tel:+919014286908" className="info-value">
                      +91 90142 86908
                    </a>
                    <button
                      type="button"
                      className="contact-copy-inline-btn"
                      onClick={() =>
                        copyToClipboard("+91 90142 86908", "Phone number")
                      }
                      title="Copy phone number"
                    >
                      ⎘
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* LOCATION */}
              <motion.div
                className="info-item"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="info-icon" aria-hidden="true">
                  ⚲
                </span>
                <div className="info-item-text">
                  <span className="info-label">LOCATION</span>
                  <span className="info-value">Hyderabad, Telangana, India</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: INTERACTIVE FORM CARD */}
          <motion.section
            className="contact-form-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="form-card-header">
              <div className="form-heading-group">
                <span className="form-number">01</span>
                <span className="form-title">SEND A DIRECT MESSAGE</span>
              </div>

              <span className="form-status">
                <span className="form-status-dot" />
                ACTIVE &amp; RESPONSIVE
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  ref={form}
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="name">YOUR NAME *</label>
                      <div className="input-wrapper">
                        <input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Vinay Varma"
                          value={formData.name}
                          onChange={handleChange}
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">YOUR EMAIL *</label>
                      <div className="input-wrapper">
                        <input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="subject">SUBJECT</label>
                    <div className="input-wrapper">
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        placeholder="Project discussion / Opportunity"
                        value={formData.subject}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="message">MESSAGE *</label>
                    <div className="input-wrapper textarea-wrapper">
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project, timeline, or just say hello..."
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        required
                      />
                    </div>
                  </div>

                  <input
                    type="hidden"
                    name="time"
                    value={currentTime}
                    readOnly
                  />

                  {/* ERROR BANNER */}
                  {error && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="send-area">
                    <motion.button
                      type="submit"
                      className="send-button"
                      disabled={sending}
                      whileHover={{ scale: sending ? 1 : 1.02 }}
                      whileTap={{ scale: sending ? 1 : 0.98 }}
                    >
                      <span>
                        {sending ? "TRANSMITTING MESSAGE..." : "SEND MESSAGE"}
                      </span>
                      <span className="send-button-arrow">
                        {sending ? "↻" : "→"}
                      </span>
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                /* SUCCESS STATE */
                <motion.div
                  key="success"
                  className="contact-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="success-circle">✓</div>
                  <span className="success-small">MESSAGE TRANSMITTED</span>
                  <h3>Thank you for reaching out!</h3>
                  <p>
                    Your message has been received. I'll review it and get back
                    to you within 24 hours.
                  </p>
                  <motion.button
                    type="button"
                    className="success-again"
                    onClick={sendAnotherMessage}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    SEND ANOTHER MESSAGE
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* FOOTER */}
        <motion.footer
          className="contact-footer"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <button type="button" className="contact-back" onClick={goBack}>
            <span>←</span>
            <span>BACK TO PREVIOUS PAGE</span>
          </button>

          <div className="footer-right">
            <div className="social-card">
              <span className="social-label">SOCIALS:</span>
              <div className="social-links">
                <a
                  href="https://linkedin.com/in/nvssvinayvarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                  title="LinkedIn — Vinay Varma (opens in new tab)"
                  aria-label="LinkedIn Profile: Vinay Varma"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span>LinkedIn</span>
                  <span className="pill-arrow" aria-hidden="true">↗</span>
                </a>

                <a
                  href="https://github.com/nvinayvarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                  title="GitHub — @nvinayvarma (opens in new tab)"
                  aria-label="GitHub Profile: @nvinayvarma"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <span>GitHub</span>
                  <span className="pill-arrow" aria-hidden="true">↗</span>
                </a>

                <a
                  href="https://leetcode.com/u/nvssvinay2348/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                  title="LeetCode — @nvssvinay2348 (Rating: 1706)"
                  aria-label="LeetCode Profile: @nvssvinay2348"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.593 5.992 5.992 0 0 0 2.215-.246 5.992 5.992 0 0 0 2.062-1.077l3.864-3.714a1.376 1.376 0 0 0-.131-2.062 1.376 1.376 0 0 0-1.931.131l-3.864 3.714a3.242 3.242 0 0 1-1.115.582 3.24 3.24 0 0 1-1.198.133 3.21 3.21 0 0 1-2.607-1.944 2.977 2.977 0 0 1-.189-.55 2.986 2.986 0 0 1-.034-1.278 2.852 2.852 0 0 1 .655-1.139l3.854-4.126 5.406-5.788a1.376 1.376 0 0 0-.978-2.352z" />
                  </svg>
                  <span>LeetCode</span>
                  <span className="pill-arrow" aria-hidden="true">↗</span>
                </a>

                <a
                  href="https://www.codechef.com/users/ideal_voice_80"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                  title="CodeChef — @ideal_voice_80 (Rating: 1493)"
                  aria-label="CodeChef Profile: @ideal_voice_80"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 18l6-6-6-6" />
                    <path d="M8 6l-6 6 6 6" />
                  </svg>
                  <span>CodeChef</span>
                  <span className="pill-arrow" aria-hidden="true">↗</span>
                </a>

                <a
                  href="https://figma.com/@nvssvinayvarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                  title="Figma — @nvssvinayvarma (opens in new tab)"
                  aria-label="Figma Community Profile: @nvssvinayvarma"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
                  </svg>
                  <span>Figma</span>
                  <span className="pill-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="contact-footer-brand">
              <img src="/images/logo.png" alt="Vinay Varma Logo" className="footer-logo-img" />
              <div className="contact-footer-tag">
                VINAY VARMA • HYDERABAD, INDIA
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}