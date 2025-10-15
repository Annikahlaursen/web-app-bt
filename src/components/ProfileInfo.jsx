import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import pen from "/pen-solid-full.svg";
import trash from "/trash-solid-full.svg";

export default function ProfileInfo() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [mail, setMail] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/users/${
    auth.currentUser?.uid
  }.json`; // replace YOUR-FIREBASE-URL with your Firebase URL

  useEffect(() => {
    async function getUser() {
      const response = await fetch(url);
      const data = await response.json();

      if (data) {
        setName(data.name);
        setTitle(data.title);
        setMail(data.mail);
        setImage(data.image);
      }
      setIsLoading(false);
    }
    getUser();
  }, [url]);

  async function handleSaveUser(event) {
    event.preventDefault();
    setIsLoading(true);

    const user = {
      name,
      title,
      mail,
      image,
    };

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      setErrorMessage("Sorry, something went wrong. Please try again.");
    }
    setIsLoading(false);
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

  function handleSignOut() {
    signOut(auth); // sign out from firebase/auth
  }

  return (
    <Fragment>
      <div className="profile-info-parent">
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Profilbillede</h3>
          </div>
          <div className="profile-info-card-image profile-card-content">
            <img src={image} alt="Placeholder image" />
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
                onChange={(e) => setGender}
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
            </form>
          </div>
          <div className="profile-btns-actions">
            <button
              type="submit"
              className="profile-btns profile-btns-actions-seperat"
              id="save-btn"
            >
              Gem
            </button>
            <br />
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
