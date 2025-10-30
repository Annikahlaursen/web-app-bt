import { Fragment, useState, useEffect } from "react";

export default function SignOutCard({
  isOpen,
  onClose,
  stevne,
  isTilmeldt,
  onTilmeldUpdate,
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setConfirmationMessage("");
      onClose();
    }, 300);
  };

  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (!currentUser || !currentUser.profile) {
      console.warn("No current user found in localStorage.");
      return null;
    }

    return currentUser;
  };

  // ------------------ Tilmeld stevne ----------------- //
  const handleConfirmTilmeld = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.uid;

    try {
      const updatedTilmeldteStevner = [
        ...(currentUser.profile.tilmeldteStevner || []),
        stevne.id,
      ];

      // Opdater Firebase database
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/users/${userId}.json`,
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

      if (typeof onTilmeldUpdate === "function") {
        onTilmeldUpdate(true); // Opdater parent komponentens state
      }

      setConfirmationMessage(
        `Du er nu tilmeldt ${stevne.titel}! Stævnet er føjet til din kalender!`
      );
    } catch (error) {
      console.error("Failed to tilmeld stevne:", error);
    }
  };

  /*------------------------Afmeld stævne-----------------------------*/

  const handleDeleteTilmeld = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.uid;

    try {
      // Fjern stævne fra tilmeldteStevner
      const updatedTilmeldteStevner =
        currentUser.profile.tilmeldteStevner.filter((id) => id !== stevne.id);

      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/users/${userId}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tilmeldteStevner: updatedTilmeldteStevner,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update Firebase: ${response.statusText}`);
      }

      console.log("Firebase update response:", await response.json());

      currentUser.profile.tilmeldteStevner = updatedTilmeldteStevner;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      console.log("Stevne afmeldt successfully!");
      if (typeof onTilmeldUpdate === "function") {
        onTilmeldUpdate(false); // Opdater parent komponentens state
      }

      setConfirmationMessage(`Du er nu afmeldt ${stevne.titel}.`);
    } catch (error) {
      console.error("Failed to afmeld stevne:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      setConfirmationMessage("");
    }
  }, [isOpen]);

  return (
    <Fragment>
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
              <h3>{confirmationMessage ? "Bekræftelse" : "Tilmelding"}</h3>
              <button
                className="signout-card-close"
                type="button"
                onClick={handleClose}
              ></button>
            </div>
            <div className="signout-card-content">
              {confirmationMessage ? (
                <p>{confirmationMessage}</p>
              ) : isTilmeldt ? (
                <p>Du er allerede tilmeldt {stevne.titel}.</p>
              ) : (
                <p>Vil du tilmeldes {stevne.titel}?</p>
              )}
            </div>
            <div className="signout-card-actions">
              {confirmationMessage ? (
                <button className="signout-card-confirm" onClick={handleClose}>
                  Luk
                </button>
              ) : (
                <>
                  <button
                    className="signout-card-cancel"
                    onClick={handleClose}
                  >
                    Annuller
                  </button>
                  {isTilmeldt ? (
                    <button
                      className="signout-card-confirm"
                      onClick={handleDeleteTilmeld}
                    >
                      Afmeld
                    </button>
                  ) : (
                    <button
                      className="signout-card-confirm"
                      onClick={handleConfirmTilmeld}
                    >
                      Tilmeld
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
