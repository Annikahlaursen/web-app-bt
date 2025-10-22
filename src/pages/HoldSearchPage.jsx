import { useState, useEffect } from "react";
import Select from "react-select";
import HoldBoks from "../components/HoldBoks";
import KampCard from "../components/KampCard";
import { useNavigate } from "react-router";
import arrowBlack from "/arrow-left-black.svg";

export default function HoldSearchPage() {
  const [hold, setHold] = useState([]);
  const [klub, setKlub] = useState([]);
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

      //klub data fetch
      const klubResponse = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`
      ); // fetch data from the url
      const klubData = await klubResponse.json(); // get the data from the response and parse it

      const klubArray = Object.keys(klubData).map((klubId) => ({
        id: klubId,
        ...data[klubId],
      }));

      setKlub(klubArray);

      setHold(holdArray); // set the posts state with the postsArray
    }

    fetchHold();
  }, []);

  const holdOptions = hold.map((hold) => ({
    value: hold.id,
    label: hold.navn,
  }));

  const klubOptions = klub.map((klub) => ({
    value: klub.id,
    label: klub.navn,
  }));

  const handleSelectChange = (selectedOption) => {
    console.log("Selected klub:", selectedOption);
    // You can add further logic here to handle the selected hold
  };

  return (
    <div className="page-topmargin">
      <div className="search-pages">
        <img
          className="arrow"
          src={arrowBlack}
          alt="Arrow back to previous page"
          onClick={() => navigate(-1)}
        />
        <h1>Søg på klubber her</h1>
        <Select
          options={klubOptions}
          //value={selectedOption}
          onChange={handleSelectChange}
          placeholder="Søg efter klubber"
          isClearable
          isSearchable
        ></Select>
      </div>
      <div className="holdkampe-background page">
        {klubOptions.map((hold, klub) => (
          <HoldBoks key={hold.id} klub={klub.id} hold={hold.id} />
        ))}

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
