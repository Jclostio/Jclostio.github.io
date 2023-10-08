import "./MainContent.css";

const MainContent = () => {
  return (
    <>
      <div className="main-content">
        <div className="img-container">
          <img src="./pictures/Me.jpg" alt="Jacob Clostio" />
        </div>
        <div className="text-container">
          <h1>Jacob Clostio</h1>
          <p className="text-box">
            Hello, I'm a Computer Science Graduate from Montana State
            University, passionate about technology and ready to embark on my
            next adventure. I'm actively seeking new opportunities in the field
            to apply my skills and contribute to exciting projects. Let's
            connect!
          </p>
        </div>
      </div>
    </>
  );
};
export default MainContent;
