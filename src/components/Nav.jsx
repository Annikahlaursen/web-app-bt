import { NavLink } from "react-router";

export default function Nav() {
  return (
    <nav>
      <NavLink className="navcircle" to="/">
        Home
      </NavLink>
      <NavLink className="navcircle" to="/about">
        About
      </NavLink>
      <NavLink className="navcircle" to="/contact">
        Contact
      </NavLink>
    </nav>
  );
}
