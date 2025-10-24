import { useState } from "react";
import Select from "react-select";

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

  // Local state til temporary filters (bruges til at gemme ændringer før de gemmes endeligt)
  const [tempFilters, setTempFilters] = useState(filterCriteria);

  // Håndter ændring af aldersinterval
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

  // Håndter ændring af navn
  const handleNameChange = (name) => {
    updateFilterCriteria("name", name);

    setTempFilters((prev) => ({
      ...prev,
      name,
    }));
  };

  // Håndter ændring af klub
  const handleClubChange = (club) => {
    updateFilterCriteria("club", club);
    setTempFilters((prev) => ({
      ...prev,
      club,
    }));
  };

  //Rydning af filtre
  const handleClearFilters = () => {
    const clearedFilters = {
      ageInterval: "",
      ageMin: "",
      ageMax: "",
      name: "",
      club: "",
    };

    setTempFilters(clearedFilters);
    Object.keys(clearedFilters).forEach((key) => {
      updateFilterCriteria(key, clearedFilters[key]);
    });
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
      <h3>Rating filtrer</h3>
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
          value={filterCriteria.name || ""}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Indtast klubnavn"
          value={filterCriteria.club || ""}
          onChange={(e) => handleClubChange(e.target.value)}
        />
      </div>
      <div className="filter-knapper">
        <button className="btn" onClick={handleSave}>
          Gem
        </button>
        <button
          className="profile-btns-actions-seperat"
          onClick={handleClearFilters}
        >
          Ryd filter
        </button>
      </div>
    </div>
  );
}
