import { Fragment, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase-config";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Placeholder from "/image-solid-full.svg";
import Select from "react-select";
import Pen from "/pen-solid-full.svg";
import Logo from "/btp-logo.png";
import { setCurrentUserStorage } from "../utils/currentUserEvents";

export default function ProfileInfo() {
  const navigate = useNavigate();

  // Profile fields
  const [selectedKlub, setSelectedKlub] = useState(null);
  const [selectedHold, setSelectedHold] = useState(null);
  const [image, setImage] = useState(""); // image download URL
  const [setStoragePath] = useState(""); // storage path used for deletion
  const [klubber, setKlubber] = useState([]);
  const [hold, setHold] = useState([]);

  const fileInputRef = useRef(null);

  // Determine firebase DB URL for the current user (if available)
  const uid = auth?.currentUser?.uid;
  const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  const handleSkip = () => {
    navigate("/");
  };

  async function handleSave(event) {
    event.preventDefault();

    const url = `${firebaseDbUrlBase}/users/${uid}.json`;
    const response = await fetch(url);
    const currentUserData = await response.json();

    // Brug først valgte hold/klub hvis flere er valgt
    const klub = selectedKlub || null;
    const hold = selectedHold || null;

    // Find klubbens billede (hvis det findes)
    let kidImage = "";
    if (klub) {
      const klubObj = klubber.find((k) => k.id === klub.value);
      if (klubObj) {
        kidImage =
          klubObj.image ||
          klubObj.billede ||
          klubObj.logo ||
          klubObj.img ||
          klubObj.url ||
          "";
      }
    }

    // Opdater brugerdata
    const updatedUserData = {
      ...currentUserData,
      kid: klub ? klub.value : null,
      kidNavn: klub ? klub.label : "",
      kidImage: kidImage,
      hid: hold ? hold.value : null,
      hidNavn: hold ? hold.label : "",
      image: image || currentUserData.image || null,
    };

    // Push opdaterede data til Firebase
    const patchResponse = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUserData),
    });

    if (!patchResponse.ok) throw new Error("Failed to update user data.");

    // Opdater currentUser i localStorage
    const currentUser = {
      ...JSON.parse(localStorage.getItem("currentUser") || "{}"),
      profile: {
        ...(JSON.parse(localStorage.getItem("currentUser") || "{}").profile ||
          {}),
        kid: updatedUserData.kid,
        kidNavn: updatedUserData.kidNavn,
        kidImage: updatedUserData.kidImage,
        hid: updatedUserData.hid,
        hidNavn: updatedUserData.hidNavn,
        image: updatedUserData.image,
      },
    };

    setCurrentUserStorage(currentUser); // Opdater localStorage og broadcast ændringer

    // Naviger tilbage til forsiden
    navigate("/");
  }

  async function handleImageChange(event) {
    const file = event.target.files && event.target.files[0]; // get the first file in the array
    if (!file) return;

    // increase allowed size to 2MB to be more forgiving
    const MAX_BYTES = 2_000_000; // 2 MB
    console.debug("Selected file:", file.name, file.size, "bytes");
    if (file.size <= MAX_BYTES) {
      // show an immediate preview while uploading
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);

      try {
        const storage = getStorage();
        const uidSafe = auth?.currentUser?.uid || "public";
        const path = `profile_images/${uidSafe}/${Date.now()}_${file.name}`;
        const fileRef = storageRef(storage, path);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // keep a no-op reference to snapshot so linters don't complain
            // about an unused parameter
            void snapshot;
          },
          (err) => {
            console.error("Upload failed:", err);
            // revoke preview if it was created (ignore any revoke errors)
            try {
              URL.revokeObjectURL(previewUrl);
            } catch {
              /* ignore */
            }
          },
          async () => {
            // success
            try {
              const downloadUrl = await getDownloadURL(fileRef);
              setImage(downloadUrl);
              setStoragePath(path);

              // update DB/localStorage immediately with the new image so other components reflect change
              if (uid && firebaseDbUrlBase) {
                try {
                  const url = `${firebaseDbUrlBase}/users/${uid}.json`;
                  await fetch(url, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      image: downloadUrl,
                      storagePath: path,
                    }),
                  });
                } catch (err) {
                  console.warn("Failed to persist image URL to DB:", err);
                }
              }

              try {
                const currentUserRaw = localStorage.getItem("currentUser");
                if (currentUserRaw) {
                  const currentUser = JSON.parse(currentUserRaw);
                  currentUser.profile = currentUser.profile || {};
                  currentUser.profile.image = downloadUrl;
                  currentUser.profile.storagePath = path;
                  localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                  );
                  window.dispatchEvent(
                    new CustomEvent("currentUserChanged", {
                      detail: currentUser,
                    })
                  );
                }
              } catch (err) {
                console.warn(
                  "Failed to update local currentUser after upload:",
                  err
                );
              }
            } finally {
              // revoke preview if it was created (ignore any revoke errors)
              try {
                URL.revokeObjectURL(previewUrl);
              } catch {
                /* ignore */
              }
            }
          }
        );
      } catch (err) {
        console.error("Upload image failed:", err);
      }
    }
  }

  useEffect(() => {
    async function fetchData(endpoint) {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${endpoint}.json`
      );
      const data = await response.json();

      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    }
    async function fetchDropdownData() {
      const klubArray = await fetchData("klubber");
      setKlubber(klubArray);

      const holdArray = await fetchData("hold");
      setHold(holdArray);
    }

    fetchDropdownData();
  }, []);

  const klubOptions = klubber.map((klub) => ({
    value: klub.id,
    label: klub.navn,
  }));

  const holdOptions = hold.map((hold) => ({
    value: hold.id,
    label: hold.navn,
  }));

  return (
    <Fragment>
      <div>
        <div className="login-page">
          <div className="login-page-logo">
            <img src={Logo} alt="Bordtennisportalen.dk logo" />
          </div>
          <div>
            <div className="profile-card update-card">
              <div className="profile-card-header">
                <h3>Profilbillede</h3>
              </div>
              <div className="profile-card-content">
                <input
                  type="file"
                  className="hide"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
                <img
                  id="image"
                  className="profile-image-preview"
                  src={image || Placeholder}
                  alt="Choose"
                  onError={(e) => {
                    // if the image fails to load, use the placeholder image
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = Placeholder;
                  }}
                  onClick={() => fileInputRef.current.click()}
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
              <div>
                <h3>Personlige oplysninger</h3>
              </div>
              <div className="profile-form">
                <Select
                  options={klubOptions}
                  placeholder="Vælg klub"
                  onChange={(selectedOption) => setSelectedKlub(selectedOption)}
                  isClearable
                  isSearchable
                  value={selectedKlub}
                />
                <Select
                  options={holdOptions}
                  placeholder="Vælg hold"
                  onChange={(selectedOption) => setSelectedHold(selectedOption)}
                  isClearable
                  isSearchable
                  value={selectedHold}
                />
              </div>
              <div className="profile-btns-actions">
                <button
                  className="profile-btns-actions-seperat profile-btn-actions-lightred"
                  id="save-btn"
                  onClick={handleSave}
                >
                  Gem
                </button>
              </div>
            </div>
            <button
              className="profile-btns-actions-seperat profile-btn-actions-nobackground"
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
