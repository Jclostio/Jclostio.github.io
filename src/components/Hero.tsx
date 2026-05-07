import "./Hero.css";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <motion.p
            className="hero__greeting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Hi, I'm
          </motion.p>
          <motion.h1
            className="hero__name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Jacob Clostio
          </motion.h1>
          <motion.p
            className="hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Full-Stack Developer
          </motion.p>
          <motion.p
            className="hero__bio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Building modern software for P&C policy administration.
            <br />
            Computer Science graduate from Montana State University.
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a href="#projects" className="btn btn--primary">View Projects</a>
            <a href="#contact" className="btn btn--secondary">Get in Touch</a>
          </motion.div>
        </div>

        <motion.div
          className="hero__photo-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="hero__photo-ring">
            <img
              src="./pictures/Me.jpg"
              alt="Jacob Clostio"
              className="hero__photo"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
