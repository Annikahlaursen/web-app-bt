import { useState, useEffect } from "react";
import Select from "react-select";

export default function SearchSpiller({ holdId, klubId, onSpillerChange }) {
  const [users, setUsers] = useState([]); // set the initial state to an empty array
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/users.json`
      ); // fetch data from the url
      const data = await response.json(); // get the data from the response and parse it
      // from object to array
      const userArray = Object.keys(data).map((userId) => ({
        id: userId,
        ...data[userId],
      })); // map the data to an array of objects

      setUsers(userArray); // set the posts state with the postsArray
    }

    fetchUsers();
  }, []);

  //Disse 2 linjer vil måske kunne bruges til at filtere og først vie dem der er på hjemmeholdet
  /* Only users with hid: -HnAd4o6AtIlkW2SCf6R
  const teamHid = kamp.hjemmehold;
  const teamUsers = users.filter((user) => user.hid === teamHid);
  */

  // Filter users by holdId if provided
  const filteredByKlub = users.filter((u) =>
    klubId ? u.kid === klubId : true
  );

  const onHold = filteredByKlub
    .filter((u) => u.hid === holdId)
    .sort((a, b) => {
      const nameA = `${a.fornavn ?? ""} ${a.efternavn ?? ""}`.trim();
      const nameB = `${b.fornavn ?? ""} ${b.efternavn ?? ""}`.trim();
      return nameA.localeCompare(nameB);
    });

  const offHold = filteredByKlub
    .filter((u) => u.hid !== holdId)
    .sort((a, b) => {
      const nameA = `${a.fornavn ?? ""} ${a.efternavn ?? ""}`.trim();
      const nameB = `${b.fornavn ?? ""} ${b.efternavn ?? ""}`.trim();
      return nameA.localeCompare(nameB);
    });

  const combined = [...onHold, ...offHold];

  const userOptions = combined.map((user) => ({
    value: user.id,
    label: `${user.fornavn} ${user.efternavn ?? ""}`.trim(),
  }));

  console.log(userOptions, klubId);

  useEffect(() => {
    setSelectedPlayers([]);
    if (onSpillerChange) onSpillerChange([]);
  }, [holdId, klubId]);

  function handleSelectChange(selectedOptions) {
    setSelectedPlayers(selectedOptions);
    if (onSpillerChange) onSpillerChange(selectedOptions); // 🔥 send data op
  }

  return (
    <>
      <Select
        className="select-boks"
        isMulti
        options={userOptions}
        value={selectedPlayers}
        onChange={handleSelectChange}
        placeholder="Søg efter spiller"
        isClearable
        isSearchable
      />
    </>
  );
}
