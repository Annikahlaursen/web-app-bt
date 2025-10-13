import { Link } from "react-router";

export default function Error() {
  return (
    <>
      <h1>Hov!</h1>
      <p>Du ramte ved siden af bordet</p>
      <Link to="...">
        <button>Gå tilbage til forrige side</button>
      </Link>
    </>
  );
}
