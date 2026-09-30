import React from 'react';
import '../App.css';
import './Home.css';
import { useState } from 'react';



function Home({ onBegin }) {

    const [showPopup, setShowPopup] = useState(false);
    const [workoutInput, setWorkoutInput] = useState("");
    const [newWorkouts, setWorkouts] = useState([]);

    const addWorkout = () => {
      if (workoutInput.trim() === "") return; 
      setWorkouts([...newWorkouts, workoutInput.trim()]);
      setWorkoutInput("");
    }

  return (
    <div className="home-root">
      <header className="home-header">
        <h1 className="neon-title text">OSC's Epic Workout App</h1>
        <p className="neon-subtitle text">Lock in. Gain aura. Save money.</p>
      </header>

    

      <main className="home-main">
        {/* Begin Workout - Prominent at the top */}
        <div className="begin-container">
          <div className="link-card button begin-card">
            <div className="card-title text ">Begin Workout</div>
            <div className="card-sub text">Primary action</div>
            <button
              className="begin-button neon-blue text"
              onClick={() => {
                if (typeof onBegin === 'function') onBegin();
              }}
            >
              Begin Workout
            </button>
          </div>
        </div>

        {/* Choices panel */}
        <section className="links-panel">
          <h2 className="panel-title text">Choices</h2>
          <div className="choices-column">
            <button className="link-card neon-red small-link" onClick={() => {/* TODO: Implement previous workout functionality */}}>
              <div className="card-title text">Previous Workout</div>
              <div className="card-sub text">View stats</div>
            </button>

            <button className="link-card neon-green small-link" onClick={() => {/* TODO: Implement aura board functionality */}}>
              <div className="card-title text">Aura Board</div>
              <div className="card-sub text">See your aura</div>
            </button>

            <button className="link-card neon-red small-link" onClick={() => {/* TODO: Implement settings functionality */}}>
              <div className="card-title text">Settings</div>
              <div className="card-sub text">Adjust app</div>
            </button>

           <button className="link-card neon-red small-link" onClick={() => setShowPopup(true)}>
            <div className="card-title text">Create a workout</div>
            <div className="card-sub text">Customize your workout</div>
          </button>
          
          {/*popup window itself*/}
          {showPopup && (
            <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          {/*contents of popup window styling*/}
          <div
            style={{
              background: "black",
              padding: "20px",
              borderRadius: "12px",
              borderColor: "white",
              borderWidth: "7px",
              borderStyle: "solid",
              width: "450px",
              height: "300px",
              textAlign: "center"
            }}
          >
                  <h2>Add a Workout</h2>

            <input
              type="text"
              value={workoutInput}
              onChange={(e) => setWorkoutInput(e.target.value)}
              placeholder="Enter workout name"
              style={{
                padding: "10px",
                width: "80%",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />
            <button
              onClick={addWorkout}
              style={{
                padding: "10px",
                background: "#ff4d4d",
                color: "black",
                borderRadius: "8px",
                border: "none",
                width: "100%",
                cursor: "pointer"
              }}
            >
              Add Workout
            </button>
            <div style={{ marginTop: "20px", textAlign: "left" }}>
              {newWorkouts.map((w, i) => (
                <div key={i} style={{ padding: "5px 0" }}>
                  • {w}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: "80px",
                padding: "10px",
                background: "#ff4d4d",
                color: "black",
                borderRadius: "8px",
                border: "none",
                width: "100%",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
          </div>
        </section>
      </main>

      <footer className="home-footer text">© OSC Workout App</footer>
    </div>
  );
}

export default Home;
