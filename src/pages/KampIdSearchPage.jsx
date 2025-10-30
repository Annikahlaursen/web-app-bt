import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import KampCard from "../components/KampCard";
import useFilters from "../hooks/useFilters";
import arrowBlack from "/public/arrow-left-black.svg";
import tableTennis from "/public/table-tennis-icon.svg";
import ArrowBack from "../components/ArrowBack";

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
  const navigate = useNavigate();

  function navigateBack() {
    navigate("/kalender");
  }

  return (
    <div>
      <ArrowBack color="black" />
      <div className="search-pages">
        <input
          className="searchbar"
          type="text"
          name="search"
          placeholder="Søg efter KampID"
          value={filterCriteria.id || ""}
          onChange={(e) => updateFilterCriteria("id", e.target.value)}
          style={{ flex: 1, padding: "10px", width: "40vh" }}
        />
      </div>
      <section className="opdel holdkampe-background">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((kamp) => (
            <KampCard key={kamp.id} kamp={kamp} oplysninger="kunOplysninger" />
          ))
        ) : (
          <div className="no-kamp-today">
            <img
              style={{ height: "90px" }}
              src={tableTennis}
              alt="bordtennis bat icon"
            />
            <h2 id="kamp-error">Der er ingen kampe i dag.</h2>
            <p>
              Bemærk: Kampdata kan kun opdateres på den dag, kampen spilles.
            </p>
            <div className="tilbage-til-kalender" onClick={navigateBack}>
              <img src={arrowBlack} alt="pil tilbage knap" />
              <p>Gå til kalender</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
