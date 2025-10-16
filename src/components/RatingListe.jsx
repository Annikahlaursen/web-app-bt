import RatingBoks from "./RatingBoks";
import { useLocation } from "react-router";

export default function RatingListe({ users = [] }) {
  const location = useLocation();
  const isRatingPage = location.pathname === "/rating";
  
  return (
    <div className={`rating-liste ${isRatingPage ? "on-rating-page" : ""}`}>
      <div className="rating-boks-grid rating-categories">
        <p>Plac.</p>
        <p>Navn</p>
        <p>Rating</p>
        <p>+/-</p>
      </div>
      <hr />
      {users.map((user) => (
        <RatingBoks user={user} key={user.id} placering={user.placering} />
      ))}
    </div>
  );
}
