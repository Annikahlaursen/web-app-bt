import { useState } from "react";
import { useNavigate } from "react-router";
import star from "/public/star.svg";
import starSolid from "/public/star-solid.svg";

//import { getHoldById, getKlubById } from "../helper";
//import { useParams } from "react-router";

export default function HoldBoks({ klub, hold }) {
  const [isFilled, setIsFilled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  function handleStarClick() {
    setIsFilled((prev) => !prev);
    setIsFavorite(true);
    console.log(isFavorite);
  }

  function handleBoksClick() {
    navigate("/error");
  }

  return (
    <div className="blaa-boks hold-boks-grid">
      <div className="hold-boks-holdnavn" onClick={handleBoksClick}>
        <div className="klublogo-container">
          <img
            className="klublogo"
            src={klub?.image ?? "/placeholder.png"}
            alt={klub?.navn ?? "ukendt klub"}
          ></img>
        </div>
        <p>{hold?.navn ?? "ukendt hold"}</p>
      </div>
      <img
        src={isFilled ? starSolid : star}
        onClick={handleStarClick}
        alt="star"
        className="star"
      />
    </div>
  );
}
