import { useState, useEffect } from "react";
import Select from "react-select";

export default function HoldSearchPage() {
  const [hold, setHold] = useState([]);

  useEffect(() => {
    async function fetchHold() {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`
      ); // fetch data from the url
      const data = await response.json(); // get the data from the response and parse it

      const holdArray = Object.keys(data).map((holdId) => ({
        id: holdId,
        ...data[holdId],
      })); // map the data to an array of objects

      setHold(holdArray); // set the posts state with the postsArray
    }

    fetchHold();
  }, []);

  const holdOptions = hold.map((hold) => ({
    value: hold.id,
    label: hold.navn,
  }));

  const handleSelectChange = (selectedOption) => {
    console.log("Selected hold:", selectedOption);
    // You can add further logic here to handle the selected hold
  };

  holdOptions.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <h1>Søg på hold her</h1>
      <Select
        options={holdOptions}
        //value={selectedOption}
        onChange={handleSelectChange}
        placeholder="Søg efter hold eller kampe"
        isClearable
        isSearchable
      ></Select>
    </>
  );
}
