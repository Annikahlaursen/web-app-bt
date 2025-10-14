import { Link } from "react-router";
import tableTennis from "/public/table-tennis-icon-white.svg";
import arrowWhite from "/public/arrow-left-white.svg";

export default function Error() {
  return (
    <div className="error">
      <img src={tableTennis} alt="Table tennis icon" />
      <h1>Hov!</h1>
      <h4>Du ramte ved siden af bordet</h4>
      <p id="red-color">
        Denne side er ikke tilgængelig, vi er godt i gang med opsætningen af
        dette.
      </p>
      <br />
      <div className="tilbage">
        <Link to="..">
          <img src={arrowWhite} alt="" />
          <p>Gå tilbage til forrige side</p>
        </Link>
      </div>
    </div>
  );
}
