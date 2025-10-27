import { useNavigate } from "react-router";
import arrowBlack from "/public/arrow-left-black.svg";
import arrowWhite from "/public/arrow-left-white.svg";

export default function ArrowBack({ color }) {
  const navigate = useNavigate();

  function navigateBack() {
    navigate(-1);
  }

  if (color === "white") {
    return (
      <img
        className="arrow"
        src={arrowWhite}
        alt="Arrow back to previus page"
        onClick={navigateBack}
      />
    );
  } else if (color === "black") {
    return (
      <img
        className="arrow"
        src={arrowBlack}
        alt="Arrow back to previus page"
        onClick={navigateBack}
      />
    );
  }
}
