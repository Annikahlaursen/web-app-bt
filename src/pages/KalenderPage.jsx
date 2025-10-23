import { useEffect, useState, useRef, useLayoutEffect } from "react";
import KalenderFilter from "../components/KalenderFilter";
import StevneCard from "../components/StevneCard";
import KampCard from "../components/KampCard";


 export default function KalenderPage() {
  const [events, setEvents] = useState([]);
  const nextEventRef = useRef(null);
  const monthHeadersRef = useRef([]);
  const [activeFilter, setActiveFilter] = useState("alle");

  //----------------------------Henter Data----------------------------//
  useEffect(() => {
    async function fetchAndFilterEvents(endpoint, type, userHid) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${endpoint}.json`
        );
        const data = await response.json();

        // Transform data into an array and filter based on type
        return Object.keys(data)
          .map((id) => ({
            id,
            ...data[id],
            type,
          }))
          .filter((event) => {
            if (type === "stevne") {
              return event.ertilmeldt === true; // Filter stevner where ertilmeldt is true
            }
            if (type === "kamp") {
              return (event.udehold && event.udehold.includes(userHid)) || (event.hjemmehold && event.hjemmehold.includes(userHid)); // Filter kampe where hold contains userHid
            }
            return false;
          });
      } catch (error) {
        console.error(`Failed to fetch or filter ${type} data:`, error);
        return [];
      }
    }

    async function fetchEvents() {
      try {
        // Get the current user's hid from localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const userHid = currentUser?.profile?.hid;

        if (!userHid) {
          console.error("User HID not found. Cannot filter events.");
          setEvents([]);
          return;
        }

        // Fetch and filter stevner and kampe
        const stevneEvents = await fetchAndFilterEvents("staevner", "stevne", userHid);
        const kampEvents = await fetchAndFilterEvents("kampe", "kamp", userHid);

        // Combine and sort events
        const combinedEvents = [...stevneEvents, ...kampEvents].sort(
          (a, b) => new Date(a.dato) - new Date(b.dato)
        );

        setEvents(combinedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      }
    }

    fetchEvents();
  }, []);


  //----------------------------Scroll til næste Event----------------------------//

  useLayoutEffect(() => {
    if (events.length > 0 && nextEventRef.current) {
      const offset = 155; // Juster denne værdi baseret på din layout
      const elementPosition = nextEventRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [events]);

  //------------------------Hjælpefunktioner formaterer månedheader og grupperer cards------------------------//
  const formatMonth = (dato) => {
    const options = { month: "long", year: "numeric" };
    const formattedDate = new Date(dato).toLocaleDateString("da-DK", options);

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  // grupperer events efter måned
  const groupedEvents = events.reduce((acc, event) => {
    const month = formatMonth(event.dato);
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const header = entry.target;
          if (entry.isIntersecting) {
            // Add sticky class to the current month header
            header.classList.add("sticky");
          } else {
            // Remove sticky class when it's no longer in view
            header.classList.remove("sticky");
          }
        });
      },
      {
        root: null, // Observe within the viewport
        rootMargin: "-70px 0px 0px 0px", // Account for the KalenderFilter height
        threshold: 0, // Trigger when the header enters or exits the viewport
      }
    );

    // Observe all month headers
    monthHeadersRef.current.forEach((header) => {
      if (header) observer.observe(header); // Ensure header is not null or undefined
    });

    return () => {
      // Cleanup observer on unmount
      monthHeadersRef.current.forEach((header) => {
        if (header) observer.unobserve(header); // Ensure header is not null or undefined
      });
    };
  }, []);

  /*---------------------------Filtrerer events baseret på type-property----------------------- */
  const filteredEvents = Object.keys(groupedEvents).reduce((acc, month) => {
    const events = groupedEvents[month].filter((event) => {
      if (activeFilter === "alle") return true;
      if (activeFilter === "holdkampe") return event.type === "kamp";
      if (activeFilter === "staevner") return event.type === "stevne";
      return false;
    });

    if (events.length > 0) {
      acc[month] = events;
    }
    return acc;
  }, {});

  /*-------------------------------JSX---------------------------------- */
  return (
    <section className="kalender-page">
      <KalenderFilter setFilter={setActiveFilter} />
      {(() => {
        let nextEventFound = false; // Track if the next event has been found across all months
        return Object.keys(filteredEvents).map((month, index) => (
          <div key={month}>
            <h2
              className="month-header"
              ref={(el) => (monthHeadersRef.current[index] = el)}
            >
              {month}
            </h2>
            {filteredEvents[month].map((event) => {
              const isNextEvent =
                !nextEventFound &&
                new Date(event.dato).setHours(0, 0, 0, 0) >=
                  new Date().setHours(0, 0, 0, 0);
              if (isNextEvent) {
                nextEventFound = true; // Mark that the next event has been found
              }
              return event.type === "stevne" ? (
                <StevneCard
                  key={event.id}
                  stevne={event}
                  ref={isNextEvent ? nextEventRef : null} // Attach ref to the next event
                />
              ) : (
                <KampCard
                  key={event.id}
                  kamp={event}
                  ref={isNextEvent ? nextEventRef : null} // Attach ref to the next event
                />
              );
            })}
          </div>
        ));
      })()}
    </section>
  );
}
