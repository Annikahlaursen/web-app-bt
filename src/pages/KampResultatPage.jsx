export default function KampResultatPage() {
  function clicked(event) {
    event.preventDefault();
    alert("Funktion ikke implementeret endnu");
  }

  return (
    <section className="page">
      <h1>Kamp Resultat Page</h1>
      <p>Her kan du se kampens resultat og statistik.</p>
      <button onClick={clicked}>gem</button>
    </section>
  );
}
