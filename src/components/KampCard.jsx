/* eslint-disable */

import share from "/public/share.svg";
import bell from "/public/bell.svg";
import bellSolid from "/public/bell-solid.svg";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState, forwardRef } from "react";
import { getHoldById, getKlubById } from "../helper";

const KampCard = forwardRef(({ kamp, oplysninger }, ref) => {
  const [hold, setHold] = useState({});
  const [klub, setKlub] = useState({});
  const [isFilled, setIsFilled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getHoldById(useParams.hid).then((fetchedHold) => setHold(fetchedHold));
  }, [params.hid]);

  useEffect(() => {
    getKlubById(useParams.kid).then((fetchedKlub) => setKlub(fetchedKlub));
  }, [params.kid]);

  function handleClick() {
    navigate(`/kamp/${kamp.id}`);
  }

  function handleResultatClick() {
    navigate(`/kamp/${kamp.id}/resultat`);
  }

  function handleBellClick() {
    setIsFilled((prev) => !prev);
    setIsFavorite(true);
    console.log(isFavorite);
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
      <div className="kamp-card" ref={ref}>
        <div className="kamp-container" onClick={handleClick}>
          <p>{kamp?.id}</p>
          <p>{kamp?.dato}</p>
        </div>
        <div className="kamp-container" onClick={handleClick}>
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
            <img
              src={isFilled ? bellSolid : bell}
              onClick={handleBellClick}
              alt="notifikations klokke ikon"
              className="star"
            />
            <p>Notifikationer</p>
          </div>
        </div>
      </div>
    );
  }
});

export default KampCard;
