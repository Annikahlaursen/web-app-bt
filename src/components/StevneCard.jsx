import location from "/public/location-dot-white.svg";
import bell from "/public/bell.svg";
import share from "/public/share.svg";
import { Link } from "react-router";
// import { useState, useEffect } from "react";

export default function StevneCard({stevne}) {
  // const [stevner, setStevner] = useState([]);

  // useEffect(() => {
  //   async function fetchStevner() {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/staevner.json`
  //     );
  //     const data = await response.json(); // get the data from the response and parse it
  //     // from object to array
  //     const stevneArray = Object.keys(data).map((stevneId) => ({
  //       id: stevneId,
  //       ...data[stevneId],
  //     })); // map the data to an array of objects

  //     setStevner(stevneArray); // set the posts state with the postsArray
  //   }

  //   fetchStevner();
  // }, []);

  return (
    <div className="stevne-card">
      <Link to="/stevne/:id">
        <div className="kamp-container">
          <h3>{stevne?.titel ?? "Ingen titel"}</h3>
          <p>{stevne?.dato ?? "Ingen dato tilgængelig"}</p>
        </div>
        <div className="stevne-container">
          <p>Senior, Junior, Ungdom</p>
          <div className="location">
            <img src={location} alt="Location pin icon" />
            <p>{stevne?.lokation ?? "Brabrand hallerne"}</p>
          </div>
        </div>
      </Link>
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
