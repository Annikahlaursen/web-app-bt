import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import StevneCard from "../components/StevneCard";
import useFilters from "../hooks/useFilters";
import ArrowBack from "../components/ArrowBack";

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
    <section className="page-topmargin">
      <div className="search-pages">
        <ArrowBack color="black" />
        <h1>Stævner</h1>
        <input
          type="text"
          name="search"
          placeholder="Søg efter stævne"
          value={filterCriteria.titel || ""}
          onChange={(e) => updateFilterCriteria("titel", e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />
      </div>
      <div className="holdkampe-background page">
        {filteredData.map((stevne) => (
          <StevneCard
            stevne={stevne}
            key={stevne.id}
            onCLick={() => navigate(`/stevne/${stevne.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
