import { useState } from "react";
//import { getHoldById, getKlubById } from "../helper";
//import { useParams } from "react-router";

export default function HoldBoks({ klub, hold }) {
  const [isFilled, setIsFilled] = useState(false);
  //const [hold, setHold] = useState({});
  // const [klub, setKlub] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  //const params = useParams();
  //const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  //const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;

  /* useEffect(() => {
    getHoldById(params.hid).then((fetchedHold) => setHold(fetchedHold));
  }, [params.hid]);

  useEffect(() => {
    getKlubById(useParams.kid).then((fetchedKlub) => setKlub(fetchedKlub));
  }, [params.kid]); */

  function handleStarClick() {
    setIsFilled((prev) => !prev);
    setIsFavorite(true);
    console.log(isFavorite);
  }

  return (
    <div className="blaa-boks hold-boks-grid">
      <div className="hold-boks-holdnavn">
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
        src={isFilled ? "/star-solid.svg" : "/star.svg"}
        onClick={handleStarClick}
        alt="star"
        className="star"
      />
    </div>
  );
}
