import { useState } from "react";


export default function FilterOverlay({ users, setFilteredUsers, onClose }) {
  const [filterCriteria, setFilterCriteria] = useState({
    ageMin: "",
    ageMax: "",
    ageInterval: "",
    club: "",
    name: "",
  });

  const ageIntervals = [
    { value: "8-15", label: "8-15 år", ageMin: 8, ageMax: 15 },
    { value: "16-21", label: "16-21 år", ageMin: 16, ageMax: 21 },
    { value: "22-44", label: "22-44 år", ageMin: 22, ageMax: 44 },
    { value: "+45", label: "+45 år", ageMin: 45, ageMax: "" },
  ];

  const applyFilters = (updatedCriteria) => {
  console.log("Filtering with criteria:", updatedCriteria);
    const filtered = users.filter((user) => {
      const matchesAge =
        (!updatedCriteria.ageMin || user.age >= updatedCriteria.ageMin) &&
        (!updatedCriteria.ageMax || user.age <= updatedCriteria.ageMax);

         if (matchesAge) {
           console.log(
             `User ${user.fornavn} ${user.efternavn} (age: ${user.age}) matches`
           );
         }

      return (
        matchesAge
      );
    });

    setFilteredUsers(filtered);
  };


  const handleFilterChange = (key, value) => {
    const updatedCriteria = { ...filterCriteria, [key]: value };
    setFilterCriteria(updatedCriteria);
      console.log("Updated filterCriteria:", updatedCriteria);
    applyFilters(updatedCriteria);
  };

  const handleAgeIntervalChange = (selectedInterval) => {
    const interval = ageIntervals.find((i) => i.value === selectedInterval) || {
      ageMin: "",
      ageMax: "",
    };

    const updatedCriteria = {
      ...filterCriteria,
      ageInterval: selectedInterval,
      ageMin: interval.ageMin,
      ageMax: interval.ageMax,
    };

    setFilterCriteria(updatedCriteria);
      console.log("Updated filterCriteria with age interval:", updatedCriteria);

        applyFilters(updatedCriteria);

  };

  return (
    <div className="filter-overlay">
      <div>
        <label>Aldersinterval:</label>
        <select
          value={filterCriteria.ageInterval}
          onChange={(e) =>
            handleAgeIntervalChange(e.target.value)
          }
        >
          <option value="">Alle Aldersgrupper</option>
          {ageIntervals.map((interval) => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
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