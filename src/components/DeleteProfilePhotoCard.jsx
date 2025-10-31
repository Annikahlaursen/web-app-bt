import { useState, useEffect } from "react";
import Close from "/xmark-solid-full.svg";

export default function DeleteProfilePhotoCard({ isOpen, onClose, onConfirm }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (err) {
      console.error("Error while deleting profile photo:", err);
    }
    handleClose();
  };

  useEffect(() => {
    if (!isOpen) setIsClosing(false);
  }, [isOpen]);

  return (
    <>
      {(isOpen || isClosing) && (
        <div className="signout-overlay">
          <div
            className={`signout-background ${
              isClosing ? "signout-background-closing" : ""
            }`}
            onClick={handleClose}
          />
          <div
            className={`signout-card ${
              isClosing ? "signout-card-closing" : ""
            }`}
          >
            <div className="signout-card-header">
              <h3>Fjern profilbillede</h3>
              <button
                className="signout-card-close"
                type="button"
                onClick={handleClose}
              >
                <img src={Close} alt="Close" className="close-image" />
              </button>
            </div>
            <div className="signout-card-content">
              <p>Er du sikker på, at du vil fjerne dit profilbillede?</p>
            </div>
            <div className="signout-card-actions">
              <button className="signout-card-cancel" onClick={handleClose}>
                Annuller
              </button>
              <button className="signout-card-confirm" onClick={handleConfirm}>
                Fjern billede
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
