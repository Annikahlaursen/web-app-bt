import { useState } from "react";

export default function FilterOverlay({
  filterCriteria,
  updateFilterCriteria,
  closeOverlay,
}) {
  const ageIntervals = [
    { value: "8-15", label: "8-15 år", ageMin: 8, ageMax: 15 },
    { value: "16-21", label: "16-21 år", ageMin: 16, ageMax: 21 },
    { value: "22-44", label: "22-44 år", ageMin: 22, ageMax: 44 },
    { value: "+45", label: "+45 år", ageMin: 45, ageMax: "" },
  ];

  // Local state for temporary filters
  const [tempFilters, setTempFilters] = useState(filterCriteria);

  const handleAgeIntervalChange = (selectedInterval) => {
    const interval = ageIntervals.find((i) => i.value === selectedInterval) || {
      ageMin: "",
      ageMax: "",
    };

    updateFilterCriteria("ageInterval", selectedInterval);
    updateFilterCriteria("ageMin", interval.ageMin);
    updateFilterCriteria("ageMax", interval.ageMax);

    setTempFilters((prev) => ({
      ...prev,
      ageInterval: selectedInterval,
      ageMin: interval.ageMin,
      ageMax: interval.ageMax,
    }));
  };

  const handleNameChange = (name) => {
    updateFilterCriteria("name", name);

    setTempFilters((prev) => ({
      ...prev,
      name,
    }));
  };

    const handleClubChange = (club) => {
      updateFilterCriteria("club", club);
      setTempFilters((prev) => ({
        ...prev,
        club,
      }));
    };


  const handleSave = () => {
    //gemmer de midlertidige filtre til de overordnede filtre
    Object.keys(tempFilters).forEach((key) => {
      updateFilterCriteria(key, tempFilters[key]);
    });

    closeOverlay();
  };

  return (
    <div className="filter-overlay">
      <div>
        <select
          value={tempFilters.ageInterval}
          onChange={(e) => handleAgeIntervalChange(e.target.value)}
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
        <input
          type="text"
          placeholder="Indtast spillerens navn"
          value={filterCriteria.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Indtast klubnavn"
          value={filterCriteria.klub}
          onChange={(e) => handleClubChange(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleSave}>Gem</button>
        <button onClick={closeOverlay}>Annuller</button>
      </div>
    </div>
  );
}
