import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { auth } from "../firebase-config";
import Logo from "/btp-logo.png";
import Update from "../components/UpdateCard";

export default function SignUpPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleSignUp(event) {
    event.preventDefault();
    const form = event.target;

    const name = form.name.value;
    const mail = form.mail.value;
    const password = form.password.value;

    createUserWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        // Created and signed in
        const user = userCredential.user;
        createUser(user.uid, name, mail); // creating a new user in the database
      })
      .catch((error) => {
        let code = error.code; // saving error code in variable
        console.log(code);
        code = code.replaceAll("-", " "); // some JS string magic to display error message. See the log above in the console
        code = code.replaceAll("auth/", "");
        //setErrorMessage(code);
      });

    navigate({ Update });
  }

  async function createUser(uid, name, mail) {
    const url = `${
      import.meta.env.VITE_FIREBASE_DATABASE_URL
    }/users/${uid}.json`;
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({ name, mail }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("New user created: ", data);
    } else {
      setErrorMessage("Sorry, something went wrong");
    }
  }

  return (
    <div>
      <div className="login-page">
        <div className="login-page-logo">
          <img id="login-logo" src={Logo} alt="Bordtennisportalen.dk logo" />
        </div>
        <div className="profile-info-parent">
          <div className="profile-info-parent">
            <div className="profile-card">
              <div>
                <form
                  action="ProfileInfo"
                  className="profile-form"
                  onSubmit={handleSignUp}
                >
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="profile-form-content"
                    placeholder="Fornavn"
                    required
                  />
                  <input
                    id="lastname"
                    type="text"
                    name="lastname"
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
                    <button
                      className="profile-btns profile-btns-actions-seperat"
                      id="save-btn"
                    >
                      Opret konto
                    </button>
                  </div>
                </form>
              </div>

              <p className="text-center">
                Har du allerede en konto? <Link to="/sign-in">Log på</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
