import { NavLink } from "react-router";
import { useState } from "react";
import Overlay from "./Overlay";
import Home from "/house-solid-full.svg";
import Calender from "/calendar-solid-full.svg";
import bars from "/bars-solid-full.svg";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbtns">
      <NavLink
        className={({ isActive }) =>
          isActive ? "navcircle active" : "navcircle"
        }
        to="/"
      >
        <img
          src={Home}
          alt="Home"
          className="nav-icon"
          style={{ fontSize: "2rem" }}
        />
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "navcircle active" : "navcircle"
        }
        to="/kalender"
      >
        <img
          src={Calender}
          alt="Calender"
          className="nav-icon"
          style={{ fontSize: "2rem" }}
        />
      </NavLink>
      <button className="navcircle" onClick={toggleOverlay}>
        <img
          src={bars}
          alt="Menu"
          className="nav-icon"
          style={{ fontSize: "2rem" }}
        />
      </button>

      <Overlay isOpen={isOpen} onClose={toggleOverlay} />
    </nav>
  );
}
