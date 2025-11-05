/* eslint-disable */

import location from "/public/location-dot-white.svg";
import share from "/public/share.svg";
import bell from "/public/bell.svg";
import bellSolid from "/public/bell-solid.svg";
import { Link } from "react-router";
import { forwardRef } from "react";
import { useState } from "react";
import { formatDate } from "../helper";

const StevneCard = forwardRef(({ stevne }, ref) => {
  const [isFilled, setIsFilled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const formattedDate = formatDate(stevne.dato);

  //console.log(Date(dateString));

  function handleBellClick() {
    setIsFilled((prev) => !prev);
    setIsFavorite(true);
    console.log(isFavorite);
  }

  return (
    <div className="stevne-card" ref={ref} style={{ scrollMargin: "10rem" }}>
      <Link to={`/stevne/${stevne.id}`}>
        <div className="kamp-container">
          <h3>{stevne?.titel ?? "Ingen titel"}</h3>
          <p>{formattedDate ?? "Ingen dato tilgængelig"}</p>
        </div>
        <div className="stevne-container">
          <p>{stevne.beskrivelse}</p>
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
});

export default StevneCard;
