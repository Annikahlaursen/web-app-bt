import { Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import KampPage from "./pages/KampPage";
import KampResultatPage from "./pages/KampResultatPage";
import StevnePage from "./pages/StevnePage";
import Error from "./pages/ErrorPage";
import RatingPage from "./pages/RatingPage";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")); // default value comes from localStorage

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is authenticated / signed in
      setIsAuth(true); // set isAuth to true
      localStorage.setItem("isAuth", true); // also, save isAuth in localStorage
    } else {
      // user is not authenticated / not signed in
      setIsAuth(false); // set isAuth to false
      localStorage.removeItem("isAuth"); // remove isAuth from localStorage
    }
  });

  // variable holding all private routes including the nav bar
  const privateRoutes = (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/error" />} />
        <Route path="/kamp" element={<KampPage />} />
        <Route path="/kamp/resultat" element={<KampResultatPage />} />
        <Route path="/stevne" element={<StevnePage />} />
        <Route path="/error" element={<Error />} />
        <Route path="/stevne/tilmeld" element={<Error />} />
      </Routes>
    </>
  );

  // variable holding all public routes without nav bar
  const publicRoutes = (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );

  // if user is authenticated, show privateRoutes, else show publicRoutes
  return <main>{isAuth ? privateRoutes : publicRoutes}</main>;
}
