import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import arrowWhite from "/public/arrow-left-white.svg";
import calendar from "/public/calendar-outline.svg";
import location from "/public/location-dot.svg";
import TilmedCard from "../components/TilmeldCard";

export default function StevnePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stevne, setStevne] = useState({});
  const [showTilmeldCard, setShowTilmeldCard] = useState(false);
  const [isTilmeldt, setIsTilmeldt] = useState(false);

  //---------------- Fetch current user---------------------
  useEffect(() => {
    const fetchCurrentUser = () => {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      if (!currentUser || !currentUser.profile) {
        console.warn("No current user found in localStorage.");
        // Handle missing user (e.g., redirect to login)
        return;
      }

      const isAlreadyTilmeldt =
        currentUser.profile.tilmeldteStevner?.includes(id) || false;
      setIsTilmeldt(isAlreadyTilmeldt);
    };

    fetchCurrentUser();
  }, [id]);

  // -----------------Fetch stevne data-----------------
  useEffect(() => {
    async function fetchStevne() {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/staevner/${id}.json`
      );

      const data = await response.json();

      setStevne({ ...data, id });
      console.log(data);
    }

    fetchStevne();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //------------------Tilmeld stevne------------------//

  async function handleShowTilmeld(event) {
    event.preventDefault();
    setShowTilmeldCard(true);
  }

  const handleCloseTilmeld = () => {
    setShowTilmeldCard(false);
  };

  return (
    <>
      <div className="blue-background">
        <img
          className="arrow"
          src={arrowWhite}
          alt="Arrow back to previus page"
          onClick={() => navigate(-1)}
        />
        <h2>{stevne.titel}</h2>
      </div>
      <section className="kamp-info-section stevne">
        <button className="btn" onClick={handleShowTilmeld}>
          {isTilmeldt ? "Du er tilmeldt stævnet" : "Tilmeld stævne "}
        </button>
        <div className="kamp-info">
          <img src={calendar} alt="Calendar icon" />
          <p>{stevne.dato}</p>
        </div>
        <div className="kamp-info">
          <img src={location} alt="Location pin icon" />
          <p>{stevne.lokation}</p>
        </div>
        <div className="kamp-info">
          <p>{`Pris: ${stevne.pris} DKK`}</p>
        </div>
        <p>{stevne.beskrivelse}</p>
        <div className="raekker">
          <h2>Rækker</h2>
          <div>
            <p>LØRDAG</p>
            <ul>
              {stevne.rækkerLørdag?.map((række, index) => (
                <li key={index}>{række}</li>
              ))}
            </ul>
          </div>
          <div>
            <p>SØNDAG</p>
            <ul>
              {stevne.rækkerSøndag?.map((række, index) => (
                <li key={index}>{række}</li>
              ))}
            </ul>
          </div>
        </div>
        {stevne.ertilmeldt && (
          <div className="tilmeldt-raekker">
            <h2>Du er tilmeldt rækkerne:</h2>
            <ul>
              {stevne.tilmeldt.map((række, index) => (
                <li key={index}>{række}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <TilmedCard
        isOpen={showTilmeldCard}
        isTilmeldt={isTilmeldt}
        stevne={stevne}
        onClose={handleCloseTilmeld}
        onTilmeldUpdate={(status) => setIsTilmeldt(status)}
      />
    </>
  );
}
