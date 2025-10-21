import { Fragment, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Pen from "/pen-solid-full.svg";
import Logo from "/btp-logo.png";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { uploadBytesResumable } from "firebase/storage";
import { auth } from "../firebase-config";
import Placeholder from "/image-solid-full.svg";
import { setCurrentUserStorage } from "../utils/currentUserEvents";
import Select from "react-select";

export default function Update() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  const uid = auth?.currentUser?.uid;
  const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  const handleSkip = () => {
    navigate("/home");
  };

  const handleSave = () => {
    navigate("/update/:id");
  };

  useEffect(() => {
    // Load profile either from Firebase (if logged in) or from localStorage fallback
    async function loadProfile() {
      setErrorMessage("");

      if (uid && firebaseDbUrlBase) {
        try {
          const url = `${firebaseDbUrlBase}/users/${uid}.json`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (data && data.image) {
              setImage(data.image);
              return;
            }
          }
        } catch (err) {
          console.error("Could not load profile from server:", err);
          setErrorMessage("Could not load profile from server");
        }
      }

      // fallback to localStorage
      try {
        const currentUserRaw = localStorage.getItem("currentUser");
        if (currentUserRaw) {
          const currentUser = JSON.parse(currentUserRaw);
          const p = currentUser.profile || {};
          if (p.image) setImage(p.image);
        }
      } catch (err) {
        console.error("Could not load local profile data:", err);
        setErrorMessage("Could not load local profile data");
      }
    }

    loadProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  /**
   * handleImageChange is called every time the user chooses an image in the file system.
   * The event is fired by the input file field in the form
   */
  async function handleImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const MAX_BYTES = 2_000_000; // 2 MB
    console.debug("Selected file for UpdateCard:", file.name, file.size);
    if (file.size > MAX_BYTES) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setErrorMessage(
        `Filen er for stor (${sizeMB} MB). Maks ${(
          MAX_BYTES /
          1024 /
          1024
        ).toFixed(2)} MB.`
      );
      return;
    }

    // show immediate local preview
    const preview = URL.createObjectURL(file);
    setImage(preview);
    setErrorMessage("");

    try {
      const storage = getStorage();
      const uidForPath = auth?.currentUser?.uid || "public";
      const fileRef = storageRef(
        storage,
        `profile_images/${uidForPath}/${Date.now()}_${file.name}`
      );
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(pct);
        },
        (err) => {
          console.error("Upload failed:", err);
          setErrorMessage("Upload failed, prøv igen");
          URL.revokeObjectURL(preview);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadUrl);
          setUploadProgress(100);

          // Persist to DB when authenticated
          if (uid && firebaseDbUrlBase) {
            try {
              const url = `${firebaseDbUrlBase}/users/${uid}.json`;
              await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: downloadUrl }),
              });
            } catch (err) {
              console.warn("Could not persist image to DB:", err);
            }
          }

          // Update localStorage so Overlay/ProfileInfo react immediately
          try {
            const raw = localStorage.getItem("currentUser");
            if (raw) {
              const cur = JSON.parse(raw);
              cur.profile = cur.profile || {};
              cur.profile.image = downloadUrl;
              setCurrentUserStorage(cur);
            } else {
              setCurrentUserStorage({
                uid: uid || null,
                email: auth?.currentUser?.email || null,
                profile: { image: downloadUrl },
              });
            }
          } catch (err) {
            console.warn("Could not update currentUser in localStorage:", err);
          }

          URL.revokeObjectURL(preview);
        }
      );
    } catch (err) {
      console.error("Unexpected upload error:", err);
      setErrorMessage("Upload image failed");
    }
  }

  const [klubber, setKlubber] = useState([]);
  const [hold, setHold] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const klubResponse = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`
      );
      const klubData = await klubResponse.json();
      const klubArray = Object.keys(klubData).map((key) => ({
        id: key,
        ...klubData[key],
      }));
      // setKlubber(klubArray); --- IGNORE ---

      setKlubber(klubArray);

      const holdResponse = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`
      );
      const holdData = await holdResponse.json();
      const holdArray = Object.keys(holdData).map((key) => ({
        id: key,
        ...holdData[key],
      }));

      setHold(holdArray);
    }

    fetchData();
  }, []);

  const klubOptions = klubber.map((klubber) => ({
    value: klubber.id,
    label: klubber.navn,
  }));

  const holdOptions = hold.map((hold) => ({
    value: hold.id,
    label: hold.navn,
  }));

  // uploadImage helper removed — using uploadBytesResumable in handleImageChange for progress

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
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
                <img
                  id="image"
                  className={"profile-image-preview"}
                  src={image || Placeholder}
                  alt="Choose"
                  onError={(e) => {
                    // if the image fails to load, use the placeholder image
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = Placeholder;
                  }}
                  onClick={() => fileInputRef.current.click()}
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="upload-spinner-overlay">
                    <div className="spinner" aria-hidden="true" />
                    <div className="upload-percent">{uploadProgress}%</div>
                  </div>
                )}
              </div>
              {errorMessage && (
                <div className="error-message" style={{ color: "#c00" }}>
                  {errorMessage}
                </div>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                  <div
                    className="upload-progress-bar"
                    style={{
                      width: `${uploadProgress}%`,
                      background: "var(--lightred)",
                      height: "8px",
                      borderRadius: "4px",
                    }}
                  />
                  <p>{uploadProgress}%</p>
                </div>
              )}
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
              <div className="profile-form">
                <Select
                  options={klubOptions}
                  placeholder="Vælg klub"
                  isClearable
                  isMulti
                  isSearchable
                ></Select>
                <Select
                  options={holdOptions}
                  placeholder="Vælg hold"
                  isClearable
                  isMulti
                  isSearchable
                ></Select>
              </div>
              <div className="profile-btns-actions">
                <button
                  className="profile-btns profile-btns-actions-seperat profile-btn-actions-lightred"
                  id="save-btn"
                  onClick={handleSave}
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
