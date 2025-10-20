import { Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import SignUpPage from "./pages/SignUpPage";
import KampPage from "./pages/KampPage";
import SignInPage from "./pages/SignInPage";
import KampResultatPage from "./pages/KampResultatPage";
import StevnePage from "./pages/StevnePage";
import Error from "./pages/ErrorPage";
import RatingPage from "./pages/RatingPage";
import KalenderPage from "./pages/KalenderPage";
import StevneSearchPage from "./pages/StevneSearchPage";
import KampCard from "./components/KampCard";
import UpdateCard from "./components/UpdateCard";


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
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/error" />} />
          <Route path="/kamp/:id" element={<KampPage />} />
          <Route path="/kamp/:id/resultat" element={<KampResultatPage />} />
          <Route path="/stevne/:id" element={<StevnePage />} />
          <Route path="/error" element={<Error />} />
          <Route path="/stevne/:id/tilmeld" element={<Error />} />
          <Route path="/kalender" element={<KalenderPage />} />
          <Route path="/:id" element={<KampCard />} />
          <Route path="/stevnesearch" element={<StevneSearchPage />} />
        </Routes>
      </main>
    </>
  );

  // variable holding all public routes without nav bar
  const publicRoutes = (
    <Routes>
      <Route path="/update/:id" element={<UpdateCard />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );

  // if user is authenticated, show privateRoutes, else show publicRoutes
  return <main>{isAuth ? privateRoutes : publicRoutes}</main>;
}
