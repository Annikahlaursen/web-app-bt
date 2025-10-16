import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import RatingListe from "../components/RatingListe";
import FilterOverlay from "../components/FilterOvelay";

function calculateAge(fødselsdato) {
  const today = new Date();
  const birthDate = new Date(fødselsdato);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export default function RatingPage() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

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

       usersArray.forEach((user, index) => {
         user.placering = index + 1;
          user.age = calculateAge(user.fødselsdato);
       });

       setUsers(usersArray);
       setSearchedUsers(usersArray);
       setLoading(false);
     }

     // Check if users are passed via location.state
     if (location.state && location.state.users) {
       setUsers(location.state.users);
       setSearchedUsers(location.state.users);
       setLoading(false);
     } else {
       // If no users are passed, fetch them directly
       fetchUsers();
     }
   }, [location.state]);

 useEffect(() => {
   // Filter users based on the search term
   if (searchTerm === "") {
     setSearchedUsers(users); // Show all users if search term is empty
   } else {
     const filtered = users.filter((user) =>
       `${user.fornavn} ${user.efternavn}`
         .toLowerCase()
         .includes(searchTerm.toLowerCase())
     );
     setSearchedUsers(filtered);
   }
 }, [searchTerm, users]);

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
          <img
            src="sliders-solid-full.svg"
            alt="Filter"
            onClick={() => setShowFilter(true)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Henter Ratingliste...</p>
      ) : (
        <RatingListe users={searchedUsers} />
      )}

      {showFilter && (
        <FilterOverlay
          users={users}
          setFilteredUsers={setFilteredUsers}
          onClose={() => setShowFilter(false)}
        />
      )}
    </section>
  );
}
