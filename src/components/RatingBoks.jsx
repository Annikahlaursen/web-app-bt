export default function RatingBoks({ user, placering }) {
  //{/*hvordan regnes ens +/- ud?* /}

  const name = user.name || `${user.fornavn} ${user.efternavn}`;

  const rating = user.rating || "N/A";

  return (
    <div className="blaa-boks rating-boks-grid">
      <p>{placering}</p>
      <p className="rating-navn">{name}</p>
      <p>{rating}</p>
      <p>9{/*user.points*/}</p>
    </div>
  );
}
