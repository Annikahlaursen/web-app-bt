/* eslint-disable */

import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState, forwardRef } from "react";
import { getHoldById } from "../helper";

const KampCard = forwardRef(({ oplysninger }, ref) => {
  const [kamp, setKamp] = useState({});
  const [hold, setHold] = useState({});
  const [klub, setKlub] = useState({});
  const params = useParams();

  //const params = useParams();
  const navigate = useNavigate();

  /*const kampUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe/${
    params.id
  }.json`;*/
  //const holdUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;

  useEffect(() => {
    getHoldById(useParams.id).then((fetchedHold) => setHold(fetchedHold));
  }, [params.id]);

  useEffect(() => {
    getHoldById(useParams.kid).then((fetchedkamp) => setKamp(fetchedkamp));
  }, [params.kid]);

  useEffect(() => {
    async function getKamp() {
      /*getHoldById(useParams.id).then((fetchedHold) => setHold(fetchedHold));
      const holdResponse = await fetch(holdUrl);
      const holdData = await holdResponse.json();
      setHold(holdData);*/

      const klubResponse = await fetch(klubUrl);
      const klubData = await klubResponse.json();
      if (klubData) {
        setKlub(klubData);
      }
    }

    getKamp();
  }, [klubUrl]);

  function handleClick() {
    navigate(`/kamp/${kamp.id}`);
  }

  function handleResultatClick() {
    navigate(`/kamp/${kamp.id}/resultat`);
  }

  //get data from hold and klub based on kamp data
  //const hjemmeholdNavn = hold?.[kamp?.hjemmehold]?.navn ?? "Hjemme";
  //const udeholdNavn = hold?.[kamp?.udehold]?.navn ?? "Ude";
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
      <div className="kamp-card" onClick={handleClick} ref={ref}>
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
    );
  }
});

export default KampCard;
