import { useState } from "react"

export default function HoldBoks() { 
    const [isFilled, setIsFilled] = useState(false);

    function handleStarClick() {
      setIsFilled((prev)=>!prev);
    }

    return (
      <div className="blaa-boks hold-boks-grid">
        <div className="hold-boks-holdnavn">
          <div className="klublogo-container">
            <img src="klublogo" alt="klubnavn(AABT)"></img>
          </div>
          <p>Holdnavn</p>
        </div>
        <img
          src={isFilled ? "/img/star-solid.svg" : "/img/star.svg"}
          onClick={handleStarClick}
          alt="star"
          className="star"
        />
      </div>
    );
}