import { Routes, Route, Navigate, useLocation } from "react-router";
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
import KalenderPage from "./pages/KalenderPage";

export default function App() {
  const location = useLocation();
  const hideNavRoutes = ["/login"];

  return (
    <>
      {!hideNavRoutes.includes(location.pathname) && <Nav />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/error" />} />
          <Route path="/kamp/:id" element={<KampPage />} />
          <Route path="/kamp/:id/resultat" element={<KampResultatPage />} />
          <Route path="/stevne" element={<StevnePage />} />
          <Route path="/error" element={<Error />} />
          <Route path="/stevne/tilmeld" element={<Error />} />
          <Route path="/kalender" element={<KalenderPage />} />
        </Routes>
      </main>
    </>
  );
}
