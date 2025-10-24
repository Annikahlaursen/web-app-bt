import { Routes, Route, Navigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import Nav from "./components/Nav";
import Splash from "./components/Splash";
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
import UpdateCard from "./pages/UpdatePageRemastered";
import { matchPath } from "react-router";
import KampIdSearchPage from "./pages/KampIdSearchPage";
import HoldSearchPage from "./pages/HoldSearchPage";

export default function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")); // default value comes from localStorage
  const location = useLocation();
  // show splash only when the public auth pages are shown (sign-in / sign-up)
  const [showSplash, setShowSplash] = useState(false);

  // subscribe to auth state changes once
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // user is authenticated / signed in
        setIsAuth(true);
        localStorage.setItem("isAuth", true);
      } else {
        // user is not authenticated / not signed in
        setIsAuth(false);
        localStorage.removeItem("isAuth");
      }
    });
    return () => unsub && unsub();
    // run once
  }, []);

  // show splash when we land on sign-in or sign-up (i.e. when public routes are shown)
  useEffect(() => {
    const isPublicAuthPage = location.pathname === "/sign-in";
    if (!isAuth && isPublicAuthPage) {
      setShowSplash(true);
      const t = setTimeout(() => setShowSplash(false), 1200);
      return () => clearTimeout(t);
    }
    // clear splash if navigating away
    setShowSplash(false);
  }, [isAuth, location.pathname]);

  // decide whether to hide top navigation for certain routes (e.g. update/profile flow)
  function hideNavFor(path) {
    // hide for update route with uid param and for auth pages
    if (matchPath("/update/:id", path)) return true;
    if (
      path === "/sign-in" ||
      path === "/sign-up" ||
      path === "/login" ||
      path === "/error"
    )
      return true;
    return false;
  }

  // variable holding all private routes including the nav bar
  const privateRoutes = (
    <>
      {!hideNavFor(location.pathname) && <Nav />}
      <Routes>
        {isAuth && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/update/:id" element={<UpdateCard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/rating" element={<RatingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/error" />} />
            <Route path="/error" element={<Error />} />
            <Route path="/kamp/:id" element={<KampPage />} />
            <Route path="/kamp/:id/resultat" element={<KampResultatPage />} />
            <Route path="/stevne/:id" element={<StevnePage />} />
            <Route path="/stevne/:id/tilmeld" element={<Error />} />
            <Route path="/kalender" element={<KalenderPage />} />
            <Route path="/stevnesearch" element={<StevneSearchPage />} />
            <Route path="/searchKampID" element={<KampIdSearchPage />} />
            <Route path="/holdsearch" element={<HoldSearchPage />} />
          </>
        )}
      </Routes>
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

  // if splash is showing, render it full-screen before mounting the app routes
  if (showSplash) return <Splash />;

  // if user is authenticated, show privateRoutes, else show publicRoutes
  return <main>{isAuth ? privateRoutes : publicRoutes}</main>;
}
