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

  const { filteredData, filterCriteria, updateFilterCriteria } = useFilters(
    users,
    (user, criteria) => {
      // aldersfilter
      const matchesAge =
        (!criteria.ageMin || user.age >= criteria.ageMin) &&
        (!criteria.ageMax || user.age <= criteria.ageMax);

      // navnefilter
      const matchesName =
        !criteria.name ||
        `${user.fornavn} ${user.efternavn}`
          .toLowerCase()
          .includes(criteria.name.toLowerCase());

      //clubfilter
      const matchesClub =
        !criteria.club ||
        (user.clubName &&
          user.clubName.toLowerCase().includes(criteria.club.toLowerCase()));

      return matchesAge && matchesName && matchesClub;
    }
  );

  const toggleOverlay = () => setShowOverlay((prev) => !prev);
  const closeOverlay = () => setShowOverlay(false);

  useEffect(() => {
    async function fetchUsersAndClubs() {
      const usersUrl = `${
        import.meta.env.VITE_FIREBASE_DATABASE_URL
      }/users.json`;
      const clubsUrl = `${
        import.meta.env.VITE_FIREBASE_DATABASE_URL
      }/klubber.json`;
      const [usersResponse, clubsResponse] = await Promise.all([
        fetch(usersUrl),
        fetch(clubsUrl),
      ]);

      const usersData = await usersResponse.json();
      const clubsData = await clubsResponse.json();

      const usersArray = Object.keys(usersData).map((key) => ({
        id: key,
        ...usersData[key],
        rating: Number(usersData[key].rating) || 0, //sikrer at rating er et tal
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

    // Event listener for "ratingsUpdated"
    const handleRatingsUpdated = () => {
      console.log("Ratings updated event detected. Re-fetching users...");
      fetchUsersAndClubs();
    };

    // Event listener for "currentUserChanged"
    const handleCurrentUserChanged = (e) => {
      fetchUsersAndClubs(); // Re-fetch users to update age and other properties
    };

    // Add event listener for "ratingsUpdated"
    window.addEventListener("ratingsUpdated", handleRatingsUpdated);
    window.addEventListener("currentUserChanged", handleCurrentUserChanged);

    // Tjek om brugere er blevet sendt via navigation state
    if (location.state && location.state.users) {
      const usersArray = location.state.users;

      // Sort and assign rankings
      usersArray.sort((a, b) => b.rating - a.rating);
      usersArray.forEach((user, index) => {
        user.placering = index + 1;
      });

      setUsers(usersArray);
      setSearchedUsers(usersArray);
      setLoading(false);
    } else {
      fetchUsersAndClubs();
    }

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("ratingsUpdated", handleRatingsUpdated);
      window.removeEventListener(
        "currentUserChanged",
        handleCurrentUserChanged
      );
    };
  }, [location.state]);

  return (
    <section>
      <img src="/img/unsplash-photo.svg" alt="Rating side"></img>
      <section className="forside">
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
          <RatingListe
            users={filteredData.sort((a, b) => b.rating - a.rating)}
          />
        )}
      </section>
    </section>
  );
}
