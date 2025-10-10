import { NavLink } from "react-router";

export default function Nav() {
  return (
    <nav>
      <NavLink className="navcirkel" to="/">
        Home
      </NavLink>
      <NavLink className="navcirkel" to="/about">
        About
      </NavLink>
      <NavLink className="navcirkel" to="/contact">
        Contact
      </NavLink>
    </nav>
  );
}
