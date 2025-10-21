/* eslint-disable */

import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { useNavigate } from "react-router";
import { useEffect, useState, forwardRef } from "react";

const KampCard = forwardRef(({ kamp, oplysninger }, ref) => {
  //const [kamp, setKamp] = useState({});
  const [hold, setHold] = useState({});
  const [klub, setKlub] = useState({});

  //const params = useParams();
  const navigate = useNavigate();

  /*const kampUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe/${
    params.id
  }.json`;*/
  const holdUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;

  useEffect(() => {
    async function getKamp() {
      /*const kampResponse = await fetch(kampUrl);
      const data = await kampResponse.json();
      console.log("Params id:", params.id, "data:", data);

      console.log(data);
      if (data) {
        data.id = params.id;
      } else {
        console.warn(`Ingen kamp fundet med id: ${params.id}`);
      }

      setKamp(data);
      //if (data) {
      // Get the first kamp from the object
      //const firstKamp = Object.values(data)[0];
      //setKamp(firstKamp);
      //}
*/
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
  }, [/*params.id, kampUrl, */ holdUrl, klubUrl]);

  function handleClick() {
    navigate(`/kamp/${kamp.id}`);
  }

  function handleResultatClick() {
    navigate(`/kamp/${kamp.id}/resultat`);
  }

  //get data from hold and klub based on kamp data
  const hjemmeholdNavn = hold?.[kamp?.hjemmehold]?.navn ?? "Hjemme";
  const udeholdNavn = hold?.[kamp?.udehold]?.navn ?? "Ude";
  const hjemmeklubLogo =
    klub?.[kamp?.hjemmeklub]?.image ?? "https://placehold.co/50x50.webp";
  const udeklubLogo =
    klub?.[kamp?.udeklub]?.image ?? "https://placehold.co/50x50.webp";

  if (oplysninger === "kunOplysninger") {
    return (
      <div className="kamp-card" onClick={handleResultatClick} ref={ref}>
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
      </div>
    );
  } else {
    return (
      <div className="kamp-card" onClick={handleClick}>
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
    </div>
  );
});

export default KampCard;

// export default function KampCard({ kamp }) {
//const [kamp, setKamp] = useState({});
// const [hold, setHold] = useState({});
// const [klub, setKlub] = useState({});

//const params = useParams();
// const navigate = useNavigate();

/*const kampUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe/${
    params.id
  }.json`;*/
// const holdUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
// const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;

// useEffect(() => {
//   async function getKamp() {
/*const kampResponse = await fetch(kampUrl);
      const data = await kampResponse.json();
      console.log("Params id:", params.id, "data:", data);

      console.log(data);
      if (data) {
        data.id = params.id;
      } else {
        console.warn(`Ingen kamp fundet med id: ${params.id}`);
      }

      setKamp(data);
      //if (data) {
      // Get the first kamp from the object
      //const firstKamp = Object.values(data)[0];
      //setKamp(firstKamp);
      //}
*/
//   const holdResponse = await fetch(holdUrl);
//   const holdData = await holdResponse.json();
//   setHold(holdData);

//   const klubResponse = await fetch(klubUrl);
//   const klubData = await klubResponse.json();
//   if (klubData) {
//     setKlub(klubData);
//   }
// }

// getKamp();
// }, [/*params.id, kampUrl, */ holdUrl, klubUrl]);

// function handleClick() {
//   navigate(`/kamp/${kamp.id}`);
// }

//get data from hold and klub based on kamp data
//   const hjemmeholdNavn = hold?.[kamp?.hjemmehold]?.navn ?? "Hjemme";
//   const udeholdNavn = hold?.[kamp?.udehold]?.navn ?? "Ude";
//   const hjemmeklubLogo =
//     klub?.[kamp?.hjemmeklub]?.image ?? "https://placehold.co/50x50.webp";
//   const udeklubLogo =
//     klub?.[kamp?.udeklub]?.image ?? "https://placehold.co/50x50.webp";

//   return (
//     <div className="kamp-card" onClick={handleClick}>
//       <div className="kamp-container">
//         <p>{kamp?.id}</p>
//         <p>{kamp?.dato}</p>
//       </div>
//       <div className="kamp-container">
//         <div className="kamp-hold">
//           <img src={hjemmeklubLogo} alt={klub?.navn} />
//           <p>{hjemmeholdNavn}</p>
//         </div>
//         <div className="kamp-vs">
//           <p>VS</p>
//           <p>{kamp?.tid}</p>
//         </div>
//         <div className="kamp-hold">
//           <img src={udeklubLogo} alt="" />
//           <p>{udeholdNavn}</p>
//         </div>
//       </div>
//       <div className="kamp-container" id="streg">
//         <div className="del-notifikationer" id="streg-midt">
//           <img src={share} alt="Dele ikon" />
//           <p>Del</p>
//         </div>
//         <div className="del-notifikationer">
//           <img src={bell} alt="Notifikations klokke ikon" />
//           <p>Notifikationer</p>
//         </div>
//       </div>
//     </div>
//   );
// }
