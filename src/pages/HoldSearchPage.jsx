import { useState, useEffect } from "react";
import Select from "react-select";
import HoldBoks from "../components/HoldBoks";
import KampCard from "../components/KampCard";
import { useNavigate } from "react-router";
import arrowBlack from "/arrow-left-black.svg";

export default function HoldSearchPage() {
  const [hold, setHold] = useState([]);
  const navigate = useNavigate();

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
    <div className="page-topmargin">
      <div className="search-pages">
        <img
          className="arrow"
          src={arrowBlack}
          alt="Arrow back to previous page"
          onClick={() => navigate(-1)}
        />
        <h1>Søg på hold her</h1>
        <Select
          options={holdOptions}
          //value={selectedOption}
          onChange={handleSelectChange}
          placeholder="Søg efter hold eller kampe"
          isClearable
          isSearchable
        ></Select>
      </div>
      <div className="holdkampe-background page">
        <HoldBoks key={hold.id} hold={hold} />

        {holdOptions.map((hold) => (
          <KampCard
            kampe={hold}
            key={hold.id}
            onCLick={() => navigate(`/hold/${hold.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
