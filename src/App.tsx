import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Projects from "./components/Projects";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import About from "./components/About";
import "./App.css";

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in effect after a delay (e.g., 1 second)
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Clear the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      <div className={`fade-in-element ${isVisible ? "fade-in" : ""}`}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </>
  );
}

export default App;
