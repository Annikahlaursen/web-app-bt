import { useState, useEffect } from "react";

export default function VSVisning({ kamp }) {
  const [hold, setHold] = useState({});
  const [klub, setKlub] = useState({});

  const holdUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;

  useEffect(() => {
    async function getKamp() {
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
  }, [holdUrl, klubUrl]);

  //get data from hold and klub based on kamp data
  const hjemmeholdNavn = hold?.[kamp?.hjemmehold]?.navn ?? "Hjemme";
  const udeholdNavn = hold?.[kamp?.udehold]?.navn ?? "Ude";
  const hjemmeklubLogo =
    klub?.[kamp?.hjemmeklub]?.image ?? "https://placehold.co/50x50.webp";
  const udeklubLogo =
    klub?.[kamp?.udeklub]?.image ?? "https://placehold.co/50x50.webp";

  return (
    <div>
      <div className="kamp-container">
        <div className="kamp-hold">
          <img src={hjemmeklubLogo} alt="" />
          <p>{hjemmeholdNavn}</p>
        </div>
        <div className="kamp-vs">
          <p>VS</p>
        </div>
        <div className="kamp-hold">
          <img src={udeklubLogo} alt="" />
          <p>{udeholdNavn}</p>
        </div>
      </div>
    </div>
  );
}
