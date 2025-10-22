import { NavLink } from "react-router";
import tableTennis from "/public/img/unsplash-photo.svg";

export default function NyhedsCard() {
  return (
    <NavLink to={"/error"}>
      <article className="nyheds-card">
        <div className="img-container">
          <img src={tableTennis} alt="nyhedsbillede" />
        </div>
        <h2>Nyheds Card</h2>
        <p>Her kommer nyheds card indholdet</p>
      </article>
    </NavLink>
  );
}
