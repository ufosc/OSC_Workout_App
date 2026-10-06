import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Brainrot from "./Components/Brainrot";
import Home from './Pages/Home';
import Session from './Components/Session';
import { useEffect, useState } from 'react';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="App">
        <nav className="nav-bar">
          <NavLink 
            to="/">
            Home
          </NavLink>
          <NavLink 
            to="/login" 

          >
            Login
          </NavLink>
          <NavLink 
            to="/signup" 
          >
            Signup
          </NavLink>
          <NavLink 
            to="/brainrot" 
          >
            Brainrot
          </NavLink>
        </nav>

        <div>
          <Routes>
            <Route path="/" element={<Home theme={theme} onThemeChange={setTheme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/brainrot" element={<Brainrot />} />
            <Route path="/session" element={<Session />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;