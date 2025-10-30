import { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router";
import Placeholder from "/user-solid-full.svg";
import SignOut from "/right-from-bracket-solid-full.svg";
import Close from "/xmark-solid-full.svg";
import SignOutCard from "./SignOutCard";
import { auth } from "../firebase-config";
import Star from "/star-solid-full.svg";

export default function Overlay({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [showSignOutCard, setShowSignOutCard] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [displayImage, setDisplayImage] = useState(Placeholder);
  const [displayRating, setDisplayRating] = useState(null);
  const [displayKlub, setDisplayKlub] = useState("");
  const [displayHold, setDisplayHold] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  // Load display name and image from Realtime DB when available; otherwise fallback to localStorage
  useEffect(() => {
    async function loadFromDbOrLocal() {
      try {
        const uid = auth?.currentUser?.uid;
        const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;
        if (uid && firebaseDbUrlBase) {
          const url = `${firebaseDbUrlBase}/users/${uid}.json`;
          const resp = await fetch(url);
          if (resp.ok) {
            const data = await resp.json();
            if (data) {
              const fornavn = data.fornavn || data.name || "";
              const efternavn = data.efternavn || data.lastname || "";
              setDisplayName(
                `${fornavn}${
                  fornavn || efternavn ? " " : ""
                }${efternavn}`.trim() || ""
              );
              setDisplayImage(data.image || Placeholder);
              setDisplayRating(data.rating ?? null);
              setDisplayKlub(data.kidImage || "");
              setDisplayHold(data.hidNavn || "");
              return;
            }
          }
        }

        // fallback to localStorage
        const currentUserRaw = localStorage.getItem("currentUser");
        if (currentUserRaw) {
          const currentUser = JSON.parse(currentUserRaw);
          const p = currentUser.profile || {};
          const fornavn = p.fornavn || p.firstName || "";
          const efternavn = p.efternavn || p.lastName || "";
          setDisplayName(
            `${fornavn}${fornavn || efternavn ? " " : ""}${efternavn}`.trim() ||
              ""
          );
          setDisplayImage(p.image || Placeholder);
          setDisplayRating(p.rating ?? null);
          setDisplayKlub(p.kidImage || "");
          setDisplayHold(p.hidNavn || "");
          return;
        }
      } catch (err) {
        console.error(err);
      }

      // fallback
      setDisplayName("");
      setDisplayImage(Placeholder);
    }

    loadFromDbOrLocal();

    function onStorage(e) {
      if (e.key === "currentUser") loadFromDbOrLocal();
    }
    function onCurrentUserChanged() {
      loadFromDbOrLocal();
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("currentUserChanged", onCurrentUserChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("currentUserChanged", onCurrentUserChanged);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  const handleShowSignOut = (e) => {
    e.preventDefault();
    setShowSignOutCard(true);
  };

  const handleCloseSignOut = () => {
    setShowSignOutCard(false);
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
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "navprofile active" : "navprofile"
              }
              onClick={handleClose}
            >
              <div className="profile-image">
                <img src={displayImage || Placeholder} alt="Profilbillede" />
              </div>
              <div className="profileinfo">
                <h4>{displayName || "Din profil"}</h4>
                <h4>
                  Rating:{" "}
                  {displayRating !== null && displayRating !== undefined
                    ? displayRating
                    : "-"}
                </h4>
                <span style={{ textDecoration: "underline" }}>Se profil →</span>
              </div>
            </NavLink>
            <nav>
              <div className="dropdown">
                <button
                  className="dropdown-favorit overlay-link overlay-linkcolorchange"
                  onClick={handleOpen}
                >
                  Favorit
                  {open ? (
                    <div style={{ fontSize: "20px" }}>&#9662;</div>
                  ) : (
                    <div style={{ fontSize: "20px" }}>&#9656;</div>
                  )}
                </button>
                {open ? (
                  <ul>
                    <li className="menu-item">
                      <NavLink
                        to="/error"
                        className={({ isActive }) =>
                          isActive ? "active" : ""
                        }
                      >
                        <img
                          className="menu-rund"
                          src={displayKlub}
                          alt={displayKlub || "Klub"}
                          style={{ objectFit: "cover", border: "none" }}
                        />
                        <p style={{ marginTop: "4px" }}>Min klub</p>
                      </NavLink>
                      <NavLink
                        to="/error"
                        className={({ isActive }) =>
                          isActive ? "active" : ""
                        }
                      >
                        <button className="menu-rund">
                          <p>{displayHold || "Mit hold"}</p>
                        </button>
                        <p className="menu-text-flow">Mit hold</p>
                      </NavLink>
                      <NavLink
                        to="/error"
                        className={({ isActive }) =>
                          isActive ? "active" : ""
                        }
                      >
                        <button className="menu-rund">
                          <img src={Star} alt="" />
                        </button>
                        <p className="menu-text-flow">Favoritter</p>
                      </NavLink>
                    </li>
                  </ul>
                ) : null}
              </div>
              <NavLink
                to="/searchKampID"
                className={({ isActive }) =>
                  isActive ? "overlay-link active" : "overlay-link"
                }
                onClick={handleClose}
              >
                <span>Indskriv Kampresultat</span>
              </NavLink>
              <NavLink
                to="/holdsearch"
                className={({ isActive }) =>
                  isActive
                    ? "overlay-link overlay-linkcolorchange active"
                    : "overlay-link overlay-linkcolorchange"
                }
                onClick={handleClose}
              >
                <span>Find Hold</span>
              </NavLink>
              <NavLink
                to="/stevnesearch"
                className={({ isActive }) =>
                  isActive ? "overlay-link active" : "overlay-link"
                }
                onClick={handleClose}
              >
                <span>Find Stævne</span>
              </NavLink>
              <NavLink
                to="/error"
                className={({ isActive }) =>
                  isActive
                    ? "overlay-link overlay-linkcolorchange active"
                    : "overlay-link overlay-linkcolorchange"
                }
                onClick={handleClose}
              >
                <span>Nyheder</span>
              </NavLink>
              <NavLink
                to="/rating"
                className={({ isActive }) =>
                  isActive ? "overlay-link active" : "overlay-link"
                }
                onClick={handleClose}
              >
                <span>Ratings</span>
              </NavLink>
              <NavLink
                to="/kalender"
                className={({ isActive }) =>
                  isActive
                    ? "overlay-link overlay-linkcolorchange active"
                    : "overlay-link overlay-linkcolorchange"
                }
                onClick={handleClose}
              >
                <span>Kalender</span>
              </NavLink>
            </nav>
            <div className="overlay-controls">
              <button onClick={handleShowSignOut} className="signout">
                <img src={SignOut} alt="Sign Out" style={{ height: "70%" }} />
                Log ud
              </button>
              <button
                className="navcircle overlay-close"
                type="button"
                onClick={handleClose}
              >
                <img src={Close} alt="Close" />
              </button>
            </div>
          </div>
        </div>
      )}
      <SignOutCard isOpen={showSignOutCard} onClose={handleCloseSignOut} />
    </Fragment>
  );
}
