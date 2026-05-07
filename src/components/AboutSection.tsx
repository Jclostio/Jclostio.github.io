import "./AboutSection.css";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import TiltCard from "./TiltCard";
import ScrambleText from "./ScrambleText";

const skills = [
  "TypeScript", "React", "Node.js", "Python", "SQL",
  "REST APIs", "C#", ".NET", "Java", "Git", "Machine Learning",
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="section" ref={ref}>
      <motion.div
        className="section__header"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="section__label">About</span>
        <h2 className="section__title"><ScrambleText text="A bit about me" /></h2>
      </motion.div>

      <div className="about__grid">
        <TiltCard>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p>
              I graduated from Montana State University with a B.S. in Computer Science
              and a minor in Mathematics. After college I joined a startup building agency
              management systems for insurance companies, and I'm currently a full-stack
              developer at WaterStreet Company focused on P&C policy administration software.
            </p>
          </motion.div>
        </TiltCard>

        <TiltCard>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="about__skills-title">Skills &amp; Technologies</h3>
            <div className="about__skills">
              {skills.map((s) => (
                <span key={s} className="skill-chip">{s}</span>
              ))}
            </div>
          </motion.div>
        </TiltCard>
      </div>
    </section>
  );
};

export default AboutSection;
