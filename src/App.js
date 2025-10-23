import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Pages/Home';

function App() {
  return (
    <Router>
      <div className="App">

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>

        <div className='header-container'>
          <div className='title-box'>
            <h1 id='title'>Workout App</h1>
            <input type='text' id='search-input' placeholder='Search for anything!'></input>
          </div>

          <div className='nav-box'>
            <NavLink to="/">
              Home
            </NavLink>
            <NavLink to="/login" >
              Login
            </NavLink>
            <NavLink to="/signup" >
              Signup
            </NavLink>
          </div>
        </div>

        <div className='content-container'>
          <div className='content-photo'>
            <h1>photo</h1>
          </div>
          <div className='content-box'>
            <h1>content</h1>
          </div>
        </div>

        <div className='more-content-container'>
          <div> more content (slide deck?) </div>
        </div>

      </div>
    </Router>
  );
}

export default App;