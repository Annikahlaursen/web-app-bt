import { useState } from "react";

export default function FilterOverlay({ users, setFilteredUsers, onClose }) {
  const [filterCriteria, setFilterCriteria] = useState({
    ratingMin: "",
    ratingMax: "",
    placeringMin: "",
    placeringMax: "",
  });

  const applyFilters = () => {
    const filtered = users.filter((user) => {
      const matchesRating =
        (!filterCriteria.ratingMin ||
          user.rating >= filterCriteria.ratingMin) &&
        (!filterCriteria.ratingMax || user.rating <= filterCriteria.ratingMax);
      const matchesPlacering =
        (!filterCriteria.placeringMin ||
          user.placering >= filterCriteria.placeringMin) &&
        (!filterCriteria.placeringMax ||
          user.placering <= filterCriteria.placeringMax);
      return matchesRating && matchesPlacering;
    });
    setFilteredUsers(filtered);
    onClose(); // Close the overlay after applying filters
  };

  return (
    <div className="filter-overlay">
      <div>
        <select
          value={filterCriteria.club}
          onChange={(e) =>
            setFilterCriteria({ ...filterCriteria, club: e.target.value })
          }
        >
          <option value="">Alle Aldersgrupper</option>
          <option value="8-15">8-15 år</option>
          <option value="16-21">16-21 år</option>
          <option value="22-45">22-44 år</option>
          <option value="22-45">+45 år</option>
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
          type="number"
          value={filterCriteria.placeringMin}
          onChange={(e) =>
            setFilterCriteria({
              ...filterCriteria,
              placeringMin: e.target.value,
            })
          }
        />
      </div>
      <button onClick={applyFilters}>Søg</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
