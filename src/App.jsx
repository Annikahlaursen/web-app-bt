import { Routes, Route, Navigate } from "react-router";
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
  return (
    <>
      <Nav />
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
