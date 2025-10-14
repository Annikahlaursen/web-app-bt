import btLogo1 from "/public/btLogo1.png";
import btLogo2 from "/public/btLogo2.png";
import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { Link } from "react-router";

export default function KampCard() {
  return (
    <div className="kamp-card">
      <Link to="/kamp">
        <div className="kamp-container">
          <p>KampID</p>
          <p>Dato</p>
        </div>
        <div className="kamp-container">
          <div className="kamp-hold">
            <img src={btLogo1} alt="" />
            <p>Hold 1</p>
          </div>
          <div className="kamp-vs">
            <p>VS</p>
            <p>20:00</p>
          </div>
          <div className="kamp-hold">
            <img src={btLogo2} alt="" />
            <p>Hold 2</p>
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
