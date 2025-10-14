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
      <h2>Filter Users</h2>
      <div>
        <label>Min Rating:</label>
        <input
          type="number"
          value={filterCriteria.ratingMin}
          onChange={(e) =>
            setFilterCriteria({ ...filterCriteria, ratingMin: e.target.value })
          }
        />
      </div>
      <div>
        <label>Max Rating:</label>
        <input
          type="number"
          value={filterCriteria.ratingMax}
          onChange={(e) =>
            setFilterCriteria({ ...filterCriteria, ratingMax: e.target.value })
          }
        />
      </div>
      <div>
        <label>Min Placering:</label>
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
      <div>
        <label>Max Placering:</label>
        <input
          type="number"
          value={filterCriteria.placeringMax}
          onChange={(e) =>
            setFilterCriteria({
              ...filterCriteria,
              placeringMax: e.target.value,
            })
          }
        />
      </div>
      <button onClick={applyFilters}>Apply Filters</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
