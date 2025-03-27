import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Projects from "./components/Projects";
import About from "./components/About";

import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
          <Footer />
        </motion.div>
      </Router>
    </>
  );
}

export default App;
