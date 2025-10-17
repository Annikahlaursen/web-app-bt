import { useEffect, useState } from "react";
import NumberPick from "../components/NumberPick";
import SearchSpiller from "../components/SearchSpiller";
import { useParams } from "react-router";

export default function KampResultatPage() {
  const [kamp, setKamp] = useState({});
  const params = useParams();
  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe/${
    params.id
  }.json`;

  useEffect(() => {
    async function getKamp() {
      const response = await fetch(url);
      const data = await response.json();
      data.id = params.id;
      setKamp(data);
    }

    getKamp();
  }, [params.id, url]);

  function clicked(event) {
    event.preventDefault();
    alert("Funktion ikke implementeret endnu");
  }

  return (
    <section className="page">
      <h1>Kamp Resultat Page</h1>
      <p>KampID: {kamp?.id}</p>
      <SearchSpiller key={kamp.id} kamp={kamp.id} />
      <p>Her kan du se kampens resultat og statistik. {kamp.dato} </p>
      <NumberPick />
      <button className="btn" onClick={clicked}>
        Gem resulatat
      </button>
    </section>
  );
}
