import "./Contact.css";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ScrambleText from "./ScrambleText";

const Contact = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="section contact-section" ref={ref}>
      <motion.div
        className="section__header"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="section__label">Contact</span>
        <h2 className="section__title"><ScrambleText text="Get in touch" /></h2>
      </motion.div>

      <motion.div
        className="glass-card contact-card"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="contact-tagline">
          Connect with me using the links below or send me an email!
        </p>
        <div className="contact-links">
          <a href="mailto:jacobclostio@gmail.com" className="contact-link">
            <span className="contact-link__label">Email</span>
            <span className="contact-link__value">jacobclostio@gmail.com</span>
          </a>
          <a
            href="https://www.linkedin.com/in/jacob-clostio-aa8064195/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="contact-link__label">LinkedIn</span>
            <span className="contact-link__value">jacob clostio</span>
          </a>
          <a
            href="https://github.com/Jclostio"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="contact-link__label">GitHub</span>
            <span className="contact-link__value">Jclostio</span>
          </a>
        </div>
      </motion.div>

      <footer className="site-footer">
        <p>© 2026 Jacob Clostio</p>
      </footer>
    </section>
  );
};

export default Contact;
