import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function KampCard() {
  const [kamp, setKamp] = useState(null);
  const [hold, setHold] = useState(null);
  const [klub, setKlub] = useState(null);

  const kampUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe.json`;
  const holdUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;

  useEffect(() => {
    async function getKamp() {
      const kampResponse = await fetch(kampUrl);

      const data = await kampResponse.json();
      if (data) {
        // Get the first kamp from the object
        const firstKamp = Object.values(data)[0];
        setKamp(firstKamp);
      }

      const holdResponse = await fetch(holdUrl);
      const holdData = await holdResponse.json();
      setHold(holdData);

      const klubResponse = await fetch(klubUrl);
      const klubData = await klubResponse.json();
      if (klubData) {
        setKlub(klubData);
      }
    }
    getKamp();
  }, [kampUrl, holdUrl, klubUrl]);

  const hjemmeholdNavn = hold?.[kamp?.hjemmehold]?.navn ?? "Hjemme";
  const udeholdNavn = hold?.[kamp?.udehold]?.navn ?? "Ude";

  const hjemmeklubLogo =
    klub?.[kamp?.hjemmeklub]?.image ?? "https://placehold.co/50x50.webp";
  const udeklubLogo =
    klub?.[kamp?.udeklub]?.image ?? "https://placehold.co/50x50.webp";

  return (
    <div className="kamp-card">
      <Link to="/kamp">
        <div className="kamp-container">
          <p>{kamp?.id}</p>
          <p>{kamp?.dato}</p>
        </div>
        <div className="kamp-container">
          <div className="kamp-hold">
            <img src={hjemmeklubLogo} alt={klub?.navn} />
            <p>{hjemmeholdNavn}</p>
          </div>
          <div className="kamp-vs">
            <p>VS</p>
            <p>{kamp?.tid}</p>
          </div>
          <div className="kamp-hold">
            <img src={udeklubLogo} alt="" />
            <p>{udeholdNavn}</p>
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
