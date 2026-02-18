import { NavLink } from "react-router-dom";
import "./BottomNav.css";

function Tab({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => "tab" + (isActive ? " active" : "")}
    >
      <div className="tabIcon">{icon}</div>
      <div className="tabLabel">{label}</div>
    </NavLink>
  );
}

export default function BottomNav() {
  return (
    <nav className="bottomNav">
      <Tab to="/brainrot" icon="💪" label="Workouts" />
      <Tab to="/signup" icon="🗓️" label="Calendar" />
      <Tab to="/login" icon="👤" label="Profile" />
      <Tab to="/" icon="🏠" label="Home" />
    </nav>
  );
}
