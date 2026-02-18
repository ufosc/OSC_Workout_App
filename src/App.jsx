import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./Pages/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Brainrot from "./Components/Brainrot";
import BottomNav from "./Components/BottomNav";

function App() {
  return (
    <Router>
      <div className="appLayout">

        <div className="pageArea">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/brainrot" element={<Brainrot />} />
          </Routes>
        </div>

        <BottomNav />

      </div>
    </Router>
  );
}

export default App;
