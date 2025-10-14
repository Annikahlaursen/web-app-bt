import { Link, useNavigate } from "react-router";
import arrowWhite from "/public/arrow-left-white.svg";
import calendar from "/public/calendar-outline.svg";
import location from "/public/location-dot.svg";

export default function StevnePage() {
  const navigate = useNavigate();

  function clicked(event) {
    event.preventDefault();
    console.log("Button clicked");
    navigate("/stevne/tilmeld");
  }
  return (
    <>
      <div className="blue-background">
        <Link to="...">
          <img
            className="arrow"
            src={arrowWhite}
            alt="Arrow back to previus page"
          />
        </Link>
        <h2>Stævne Navn</h2>
      </div>
      <section className="kamp-info-section">
        <button className="btn" onClick={clicked}>
          Tilmeld stævne
        </button>
        <div className="kamp-info">
          <img src={calendar} alt="Calendar icon" />
          <p>dato oktober 2025</p>
        </div>
        <div className="kamp-info">
          <img src={location} alt="Location pin icon" />
          <p>Adresse, postnummer</p>
        </div>
        <div className="kamp-info">
          <p>Pris: 100 DKK</p>
        </div>
        <br />
        <h2>Rækker</h2>
        <p>LØRDAG</p>
        <ul>
          <li>Dame Junior Elite</li>
          <li>Herre klasse 2</li>
          <li>Herre Junior Elite</li>
        </ul>
        <p>Søndag</p>
        <ul>
          <li>Dame Elite</li>
          <li>Drenge B</li>
          <li>Puslinge A</li>
        </ul>
      </section>
    </>
  );
}
