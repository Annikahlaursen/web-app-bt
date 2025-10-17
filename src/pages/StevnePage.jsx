import { Link, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import arrowWhite from "/public/arrow-left-white.svg";
import calendar from "/public/calendar-outline.svg";
import location from "/public/location-dot.svg";

export default function StevnePage() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [stevne, setStevne] = useState({});
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchStevne() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/staevner/${id}.json`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stevne");
      }

      const data = await response.json();

      // Check if data is valid
      if (!data) {
        setStevne(null); // Set stevne to null if no data is returned
        return;
      }

      // If data is valid, process it
      const staevneArray = Object.keys(data).map((stevneId) => ({
        id: stevneId,
        ...data[stevneId],
      }));

      setStevne(staevneArray);
    } catch (error) {
      console.error("Error fetching stevne:", error);
      setStevne(null); // Handle error by setting stevne to null
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  }

  fetchStevne();
}, [id]);

if (loading) {
  return <p>Loading...</p>;
}

if (!stevne) {
  return <p>Stevne not found</p>;
}


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
        <h2>{stevne.titel}</h2>
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
