import KampCard from "../components/KampCard";
import HoldBoks from "../components/HoldBoks";
import RatingListe from "../components/RatingListe";


export default function HomePage() {
  return (
    <section className="page">
      <HoldBoks />
      <RatingListe/>
      <h1>Home Page</h1>
      <p>Home is where the heart is 💛</p>
      <p>Oh My, sounds like a bad movie!</p>
      <p>Hej ændringer</p>
      <h1>Hej verden</h1>
      <KampCard />

      {/* <p>https://web-app-bt-124b8-default-rtdb.firebaseio.com/</p> */}
    </section>
  );
}
