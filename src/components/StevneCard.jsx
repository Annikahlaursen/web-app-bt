import location from "/public/location-dot-white.svg";
import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { Link } from "react-router";

export default function StevneCard({stevne}) {

  return (
    <div className="stevne-card">
      <Link to={`/stevne/${stevne.id}`}>
        <div className="kamp-container">
          <h3>{stevne?.titel ?? "Ingen titel"}</h3>
          <p>{stevne?.dato ?? "Ingen dato tilgængelig"}</p>
        </div>
        <div className="stevne-container">
          <ul>
            {stevne.rækkerLørdag.map((række, index) => (
              <li key={index}>{række}</li>
            ))}
            {stevne.rækkerSøndag.map((række, index) => (
              <li key={index}>{række}</li>
            ))}
          </ul>
          <div className="location">
            <img src={location} alt="Location pin icon" />
            <p>{stevne?.lokation ?? "Brabrand hallerne"}</p>
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
