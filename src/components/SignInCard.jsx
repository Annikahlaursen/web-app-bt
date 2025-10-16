import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase-config";

export default function SignInCard() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSignIn(event) {
    event.preventDefault();
    const mail = event.target.mail.value; // mail value from input field in sign in form
    const password = event.target.password.value; // password value from input field in sign in form

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        mail,
        password
      );
      const user = userCredential.user;
      // store minimal user info for later pages (ProfileInfo reads from localStorage fallback)
      try {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ uid: user.uid, email: user.email })
        );
        // also set auth flag so App can render private routes immediately
        localStorage.setItem("isAuth", "true");
      } catch (e) {
        console.warn("Could not write currentUser to localStorage", e);
      }
      // navigate to home on success
      navigate("/home");
    } catch (error) {
      let code = error.code || error.message || "Login failed";
      // normalize known Firebase auth codes
      if (typeof code === "string") {
        code = code.replaceAll("-", " ").replaceAll("auth/", "");
      }
      setErrorMessage(code);
    }
  }

  const handleGoToSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <section className="profile-info-parent">
      <div>
        <form className="profile-form" onSubmit={handleSignIn}>
          <input
            id="mail"
            className="profile-form-content"
            type="email"
            name="mail"
            aria-label="mail"
            placeholder="Type your mail..."
            required
          />
          <input
            id="password"
            className="profile-form-content"
            type="password"
            name="password"
            aria-label="password"
            placeholder="Type your password..."
            autoComplete="current-password"
          />
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
          <div>
            <button
              className="profile-btns profile-btns-actions-seperat"
              type="submit"
            >
              Log på
            </button>
          </div>
        </form>

        <div className="profile-btns-actions">
          <button
            className="profile-btns profile-btns-actions-seperat"
            id="save-btn"
            onClick={handleGoToSignUp}
          >
            Opret ny konto
          </button>
          <p>Eller</p>
          <button className="profile-btns profile-btns-actions-seperat">
            Log ind med Facebook
          </button>
          <button className="profile-btns profile-btns-actions-seperat">
            Log ind med Google
          </button>
        </div>
      </div>
    </section>
  );
}
