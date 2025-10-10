export default function KampCard() {
  return (
    <div className="kamp-card">
      <div className="kamp-container">
        <p>KampID</p>
        <p>Dato</p>
      </div>
      <div className="kamp-container">
        <div className="kamp-hold">
          <img src="logo.img" alt="" />
          <p>Hold 1</p>
        </div>
        <p>VS</p>
        <p>20:00</p>
        <div className="kamp-hold">
          <img src="" alt="" />
          <p>Hold 2</p>
        </div>
      </div>
      <div className="kamp-container">
        <div className="del-notifikationer">
          <img src="" alt="" />
          <p>Del</p>
        </div>
        <div className="del-notifikationer">
          <img src="" alt="" />
          <p>Notifikationer</p>
        </div>
      </div>
    </div>
  );
}
