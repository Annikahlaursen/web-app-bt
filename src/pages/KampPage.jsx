import { Link } from "react-router";
import VSVisning from "../components/VSVisning";
import arrowWhite from "/public/arrow-left-white.svg";

export default function KampPage() {
  return (
    <>
      <div className="red-background">
        <Link to="...">
          <img
            className="arrow"
            src={arrowWhite}
            alt="Arrow back to previus page"
          />
        </Link>
        <VSVisning />
      </div>
      <section className="kamp-info-section">
        <div className="kamp-info">
          <img src="" alt="" />
          <p>Kamp ID</p>
        </div>
        <div className="kamp-info">
          <img src="" alt="" />
          <p>dato oktober 2025</p>
        </div>
        <div className="kamp-info">
          <img src="" alt="" />
          <p>Klokslæt (20:00)</p>
        </div>
        <div className="kamp-info">
          <img src="" alt="" />
          <p>Adresse, postnummer</p>
        </div>
      </section>
    </>
  );
}
