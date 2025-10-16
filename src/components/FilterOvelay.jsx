import { useState } from "react";

function calculateAge(fødselsdato) {
  const today = new Date();
  const birthDate = new Date(fødselsdato);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default function FilterOverlay({ users, setFilteredUsers, onClose }) {
  const [filterCriteria, setFilterCriteria] = useState({
    ratingMin: "",
    ratingMax: "",
    placeringMin: "",
    placeringMax: "",
    ageMin: "",
    ageMax: "",
    ageInterval: "",
    club: "",
    name: "",
  });

  const applyFilters = (updatedCriteria) => {

 const usersWithAge = users.map((user) => ({
   ...user,
   age: calculateAge(user.fødselsdato),
 }));

   console.log("Users with calculated ages:", usersWithAge);

    const filtered = usersWithAge.filter((user) => {

      const matchesRating =
        (!updatedCriteria.ratingMin || user.rating >= updatedCriteria.ratingMin) &&
        (!updatedCriteria.ratingMax || user.rating <= updatedCriteria.ratingMax);
      const matchesPlacering =
        (!updatedCriteria.placeringMin ||
          user.placering >= updatedCriteria.placeringMin) &&
        (!updatedCriteria.placeringMax ||
          user.placering <= updatedCriteria.placeringMax);
      const matchesAge =
        (!updatedCriteria.ageMin || user.age >= updatedCriteria.ageMin) &&
        (!updatedCriteria.ageMax || user.age <= updatedCriteria.ageMax);
      const matchesClub =
        !updatedCriteria.club || user.club === updatedCriteria.club;
      const matchesName =
        !updatedCriteria.name ||
        `${user.fornavn} ${user.efternavn}`
          .toLowerCase()
          .includes(updatedCriteria.name.toLowerCase());

      return (
        matchesRating &&
        matchesPlacering &&
        matchesAge &&
        matchesClub &&
        matchesName
      );
    });

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (key, value) => {
    const updatedCriteria = { ...filterCriteria, [key]: value };
    setFilterCriteria(updatedCriteria);
    applyFilters(updatedCriteria);
  };

  return (
    <div className="filter-overlay">
      <div>
        <label>Aldersinterval:</label>
        <select
          value={filterCriteria.ageInterval}
          onChange={(e) => {
            const selectedInterval = e.target.value;
            let ageMin = "";
            let ageMax = "";

            if (selectedInterval === "8-15") {
              ageMin = 8;
              ageMax = 15;
            } else if (selectedInterval === "16-21") {
              ageMin = 16;
              ageMax = 21;
            } else if (selectedInterval === "22-45") {
              ageMin = 22;
              ageMax = 45;
            } else if (selectedInterval === "+45") {
              ageMin = 46;
              ageMax = "";
            }

            handleFilterChange("ageInterval", selectedInterval);
            handleFilterChange("ageMin", ageMin);
            handleFilterChange("ageMax", ageMax);
          }}
        >
          <option value="">Alle Aldersgrupper</option>
          <option value="8-15">8-15 år</option>
          <option value="16-21">16-21 år</option>
          <option value="22-45">22-45 år</option>
          <option value="+45">+45 år</option>
        </select>
      </div>
      <div>
        <label>Søg efter spiller:</label>
        <input
          type="text"
          placeholder="Indtast spillerens navn"
          value={filterCriteria.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}