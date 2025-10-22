import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { auth } from "../firebase-config";
import { setCurrentUserStorage } from "../utils/currentUserEvents";
import Logo from "/btp-logo.png";

export default function SignUpPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(event) {
    event.preventDefault();
    // show the UpdateCard immediately so user can continue with profile details
    setErrorMessage("");

    const form = event.target;
    const fornavn =
      form.querySelector("#fornavn")?.value || form.name?.value || "";
    const efternavn =
      form.querySelector("#efternavn")?.value || form.efternavn?.value || "";
    const mail = form.querySelector("#mail")?.value || form.mail?.value || "";
    const phone =
      form.querySelector("#phone")?.value || form.phone?.value || "";
    const password =
      form.querySelector("#password")?.value || form.password?.value || "";

    try {
      // create Firebase Authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        mail,
        password
      );
      const user = userCredential.user;

      // assign a random rating between 1000 and 1500 for new users
      const rating = Math.floor(Math.random() * (1500 - 1000 + 1)) + 1000;

      // build profile payload (write both danish keys and legacy english keys for compatibility)
      const payload = {
        fornavn,
        efternavn,
        mail,
        phone,
        rating,
      };

      // persist profile to Realtime DB using PATCH so we don't overwrite other fields
      await createUser(user.uid, payload);
      // navigate to update route (use the new uid so UpdateCard persists after auth change)
      navigate(`/update/${user.uid}`);

      // fetch saved profile (best-effort) and store full object locally so UI updates
      let savedProfile = null;
      const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;
      if (firebaseDbUrlBase) {
        try {
          const resp = await fetch(
            `${firebaseDbUrlBase}/users/${user.uid}.json`
          );
          if (resp.ok) savedProfile = await resp.json();
        } catch {
          console.warn("Could not fetch saved profile after create");
        }
      }

      // persist currentUser locally so UI updates immediately
      const storageObj = savedProfile
        ? { uid: user.uid, mail: user.mail, profile: savedProfile }
        : {
            uid: user.uid,
            mail: user.mail,
            profile: { fornavn, efternavn, rating },
          };
      setCurrentUserStorage(storageObj);
    } catch (error) {
      let code = error.code || error.message || "unknown error";
      try {
        code = String(code).replaceAll("-", " ").replaceAll("auth/", "");
      } catch {
        /* noop */
      }
      // revert optimistic UI if signup failed
      setErrorMessage(code);
    }
  }

  async function createUser(uid, payload) {
    const url = `${
      import.meta.env.VITE_FIREBASE_DATABASE_URL
    }/users/${uid}.json`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Failed to create user record:", response.status, text);
        throw new Error("Failed to create user record");
      }
      const data = await response.json();
      console.log("New user created: ", data);
      return data;
    } catch (err) {
      setErrorMessage("Sorry, something went wrong");
      throw err;
    }
  }

  return (
    <div>
      <div className="login-page">
        <div className="login-page-logo">
          <img id="login-logo" src={Logo} alt="Bordtennisportalen.dk logo" />
        </div>
        <div className="profile-info-parent">
            <div className="profile-card">
              <div>
                <form
                  action="ProfileInfo"
                  className="profile-form"
                  onSubmit={handleSignUp}
                >
                  <input
                    id="fornavn"
                    type="text"
                    name="name"
                    className="profile-form-content"
                    placeholder="Fornavn"
                    required
                  />
                  <input
                    id="efternavn"
                    type="text"
                    name="efternavn"
                    className="profile-form-content"
                    placeholder="Efternavn"
                    required
                  />
                  <input
                    id="mail"
                    type="email"
                    name="mail"
                    className="profile-form-content"
                    aria-label="mail"
                    placeholder="Email"
                    required
                    autoComplete="off"
                  />
                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    className="profile-form-content"
                    placeholder="Telefonnummer"
                    required
                  />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="profile-form-content"
                    aria-label="password"
                    placeholder="Adgangskode"
                    autoComplete="current-password"
                    required
                  />
                  <div className="error-message">
                    <p>{errorMessage}</p>
                  </div>
                  <div className="profile-btns-actions">
                    <button className="profile-btns profile-btns-actions-seperat profile-btn-actions-lightred">
                      Opret konto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          <br />
          <p className="text-center">
            Har du allerede en konto? <Link to="/sign-in">Log på</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
