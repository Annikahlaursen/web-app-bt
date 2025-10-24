import { useEffect, useState } from "react";
import NumberPick from "../components/NumberPick";
import SearchSpiller from "../components/SearchSpiller";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";
import arrowBlack from "/public/arrow-left-black.svg";
import KampCard from "../components/KampCard";
import { getHoldById } from "../helper";

export default function KampResultatPage() {
  const [hold, setHold] = useState({});
  const [kamp, setKamp] = useState({});
  const [valgteSpillereHjem, setValgteSpillereHjem] = useState([]);
  const [valgteSpillereUde, setValgteSpillereUde] = useState([]);

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

  useEffect(() => {
    getHoldById(useParams.hid).then((fetchedHold) => setHold(fetchedHold));
  }, [params.hid]);

  //get data from hold and klub based on kamp data
  const hjemmeholdNavn = hold?.[kamp?.hjemmehold]?.navn ?? "Hjemme";
  const udeholdNavn = hold?.[kamp?.udehold]?.navn ?? "Ude";

  // helpes to extract user ids (react-select returns {value,label}, other variants may be id or user object)
  function extractIds(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map((s) => s?.value ?? s?.id ?? s).filter(Boolean);
  }

  async function handleSave() {
    // collect unique user ids from both selections
    const hjemIds = extractIds(valgteSpillereHjem);
    const udeIds = extractIds(valgteSpillereUde);
    const allIds = Array.from(new Set([...hjemIds, ...udeIds]));

    // update each user's rating by +10
    const updatePromises = allIds.map(async (uid) => {
      const userUrl = `${
        import.meta.env.VITE_FIREBASE_DATABASE_URL
      }/users/${uid}.json`;
      try {
        const res = await fetch(userUrl);
        const user = await res.json();
        const newRating = (user?.rating ?? 0) + 10;
        return fetch(userUrl, {
          method: "PATCH",
          body: JSON.stringify({ rating: newRating }),
        });
      } catch (err) {
        console.warn("Failed to update user", uid, err);
        return null;
      }
    });

    await Promise.all(updatePromises);

    const updatedKamp = {
      ...kamp,
      spillereHjemme: valgteSpillereHjem, //data fra searchSpillere
      spillereUde: valgteSpillereUde, //data fra searchSpillere
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

      // event der notificerer Ratingpage om opdatering af ratings
      const event = new CustomEvent("ratingsUpdated", {
        detail: { updatedKamp },
      });
      window.dispatchEvent(event);

      // naviger tilbage til kamp siden med opdaterede spillere
      navigate(`/kamp/${params.id}`, {
        state: { spillere: valgteSpillereHjem },
      });
    } else {
      console.log("Error updating kamp resultat");
    }
  }

  return (
    <section className="resultat-page">
      <button className="btn" onClick={handleSave}>
        Gem resulatat
      </button>
      <Link to="...">
        <img
          className="arrow"
          src={arrowBlack}
          alt="Arrow back to previus page"
        />
      </Link>
      <KampCard kamp={kamp} oplysninger="kunOplysninger" />
      <section className="updateResult">
        <p>Vælg spillere ({hjemmeholdNavn})</p>
        <SearchSpiller
          key={kamp.id}
          kamp={kamp}
          onSpillerChange={(spillere) => setValgteSpillereHjem(spillere)}
        />
        <p>Vælg spillere ({udeholdNavn})</p>
        <SearchSpiller
          key={kamp.id}
          kamp={kamp}
          onSpillerChange={(spillere) => setValgteSpillereUde(spillere)}
        />
        <section className="result-number">
          <p>Resultat</p>
          <NumberPick
            key={kamp.id}
            kamp={kamp}
            onChangeH={(nytHjemResultat) => setResultatHjem(nytHjemResultat)}
            onChangeU={(nytUdeResultat) => setResultatUde(nytUdeResultat)}
          />
        </section>
      </section>
    </section>
  );
}
