import React from 'react';
import '../App.css';
import './Home.css';

function Home({ onBegin }) {
  return (
    <div className="home-root">
      <header className="home-header">
        <h1 className="neon-title">OSC's Epic Workout App</h1>
        <p className="neon-subtitle">Lock in. Gain aura. Save money.</p>
      </header>

      <main className="home-main">
        {/* Begin Workout - Prominent at the top */}
        <div className="begin-container">
          <div className="link-card neon-blue begin-card">
            <div className="card-title">Begin Workout</div>
            <div className="card-sub">Primary action</div>
            <button
              className="begin-button neon-blue"
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
          <h2 className="panel-title">Choices</h2>
          <div className="choices-column">
            <button className="link-card neon-red small-link" onClick={() => {/* TODO: Implement previous workout functionality */}}>
              <div className="card-title">Previous Workout</div>
              <div className="card-sub">View stats</div>
            </button>

            <button className="link-card neon-green small-link" onClick={() => {/* TODO: Implement aura board functionality */}}>
              <div className="card-title">Aura Board</div>
              <div className="card-sub">See your aura</div>
            </button>

            <button className="link-card neon-red small-link" onClick={() => {/* TODO: Implement settings functionality */}}>
              <div className="card-title">Settings</div>
              <div className="card-sub">Adjust app</div>
            </button>
          </div>
        </section>
      </main>

      <footer className="home-footer">© OSC Workout App</footer>
    </div>
  );
}

export default Home;
