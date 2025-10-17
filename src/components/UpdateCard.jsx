import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Image from "/image-solid-full.svg";
import Pen from "/pen-solid-full.svg";
import Logo from "/btp-logo.png";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth } from "../firebase-config";
import { setCurrentUserStorage } from "../utils/currentUserEvents";

export default function Update() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(Image);
  const fileInputRef = useRef(null);

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <Fragment>
      <div>
        <div className="login-page">
          <div className="login-page-logo">
            <img id="login-logo" src={Logo} alt="Bordtennisportalen.dk logo" />
          </div>
          <div className="profile-info-parent">
            <div className="profile-card update-card">
              <div className="profile-card-header">
                <h3>Profilbillede</h3>
              </div>
              <div className="profile-info-card-image profile-card-content">
                <input
                  type="file"
                  className="hide"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    try {
                      const storage = getStorage();
                      const uid = auth?.currentUser?.uid || "public";
                      const ref = storageRef(
                        storage,
                        `profile_images/${uid}/${Date.now()}_${file.name}`
                      );
                      const snap = await uploadBytes(ref, file);
                      const url = await getDownloadURL(snap.ref);
                      setImageUrl(url);
                      // update local currentUser so Overlay/ProfileInfo update
                      try {
                        const raw = localStorage.getItem("currentUser");
                        if (raw) {
                          const cur = JSON.parse(raw);
                          cur.profile = cur.profile || {};
                          cur.profile.image = url;
                          setCurrentUserStorage(cur);
                        } else {
                          setCurrentUserStorage({
                            uid: null,
                            email: null,
                            profile: { image: url },
                          });
                        }
                      } catch (err) {
                        console.warn(
                          "Could not update local currentUser after upload:",
                          err
                        );
                      }
                    } catch (err) {
                      console.error("Upload failed:", err);
                    }
                  }}
                />
                <img
                  src={imageUrl}
                  alt="Placeholder image"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="profile-card-actions profile-card-oneaction">
                <a id="profile-card-actions-seperat">
                  <img src={Pen} alt="Edit icon" style={{ width: "1.5rem" }} />
                  Rediger
                </a>
              </div>
            </div>
            <div className="profile-card update-card">
              <div className="profile-card-header">
                <h3>Personlige oplysninger</h3>
              </div>
              <div>
                <form action="ProfileInfo" className="profile-form">
                  <select
                    id="gender"
                    name="gender"
                    className="profile-form-content"
                  >
                    <option value="women">Kvinde</option>
                    <option value="men">Mand</option>
                    <option value="other">Andet</option>
                  </select>
                  <select
                    id="gender"
                    name="gender"
                    className="profile-form-content"
                  >
                    <option value="women">Kvinde</option>
                    <option value="men">Mand</option>
                    <option value="other">Andet</option>
                  </select>
                </form>
              </div>
              <div className="profile-btns-actions">
                <button
                  className="profile-btns profile-btns-actions-seperat profile-btn-actions-lightred"
                  id="save-btn"
                  onClick={handleSkip}
                >
                  Gem
                </button>
              </div>
            </div>
            <button
              className="profile-btns profile-btns-actions-seperat profile-btn-actions-nobackground"
              onClick={handleSkip}
            >
              Spring over
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
