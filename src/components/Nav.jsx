import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
  return (
    <nav>
      <NavLink className="navcircle" to="/">
        <FontAwesomeIcon icon={faHome} className="nav-icon" />
      </NavLink>
      <NavLink className="navcircle" to="/about">
        <FontAwesomeIcon icon={faCalendar} className="nav-icon" />
      </NavLink>
      <NavLink className="navcircle" to="/contact">
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </NavLink>
    </nav>
  );
}
