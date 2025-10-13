import location from "/public/location-dot-white.svg";
import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { Link } from "react-router";

export default function StevneCard() {
  return (
    <div className="stevne-card">
      <Link to="/kamp">
        <div className="kamp-container">
          <h3>Stævne Navn</h3>
          <p>Dato</p>
        </div>
        <div className="stevne-container">
          <p>Senior, Junior, Ungdom</p>
          <div className="location">
            <img src={location} alt="Location pin icon" />
            <p>Lokation (Brabrand Hallerne)</p>
          </div>
        </div>
      </Link>
      <div className="kamp-container" id="streg">
        <div className="del-notifikationer" id="streg-midt">
          <img src={share} alt="Dele ikon" />
          <p>Del</p>
        </div>
        <div className="del-notifikationer">
          <img src={bell} alt="Notifikations klokke ikon" />
          <p>Notifikationer</p>
        </div>
      </div>
    </div>
  );
}
