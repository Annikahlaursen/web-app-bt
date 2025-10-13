import { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router";
import Profile from "../assets/icons/user-solid-full.svg";
import SignOut from "../assets/icons/right-from-bracket-solid-full.svg";
import Close from "../assets/icons/xmark-solid-full.svg";
import SignOutCard from "./SignOutCard";

export default function Overlay({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);
  return (
    <Fragment>
      {(isOpen || isClosing) && (
        <div className="overlay">
          <div
            className={`overlay-background ${
              isClosing ? "overlay-background-closing" : ""
            }`}
            onClick={handleClose}
          />
          <div
            className={`overlay-container ${
              isClosing ? "overlay-container-closing" : ""
            }`}
          >
            <div className="navprofile">
              <div>
                <img src={Profile} alt="Profile" className="profile-image" />
              </div>
              <div className="profileinfo">
                <h3>Heidi Astrup</h3>
                <p>Rating</p>
                <a href="/">Se profil →</a>
              </div>
            </div>
            <nav className="overlay-nav">
              <NavLink
                to="/"
                className="overlay-link overlay-linkcolorchange"
                onClick={handleClose}
              >
                <span>Favorit</span>
              </NavLink>
              <NavLink to="/" className="overlay-link" onClick={handleClose}>
                <span>Indskriv Kampresultat</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay-link overlay-linkcolorchange"
                onClick={handleClose}
              >
                <span>Find Hold</span>
              </NavLink>
              <NavLink to="/" className="overlay-link" onClick={handleClose}>
                <span>Find Stævne</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay-link overlay-linkcolorchange"
                onClick={handleClose}
              >
                <span>Nyheder</span>
              </NavLink>
              <NavLink to="/" className="overlay-link" onClick={handleClose}>
                <span>Ratings</span>
              </NavLink>
              <NavLink
                to="/"
                className="overlay-link overlay-linkcolorchange"
                onClick={handleClose}
              >
                <span>Kalender</span>
              </NavLink>
            </nav>
            <div className="overlay-controls">
              <a href={SignOutCard} className="signout">
                <img
                  src={SignOut}
                  alt="Sign Out"
                  className="signout-image"
                  style={{ height: "70%" }}
                />
                Log ud
              </a>
              <button
                className="navcircle menu-button overlay-close"
                type="button"
                onClick={handleClose}
              >
                <img src={Close} alt="Close" className="close-image" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
