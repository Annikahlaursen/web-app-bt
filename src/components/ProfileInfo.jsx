import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase-config";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { signOut } from "firebase/auth";
import pen from "/pen-solid-full.svg";
import trash from "/trash-solid-full.svg";
import Placeholder from "/image-solid-full.svg";

export default function ProfileInfo() {
  const navigate = useNavigate();

  // Profile fields
  const [fornavn, setFornavn] = useState("");
  const [efternavn, setEfternavn] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [adress, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  // Determine firebase DB URL for the current user (if available)
  const uid = auth?.currentUser?.uid;
  const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  useEffect(() => {
    // Load profile either from Firebase (if logged in) or from localStorage fallback
    async function loadProfile() {
      // Reset error
      setErrorMessage("");

      // If a Firebase user id exists, try to load from realtime database
      if (uid && firebaseDbUrlBase) {
        try {
          const url = `${firebaseDbUrlBase}/users/${uid}.json`;
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();
          if (data) {
            // prefer danish keys (fornavn/efternavn) but fall back to legacy keys
            setFornavn(data.fornavn || data.name || "");
            setEfternavn(data.efternavn || data.lastname || "");
            setGender(data.gender || "");
            setBirthday(data.birthday || "");
            setAdress(data.adress || "");
            setCity(data.city || "");
            setZip(data.zip || "");
            setMail(data.mail || "");
            setPhone(data.phone || "");
            setImage(data.image || "");
          }
          return;
        } catch (err) {
          console.error(err);
          setErrorMessage("Could not load profile from server");
        }
      }

      // Fallback: load current user from localStorage (set by login)
      try {
        const currentUserRaw = localStorage.getItem("currentUser");
        if (currentUserRaw) {
          const currentUser = JSON.parse(currentUserRaw);
          const p = currentUser.profile || {};
          setFornavn(p.fornavn || "");
          setEfternavn(p.efternavn || "");
          setGender(p.gender || "");
          setBirthday(p.birthday || "");
          setAdress(p.adress || "");
          setCity(p.city || "");
          setZip(p.zip || "");
          setMail(p.email || "");
          setPhone(p.phone || "");
          setImage(p.image || "");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Could not load local profile data");
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  async function handleSaveUser(event) {
    event.preventDefault();

    setErrorMessage("");

    // Persist both danish keys and legacy keys for compatibility
    const user = {
      fornavn: fornavn,
      efternavn: efternavn,
      gender,
      birthday,
      adress,
      city,
      zip,
      mail,
      phone,
      image,
    };

    // If we have a Firebase UID and DB base URL, save to Firebase realtime DB
    if (uid && firebaseDbUrlBase) {
      try {
        const url = `${firebaseDbUrlBase}/users/${uid}.json`;
        const response = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error("Failed to save user");
      } catch (err) {
        console.error(err);
        setErrorMessage("Sorry, something went wrong saving to server.");
        return;
      }
    }

    // Always update localStorage fallback copy
    try {
      const currentUserRaw = localStorage.getItem("currentUser");
      if (currentUserRaw) {
        const currentUser = JSON.parse(currentUserRaw);
        currentUser.profile = {
          fornavn: fornavn,
          efternavn: efternavn,
          gender,
          birthday,
          adress,
          city,
          zip,
          mail,
          phone,
          image,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        // notify listeners in same tab immediately
        window.dispatchEvent(
          new CustomEvent("currentUserChanged", { detail: currentUser })
        );
      }
    } catch (err) {
      console.error(err);
    }

    // After saving, navigate to the update view so the user can continue
    navigate("/profile/update");
  }

  /**
   * handleImageChange is called every time the user chooses an image in the file system.
   * The event is fired by the input file field in the form
   */
  async function handleImageChange(event) {
    const file = event.target.files && event.target.files[0]; // get the first file in the array
    if (!file) return;

    // increase allowed size to 2MB to be more forgiving
    const MAX_BYTES = 2_000_000; // 2 MB
    console.debug("Selected file:", file.name, file.size, "bytes");
    if (file.size <= MAX_BYTES) {
      // if file size is below or equal to 2MB
      const imageUrl = await uploadImage(file); // call the uploadImage function
      setImage(imageUrl); // set the image state with the image URL
      setErrorMessage(""); // reset errorMessage state
    } else {
      // if too big display an informative error message
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setErrorMessage(
        `Filen er for stor (${sizeMB} MB). Maks ${(
          MAX_BYTES /
          1024 /
          1024
        ).toFixed(2)} MB.`
      );
    }
  }

  async function uploadImage(imageFile) {
    try {
      // Initialize storage and upload the file to a user-specific path when possible
      const storage = getStorage();
      const uid = auth?.currentUser?.uid || "public";
      const fileRef = storageRef(
        storage,
        `profile_images/${uid}/${Date.now()}_${imageFile.name}`
      );
      const snapshot = await uploadBytes(fileRef, imageFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.error("Upload image failed:", err);
      setErrorMessage("Upload image failed");
      throw err;
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth); // sign out from firebase/auth
    } catch (err) {
      console.error("Sign out error:", err);
      setErrorMessage("Could not sign out. Try again.");
      return;
    }

    // clear local session and redirect to login
    try {
      localStorage.removeItem("currentUser");
    } catch (err) {
      console.error(err);
    }
    navigate("/");
  }

  // Delete profile from Realtime Database and sign the user out locally
  async function handleDeleteProfile() {
    const confirm = window.confirm(
      "Er du sikker på, at du vil slette din profil? Denne handling kan ikke fortrydes."
    );
    if (!confirm) return;

    setErrorMessage("");

    // Attempt to delete the DB record when we have a uid and DB base URL
    if (uid && firebaseDbUrlBase) {
      try {
        const url = `${firebaseDbUrlBase}/users/${uid}.json`;
        const resp = await fetch(url, { method: "DELETE" });
        if (!resp.ok) {
          const text = await resp.text();
          console.error("Failed to delete user record:", resp.status, text);
          setErrorMessage("Kunne ikke slette profilen på serveren.");
          return;
        }
      } catch (err) {
        console.error("Delete profile request failed:", err);
        setErrorMessage("Kunne ikke slette profilen. Prøv igen senere.");
        return;
      }
    }

    // Clear local session and sign out from Firebase auth
    try {
      try {
        await signOut(auth);
      } catch (err) {
        // If signOut fails, continue to clear local data anyway
        console.warn("Sign out after delete failed:", err);
      }

      try {
        localStorage.removeItem("currentUser");
      } catch (err) {
        console.warn("Could not clear local currentUser after delete:", err);
      }
    } finally {
      // Redirect to sign-in page
      navigate("/sign-in");
    }
  }

  return (
    <Fragment>
      <div className="profile-info-parent">
        <div className="profile-card">
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
          </div>
          <div className="profile-card-actions">
            <a
              id="profile-card-actions-seperat"
              onClick={() => fileInputRef.current.click()}
            >
              <img src={pen} alt="Edit icon" style={{ width: "1.5rem" }} />
              Rediger
            </a>
            <a
              id="profile-card-actions-seperat"
              onClick={async () => {
                // remove image handler
                async function handleRemoveImage() {
                  setErrorMessage("");

                  // first try to update the server record if possible
                  if (uid && firebaseDbUrlBase) {
                    try {
                      const url = `${firebaseDbUrlBase}/users/${uid}.json`;
                      const resp = await fetch(url, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: "" }),
                      });
                      if (!resp.ok) {
                        const txt = await resp.text();
                        console.error(
                          "Failed to clear image on server:",
                          resp.status,
                          txt
                        );
                        setErrorMessage(
                          "Kunne ikke fjerne billedet på serveren."
                        );
                        return;
                      }
                    } catch (err) {
                      console.error("Error clearing image on server:", err);
                      setErrorMessage(
                        "Kunne ikke fjerne billedet på serveren."
                      );
                      return;
                    }
                  }

                  // Update localStorage fallback copy and notify listeners
                  try {
                    const currentUserRaw = localStorage.getItem("currentUser");
                    if (currentUserRaw) {
                      const currentUser = JSON.parse(currentUserRaw);
                      currentUser.profile = currentUser.profile || {};
                      currentUser.profile.image = "";
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
                    console.error(
                      "Failed to update local currentUser after removing image:",
                      err
                    );
                  }

                  // finally update component state so UI shows placeholder
                  setImage("");
                }

                // ask user for confirmation before removing image
                const confirmRemove = window.confirm(
                  "Vil du fjerne dit profilbillede?"
                );
                if (confirmRemove) await handleRemoveImage();
              }}
            >
              <img src={trash} alt="Delete icon" style={{ width: "1.5rem" }} />
              Fjern
            </a>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Personlige oplysninger</h3>
          </div>
          <div>
            <form className="profile-form" onSubmit={handleSaveUser}>
              <input
                type="text"
                className="profile-form-content"
                id="name"
                name="name"
                placeholder="Fornavn"
                value={fornavn}
                onChange={(e) => setFornavn(e.target.value)}
              />

              <input
                type="text"
                className="profile-form-content"
                id="efternavn"
                name="efternavn"
                placeholder="Efternavn"
                value={efternavn}
                onChange={(e) => setEfternavn(e.target.value)}
              />

              <select
                id="gender"
                name="gender"
                className="profile-form-content"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Vælg køn</option>
                <option value="Kvinde">Kvinde</option>
                <option value="Mand">Mand</option>
                <option value="Andet">Andet</option>
              </select>

              <input
                type="date"
                className="profile-form-content"
                id="birthday"
                name="birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />

              <input
                type="text"
                className="profile-form-content"
                id="adress"
                name="adress"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
                placeholder="Adresse"
              />

              <input
                type="text"
                className="profile-form-content"
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="By"
              />

              <input
                type="text"
                className="profile-form-content"
                id="zip"
                name="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Postnummer"
              />

              <input
                type="email"
                className="profile-form-content"
                id="email"
                name="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="Email"
              />

              <input
                type="phone"
                className="profile-form-content"
                id="phone"
                name="phone"
                placeholder="Telefonnummer"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="error-message" style={{ color: "#c00" }}>
                {errorMessage && <p>{errorMessage}</p>}
              </div>

              <div className="profile-btns-actions">
                <button
                  type="submit"
                  className="profile-btns profile-btns-actions-seperat profile-btn-actions-lightred"
                  id="save-btn"
                >
                  Gem
                </button>
              </div>
            </form>
          </div>

          <div className="profile-btns-actions">
            <button
              className="profile-btns profile-btns-actions-seperat profile-btn-actions-blackborder"
              onClick={handleSignOut}
            >
              Log ud
            </button>
            <button className="profile-btns profile-btns-actions-seperat profile-btn-actions-blackborder">
              Opdater adgangskode
            </button>
            <button className="profile-btns profile-btns-actions-seperat profile-btn-actions-blackborder">
              Tilknyt login til Face ID
            </button>
            <button className="profile-btns profile-btns-actions-seperat profile-btn-actions-blackborder">
              Indstillinger
            </button>
            <br />
            <button
              className="profile-btns profile-btns-actions-seperat profile-btn-actions-blackborder"
              onClick={handleDeleteProfile}
            >
              Slet profil
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
