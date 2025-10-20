import { useState, useEffect } from "react";
import KampCard from "../components/KampCard";
import useFilters from "../hooks/useFilters";

export default function KampIdSearchPage() {
  const [kamp, setKamp] = useState([]);
  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe.json`;

  useEffect(() => {
    async function getKamp() {
      const kampResponse = await fetch(url);
      const data = await kampResponse.json();

      if (data) {
        const kampArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
        console.log(today);

        const todaysKampe = kampArray.filter((kamp) => {
          if (!kamp.dato) return false;
          const kampDato = new Date(kamp.dato);
          kampDato.setHours(0, 0, 0, 0);
          return kampDato.getTime() === today.getTime();
        });

        setKamp(todaysKampe);

        /*datesArray.filter((kamp) => kamp.dato && new Date(kamp.dato) >= today);
        console.log(datesArray);*/
      }

      console.log(data);
    }

    getKamp();
  }, [url]);

  const { filteredData, filterCriteria, updateFilterCriteria } = useFilters(
    kamp,
    (kamp, criteria) => {
      // KampID filter
      const matchesKampID =
        !criteria.id ||
        kamp.id.toLowerCase().includes(criteria.id.toLowerCase());
      return matchesKampID;
    }
  );

  return (
    <>
      <h1>Søg kampID</h1>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          name="search"
          placeholder="Søg efter KampID"
          value={filterCriteria.id || ""}
          onChange={(e) => updateFilterCriteria("id", e.target.value)}
          style={{ flex: 1, padding: "10px", width: "40vh" }}
        />

        {filteredData.length > 0 ? (
          filteredData.map((kamp) => (
            <KampCard key={kamp.id} kamp={kamp} oplysninger="kunOplysninger" />
          ))
        ) : (
          <p>Ingen kampe idag</p>
        )}
      </div>
    </>
  );
}
