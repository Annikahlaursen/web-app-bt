import RatingBoks from "./RatingBoks";

export default function RatingListe({ users = [] }) {
  return (
    <div className="rating-liste">
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
