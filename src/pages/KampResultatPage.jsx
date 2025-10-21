import { useEffect, useState } from "react";
import NumberPick from "../components/NumberPick";
import SearchSpiller from "../components/SearchSpiller";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import arrowBlack from "/public/arrow-left-black.svg";

export default function KampResultatPage() {
  const [kamp, setKamp] = useState({});
  const [valgteSpillere, setValgteSpillere] = useState([]);
  const [resultatHjem, setResultatHjem] = useState(0);
  const [resultatUde, setResultatUde] = useState(0);

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
      resultatHjemme: resultatHjem, //data fra numberPick
      resultatUde: resultatUde, //data fra numberPick
      harResultat: true,
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
      <Link to="...">
        <img
          className="arrow"
          src={arrowBlack}
          alt="Arrow back to previus page"
        />
      </Link>
      <h1>Kamp Resultat Page</h1>
      <p>KampID: {kamp?.id}</p>
      <SearchSpiller
        key={kamp.id}
        kamp={kamp}
        onSpillerChange={(spillere) => setValgteSpillere(spillere)}
      />
      <p>Her kan du se kampens resultat og statistik. {kamp.dato} </p>
      <NumberPick
        onChangeH={(nytHjemResultat) => setResultatHjem(nytHjemResultat)}
        onChangeU={(nytUdeResultat) => setResultatUde(nytUdeResultat)}
      />
      <button className="btn" onClick={handleSave}>
        Gem resulatat
      </button>
    </section>
  );
}
