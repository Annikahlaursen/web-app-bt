import { useState } from "react";

export default function FilterOverlay({ users, setFilteredUsers, onClose }) {
  const [filterCriteria, setFilterCriteria] = useState({
    ratingMin: "",
    ratingMax: "",
    placeringMin: "",
    placeringMax: "",
  });

  //hjælpefunktion beregner brugernes alder ud fra fødselsdato
  function calculateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // justerer alderen hvis fødselsdagen i år ikke er passeret endnu
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  const applyFilters = () => {
    const filtered = users.filter((user) => {
      const userAge = calculateAge(user.fødselsdato);

      const matchesRating =
        (!filterCriteria.ratingMin ||
          user.rating >= filterCriteria.ratingMin) &&
        (!filterCriteria.ratingMax || user.rating <= filterCriteria.ratingMax);
      const matchesPlacering =
        (!filterCriteria.placeringMin ||
          user.placering >= filterCriteria.placeringMin) &&
        (!filterCriteria.placeringMax ||
          user.placering <= filterCriteria.placeringMax);
      const matchesAge =
        (!filterCriteria.ageMin || userAge >= filterCriteria.ageMin) &&
        (!filterCriteria.ageMax || userAge <= filterCriteria.ageMax);

      return matchesRating && matchesPlacering && matchesAge;

     
    });

    setFilteredUsers(filtered);
    onClose();
  };

  return (
    <div className="filter-overlay">
      <div>
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

            setFilterCriteria({
              ...filterCriteria,
              ageInterval: selectedInterval,
              ageMin,
              ageMax,
            });
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
        <select
          value={filterCriteria.club}
          onChange={(e) =>
            setFilterCriteria({ ...filterCriteria, club: e.target.value })
          }
        >
          <option value="">Alle Køn</option>
          <option value="mand">Herre</option>
          <option value="kvinde">Kvinder</option>
          <option value="andet">Andet</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="Klubnavn"
          value={filterCriteria.ratingMin}
          onChange={(e) =>
            setFilterCriteria({ ...filterCriteria, ratingMin: e.target.value })
          }
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Spiller"
          value={filterCriteria.placeringMin}
          onChange={(e) =>
            setFilterCriteria({
              ...filterCriteria,
              placeringMin: e.target.value,
            })
          }
        />
      </div>
      <button onClick={applyFilters} className="btn" id="save-btn">
        Søg
      </button>
    </div>
  );
}
