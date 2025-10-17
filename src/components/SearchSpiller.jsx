import { useState, useEffect } from "react";
import RatingBoks from "./RatingBoks";
import Select from "react-select";

//value=key
const options = [
  { value: "holland", label: "Holland" },
  { value: "denmark", label: "Denmark" },
  { value: "sweden", label: "Sweden" },
  { value: "norway", label: "Norway" },
  { value: "finland", label: "Finland" },
];

export default function SearchSpiller() {
  const [searchQuery, setSearchQuery] = useState(""); // set the initial state to an empty string
  const [users, setUsers] = useState([]); // set the initial state to an empty array
  const [showResults, setShowResults] = useState(false); // Track input focus

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
  const teamHid = "-HnAd4o6AtIlkW2SCf6R";
  const teamUsers = users.filter((user) => user.hid === teamHid);

  // Filter posts based on the search query
  const filteredUsers = teamUsers.filter((user) =>
    (user.fornavn ?? "").toLowerCase().includes(searchQuery)
  );

  const [selectedOption, setSelectedOption] = useState({});

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  return (
    <>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
      />

      <label>
        Search by name{" "}
        <input
          aria-label="Search by caption"
          defaultValue={searchQuery}
          onClick={() => setShowResults(true)}
          onChange={(event) => setSearchQuery(event.target.value.toLowerCase())}
          placeholder="Søg spiller"
          type="search"
          name="searchQuery"
        />
      </label>
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
