import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Brainrot from "./Components/Brainrot";
import Home from './Pages/Home';
import { ThemeProvider, useTheme } from './Theme/ThemeContext';

function Navigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="main-nav">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/signup">Signup</NavLink>
      <NavLink to="/brainrot">Brainrot</NavLink>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Current theme: ${theme}. Click to change theme.`}
      >
        Theme: {theme}
      </button>
    </nav>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navigation />

          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/brainrot" element={<Brainrot />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
