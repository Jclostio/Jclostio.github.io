import "./Projects.css";
import FadeIn from "react-fade-in/lib/FadeIn";

const Projects = () => {
  return (
    <>
      <FadeIn>
        <div className="projects-container">
          <h1>My Projects</h1>
          <div className="project">
            <h2>Project 1: Neural Network With Back Propagation</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              tincidunt vitae mi ac bibendum.
            </p>
          </div>
          <div className="project">
            <h2>Project 2: Rocket League Stats</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              tincidunt vitae mi ac bibendum.
            </p>
          </div>
          <div className="project">
            <h2>Project 3: Wordle Solver</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              tincidunt vitae mi ac bibendum.
            </p>
          </div>
        </div>
      </FadeIn>
    </>
  );
};

export default Projects;
