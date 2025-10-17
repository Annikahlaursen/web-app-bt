import { useEffect, useState } from "react";
import StevneCard from "../components/StevneCard";


export default function StevneSearchPage() {
  //-----------------Fetch stævner-----------------
  const [stevner, setStevner] = useState([]);

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

      console.log(staevneArray);
    }

    fetchStevner();
  }, []);

return (
  <section className="page">
    <h1>Stævnesøgning</h1>
    {stevner.map((stevne) => (
      <StevneCard stevne={stevne} key={stevne.id} />
    ))}
  </section>
);


}