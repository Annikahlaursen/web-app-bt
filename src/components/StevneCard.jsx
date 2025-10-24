/* eslint-disable */

import location from "/public/location-dot-white.svg";
import share from "/public/share.svg";
import { Link } from "react-router";
import { forwardRef } from "react";
import { useState, useEffect } from "react";

const StevneCard = forwardRef(({ stevne }, ref) => {
  const [isFilled, setIsFilled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
          <p>{stevne?.dato ?? "Ingen dato tilgængelig"}</p>
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
            src={isFilled ? "/public/bell-solid.svg" : "/bell.svg"}
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

// export default function StevneCard({stevne}) {

//   return (
//     <div className="stevne-card">
//       <Link to={`/stevne/${stevne}`}>
//         <div className="kamp-container">
//           <h3>{stevne?.titel ?? "Ingen titel"}</h3>
//           <p>{stevne?.dato ?? "Ingen dato tilgængelig"}</p>
//         </div>
//         <div className="stevne-container">
//           <p>Senior, Junior, Ungdom</p>
//           <div className="location">
//             <img src={location} alt="Location pin icon" />
//             <p>{stevne?.lokation ?? "Brabrand hallerne"}</p>
//           </div>
//         </div>
//       </Link>
//       <div className="kamp-container" id="streg">
//         <div className="del-notifikationer" id="streg-midt">
//           <img src={share} alt="Dele ikon" />
//           <p>Del</p>
//         </div>
//         <div className="del-notifikationer">
//           <img src={bell} alt="Notifikations klokke ikon" />
//           <p>Notifikationer</p>
//         </div>
//       </div>
//     </div>
//   );
// }
