import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import useFilters from "../hooks/useFilters";
import RatingListe from "../components/RatingListe";
import FilterOverlay from "../components/FilterOvelay";

// Funktion til at beregne alder ud fra fødselsdato
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
  const [showFilter, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(true);

  const { filterCriteria, filteredUsers, updateFilterCriteria } =
    useFilters(users);

  const toggleOverlay = () => setShowOverlay((prev) => !prev);
  const closeOverlay = () => setShowOverlay(false);

  useEffect(() => {
    async function fetchUsersAndClubs() {
      const usersUrl =
        "https://web-app-bt-124b8-default-rtdb.firebaseio.com/users.json";
      const clubsUrl =
        "https://web-app-bt-124b8-default-rtdb.firebaseio.com/klubber.json";
      const [usersResponse, clubsResponse] = await Promise.all([
        fetch(usersUrl),
        fetch(clubsUrl),
      ]);

      const usersData = await usersResponse.json();
      const clubsData = await clubsResponse.json();

      const usersArray = Object.keys(usersData).map((key) => ({
        id: key,
        ...usersData[key],
      }));

      usersArray.sort((a, b) => b.rating - a.rating);

      //tilføjer properties placering, alder, klubnavn til hver bruger
      usersArray.forEach((user, index) => {
        user.placering = index + 1;
        user.age = calculateAge(user.fødselsdato);
        user.clubName = clubsData[user.kid]?.navn || "Ukendt Klub";
      });

      setUsers(usersArray);
      setSearchedUsers(usersArray);
      setLoading(false);
    }

    // Tjek om brugere er blevet sendt via navigation state
    if (location.state && location.state.users) {
      setUsers(location.state.users);
      setSearchedUsers(location.state.users);
      setLoading(false);
    } else {
      fetchUsersAndClubs();
    }
  }, [location.state]);

  return (
    <section className="page">
      <h1>Rating</h1>
      <div className="rating-filter">
        <div style={{ position: "relative" }}>
          <input
            type="text"
            name="search"
            placeholder="Søg i rating"
            value={filterCriteria.name || ""}
            onChange={(e) => updateFilterCriteria("name", e.target.value)}
            style={{ flex: 1, padding: "10px" }}
          />
          <img
            src="sliders-solid-full.svg"
            alt="Filter"
            onClick={toggleOverlay}
            style={{ cursor: "pointer" }}
          />
          {showFilter && (
            <FilterOverlay
              users={searchedUsers}
              filterCriteria={filterCriteria}
              updateFilterCriteria={updateFilterCriteria}
              closeOverlay={closeOverlay}
            />
          )}
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Henter Ratingliste...</p>
      ) : (
        <RatingListe users={filteredUsers} />
      )}
    </section>
  );
}
