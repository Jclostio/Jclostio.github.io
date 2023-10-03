import "./About.css";

const About = () => {
  return (
    <>
      <div className="about-header">
        <h1>About Me</h1>
      </div>
      <div>
        <hr></hr>
        <section className="about-section">
          <div className="section-content">
            <figure>
              <img
                src="../pictures/citywall.jpg"
                alt="Beautiful landscape"
              ></img>
              <figcaption>A beautiful la</figcaption>
            </figure>
            <div className="text">
              <h2>Section 2 Header</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                tincidunt vitae mi ac bibendum.
              </p>
            </div>
          </div>
        </section>

        <hr></hr>

        <section className="about-section">
          <div className="section-content">
            <figure>
              <img
                src="../pictures/citywall.jpg"
                alt="Beautiful landscape"
              ></img>
              <figcaption>A beautiful la</figcaption>
            </figure>
            <div className="text">
              <h2>Section 2 Header</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                tincidunt vitae mi ac bibendum.
              </p>
            </div>
          </div>
        </section>
        <hr></hr>
      </div>
    </>
  );
};
export default About;
