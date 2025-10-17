import { useState, useEffect } from "react";

export default function useFilters(data, filterFunction) {
  const [filterCriteria, setFilterCriteria] = useState({
    // ageMin: "",
    // ageMax: "",
    // ageInterval: "",
    // club: "",
    // name: "",
  });

  // const [filteredUsers, setFilteredUsers] = useState(users);
  const [filteredData, setFilteredData] = useState(data);

const applyFilters = () => {
  const filtered = data.filter((item) => filterFunction(item, filterCriteria));
  setFilteredData(filtered);
};

// Update filter criteria
const updateFilterCriteria = (key, value) => {
  setFilterCriteria((prev) => ({
    ...prev,
    [key]: value,
  }));
};

// Reapply filters whenever data or filter criteria change
useEffect(() => {
  applyFilters();
}, [data, filterCriteria]);

return { filteredData, filterCriteria, updateFilterCriteria };


  // const applyFilters = () => {
  //   const filtered = users.filter((user) => {
  //     // aldersfilter
  //     const matchesAge =
  //       (!filterCriteria.ageMin || user.age >= filterCriteria.ageMin) &&
  //       (!filterCriteria.ageMax || user.age <= filterCriteria.ageMax);

  //     // navnefilter
  //     const matchesName =
  //       !filterCriteria.name ||
  //       `${user.fornavn} ${user.efternavn}`
  //         .toLowerCase()
  //         .includes(filterCriteria.name.toLowerCase());

  //     //clubfilter
  //     const matchesClub =
  //       !filterCriteria.club ||
  //       (user.clubName &&
  //         user.clubName.toLowerCase().includes(filterCriteria.club.toLowerCase()));

  //     return matchesAge && matchesName && matchesClub;
  //   });

  //   setFilteredUsers(filtered);

  // };

  // opdater filterkriterier
  // const updateFilterCriteria = (key, value) => {
  //   setFilterCriteria((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };

  // useEffect(() => {
  //   applyFilters();
  // }, [filterCriteria, users]);

  // return {
  //   filterCriteria,
  //   filteredUsers,
  //   updateFilterCriteria,
  // };
}
