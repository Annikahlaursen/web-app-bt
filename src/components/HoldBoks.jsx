import { useState } from "react"

export default function HoldBoks() { 
    const [isFilled, setIsFilled] = useState(false);

    function handleStarClick() {
      setIsFilled((prev)=>!prev);
    }

    return (
      <div className="blaa-boks">
        <div className="blaa-boks-holdnavn">
          <div className="klublogo-container">
            <img src="klublogo" alt="klubnavn(AABT)"></img>
          </div>
          <p>Holdnavn</p>
        </div>
        <div onClick={handleStarClick}>{isFilled ? "★" : "☆"}</div>
      </div>
    );
}