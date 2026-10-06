import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Brainrot from "./Components/Brainrot";
import Timer from './Components/Timer';
import Home from './Pages/Home';

function AppRoutes() {
  const navigate = useNavigate();

  return (
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
      </nav>

      <div>
        <Routes>
          <Route path="/" element={<Home onBegin={() => navigate('/timer')} />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/brainrot" element={<Brainrot />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;