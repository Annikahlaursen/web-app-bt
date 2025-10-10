import { Fragment } from "react";
import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faSignOut,
  faTimes,
  faUser,
  faHeart,
  faPen,
  faUsers,
  faCalendar,
  faNewspaper,
  faStarHalf,
} from "@fortawesome/free-solid-svg-icons";

export default function Overlay({ isOpen, onClose }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <div className="overlay__container">
            <div className="navprofile">
              <div>
                <FontAwesomeIcon
                  icon={faUser}
                  className="profile__image"
                  style={{ fontSize: "2rem", color: "white" }}
                />
              </div>
              <div className="profileinfo">
                <h3>Bruger</h3>
                <p>Rating</p>
                <a href="/">
                  Se profil
                  <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </div>
            </div>
            <nav className="overlay__nav">
              <NavLink
                to="/"
                className="overlay__link overlay__linkcolorchange"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faHeart} />
                <span>Favorit</span>
              </NavLink>
              <NavLink to="/" className="overlay__link" onClick={onClose}>
                <FontAwesomeIcon icon={faPen} />
                <span>Indskriv Kampresultat</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay__link overlay__linkcolorchange"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faUsers} />
                <span>Find Hold</span>
              </NavLink>
              <NavLink to="/" className="overlay__link" onClick={onClose}>
                <FontAwesomeIcon icon={faCalendar} />
                <span>Find Stævne</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay__link overlay__linkcolorchange"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faNewspaper} />
                <span>Nyheder</span>
              </NavLink>
              <NavLink to="/" className="overlay__link" onClick={onClose}>
                <FontAwesomeIcon icon={faStarHalf} />
                <span>Ratings</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay__link overlay__linkcolorchange"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faCalendar} />
                <span>Kalender</span>
              </NavLink>
            </nav>
            <div className="overlay__controls">
              <a href="/" className="signout">
                <FontAwesomeIcon
                  icon={faSignOut}
                  style={{ fontSize: "2rem", color: "white" }}
                />
                Log ud
              </a>
              <button
                className="navcircle menu-button overlay__close"
                type="button"
                onClick={onClose}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ fontSize: "2rem", color: "white" }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
