import "./MainContent.css";

const MainContent = () => {
  return (
    <>
      <div className="main-content">
        <div className="image-container">
          <img id="profilePic" src="./pictures/picOfMe.JPG" alt="Your Name" />
        </div>
        <div className="text-container">
          <h1>Jacob Clostio</h1>
          <p>
            Hello, I'm a Computer Science Graduate from Montana State
            University, passionate about technology and ready to embark on my
            next adventure. I'm actively seeking new opportunities in the field
            to apply my skills and contribute to exciting projects. Let's
            connect!
          </p>
        </div>
      </div>
      <hr></hr>
    </>
  );
};
export default MainContent;
