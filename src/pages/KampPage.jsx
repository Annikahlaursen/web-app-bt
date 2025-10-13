import { Link } from "react-router";
import VSVisning from "../components/VSVisning";
import arrowWhite from "/public/arrow-left-white.svg";
import clock from "/public/clock.svg";
import calendar from "/public/calendar-outline.svg";
import location from "/public/location-dot.svg";
import tableTennis from "/public/table-tennis-icon.svg";

export default function KampPage() {
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
        <VSVisning />
      </div>
      <section className="kamp-info-section">
        <div className="kamp-info">
          <img src={tableTennis} alt="TableTennis icon" />
          <p>Kamp ID</p>
        </div>
        <div className="kamp-info">
          <img src={calendar} alt="Calendar icon" />
          <p>dato oktober 2025</p>
        </div>
        <div className="kamp-info">
          <img src={clock} alt="Clock icon" />
          <p>Klokslæt (20:00)</p>
        </div>
        <div className="kamp-info">
          <img src={location} alt="Location pin icon" />
          <p>Adresse, postnummer</p>
        </div>
        <br />
        <p>Kamp resultat: Afventer</p>
        <p>Spillere: Afventer</p>
      </section>
    </>
  );
}
