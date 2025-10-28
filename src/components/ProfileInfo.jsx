import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router";
import { auth } from "../firebase-config";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import pen from "/pen-solid-full.svg";
import trash from "/trash-solid-full.svg";
import Placeholder from "/image-solid-full.svg";
import SignOutCard from "./SignOutCard";
import { signOut } from "firebase/auth";

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
  const [image, setImage] = useState(""); // image download URL
  const [storagePath, setStoragePath] = useState(""); // storage path used for deletion
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSignOutCard, setShowSignOutCard] = useState(false);

  const fileInputRef = useRef(null);

  // Determine firebase DB URL for the current user (if available)
  const uid = auth?.currentUser?.uid;
  const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;

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
            if (data) {
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
              setStoragePath(data.storagePath || "");
              return;
            }
          }
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
          setStoragePath(p.storagePath || "");
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
    setIsSaving(true);
    setErrorMessage("");

    const user = {
      fornavn,
      efternavn,
      gender,
      birthday,
      adress,
      city,
      zip,
      mail,
      phone,
      image,
      storagePath,
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
        setIsSaving(false);
        return;
      }
    }

    // Always update localStorage fallback copy
    try {
      const currentUserRaw = localStorage.getItem("currentUser");
      if (currentUserRaw) {
        const currentUser = JSON.parse(currentUserRaw);
        currentUser.profile = {
          fornavn,
          efternavn,
          gender,
          birthday,
          adress,
          city,
          zip,
          mail,
          phone,
          image,
          storagePath,
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

    setIsSaving(false);
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
      // show an immediate preview while uploading
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setErrorMessage("");

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
            setErrorMessage("Upload image failed");
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
        setErrorMessage("Upload image failed");
      }
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

  const handleShowSignOut = (e) => {
    e.preventDefault();
    setShowSignOutCard(true);
  };

  const handleCloseSignOut = () => {
    setShowSignOutCard(false);
  };

  /* async function handleShowSignOut(e) {
    try {
      await signOut(auth); // sign out from firebase/auth
    } catch (err) {
      console.error("Sign out error:", err);
      setErrorMessage("Could not sign out. Try again.");
      e.preventDefault();
      setShowSignOutCard(true);
    }

    // clear local session and redirect to login
    try {
      localStorage.removeItem("currentUser");
    } catch (err) {
      console.error(err);
    }
    navigate("/");
  } */

  // Delete profile from Realtime Database and sign the user out locally
  async function handleDeleteProfile() {
    const confirmed = window.confirm(
      "Er du sikker på, at du vil slette din profil? Denne handling kan ikke fortrydes."
    );
    if (!confirmed) return;

    setErrorMessage("");

    // If the user has an uploaded profile image, try to delete it from Storage first
    if (storagePath) {
      try {
        const storage = getStorage();
        const imgRef = storageRef(storage, storagePath);
        await deleteObject(imgRef);
      } catch (err) {
        console.warn("Failed to delete profile image from Storage:", err);
        // we continue even if deleting the image failed
      }
    } else if (image) {
      // try to parse a firebase storage URL and delete by decoded path
      try {
        const parsed = new URL(image);
        if (
          parsed.hostname.includes("firebasestorage.googleapis.com") &&
          parsed.pathname.includes("/o/")
        ) {
          const encodedPath = parsed.pathname.split("/o/")[1];
          const path = decodeURIComponent(encodedPath);
          const storage = getStorage();
          const imgRef = storageRef(storage, path);
          await deleteObject(imgRef);
        }
      } catch (err) {
        console.warn(
          "Failed to parse or delete storage object for image:",
          err
        );
      }
    }

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

  // Remove profile image: delete storage object when possible, clear DB/local state and UI
  async function handleRemoveImage() {
    const confirmRemove = window.confirm("Vil du fjerne dit profilbillede?");
    if (!confirmRemove) return;

    setErrorMessage("");

    // Try deleting the storage object using stored storagePath first
    if (storagePath) {
      try {
        const storage = getStorage();
        const imgRef = storageRef(storage, storagePath);
        await deleteObject(imgRef);
      } catch (err) {
        console.warn("Failed to delete storage object by storagePath:", err);
        setErrorMessage(
          "Kunne ikke fjerne billedet fra Storage, men profilen vil blive opdateret."
        );
        // continue
      }
    } else if (image) {
      // Fallback: try to parse a firebase storage URL and delete by decoded path
      try {
        const parsed = new URL(image);
        if (
          parsed.hostname.includes("firebasestorage.googleapis.com") &&
          parsed.pathname.includes("/o/")
        ) {
          const encodedPath = parsed.pathname.split("/o/")[1];
          const path = decodeURIComponent(encodedPath);
          const storage = getStorage();
          const imgRef = storageRef(storage, path);
          await deleteObject(imgRef);
        }
      } catch (err) {
        console.warn("Failed to delete storage object by parsing URL:", err);
        setErrorMessage(
          "Kunne ikke fjerne billedet fra Storage, men profilen vil blive opdateret."
        );
      }
    }

    // Clear DB record
    if (uid && firebaseDbUrlBase) {
      try {
        const url = `${firebaseDbUrlBase}/users/${uid}.json`;
        const resp = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: "", storagePath: "" }),
        });
        if (!resp.ok) {
          const txt = await resp.text();
          console.error("Failed to clear image on server:", resp.status, txt);
          setErrorMessage("Kunne ikke fjerne billedet på serveren.");
          return;
        }
      } catch (err) {
        console.error("Error clearing image on server:", err);
        setErrorMessage("Kunne ikke fjerne billedet på serveren.");
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
        currentUser.profile.storagePath = "";
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        window.dispatchEvent(
          new CustomEvent("currentUserChanged", { detail: currentUser })
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
    setStoragePath("");
  }

  return (
    <Fragment>
      <div>
        <div className="profile-card">
          <div>
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
            <div style={{ position: "relative" }}>
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
          </div>
          <div className="profile-card-actions">
            <a
              id="profile-card-actions-seperat"
              onClick={() => fileInputRef.current.click()}
            >
              <img src={pen} alt="Edit icon" style={{ width: "1.5rem" }} />
              Rediger
            </a>
            <a id="profile-card-actions-seperat" onClick={handleRemoveImage}>
              <img src={trash} alt="Delete icon" style={{ width: "1.5rem" }} />
              Fjern
            </a>
          </div>
        </div>

        <div className="profile-card">
          <div>
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
                  {isSaving ? "Gemmer..." : "Gem"}
                </button>
              </div>
            </form>
          </div>

          <div className="profile-btns-actions">
            <button
              className="profile-btns-actions-seperat profile-btn-actions-blackborder"
              onClick={handleShowSignOut}
            >
              Log ud
            </button>
            <button className="profile-btns-actions-seperat profile-btn-actions-blackborder">
              Opdater adgangskode
            </button>
            <button className="profile-btns-actions-seperat profile-btn-actions-blackborder">
              Tilknyt login til Face ID
            </button>
            <NavLink to={"/update/:id"}>
              <button className="profile-btns-actions-seperat profile-btn-actions-blackborder">
                Indstillinger
              </button>
            </NavLink>
            <br />
            <button
              className="profile-btns-actions-seperat profile-btn-actions-blackborder"
              onClick={handleDeleteProfile}
            >
              Slet profil
            </button>
          </div>
        </div>
      </div>
      <SignOutCard isOpen={showSignOutCard} onClose={handleCloseSignOut} />
    </Fragment>
  );
}
