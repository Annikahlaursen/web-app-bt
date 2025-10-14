

import RatingBoks from "./RatingBoks";

export default function RatingListe({ users }) {

  return (
    <>
      <div className="rating-boks-grid rating-categories">
        <p>Plac.</p>
        <p>Navn</p>
        <p>Rating</p>
        <p>+/-</p>
      </div>
      <div className="rating-liste">
        <hr />
        {users.map((user) => (
          <RatingBoks user={user} key={user.id} placering={user.placering} />
        ))}
      </div>
    </>
  );
}
