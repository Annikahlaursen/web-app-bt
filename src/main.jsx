import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router";
import { migrateLocalProfile } from "./utils/profileMigration";

// normalize any legacy local profile keys on startup
migrateLocalProfile();

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.DEV ? "/" : "/web-app-bt/"}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
