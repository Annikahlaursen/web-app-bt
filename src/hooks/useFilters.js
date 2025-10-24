import { useState, useEffect } from "react";

export default function useFilters(data, filterFunction) {
  const [filterCriteria, setFilterCriteria] = useState({});
  const [filteredData, setFilteredData] = useState(data);

  const applyFilters = () => {
    const filtered = data.filter((item) =>
      filterFunction(item, filterCriteria)
    );
    setFilteredData(filtered);
  };

  // Opdaterer filterkriterierne
  const updateFilterCriteria = (key, value) => {
    setFilterCriteria((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Tilpasser filteredData når data eller filterCriteria ændres
  useEffect(() => {
    applyFilters();
  }, [data, filterCriteria]);

  return { filteredData, filterCriteria, updateFilterCriteria };
}
