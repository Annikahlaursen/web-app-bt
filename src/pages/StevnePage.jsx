import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import arrowWhite from "/public/arrow-left-white.svg";
import calendar from "/public/calendar-outline.svg";
import location from "/public/location-dot.svg";

export default function StevnePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stevne, setStevne] = useState({});

  useEffect(() => {
    async function fetchStevne() {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/staevner/${id}.json`
      );

      const data = await response.json();

      setStevne(data);
      console.log(data);
    }

    fetchStevne();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function clicked(event) {
    event.preventDefault();
    console.log("Button clicked");
    navigate("/error");
  }

  console.log(stevne);

  return (
    <>
      <div className="blue-background">
        <img
          className="arrow"
          src={arrowWhite}
          alt="Arrow back to previus page"
          onClick={() => navigate(-1)}
        />
        <h2>{stevne.titel}</h2>
      </div>
      <section className="kamp-info-section stevne">
        <button className="btn" onClick={clicked}>
          {stevne.ertilmeldt ? "Du er tilmeldt" : "Tilmeld stævne "}
        </button>
        <div className="kamp-info">
          <img src={calendar} alt="Calendar icon" />
          <p>{stevne.dato}</p>
        </div>
        <div className="kamp-info">
          <img src={location} alt="Location pin icon" />
          <p>{stevne.lokation}</p>
        </div>
        <div className="kamp-info">
          <p>{`Pris: ${stevne.pris} DKK`}</p>
        </div>
        <p>{stevne.beskrivelse}</p>
        <h2>Rækker</h2>
        <p>LØRDAG</p>
        <ul>
          {stevne.rækkerLørdag?.map((række, index) => (
            <li key={index}>{række}</li>
          ))}
        </ul>
        <p>SØNDAG</p>
        <ul>
          {stevne.rækkerSøndag?.map((række, index) => (
            <li key={index}>{række}</li>
          ))}
        </ul>
        {stevne.ertilmeldt && (
          <div>
            <p>Du er tilmeldt rækkerne:</p>
            <ul>
              {stevne.tilmeldt.map((række, index) => (
                <li key={index}>{række}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
