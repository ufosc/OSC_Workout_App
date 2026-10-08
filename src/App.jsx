import { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Brainrot from "./Components/Brainrot";
import Home from './Pages/Home';
import Session from './Components/Session';
import Nutrition from './Components/Nutrition';
import PastSessions from './Pages/PastSessions';

const THEMES = ['dark', 'light', 'colorblind'];

function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  if (!THEMES.includes(stored)) return 'dark';
  return stored;
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="App">
        <nav >
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
          <NavLink to="/nutrition">
            Nutrition
          </NavLink>
          <NavLink to="/history">
            History
          </NavLink>
        </nav>

        <div>
          <Routes>
            <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/brainrot" element={<Brainrot />} />
            <Route path="/session" element={<Session />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/history" element={<PastSessions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;