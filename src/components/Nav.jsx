import { NavLink } from "react-router";
import { useState } from "react";
import Overlay from "./Overlay";
import Home from "../assets/icons/house-solid-full.svg";
import Calender from "../assets/icons/calendar-solid-full.svg";
import bars from "../assets/icons/bars-solid-full.svg";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbtns">
      <NavLink className="navcircle" to="/">
        <img
          src={Home}
          alt="Home"
          className="nav-icon"
          style={{ fontSize: "2rem" }}
        />
      </NavLink>
      <NavLink className="navcircle" to="/about">
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
