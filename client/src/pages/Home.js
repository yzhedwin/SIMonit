import logo from "../logo.svg";
// import React, { useState } from "react";
import "./Home.css";
// import DragMove from '../component/DragMove';

const Home = () => {
  return (
    <div className="Home">
      <h1 className="Home-title">
        Built with
      </h1>
      <div>
        <img src={logo} className="React-logo" alt="logo" />
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/c/c6/Influxdb_logo.svg"
          }
          className="Influx-logo"
          alt="logo"
        />
      </div>
    </div>
  );
};

export default Home;
// style={{
//     transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
// }}
// const [translate, setTranslate] = useState({
//     x: 0,
//     y: 0
// });

// const handleDragMove = (e) => {
//     setTranslate({
//         x: translate.x + e.movementX,
//         y: translate.y + e.movementY
//     });
// };
