import btLogo1 from "/public/btLogo1.png";
import btLogo2 from "/public/btLogo2.png";

export default function KampCard() {
  return (
    <div className="kamp-card">
      <div className="kamp-container">
        <p>KampID</p>
        <p>Dato</p>
      </div>
      <div className="kamp-container">
        <div className="kamp-hold">
          <img src={btLogo1} alt="" />
          <p>Hold 1</p>
        </div>
        <div className="kamp-vs">
          <p>VS</p>
          <p>20:00</p>
        </div>
        <div className="kamp-hold">
          <img src={btLogo2} alt="" />
          <p>Hold 2</p>
        </div>
      </div>
      <div className="kamp-container" id="streg">
        <div className="del-notifikationer" id="streg-midt">
          <img src="" alt="" />
          <p>Del</p>
        </div>
        <div className="del-notifikationer">
          <img src="" alt="" />
          <p>Notifikationer</p>
        </div>
      </div>
    </div>
  );
}
