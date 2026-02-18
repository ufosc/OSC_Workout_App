import React from "react";
import "./Home.css";
import chartImg from "./chart.png";

function Home() {
  return (
    <div className="homeScreen">

      <h1 className="appTitle">OSC Workout App</h1>


      <div className="chartFrame">
        <img src={chartImg} alt="Workout Chart" className="chartImage" />
      </div>

      <div className="statsCard">
        <ul className="statsCol">
          <li>Total</li>
          <li>Sessions</li>
        </ul>

        <ul className="statsCol">
          <li>Weight Lifted</li>
          <li>PRs Hit</li>
        </ul>
      </div>

    </div>
  );
}

export default Home;
