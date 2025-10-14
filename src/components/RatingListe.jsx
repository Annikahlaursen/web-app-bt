import { useState, useEffect} from "react";

import RatingBoks from "./RatingBoks";

export default function RatingListe() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const url =
        "https://web-app-bt-124b8-default-rtdb.firebaseio.com/users.json";
      const response = await fetch(url);
      const data = await response.json();

      const usersArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setUsers(usersArray);
    }
    fetchUsers();
  }, []);

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
          <RatingBoks user={user} key={user.id} />
        ))}
      </div>
    </>
  );
}
