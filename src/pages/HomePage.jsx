import { Link } from "react-router";
import { useState, useEffect } from "react";

import KampCard from "../components/KampCard";
import NyhedsCard from "../components/NyhedsCard";
import photo from "/public/img/unsplash-photo.svg";
import arrow from "/public/arrow-right-black.svg";
import RatingListe from "../components/RatingListe";
import { normalizeUsers } from "../helper";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingKamp, setLoadingKamp] = useState(true);
  const [kamp, setKamp] = useState([]);
  const [userHid, setUserHid] = useState(null);

  //-----------------Fetch current user's Hid (hold)-----------------
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

      const hid = currentUser.profile.hid;
      setUserHid(hid);
    };

    fetchCurrentUser();

    // Lytter på forandring i current user
    const handleCurrentUserChanged = () => {
      fetchCurrentUser();
    };

    window.addEventListener("currentUserChanged", handleCurrentUserChanged);

    // Cleanup event listener ved unmount
    return () => {
      window.removeEventListener(
        "currentUserChanged",
        handleCurrentUserChanged
      );
    };
  }, []);

  //-----------------Fetch users-----------------

  useEffect(() => {
    async function fetchUsers() {
      const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/users.json`;
      const response = await fetch(url);
      const data = await response.json();

      const usersArray = normalizeUsers(data);

      setUsers(usersArray);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  //-----------------Fetch kampe-----------------
  useEffect(() => {
    async function fetchKampe() {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe.json`
      );
      const data = await response.json();
      // from object to array
      const kampArray = Object.keys(data).map((kampId) => ({
        id: kampId,
        ...data[kampId],
      }));

      setKamp(kampArray);
      setLoadingKamp(false);
    }

    fetchKampe();
  }, []);

  //-----------------Find næste kamp-----------------
  const iDag = new Date();
  iDag.setHours(0, 0, 0, 0);

  let nextKamp = null;

  console.log("Kamp array:", kamp);
  console.log("User HID:", userHid);

  if (kamp.length > 0 && userHid) {
    const kommendeKampe = kamp.filter(
      (k) =>
        new Date(k.dato) >= iDag &&
        ((k.hjemmehold && k.hjemmehold.includes(userHid)) ||
          (k.udehold && k.udehold.includes(userHid)))
    );

    console.log("Filtered kommendeKampe:", kommendeKampe);

    kommendeKampe.sort((a, b) => new Date(a.dato) - new Date(b.dato));
    nextKamp = kommendeKampe[0];
  }

  console.log("Næste kamp:", nextKamp);

  return (
    <section>
      <img src={photo} alt="" className="header-img" />
      <section className="forside">
        <section className="forside-del">
          <h1>Din Næste Kamp</h1>
          {loadingKamp || userHid === null ? (
            <p>Henter næste kamp...</p>
          ) : nextKamp ? (
            <KampCard key={nextKamp.id} kamp={nextKamp} />
          ) : (
            <p>Ingen kommende kampe</p>
          )}
          <Link className="flex-pil" to="/kalender">
            <p>Kalender</p>
            <img src={arrow} alt="Pil til kamp med id" />
          </Link>
        </section>
        <section className="forside-del">
          <h1>Rating</h1>
          {loading ? (
            <p>Henter ratingliste...</p>
          ) : (
            <RatingListe users={users} />
          )}

          <Link
            className="flex-pil"
            to={{
              pathname: "/rating",
              state: { users },
            }}
          >
            <p>Se alle ratings</p>
            <img src={arrow} alt="Pil til rating-side" />
          </Link>
        </section>
        <section className="forside-del">
          <h1>Nyheder</h1>
          <NyhedsCard />
          <NyhedsCard />
          <NyhedsCard />
          <Link className="flex-pil" to="/error">
            <p>Se alle nyheder</p>
            <img src={arrow} alt="Pil til nyheder" />
          </Link>
        </section>
      </section>
    </section>
  );
}
