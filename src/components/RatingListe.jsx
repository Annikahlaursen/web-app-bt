import RatingBoks from "./RatingBoks";

export default function RatingListe({ users }) {
  return (
    <div className="rating-liste">
      <hr />
      {users.map((user) => (
        <RatingBoks user={user} key={user.id} placering={user.placering} />
      ))}
    </div>
  );
}
