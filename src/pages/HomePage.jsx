import { Link } from "react-router";

import KampCard from "../components/KampCard";
import NyhedsCard from "../components/NyhedsCard";
import photo from "/public/img/unsplash-photo.svg";
import arrow from "/public/arrow-right-black.svg";
import RatingListe from "../components/RatingListe";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [kamp, setKamp] = useState([]);

  useEffect(() => {
    async function fetchKampe() {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe.json`
      );
      const data = await response.json();
      // from object to array
      const kampArray = Object.keys(data).map((kampId) => ({
        id: kampId,
        ...data[kampId],
      }));

      setKamp(kampArray);
    }

    fetchKampe();
  }, []);

  const iDag = new Date();
  iDag.setHours(0, 0, 0, 0);
  //filter kampe fra der har været der
  const kommendeKampe = kamp.filter((k) => new Date(k.dato) >= iDag);
  //sort kampe efter dato
  kommendeKampe.sort((a, b) => new Date(a.dato) - new Date(b.dato));

  const nextKamp = kommendeKampe[0]; // den næste kamp
  if (!nextKamp) return <p>Ingen kommende kampe</p>;

  console.log("næste kamp:", nextKamp.id);

  return (
    <section>
      <img src={photo} alt="" />
      <section className="forside">
        <section className="forside-del">
          <h1>Din Næste Kamp</h1>
          <KampCard key={nextKamp.id} kamp={nextKamp} />
          <Link className="flex-pil" to="/kamp">
            <p>Se alle kampe</p>
            <img src={arrow} alt="Pil til kamp med id" />
          </Link>
        </section>
        <section className="forside-del">
          <h1>Rating</h1>
          <RatingListe />
          <Link className="flex-pil" to="/rating">
            <p>Se alle ratings</p>
            <img src={arrow} alt="Pil til rating-side" />
          </Link>
        </section>
        <section className="forside-del">
          <h1>Nyheder</h1>
          <NyhedsCard />
          <NyhedsCard />
          <NyhedsCard />
          <Link className="flex-pil" to="/nyheder">
            <p>Se alle nyheder</p>
            <img src={arrow} alt="Pil til nyheder" />
          </Link>
        </section>
      </section>

      {/* <p>https://web-app-bt-124b8-default-rtdb.firebaseio.com/</p> */}
    </section>
  );
}
