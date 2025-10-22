import { Fragment, useState, useRef } from "react";
import { useNavigate } from "react-router";
import Placeholder from "/user-solid-full.svg";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth } from "../firebase-config";
import { setCurrentUserStorage } from "../utils/currentUserEvents";

export default function CreateCard() {
  const [image, setImage] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSave = () => {
    navigate(`/update/${auth?.currentUser?.uid}`);
  };

  async function handleImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      const storage = getStorage();
      const uid = auth?.currentUser?.uid || "public";
      const fileRef = storageRef(
        storage,
        `profile_images/${uid}/${Date.now()}_${file.name}`
      );
      const snap = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snap.ref);
      setImage(downloadUrl);

      // Update localStorage.currentUser so Overlay/ProfileInfo react
      try {
        const raw = localStorage.getItem("currentUser");
        if (raw) {
          const cur = JSON.parse(raw);
          cur.profile = cur.profile || {};
          cur.profile.image = downloadUrl;
          setCurrentUserStorage(cur);
        } else {
          // no currentUser yet; store minimal profile so UI can show image
          setCurrentUserStorage({
            uid: null,
            email: null,
            profile: { image: downloadUrl },
          });
        }
      } catch (err) {
        console.warn("Could not update currentUser in localStorage:", err);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      // keep placeholder if upload fails
    }
  }


  return (
    <Fragment>
      <div className="profile-info-parent">
        <div className="profile-card">
          <div className="profile-info-card-image profile-card-content">
            <input
              type="file"
              className="hide"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <img
              src={image || Placeholder}
              alt="Placeholder image"
              style={{ width: "100%", cursor: "pointer" }}
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            />
          </div>
        </div>
        <div className="profile-card">
          <div>
            <form action="ProfileInfo" className="profile-form">
              <input
                type="text"
                className="profile-form-content"
                id="name"
                name="name"
                placeholder="Fornavn"
              />
              <input
                type="text"
                className="profile-form-content"
                id="lastname"
                name="lastname"
                placeholder="Efternavn"
              />
              <input
                type="date"
                className="profile-form-content"
                id="birthday"
                name="Fødselsdato"
              />
              <input
                type="email"
                className="profile-form-content"
                id="email"
                name="email"
                placeholder="Din email"
              />
              <input
                type="phone"
                className="profile-form-content"
                id="phone"
                name="phone"
                placeholder="Dit telefonnummer"
              />
              <input
                type="code"
                className="profile-form-content"
                id="code"
                name="code"
                placeholder="Adgangskode"
              />
              <input
                type="code"
                className="profile-form-content"
                id="code"
                name="code"
                placeholder="Gentag adgangskode"
              />
            </form>
          </div>
          <div className="profile-btns-actions">
            <button
              className="profile-btns profile-btns-actions-seperat"
              id="save-btn"
              onClick={handleSave}
            >
              Gem
            </button>
          </div>
        </div>
        <button className="profile-btns profile-btns-actions-seperat">
          Tilknyt login til FaceBook
        </button>
      </div>
    </Fragment>
  );
}
