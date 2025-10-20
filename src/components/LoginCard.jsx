import { Fragment, useState } from "react";
import { useNavigate, Link } from "react-router";
import CreateCard from "./SignUpCard";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, mockUsers, createTestAccounts } from "../firebase-config";

export default function SignInPage() {
  const navigate = useNavigate();
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateAccount = () => {
    setShowCreateCard(true);
  };

  const handleCreateTestAccounts = async () => {
    try {
      await createTestAccounts();
      setErrorMessage(
        "Test accounts created! You can now log in with the test users."
      );
    } catch (error) {
      setErrorMessage("Error creating test accounts: " + error.message);
    }
  };

  if (showCreateCard) {
    return <CreateCard />;
  }

  function handleSignIn(event) {
    event.preventDefault();
    const mail = event.target.mail.value;
    const password = event.target.password.value;

    // Clear any previous error messages
    setErrorMessage("");

    // Try Firebase authentication
    signInWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        // Signed in successfully
        const firebaseUser = userCredential.user;
        console.log("Firebase login successful:", firebaseUser.email);

        // Find corresponding profile data in mockUsers (or create default profile)
        let userProfile = mockUsers.find((u) => u.email === mail);
        if (!userProfile) {
          // Create a default profile if not found in mockUsers
          userProfile = {
            id: Date.now(),
            email: mail,
            profile: {
              fornavn: firebaseUser.displayName?.split(" ")[0] || "User",
              efternavn: firebaseUser.displayName?.split(" ")[1] || "",
              gender: "",
              birthday: "",
              email: mail,
              phone: "",
              rating: 1200,
            },
          };
        }

        // Store user data in localStorage for ProfileInfo component to use
        localStorage.setItem("currentUser", JSON.stringify(userProfile));
        navigate("/home");
      })
      .catch((error) => {
        // Handle authentication errors
        console.error("Firebase authentication error:", error);
        let errorMsg = "Login failed. Please try again.";

        switch (error.code) {
          case "auth/user-not-found":
            errorMsg = "No account found with this email.";
            break;
          case "auth/wrong-password":
            errorMsg = "Incorrect password.";
            break;
          case "auth/invalid-email":
            errorMsg = "Invalid email address.";
            break;
          case "auth/too-many-requests":
            errorMsg = "Too many failed attempts. Try again later.";
            break;
          default:
            errorMsg = error.message;
        }

        setErrorMessage(errorMsg);
      });
  }
  return (
    <Fragment>
      <div className="profile-info-parent">
        <div className="profile-card">
          <form
            id="sign-in-form"
            action="ProfileInfo"
            className="profile-form"
            onSubmit={handleSignIn}
          >
            <label htmlFor="mail">Mail</label>
            <input
              id="mail"
              type="email"
              name="mail"
              className="profile-form-content"
              aria-label="mail"
              placeholder="Type your mail..."
              required
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="profile-form-content"
              aria-label="password"
              placeholder="Type your password..."
              autoComplete="current-password"
            />
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
            <div className="profile-btns-actions">
              <button
                type="submit"
                className="profile-btns profile-btns-actions-seperat"
                id="save-btn"
              >
                Log på
              </button>
            </div>
          </form>
          <p
            className="profile-btns profile-btns-actions-seperat"
            id="save-btn"
            onClick={handleCreateAccount}
          >
            Don&apos;t have an account? <Link to="/sign-up">Sign Up</Link>
          </p>
          <p>Eller</p>
          <button className="profile-btns profile-btns-actions-seperat">
            Log ind med Facebook
          </button>
          <button className="profile-btns profile-btns-actions-seperat">
            Log ind med Google
          </button>

          {/* Development button to create test accounts */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              border: "1px dashed #ccc",
            }}
          >
            <p style={{ fontSize: "0.8rem", color: "#666" }}>
              Development Only:
            </p>
            <button
              type="button"
              className="profile-btns profile-btns-actions-seperat"
              onClick={handleCreateTestAccounts}
              style={{ backgroundColor: "#f0f0f0", color: "#333" }}
            >
              Create Firebase Test Accounts
            </button>
            <p
              style={{ fontSize: "0.7rem", color: "#666", marginTop: "0.5rem" }}
            >
              Test users: heidi@btp.dk, lars@btp.dk, anna@btp.dk (all with
              password123/456/789)
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
