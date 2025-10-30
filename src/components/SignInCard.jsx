import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase-config";
import { setCurrentUserStorage } from "../utils/currentUserEvents";

export default function SignInCard() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  async function handleSignIn(event) {
    event.preventDefault();
    setErrorMessage("");

    const mail = event.target.mail.value;
    const password = event.target.password.value;

    console.log(auth);

    console.log(mail, password);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        mail,
        password
      );
      const user = userCredential.user;

      // Try to load the user's profile from the realtime DB (by uid)
      let profile = null;
      const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;
      if (firebaseDbUrlBase && user?.uid) {
        try {
          const url = `${firebaseDbUrlBase}/users/${user.uid}.json`;
          const resp = await fetch(url);
          if (resp.ok) {
            const data = await resp.json();
            if (data) profile = data;
          }
        } catch (e) {
          console.warn("Could not load user profile from DB", e);
        }
      }

      if (profile) {
        const currentUser = {
          uid: user.uid,
          mail: user.email,
          profile: {
            ...profile,
            hid: profile.hid?.value || profile.hid,
            kid: profile.kid?.value || profile.kid,
          },
        };

        // Opdater Firebase database til at sikre hid og kid er opdateret
        const firebaseDbUrlBase = import.meta.env.VITE_FIREBASE_DATABASE_URL;
        if (firebaseDbUrlBase && user?.uid) {
          const url = `${firebaseDbUrlBase}/users/${user.uid}.json`;
          try {
            await fetch(url, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                hid: currentUser.profile.hid,
                kid: currentUser.profile.kid,
              }),
            });
          } catch (err) {
            console.warn(
              "Failed to update Firebase database during login:",
              err
            );
          }
        }

        setCurrentUserStorage(currentUser);
      } else {
        // fallback: store minimal info so UI still reacts
        setCurrentUserStorage({ uid: user.uid, email: user.email });
      }

      // navigate to home on success
      navigate("/");
    } catch (error) {
      let code = error.code || error.message || "Login failed";
      // normalize known Firebase auth codes
      if (typeof code === "string") {
        code = code.replaceAll("-", " ").replaceAll("auth/", "");
      }
      if (code === "invalid credential") {
        code = "Forkert adgangskode eller email. Prøv igen.";
      } else if (code === "user not found") {
        code = "Brugeren blev ikke fundet. Tjek din email.";
      }

      setErrorMessage(code);
    }
  }

  const handleGoToSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <section>
      <div>
        <form className="profile-form" onSubmit={handleSignIn}>
          <input
            id="mail"
            className="profile-form-content"
            type="email"
            name="mail"
            aria-label="mail"
            placeholder="Email"
            required
          />
          <input
            id="password"
            className="profile-form-content"
            type="password"
            name="password"
            aria-label="password"
            placeholder="Adgangskode"
            autoComplete="current-password"
          />
          {errorMessage && (
            <div className="error-message-light">
              <p>{errorMessage}</p>
            </div>
          )}
          <div>
            <button
              className="profile-btns profile-btns-actions-seperat profile-btns-actions-white"
              type="submit"
            >
              Log på
            </button>
            <p style={{ color: "#fff" }}>Har du glemt din adgangskode?</p>
          </div>
        </form>

        <div className="profile-btns-actions">
          <button
            className="profile-btns-actions-seperat profile-btn-actions-red"
            onClick={handleGoToSignUp}
          >
            Opret ny konto
          </button>
          <p style={{ color: "#fff" }}>Eller</p>
          <button className="profile-btns-actions-seperat profile-btns-actions-style">
            Log ind med Facebook
          </button>
          <button className="profile-btns-actions-seperat profile-btns-actions-style">
            Log ind med Google
          </button>
        </div>
      </div>
    </section>
  );
}
