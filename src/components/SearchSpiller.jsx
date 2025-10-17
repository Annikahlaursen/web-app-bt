import { useState, useEffect } from "react";
import RatingBoks from "./RatingBoks";
import Select from "react-select";

export default function SearchSpiller({ kamp }) {
  const [searchQuery, setSearchQuery] = useState(""); // set the initial state to an empty string
  const [users, setUsers] = useState([]); // set the initial state to an empty array
  const [showResults, setShowResults] = useState(false); // Track input focus
  const [selectedOption, setSelectedOption] = useState({});

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

  // Only users with hid: -HnAd4o6AtIlkW2SCf6R
  const teamHid = kamp.hjemmehold;
  const teamUsers = users.filter((user) => user.hid === teamHid);

  // dynamiske options til react-select
  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.fornavn} ${user.efternavn ?? ""}`.trim(),
  }));

  const handleChange = (option) => {
    setSelectedOption(option);
    setShowResults(true);
  };

  // Filter posts based on the search query
  const filteredUsers = (
    selectedOption
      ? users.filter((user) => user.id === selectedOption.value)
      : teamUsers
  ).filter((user) => (user.fornavn ?? "").toLowerCase().includes(searchQuery));

  return (
    <>
      <Select
        options={userOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder="Søg efter spiller"
        isClearable
        isSearchable
      />

      {showResults && (
        <div>
          {filteredUsers.map((user, idx) => (
            <RatingBoks key={user.id} user={user} placering={idx + 1} />
          ))}
        </div>
      )}
    </>
  );
}
