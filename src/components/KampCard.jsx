import btLogo2 from "/public/btLogo2.png";
import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function KampCard() {
  const [klub, setKlub] = useState({});

  useEffect(() => {
    async function getKlub() {
      const response = await fetch(
        `https://web-app-bt-124b8-default-rtdb.firebaseio.com/klubber.json`
      );
      const data = await response.json();
      if (data) {
        setKlub(data); // set the klub state with the data from firebase
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
            <p>{klub?.hold}</p>
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
