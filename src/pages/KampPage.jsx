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
  const [valgteSpillereHjem, setValgteSpillereHjem] = useState([]);
  const [valgteSpillereUde, setValgteSpillereUde] = useState([]);

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

      // Kun de valgte spillere i kamp.spillere
      // Forudsætter at kamp.spillere er et array med uid'er eller objekter med id'er
      const valgteH = (data.spillereHjemme || []).map((spiller) => {
        if (typeof spiller === "string") {
          // Hvis det bare er uid'er, hent navnet fra data eller hold en reference
          return { id: spiller, navn: spiller }; // eller slå op i users-array
        } else {
          // Hvis spiller allerede er et objekt
          return spiller;
        }
      });
      const valgteU = (data.spillereUde || []).map((spiller) => {
        if (typeof spiller === "string") {
          // Hvis det bare er uid'er, hent navnet fra data eller hold en reference
          return { id: spiller, navn: spiller }; // eller slå op i users-array
        } else {
          // Hvis spiller allerede er et objekt
          return spiller;
        }
      });

      setValgteSpillereHjem(valgteH);
      setValgteSpillereUde(valgteU);

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
    navigate(`/kamp/${kamp.id}/resultat`);
  }

  if (kamp.harResultat) {
    kamp.resultat = kamp.resultatHjemme.num1 + " - " + kamp.resultatUde.num2;
  } else {
    kamp.resultat = "Afventer";
  }

  if (kamp.harResultat) {
    kamp.spillereHjemme = valgteSpillereHjem
      .map((spillereHjemme) => spillereHjemme.label)
      .join(", ");
  } else {
    kamp.spillere = "Afventer";
  }

  if (kamp.harResultat) {
    kamp.spillereUde = valgteSpillereUde
      .map((spillereUde) => spillereUde.label)
      .join(", ");
  } else {
    kamp.spillere = "Afventer";
  }

  console.log(kamp.harResultat);
  console.log(valgteSpillereHjem);
  console.log(valgteSpillereUde);

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
        <p>Kamp resultat: {kamp?.resultat ?? "Afventer"}</p>
        <p>Spillere (Hjemmehold): {kamp?.spillereHjemme ?? "Afventer"}</p>
        <p>Spillere (Udehold): {kamp?.spillereUde ?? "Afventer"}</p>
      </section>
    </>
  );
}
