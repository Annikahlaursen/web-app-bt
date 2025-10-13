import KampCard from "../components/KampCard";
import HoldBoks from "../components/HoldBoks";

import StevneCard from "../components/StevneCard";
import NyhedsCard from "../components/NyhedsCard";

export default function HomePage() {
  return (
    <section className="page">
      <HoldBoks />
      <h1>Home Page</h1>
      <p>Home is where the heart is 💛</p>
      <p>Oh My, sounds like a bad movie!</p>
      <p>Hej ændringer</p>
      <h1>Hej verden</h1>
      <StevneCard />

      <KampCard />

      <section>
        <NyhedsCard />
      </section>

      {/* <p>https://web-app-bt-124b8-default-rtdb.firebaseio.com/</p> */}
    </section>
  );
}
