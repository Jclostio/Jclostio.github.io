import "./MainContent.css";

const MainContent = () => {
  return (
    <>
      <div className="main-content">
        <div className="main-img">
          <img src="./pictures/Me.jpg" alt="Jacob Clostio" />
        </div>
        <div className="main-text shadow-lg p-3 mb-5 bg-aqua rounded">
          <h1>
            <b>Hi, my name is </b>
            <span>
              <b className="nameBackground">Jacob Clostio</b>
            </span>
          </h1>
          <p className="main-text-box">
            I am a recent graduate from Montana State University, where I
            obtained a Bachelor's degree in Computer Science and a minor in
            Mathematics. Through coursework and projects, I have prepared myself
            for a future career in Software Development and am actively seeking
            new opportunities in the field to apply my skills and contribute to
            exciting projects. Let's connect!
          </p>
        </div>
      </div>
    </>
  );
};
export default MainContent;
