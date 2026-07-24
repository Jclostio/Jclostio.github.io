import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--open" : ""}`}>
      <a href="#hero" className="navbar__brand" onClick={scrollTo("hero")}>JC</a>

      <button
        className="navbar__hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className="navbar__links">
        <li>
          <Link to="/nationdle" className="navbar__nationdle" onClick={closeMenu}>
            🌍 Nationdle
          </Link>
        </li>
        <li><a href="#about" onClick={scrollTo("about")}>About</a></li>
        <li><a href="#projects" onClick={scrollTo("projects")}>Projects</a></li>
        <li><a href="#contact" onClick={scrollTo("contact")}>Contact</a></li>
        <li>
          <a href="./Resume.pdf" target="_blank" rel="noopener noreferrer" className="navbar__resume">
            Resume
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
