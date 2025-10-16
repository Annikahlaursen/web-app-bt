import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase-config";
import SignUp from "./SignUpCard";

export default function SignInPage() {
  const [errorMessage, setErrorMessage] = useState("");

  function handleSignIn(event) {
    event.preventDefault();
    const mail = event.target.mail.value; // mail value from inout field in sign in form
    const password = event.target.password.value; // password value from inout field in sign in form

    signInWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user); // for test purposes: logging the authenticated user
      })
      .catch((error) => {
        let code = error.code; // saving error code in variable
        code = code.replaceAll("-", " "); // some JS string magic to display error message. See the log above in the console
        code = code.replaceAll("auth/", "");
        setErrorMessage(code);
      });
  }
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
              href="/home"
            >
              Sign In
            </button>
          </div>
        </form>
        <button
          className="profile-btns profile-btns-actions-seperat"
          id="save-btn"
          onClick={SignUp}
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
