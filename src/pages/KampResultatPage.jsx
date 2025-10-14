import NumberPick from "../components/NumberPick";
import SearchSpiller from "../components/SearchSpiller";

export default function KampResultatPage() {
  function clicked(event) {
    event.preventDefault();
    alert("Funktion ikke implementeret endnu");
  }

  return (
    <section className="page">
      <h1>Kamp Resultat Page</h1>
      <SearchSpiller />
      <p>Her kan du se kampens resultat og statistik.</p>
      <NumberPick />
      <button className="btn" onClick={clicked}>
        Gem resulatat
      </button>
    </section>
  );
}
