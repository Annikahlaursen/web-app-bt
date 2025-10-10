import { Fragment } from "react";
import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faEnvelope,
  faImage,
  faArrowRight,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

export default function Overlay({ isOpen, onClose }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <div className="overlay__container">
            <div className="navprofil">
              <div>
                <FontAwesomeIcon icon={faImage} />
              </div>
              <div>
                <h3>Bruger</h3>
                <p>Rating</p>
                <a href="/">
                  Se profil
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </div>
            </div>
            <nav className="overlay__nav">
              <NavLink to="/" className="overlay__link" onClick={onClose}>
                <FontAwesomeIcon icon={faHome} />
                <span>Home</span>
              </NavLink>
              <NavLink to="/about" className="overlay__link" onClick={onClose}>
                <FontAwesomeIcon icon={faUser} />
                <span>About</span>
              </NavLink>
              <NavLink
                to="/contact"
                className="overlay__link"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Contact</span>
              </NavLink>
            </nav>
            <div className="overlay__controls">
              <a href="/">
                <FontAwesomeIcon icon={faSignOut} />
                Log ud
              </a>
              <button
                className="navcircle menu-button overlay__close"
                type="button"
                onClick={onClose}
              ></button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
