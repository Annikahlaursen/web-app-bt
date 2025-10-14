import { Routes, Route, Navigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import LogInPage from "./pages/LogInPage";
import KampPage from "./pages/KampPage";
import KampResultatPage from "./pages/KampResultatPage";
import StevnePage from "./pages/StevnePage";
import Error from "./pages/ErrorPage";
import RatingPage from "./pages/RatingPage";

export default function App() {
  const location = useLocation();
  const hideNavRoutes = ["/", "/login"];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation af loading tid på 2 sekunder
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <img
            src="/btp-logo.png"
            alt="Bordtennisportalen.dk logo"
            className="loading-logo-img"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {!hideNavRoutes.includes(location.pathname) && <Nav />}
      <main>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/error" />} />
          <Route path="/kamp" element={<KampPage />} />
          <Route path="/kamp/resultat" element={<KampResultatPage />} />
          <Route path="/stevne" element={<StevnePage />} />
          <Route path="/error" element={<Error />} />
          <Route path="/stevne/tilmeld" element={<Error />} />
        </Routes>
      </main>
    </>
  );
}
