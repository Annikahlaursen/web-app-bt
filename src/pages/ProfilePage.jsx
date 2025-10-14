import { useState } from "react";
import Placeholder from "/image-solid-full.svg";
import ProfilePic from "/user-solid-full.svg";
import Users from "/users-solid-full.svg";
import ProfileInfo from "../components/ProfileInfo";
import ProfileParent from "../components/ProfileParent";

export default function Profile() {
  const [activeView, setActiveView] = useState("info"); // 'info' eller 'kontakt'
  return (
    <div className="profile">
      <div className="profile-background">
        <div className="profile-placeholder">
          <img src={Placeholder} alt="Placeholder image" />
        </div>
        <div className="profile-text">
          <h4>Heidi Astrup</h4>
          <h4>Rating:</h4>
        </div>
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
