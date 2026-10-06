import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Brainrot from "./Components/Brainrot";
import Home from './Pages/Home';
import Session from './Components/Session';
import WorkoutList from './Components/WorkoutList';

function App() {
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
          <NavLink
            to="/workouts"
          >
            Workouts
          </NavLink>
        </nav>

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/brainrot" element={<Brainrot />} />
            <Route path="/session" element={<Session />} />
            <Route path="/workouts" element={<WorkoutList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;