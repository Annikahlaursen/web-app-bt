import { useState, useEffect, useRef } from "react";
import Select from "react-select";

export default function FilterOverlay({
  filterCriteria,
  updateFilterCriteria,
  closeOverlay,
  klubOptions,
}) {
  const overlayRef = useRef(null);
  const ageIntervals = [
    { value: "8-15", label: "8-15 år", ageMin: 8, ageMax: 15 },
    { value: "16-21", label: "16-21 år", ageMin: 16, ageMax: 21 },
    { value: "22-44", label: "22-44 år", ageMin: 22, ageMax: 44 },
    { value: "+45", label: "+45 år", ageMin: 45, ageMax: "" },
  ];

  // Local state til temporary filters (bruges til at gemme ændringer før de gemmes endeligt)
  const [tempFilters, setTempFilters] = useState(filterCriteria);

  useEffect(() => {
    setTempFilters(filterCriteria);
  }, [filterCriteria]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        closeOverlay();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Håndter ændring af aldersinterval
  const handleAgeIntervalChange = (selectedAgeGroups) => {
    console.log("selectedAgeGroups", selectedAgeGroups);

    const selectedIntervals = (selectedAgeGroups || []).map((group) => {
      // Find the full object in ageIntervals
      const matchingInterval = ageIntervals.find(
        (interval) => interval.value === group.value
      );
      return matchingInterval || group; // Fallback to group if no match
    });

    console.log("Mapped selectedIntervals:", selectedIntervals);

    // Update the filter criteria with the selected intervals
    updateFilterCriteria(
      "ageIntervals",
      selectedIntervals.map((interval) => ({
        ageMin: interval.ageMin,
        ageMax: interval.ageMax,
      }))
    );

    setTempFilters((prev) => ({
      ...prev,
      ageIntervals: selectedIntervals,
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

  // Håndter ændring af klubber
  const handleClubChange = (selectedClubs) => {
    const clubValues = selectedClubs
      ? selectedClubs.map((club) => club.value)
      : [];

        console.log("Selected Clubs:", selectedClubs);
        console.log("Club Values:", clubValues);
    updateFilterCriteria("clubs", clubValues);

    setTempFilters((prev) => ({
      ...prev,
      clubs: clubValues,
    }));
  };

  //Rydning af filtre
  const handleClearFilters = () => {
    const clearedFilters = {
      ageIntervals: [],
      ageMin: "",
      ageMax: "",
      name: "",
      clubs: [],
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
    <div className="filter-overlay" ref={overlayRef}>
      <h3>Rating filtrer</h3>
      <div>
        <Select
          options={ageIntervals}
          placeholder="Vælg aldersgrupper"
          isMulti
          isClearable
          value={tempFilters.ageIntervals?.map((interval) => {
            // Find the matching interval in ageIntervals to get the label
            const matchingInterval = ageIntervals.find(
              (ageInterval) =>
                ageInterval.ageMin === interval.ageMin &&
                ageInterval.ageMax === interval.ageMax
            );
            return {
              value: `${interval.ageMin}-${interval.ageMax}`,
              label:
                matchingInterval?.label ||
                `${interval.ageMin}-${interval.ageMax}`,
            };
          })}
          onChange={handleAgeIntervalChange}
        />
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
        <Select
          options={klubOptions}
          placeholder="Vælg klubber"
          isMulti
          isClearable
          value={tempFilters.clubs?.map((club) => ({
            value: club,
            label: klubOptions.find((k) => k.value === club)?.label || club,
          }))}
          onChange={handleClubChange}
        />
      </div>
      <div className="filter-knapper">
        <button onClick={handleSave}>Gem</button>
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
