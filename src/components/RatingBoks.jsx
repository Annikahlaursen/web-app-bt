import { auth } from "../firebase-config";

export default function RatingBoks({ user, placering }) {

  const name = user.name || `${user.fornavn} ${user.efternavn}`;

  const rating = user.rating || "N/A";

  const currentUser = auth?.currentUser;
  const isUserSame = user && currentUser && user.id === auth.currentUser.uid;

  const userClass = isUserSame
    ? "blaa-boks rating-boks-grid red-border"
    : "blaa-boks rating-boks-grid";

  return (
    <div className={userClass}>
      <p>{placering}</p>
      <p className="rating-navn">{name}</p>
      <p>{rating}</p>
      <p>9</p>
    </div>
  );
}
