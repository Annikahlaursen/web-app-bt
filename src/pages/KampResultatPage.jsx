import { useEffect, useState } from "react";
import NumberPick from "../components/NumberPick";
import SearchSpiller from "../components/SearchSpiller";
import { useNavigate, useParams } from "react-router";

export default function KampResultatPage() {
  const [kamp, setKamp] = useState({});
  const [valgteSpillere, setValgteSpillere] = useState([]);
  const [resultat, setResultat] = useState({ hjemme: 0, ude: 0 });

  const params = useParams();
  const navigate = useNavigate();
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

  async function handleSave() {
    const updatedKamp = {
      ...kamp,
      spillere: valgteSpillere, //data fra searchSpillere
      resultat: resultat, //data fra numberPick
    };

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(updatedKamp),
    });

    if (response.ok) {
      console.log("Tillykke, kamp er blevet opdateret");
      navigate(`/kamp/${params.id}`);
    } else {
      console.log("Error updating kamp resultat");
    }
  }

  return (
    <section className="page">
      <h1>Kamp Resultat Page</h1>
      <p>KampID: {kamp?.id}</p>
      <SearchSpiller
        key={kamp.id}
        kamp={kamp}
        onSpillerChange={(spillere) => setValgteSpillere(spillere)}
      />
      <p>Her kan du se kampens resultat og statistik. {kamp.dato} </p>
      <NumberPick onChange={(nytresultat) => setResultat(nytresultat)} />
      <button className="btn" onClick={handleSave}>
        Gem resulatat
      </button>
    </section>
  );
}
