import { useState, useEffect } from "react";
import Placeholder from "/image-solid-full.svg";
import ProfilePic from "/user-solid-full.svg";
import Users from "/users-solid-full.svg";
import ProfileInfo from "../components/ProfileInfo";
import ProfileParent from "../components/ProfileParent";
import { auth } from "../firebase-config";

export default function Profile() {
  const [activeView, setActiveView] = useState("info"); // 'info' eller 'kontakt'
  const [displayName, setDisplayName] = useState("");
  const [displayImage, setDisplayImage] = useState(Placeholder);

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

  return (
    <div className="profile">
      <div className="profile-placeholder">
        <img
          className="profile-head-image"
          src={displayImage || Placeholder}
          alt="Placeholder image"
        />
      </div>
      <div className="profile-text">
        <h4>{displayName || "Din profil"}</h4>
        <h4>Rating:</h4>
      </div>
      <div>
        <div className="profile-btns">
          <button
            className={`profile-btns-seperate ${
              activeView === "info" ? "active" : ""
            }`}
            onClick={() => setActiveView("info")}
          >
            <img
              src={ProfilePic}
              alt="Profile icon placeholder"
              style={{ width: "2em" }}
            />
            <h5>Mine oplysninger</h5>
          </button>
          <button
            className={`profile-btns-seperate ${
              activeView === "kontakt" ? "active" : ""
            }`}
            onClick={() => setActiveView("kontakt")}
          >
            <img
              src={Users}
              alt="Group icon placeholder"
              style={{ width: "2em" }}
            />
            <h5>Kontaktpersoner</h5>
          </button>
        </div>
      </div>

      {/* Conditional rendering af komponenter */}
      <div className="profile-content">
        {activeView === "info" ? <ProfileInfo /> : <ProfileParent />}
      </div>
    </div>
  );
}
