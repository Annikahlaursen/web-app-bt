import { useState, useEffect } from "react";
import Select from "react-select";
import HoldBoks from "../components/HoldBoks";
import KampCard from "../components/KampCard";
import { useNavigate } from "react-router";
import arrowBlack from "/arrow-left-black.svg";

export default function HoldSearchPage() {
  const [klub, setKlub] = useState([]);
  const navigate = useNavigate();
  const [kamp, setKamp] = useState([]);
  const kampUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe.json`;
  const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;
  const [selectedOption, setSelectedOption] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // fetch klub
      const response = await fetch(klubUrl);
      const data = await response.json();

      const klubArray = data
        ? Object.keys(data).map((klubId) => ({ id: klubId, ...data[klubId] }))
        : [];

      // fetch kampe
      const kampresponse = await fetch(kampUrl);
      const kampData = await kampresponse.json();

      const kampArray = kampData
        ? Object.keys(kampData).map((kampId) => ({
            id: kampId,
            ...kampData[kampId],
          }))
        : [];

      setKamp(kampArray);
      setKlub(klubArray);
    }

    fetchData();
  }, [kampUrl, klubUrl]);

  const klubOptions = klub.map((klub) => ({
    value: klub.id,
    label: klub.navn || "ukendt klub",
  }));

  klubOptions.sort((a, b) => a.label.localeCompare(b.label));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
  };

  const displayedKampe = selectedOption
    ? kamp.filter(
        (klub) =>
          klub.hjemmeklub === selectedOption.value ||
          klub.udeklub === selectedOption.value
      )
    : kamp;

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
          options={klubOptions}
          value={selectedOption}
          onChange={handleSelectChange}
          placeholder="Søg efter hold eller kampe"
          isClearable
          isSearchable
        ></Select>
      </div>
      <div className="holdkampe-background page">
        {klub.map((hold) => (
          <HoldBoks key={hold.id} hold={hold} />
        ))}

        {displayedKampe.map((klub) => (
          <KampCard
            key={klub.id}
            kamp={klub}
            onCLick={() => navigate(`/kamp/${klub.id}`)}
            oplysninger="kunOplysninger"
          />
        ))}
      </div>
    </div>
  );
}
