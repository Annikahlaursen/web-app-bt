

export default function RatingBoks({ user }) {

  {/*hvordan regnes ens +/- ud?*/}

  const name = `${user.fornavn} ${user.efternavn}`;
  user.name = name;
  return (
    <div className="blaa-boks rating-boks-grid">
      <p>802{/*user.placement*/}</p>
      <p className="rating-navn">{user.name}</p>
      <p>{user.rating}</p>
      <p>9{/*user.points*/}</p>
    </div>
  );
}
