export default function RatingBoks({ user, placering }) {
  //{/*hvordan regnes ens +/- ud?* /}

  const name = user.name || `${user.fornavn} ${user.efternavn}`;
  user.name = name;

  return (
    <div className="blaa-boks rating-boks-grid">
      <p>{placering}</p>
      <p className="rating-navn">{user.name}</p>
      <p>{user.rating}</p>
      <p>9{/*user.points*/}</p>
    </div>
  );
}
