import btLogo2 from "/public/btLogo2.png";
import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function KampCard() {
  const [klub, setKlub] = useState(null);

  useEffect(() => {
    async function getKlub() {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`
      );
      const data = await response.json();
      if (data) {
        // Get the first klub from the object
        const firstKlub = Object.values(data)[0];
        setKlub(firstKlub);
      }
    }
    getKlub();
  });

  return (
    <div className="kamp-card">
      <Link to="/kamp">
        <div className="kamp-container">
          <p>KampID</p>
          <p>Dato</p>
        </div>
        <div className="kamp-container">
          <div className="kamp-hold">
            <img src={klub?.image} alt="" />
            <p>{klub?.hold[0]}</p>
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
