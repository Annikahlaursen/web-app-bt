import KampCard from "../components/KampCard";
import RatingBoks from "../components/RatingBoks";
import HoldBoks from "../components/HoldBoks";


export default function HomePage() {
  return (
    <section className="page">
      <HoldBoks />
      <RatingBoks/>
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
