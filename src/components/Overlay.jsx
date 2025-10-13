import { Fragment } from "react";
import { NavLink } from "react-router";
import Profile from "../assets/icons/user-solid-full.svg";
import Arrow from "../assets/icons/arrow-right-solid-full.svg";
import SignOut from "../assets/icons/right-from-bracket-solid-full.svg";
import Close from "../assets/icons/xmark-solid-full.svg";

export default function Overlay({ isOpen, onClose }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <div className="overlay__container">
            <div className="navprofile">
              <div>
                <img
                  src={Profile}
                  alt="Profile"
                  className="profile__image"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <div className="profileinfo">
                <h3>Bruger</h3>
                <p>Rating</p>
                <a href="/">
                  Se profil
                  <img
                    src={Arrow}
                    alt="Arrow"
                    className="arrow__image"
                    style={{ fontSize: "1rem" }}
                  />
                </a>
              </div>
            </div>
            <nav className="overlay__nav">
              <NavLink
                to="/"
                className="overlay__link overlay__linkcolorchange"
                onClick={onClose}
              >
                <span>Favorit</span>
              </NavLink>
              <NavLink to="/" className="overlay__link" onClick={onClose}>
                <span>Indskriv Kampresultat</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay__link overlay__linkcolorchange"
                onClick={onClose}
              >
                <span>Find Hold</span>
              </NavLink>
              <NavLink to="/" className="overlay__link" onClick={onClose}>
                <span>Find Stævne</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay__link overlay__linkcolorchange"
                onClick={onClose}
              >
                <span>Nyheder</span>
              </NavLink>
              <NavLink to="/" className="overlay__link" onClick={onClose}>
                <span>Ratings</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay__link overlay__linkcolorchange"
                onClick={onClose}
              >
                <span>Kalender</span>
              </NavLink>
            </nav>
            <div className="overlay__controls">
              <a href="/" className="signout">
                <img
                  src={SignOut}
                  alt="Sign Out"
                  className="signout__image"
                  style={{ fontSize: "2rem" }}
                />
                Log ud
              </a>
              <button
                className="navcircle menu-button overlay__close"
                type="button"
                onClick={onClose}
              >
                <img
                  src={Close}
                  alt="Close"
                  className="close__image"
                  style={{ fontSize: "2rem" }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
