import "./About.css";
import FadeIn from "react-fade-in/lib/FadeIn";

const About = () => {
  return (
    <>
      <FadeIn>
        <div className="about-header">
          <h1>About Me</h1>
        </div>
        <hr />
        <section className="about-section">
          <div className="section-content">
            <div className="image-container">
              <img
                src="../pictures/SkiingPic.jpg"
                alt="Skiing with family"
              ></img>
            </div>
            <div className="image-container">
              <img src="../pictures/BigMountain.jpg" alt="Big Mountain"></img>
            </div>
            <div className="text">
              <h2>Skiing</h2>
              <p>
                Living near Whitefish Montana, means living next to Big
                Mountain. My dad taught me at a very young age how to ski, and I
                have been skiing most winters since then. Big Mountain is
                extremely scenic and full of many routes to fuel my love of
                downhill skiing.
              </p>
            </div>
          </div>
        </section>
        <hr />
        <section className="about-section">
          <div className="section-content">
            <div className="image-container">
              <img src="../pictures/Seward.jpg" alt="Beautiful landscape"></img>
              <div className="image">
                <img
                  src="../pictures/ReidLakesTop.jpg"
                  alt="Another beautiful landscape"
                ></img>
              </div>
            </div>
            <div className="image-container">
              <img
                src="../pictures/ChampTrailHike.jpg"
                alt="Beautiful landscape"
              ></img>
              <div className="image">
                <img
                  src="../pictures/ReidLakes.jpg"
                  alt="Another beautiful landscape"
                ></img>
              </div>
            </div>
            <div className="text">
              <h2>Alaskan Hiking</h2>
              <p>
                My Sister lives in Alaska, and I got the opportunity to go visit
                with her and her fiancé this summer. There seems to be infinite
                hiking and anything outdoorsy in the summer, and mixed with the
                picturesqe landscapes it made for the best summer vacation.
              </p>
            </div>
          </div>
        </section>
        <hr />
        <section className="about-section">
          <div className="section-content">
            <div className="image-container-dog">
              <img
                src="../pictures/BeauxBall.jpg"
                alt="Another beautiful landscape"
              ></img>
            </div>
            <div className="image-container-dog">
              <img
                src="../pictures/HoldingYukla.jpg"
                alt="Beautiful landscape"
              ></img>
            </div>
            <div className="image-container-dog">
              <img
                src="../pictures/Yukla.jpg"
                alt="Another beautiful landscape"
              ></img>
            </div>

            <div className="text">
              <h2>Goldens</h2>
              <p>
                These dogs are some of the most comically clumsy creatures
                around, and despite their penchant for mischief, they undeniably
                add a touch of excitement and joy to life.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
};

export default About;
