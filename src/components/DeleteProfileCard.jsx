import { Fragment, useState, useEffect } from "react";
import Close from "/xmark-solid-full.svg";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

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

  const handleConfirmDeleteProfile = async () => {
    // Try to remove profile data from Firebase Realtime DB and Storage first
    const uid = auth?.currentUser?.uid;
    const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;

    // Attempt to delete storage object referenced in local copy (if any)
    try {
      const currentUserRaw = localStorage.getItem("currentUser");
      if (currentUserRaw) {
        const currentUser = JSON.parse(currentUserRaw);
        const profile = currentUser.profile || {};
        const path = profile.storagePath || "";
        const image = profile.image || "";

        if (path) {
          try {
            const storage = getStorage();
            const imgRef = storageRef(storage, path);
            await deleteObject(imgRef);
          } catch (err) {
            console.warn(
              "Failed to delete storage object by storagePath:",
              err
            );
          }
        } else if (image) {
          // Fallback: try to derive storage path from firebase storage url
          try {
            const parsed = new URL(image);
            if (
              parsed.hostname.includes("firebasestorage.googleapis.com") &&
              parsed.pathname.includes("/o/")
            ) {
              const encodedPath = parsed.pathname.split("/o/")[1];
              const decoded = decodeURIComponent(encodedPath);
              const storage = getStorage();
              const imgRef = storageRef(storage, decoded);
              await deleteObject(imgRef);
            }
          } catch (err) {
            console.warn(
              "Failed to delete storage object by parsing URL:",
              err
            );
          }
        }
      }
    } catch (err) {
      console.warn(
        "Error while attempting to delete profile image from storage:",
        err
      );
    }

    // Delete the user profile node from Realtime Database
    if (uid && firebaseDbUrlBase) {
      try {
        const url = `${firebaseDbUrlBase}/users/${uid}.json`;
        const resp = await fetch(url, { method: "DELETE" });
        if (!resp.ok) {
          console.warn("Failed to delete user record from DB:", resp.status);
        }
      } catch (err) {
        console.warn("Error deleting user data from DB:", err);
      }
    }

    // Sign out the user from Firebase Auth (best-effort)
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failed:", err);
      // proceed anyway to clear local state
    }

    // Clear local session/state
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
              <h3>Slet profil</h3>
              <button
                className="signout-card-close"
                type="button"
                onClick={handleClose}
              >
                <img src={Close} alt="Close" className="close-image" />
              </button>
            </div>
            <div className="signout-card-content">
              <p>Er du sikker på, at du vil slette din profil?</p>
            </div>
            <div className="signout-card-actions">
              <button className="signout-card-cancel" onClick={handleClose}>
                Annuller
              </button>

              {/* ------ Her skal intro siden implementeres ------ */}
              <button
                className="signout-card-confirm"
                onClick={handleConfirmDeleteProfile}
              >
                Slet profil
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
