import { useState, useEffect } from "react";
import Select from "react-select";
import HoldBoks from "../components/HoldBoks";
import KampCard from "../components/KampCard";
import { useNavigate } from "react-router";
import arrowBlack from "/arrow-left-black.svg";

export default function HoldSearchPage() {
  const [klubber, setKlubber] = useState([]);
  const navigate = useNavigate();
  const [kamp, setKamp] = useState([]);
  const [hold, setHold] = useState([]);
  const kampUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe.json`;
  const klubUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;
  const holdUrl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const [selectedOption, setSelectedOption] = useState(null);
  //const [selectedOptionHold, setSelectedOptionHold] = useState([]);

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

      // fetch hold
      const holdresponse = await fetch(holdUrl);
      const holdData = await holdresponse.json();

      const holdArray = holdData
        ? Object.keys(holdData).map((holdId) => ({
            id: holdId,
            ...holdData[holdId],
          }))
        : [];

      setHold(holdArray);
      setKamp(kampArray);
      setKlubber(klubArray);
    }

    fetchData();
  }, [kampUrl, klubUrl, holdUrl]);

  const klubOptions = klubber.map((klub) => ({
    value: klub.id,
    label: klub.navn || "ukendt klub",
  }));

  klubOptions.sort((a, b) => a.label.localeCompare(b.label));

  const HoldOptions = hold.map((hold) => ({
    value: hold.id,
    label: hold.navn || "ukendt klub",
  }));

  HoldOptions.sort((a, b) => a.label.localeCompare(b.label));

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

  const displayedHold = selectedOption
    ? hold.filter((h) => {
        const klubForHold = klubber.find((k) => k.hold.includes(h.id));
        return klubForHold?.id === selectedOption.value;
      })
    : hold;

  return (
    <div>
      <div className="search-pages">
        <img
          className="arrow"
          src={arrowBlack}
          alt="Arrow back to previous page"
          onClick={() => navigate(-1)}
        />
        <Select
          options={klubOptions}
          value={selectedOption}
          onChange={handleSelectChange}
          placeholder="Søg efter klubber"
          isClearable
          isSearchable
        ></Select>
      </div>
      <div className="holdkampe-background">
        <div className="gap-to-card">
          {displayedHold.map((hold) => {
            const klubForHold = klubber.find((k) => k.hold.includes(hold.id));
            return <HoldBoks key={hold.id} hold={hold} klub={klubForHold} />;
          })}
        </div>
        {displayedKampe.map((klub) => (
          <KampCard
            key={klub.id}
            kamp={klub}
            onCLick={() => navigate(`/kamp/${klub.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
