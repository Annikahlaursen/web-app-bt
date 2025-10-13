import { Fragment, useState, useEffect } from "react";
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
            className={`overlay-signout ${
              isClosing ? "overlay-container-closing" : ""
            }`}
          >
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
