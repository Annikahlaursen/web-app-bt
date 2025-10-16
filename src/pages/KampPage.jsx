import { Link, useNavigate, useParams } from "react-router";
import VSVisning from "../components/VSVisning";
import arrowWhite from "/public/arrow-left-white.svg";
import clock from "/public/clock.svg";
import calendar from "/public/calendar-outline.svg";
import location from "/public/location-dot.svg";
import tableTennis from "/public/table-tennis-icon.svg";
import { useState, useEffect } from "react";

export default function KampPage() {
  const navigate = useNavigate();
  const [kamp, setKamp] = useState({});

  const params = useParams();

  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe/${
    params.id
  }.json`;

  useEffect(() => {
    async function getKamp() {
      const response = await fetch(url);
      const data = await response.json();
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
    }

    getKamp();
  }, [params.id, url]);

  function clicked(event) {
    event.preventDefault();
    console.log("Button clicked");
    navigate("/kamp/resultat");
  }

  if (kamp.harResultat) {
    kamp.resultat = kamp.resultatHjemme + " - " + kamp.resultatUde;
  } else {
    kamp.resultat = "Afventer";
  }

  if (kamp.harResultat) {
    kamp.spillere =
      "Spiller A1, Spiller A2, Spiller A3, Spiller B1, Spiller B2, Spiller B3";
  } else {
    kamp.spillere = "Afventer";
  }

  return (
    <>
      <div className="red-background">
        <Link to="...">
          <img
            className="arrow"
            src={arrowWhite}
            alt="Arrow back to previus page"
          />
        </Link>
        <VSVisning key={kamp.id} kamp={kamp} />
      </div>
      <section className="kamp-info-section">
        <button className="btn" onClick={clicked}>
          Skriv kampresultat
        </button>
        <div className="kamp-info">
          <img src={tableTennis} alt="TableTennis icon" />
          <p>{kamp?.id}</p>
        </div>
        <div className="kamp-info">
          <img src={calendar} alt="Calendar icon" />
          <p>{kamp?.dato}</p>
        </div>
        <div className="kamp-info">
          <img src={clock} alt="Clock icon" />
          <p>{kamp?.tid}</p>
        </div>
        <div className="kamp-info">
          <img src={location} alt="Location pin icon" />
          <p>{kamp?.lokation}</p>
        </div>
        <br />
        <p>Kamp resultat: {kamp.resultat ?? "Afventer"}</p>
        <p>Spillere: {kamp?.spillere ?? "Afventer"}</p>
      </section>
    </>
  );
}
