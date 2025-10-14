import { useState, useEffect } from "react";
import RatingListe from "../components/RatingListe";

export default function RatingPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

      usersArray.sort((a, b) => b.rating - a.rating);

      // tilføjer global placering på ratinglisten til hvert userobject
      usersArray.forEach((user, index) => {
        user.placering = index + 1;
      });

      setUsers(usersArray);
    }
    fetchUsers();
  }, []);

    const filteredUsers = users.filter((user) =>
      `${user.fornavn} ${user.efternavn}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );


  return (
    <section className="page">
      <h1>Rating</h1>
      <div className="rating-filter">
        <div>
          <input
            type="text"
            name="search"
            placeholder="Søg i rating"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: "10px" }}
          />
        </div>
        <div className="rating-boks-grid rating-categories">
          <p>Plac.</p>
          <p>Navn</p>
          <p>Rating</p>
          <p>+/-</p>
        </div>
      </div>

      <RatingListe users={filteredUsers} />
    </section>
  );
}
