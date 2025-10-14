import btLogo1 from "/public/btLogo1.png";
import btLogo2 from "/public/btLogo2.png";

export default function VSVisning() {
  return (
    <div>
      <div className="kamp-container">
        <div className="kamp-hold">
          <img src={btLogo1} alt="" />
          <p>Hold 1</p>
        </div>
        <div className="kamp-vs">
          <p>VS</p>
        </div>
        <div className="kamp-hold">
          <img src={btLogo2} alt="" />
          <p>Hold 2</p>
        </div>
      </div>
    </div>
  );
}
