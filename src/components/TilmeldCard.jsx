import { Fragment, useState, useEffect } from "react";

export default function SignOutCard({ isOpen, onClose, stevne }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  // ------------------ Tilmeld stevne ----------------- //
  const handleConfirmTilmeld = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (!currentUser || !currentUser.profile) {
    console.warn("No current user found in localStorage.");
    return;
  }

  const userId = currentUser.uid;

  try {
    const updatedTilmeldteStevner = [
      ...(currentUser.profile.tilmeldteStevner || []),
      stevne.id,
    ];

    // Opdater Firebase database
    const response = await fetch(
      `${
        import.meta.env.VITE_FIREBASE_DATABASE_URL
      }/users/${userId}.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tilmeldteStevner: updatedTilmeldteStevner }),
      }
    );

     if (!response.ok) {
       throw new Error(`Failed to update Firebase: ${response.statusText}`);
     }


      console.log("Firebase update response:", await response.json());

    // Opdater localStorage for at reflektere ændringen
    currentUser.profile.tilmeldteStevner = updatedTilmeldteStevner;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    console.log("Stevne tilmeldt successfully!");
  } catch (error) {
    console.error("Failed to tilmeld stevne:", error);
  }

    handleClose();
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
              <h3>Tilmelding</h3>
              <button
                className="signout-card__close"
                type="button"
                onClick={handleClose}
              >
              </button>
            </div>
            <div className="signout-card__content">
              <p>Vil du tilmeldes {stevne.titel}?</p>
            </div>
            <div className="signout-card__actions">
              <button className="signout-card__cancel" onClick={handleClose}>
                Annuller
              </button>

              {/* ------ Her skal intro siden implementeres ------ */}
              <button
                className="signout-card__confirm"
                onClick={handleConfirmTilmeld}
              >
                Tilmeld
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
