import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import arrowBlack from "/arrow-left-black.svg";

import StevneCard from "../components/StevneCard";
import useFilters from "../hooks/useFilters";

export default function StevneSearchPage() {
  //-----------------Fetch stævner-----------------
  const [stevner, setStevner] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStevner() {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/staevner.json`
      );
      const data = await response.json();
      // from object to array
      const staevneArray = Object.keys(data).map((stevneId) => ({
        id: stevneId,
        ...data[stevneId],
      }));

      setStevner(staevneArray);
    }

    fetchStevner();
  }, []);

  const { filteredData, filterCriteria, updateFilterCriteria } = useFilters(
    stevner,
    (stevne, criteria) => {
      const matchesTitel =
        !criteria.titel ||
        stevne.titel.toLowerCase().includes(criteria.titel.toLowerCase());

      return matchesTitel;
    }
  );

  return (
    <section className="page">
      <img
        className="arrow"
        src={arrowBlack}
        alt="Arrow back to previous page"
        onClick={() => navigate(-1)}
      />
      <h1>Stævner</h1>
      <input
        type="text"
        name="search"
        placeholder="Søg efter stævne"
        value={filterCriteria.name || ""}
        onChange={(e) => updateFilterCriteria("name", e.target.value)}
        style={{ flex: 1, padding: "10px" }}
      />
      {filteredData.map((stevne) => (
        <StevneCard stevne={stevne} key={stevne.id} />
      ))}
    </section>
  );
}
