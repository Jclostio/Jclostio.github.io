import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import Contact from "../components/Contact";
import ParticleDust from "../components/ParticleDust";
import Aurora from "../components/Aurora";
import SectionDivider from "../components/SectionDivider";

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Aurora />
      <ParticleDust />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <SectionDivider />
        <AboutSection />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <Contact />
      </main>
    </motion.div>
  );
};

export default HomePage;
