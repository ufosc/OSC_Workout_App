import React from 'react';
import '../App.css';
import './Home.css';

function Home({ onBegin }) {
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
          </div>
        </section>
      </main>

      <footer className="home-footer text">© OSC Workout App</footer>
    </div>
  );
}

export default Home;
