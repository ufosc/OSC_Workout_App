import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Nutrition from './Components/Nutrition';
import Login from './Components/Login';
import Session from './Components/Session';

function App() {
  return (
    <Router>
      <nav
        style={{
          padding: '12px 20px',
          display: 'flex',
          gap: '15px',
          borderBottom: '1px solid #ddd'
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/nutrition">Nutrition</Link>
        <Link to="/login">Login</Link>
        <Link to="/session">Workout</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: '20px' }}>
              <h1>Welcome to OSC Workout</h1>
            </div>
          }
        />

        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/login" element={<Login />} />
        <Route path="/session" element={<Session />} />
      </Routes>
    </Router>
  );
}

export default App;