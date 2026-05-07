import "./ProjectsSection.css";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import TiltCard from "./TiltCard";
import ScrambleText from "./ScrambleText";

const projects = [
  {
    title: "Neural Network Classifier",
    description:
      "Built a neural network from scratch with backpropagation in Python. Tunable parameters include hidden layers, learning rate, and momentum. Tested on regression and classification datasets from the UCI ML Repository.",
    tags: ["Python", "Machine Learning", "NumPy"],
    link: "https://github.com/Jclostio/Projects",
  },
  {
    title: "Rocket League Stats",
    description:
      "Consumed the Octane.gg RESTful API to pull tournament player statistics. Aggregated JSON data to surface top performers across categories like saves, shots, and assists.",
    tags: ["Python", "REST API", "JSON"],
    link: "https://github.com/Jclostio/Projects",
  },
  {
    title: "Wordle Solver",
    description:
      "Algorithm that solves the NYT Wordle puzzle using a 5,000+ word dataset and process-of-elimination logic. Averages the correct answer in approximately 4 guesses.",
    tags: ["Python", "Algorithms"],
    link: "https://github.com/Jclostio/Projects",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="section" ref={ref}>
      <motion.div
        className="section__header"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="section__label">Coding</span>
        <h2 className="section__title"><ScrambleText text="Projects" /></h2>
      </motion.div>

      <div className="projects__grid">
        {projects.map((p, i) => (
          <TiltCard key={p.title}>
            <motion.a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="project-card__title">{p.title}</h3>
              <p className="project-card__desc">{p.description}</p>
              <div className="project-card__tags">
                {p.tags.map((t) => (
                  <span key={t} className="skill-chip">{t}</span>
                ))}
              </div>
              <span className="project-card__link">View on GitHub →</span>
            </motion.a>
          </TiltCard>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
