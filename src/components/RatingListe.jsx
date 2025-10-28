import { useState, useEffect } from "react";
import RatingBoks from "./RatingBoks";
import { auth } from "../firebase-config";

export default function RatingListe({ users = [], isRating }) {
  const [currentUid, setCurrentUid] = useState(() => {
    // init from auth eller localStorage fallback
    return (
      auth?.currentUser?.uid ??
      (() => {
        try {
          const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
          return cu?.profile?.uid ?? null;
        } catch {
          return null;
        }
      })()
    );
  });

  useEffect(() => {
    // opdater når auth-status ændrer sig
    const unsubscribe =
      auth && typeof auth.onAuthStateChanged === "function"
        ? auth.onAuthStateChanged((user) => setCurrentUid(user?.uid ?? null))
        : null;
    return () => unsubscribe && unsubscribe();
  }, []);

  if (users.length === 0) {
    return <p>Ingen spillere matcher din søgning</p>;
  }

  // Find index for den loggede bruger
  const currentIndex = currentUid
    ? users.findIndex((u) => u.id === currentUid)
    : -1;

  // Hvis bruger ikke fundet, vis top 5; ellers vis 2 før og 2 efter brugeren
  let displayedUsers;
  if (currentIndex === -1) {
    displayedUsers = users.slice(0, Math.min(5, users.length)); //den gamle version med at vise top 5
  } else {
    // to før og to efter brugeren
    const start = Math.max(0, currentIndex - 2);
    const end = Math.min(users.length, currentIndex + 3);
    displayedUsers = users.slice(start, end);
  }

  if (isRating === "onRating") {
    return (
      <div className="rating-liste on-rating-page">
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
  } else {
    return (
      <div className="rating-liste">
        <div className="rating-boks-grid rating-categories">
          <p>Plac.</p>
          <p>Navn</p>
          <p>Rating</p>
          <p>+/-</p>
        </div>
        <hr />
        {displayedUsers.map((user) => (
          <RatingBoks user={user} key={user.id} placering={user.placering} />
        ))}
      </div>
    );
  }

  /* return (
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
  );*/
}
