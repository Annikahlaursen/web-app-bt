import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Overlay from "./Overlay";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <NavLink className="navcircle" to="/">
        <FontAwesomeIcon icon={faHome} className="nav-icon" />
      </NavLink>
      <NavLink className="navcircle" to="/about">
        <FontAwesomeIcon icon={faCalendar} className="nav-icon" />
      </NavLink>
      <button className="navcircle menu-button" onClick={toggleOverlay}>
        <FontAwesomeIcon
          icon={faBars}
          className="nav-icon"
          style={{ fontSize: "2rem", color: "white" }}
        />
      </button>

      <Overlay isOpen={isOpen} onClose={toggleOverlay} />
    </nav>
  );
}
