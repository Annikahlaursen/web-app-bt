import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import pen from "/pen-solid-full.svg";
import trash from "/trash-solid-full.svg";

export default function ProfileInfo() {
  const navigate = useNavigate();

  // Profile fields
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
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
            setName(data.name || "");
            setLastname(data.lastname || "");
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
          setName(p.firstName || "");
          setLastname(p.lastName || "");
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

    const user = {
      name,
      lastname,
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
          firstName: name,
          lastName: lastname,
          gender,
          birthday,
          adress,
          city,
          zip,
          email: mail,
          phone,
          image,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
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
    const file = event.target.files[0]; // get the first file in the array
    if (file.size < 500000) {
      // if file size is below 0.5MB
      const imageUrl = await uploadImage(file); // call the uploadImage function
      setImage(imageUrl); // set the image state with the image URL
      setErrorMessage(""); // reset errorMessage state
    } else {
      // if not below 0.5MB display an error message using the errorMessage state
      setErrorMessage("The image file is too big!");
    }
  }

  async function uploadImage(imageFile) {
    const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseProjectId}.appspot.com/o/${imageFile.name}`;
    // POST request to upload image
    const response = await fetch(url, {
      method: "POST",
      body: imageFile,
      headers: { "Content-Type": imageFile.type },
    });

    if (!response.ok) {
      setErrorMessage("Upload image failed"); // set errorMessage state with error message
      throw new Error("Upload image failed"); // throw an error
    }

    const imageUrl = `${url}?alt=media`; // get the image URL
    return imageUrl; // return the image URL
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
              className={"image-preview"}
              src={
                image
                  ? image
                  : "https://placehold.co/600x400?text=Click+here+to+select+an+image"
              }
              alt="Choose"
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/600x400?text=Error+loading+image")
              }
              onClick={() => fileInputRef.current.click()}
            />{" "}
          </div>
          <div className="profile-card-actions">
            <a id="profile-card-actions-seperat">
              <img src={pen} alt="Edit icon" style={{ width: "1.5rem" }} />
              Rediger
            </a>
            <a id="profile-card-actions-seperat">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                className="profile-form-content"
                id="lastname"
                name="lastname"
                placeholder="Efternavn"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
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
                  className="profile-btns profile-btns-actions-seperat"
                  id="save-btn"
                >
                  Gem
                </button>
              </div>
            </form>
          </div>

          <div className="profile-btns-actions">
            <button
              className="profile-btns profile-btns-actions-seperat"
              onClick={handleSignOut}
            >
              Log ud
            </button>
            <button className="profile-btns profile-btns-actions-seperat">
              Opdater adgangskode
            </button>
            <button className="profile-btns profile-btns-actions-seperat">
              Tilknyt login til Face ID
            </button>
            <button className="profile-btns profile-btns-actions-seperat">
              Indstillinger
            </button>
            <br />
            <button className="profile-btns profile-btns-actions-seperat">
              Slet profil
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
