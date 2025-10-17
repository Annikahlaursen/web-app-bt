import { Fragment, useState, useEffect } from "react";
import Close from "/xmark-solid-full.svg";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";

export default function SignOutCard({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  const handleConfirmSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failed:", err);
      // proceed anyway to clear local state
    }

    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isAuth");
    } catch (err) {
      console.error("Clearing localStorage failed:", err);
    }

    // Close modal then navigate to public sign-in after animation
    handleClose();
    setTimeout(() => navigate("/sign-in"), 300);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  return (
    <Fragment>
      {(isOpen || isClosing) && (
        <div className="signout-overlay">
          <div
            className={`signout-background ${
              isClosing ? "signout-background--closing" : ""
            }`}
            onClick={handleClose}
          />
          <div
            className={`signout-card ${
              isClosing ? "signout-card--closing" : ""
            }`}
          >
            <div className="signout-card__header">
              <h3>Log ud</h3>
              <button
                className="signout-card__close"
                type="button"
                onClick={handleClose}
              >
                <img src={Close} alt="Close" className="close-image" />
              </button>
            </div>
            <div className="signout-card__content">
              <p>Er du sikker på, at du vil logge ud?</p>
            </div>
            <div className="signout-card__actions">
              <button className="signout-card__cancel" onClick={handleClose}>
                Annuller
              </button>

              {/* ------ Her skal intro siden implementeres ------ */}
              <button
                className="signout-card__confirm"
                onClick={handleConfirmSignOut}
              >
                Log ud
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
