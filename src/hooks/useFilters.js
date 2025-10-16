import { useState, useEffect } from "react";

export default function useFilters(users) {
  const [filterCriteria, setFilterCriteria] = useState({
    ageMin: "",
    ageMax: "",
    ageInterval: "",
    club: "",
    name: "",
  });

  const [filteredUsers, setFilteredUsers] = useState(users);


  const applyFilters = () => {
    const filtered = users.filter((user) => {
      // aldersfilter
      const matchesAge =
        (!filterCriteria.ageMin || user.age >= filterCriteria.ageMin) &&
        (!filterCriteria.ageMax || user.age <= filterCriteria.ageMax);

      // navnefilter
      const matchesName =
        !filterCriteria.name ||
        `${user.fornavn} ${user.efternavn}`
          .toLowerCase()
          .includes(filterCriteria.name.toLowerCase());


           const matchesClub =
             !filterCriteria.club ||
             (user.club &&
               user.club
                 .toLowerCase()
                 .includes(filterCriteria.club.toLowerCase()));

      return matchesAge && matchesName && matchesClub;
    });

    setFilteredUsers(filtered);
  };

  // opdater filterkriterier
  const updateFilterCriteria = (key, value) => {
    setFilterCriteria((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [filterCriteria, users]);

  return {
    filterCriteria,
    filteredUsers,
    updateFilterCriteria,
  };
}