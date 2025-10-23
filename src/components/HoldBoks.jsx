import { useEffect, useState } from "react";

export default function HoldBoks({ hold }) {
  const [isFilled, setIsFilled] = useState(false);
  //const [hold, setHold] = useState({});
  const [klub, setKlub] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  //const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;

  useEffect(() => {
    async function fetchData() {
      const klubResponse = await fetch(klubUrl);
      const klubData = await klubResponse.json();
      setKlub(klubData);
    }

    fetchData();
  }, [klubUrl]);

  console.log("hold data:", hold?.navn);
  console.log("klub data:", klub.navn);

  function handleStarClick() {
    setIsFilled((prev) => !prev);
    setIsFavorite(true);
    console.log(isFavorite);
  }

  return (
    <div className="blaa-boks hold-boks-grid">
      <div className="hold-boks-holdnavn">
        <div className="klublogo-container">
          <img src={klub?.image} alt={klub?.navn}></img>
        </div>
        <p>holdnavn: {hold?.navn}</p>
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
