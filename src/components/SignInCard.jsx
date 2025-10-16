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
    <section id="sign-in-page" className="profile-info-parent">
      <div className="profile-card">
        <form onSubmit={handleSignIn}>
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
              Sign In
            </button>
          </div>
        </form>

        <button
          className="profile-btns profile-btns-actions-seperat"
          id="save-btn"
          onClick={handleGoToSignUp}
        >
          Sign Up
        </button>
        <p>Eller</p>
        <button className="profile-btns profile-btns-actions-seperat">
          Log ind med Facebook
        </button>
        <button className="profile-btns profile-btns-actions-seperat">
          Log ind med Google
        </button>
      </div>
    </section>
  );
}
