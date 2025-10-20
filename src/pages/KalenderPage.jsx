import { useEffect, useState, useRef } from "react";
import KalenderFilter from "../components/KalenderFilter";
import StevneCard from "../components/StevneCard";
import KampCard from "../components/KampCard";

export default function KalenderPage() {
  const [events, setEvents] = useState([]);
  const nextEventRef = useRef(null);

  useEffect(() => {
    async function fetchEvents() {
      // Fetch stevne data
      const stevneResponse = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/staevner.json`
      );
      const stevneData = await stevneResponse.json();
      const stevneArray = Object.keys(stevneData).map((id) => ({
        id,
        ...stevneData[id],
        type: "stevne", //Tilføj type for at skelne mellem stevne og kamp
      }));

      // Fetch kamp data
      const kampResponse = await fetch(
        `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe.json`
      );
      const kampData = await kampResponse.json();
      const kampArray = Object.keys(kampData).map((id) => ({
        id,
        ...kampData[id],
        type: "kamp",
      }));

      const combinedEvents = [...stevneArray, ...kampArray].sort(
        (a, b) => new Date(a.dato) - new Date(b.dato)
      );

      setEvents(combinedEvents);
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    // Scroll to the next upcoming event
    if (nextEventRef.current) {
      nextEventRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [events]);

  // Helper function to format the month header
  const formatMonth = (dato) => {
    const options = { month: "long", year: "numeric" };
    const formattedDate = new Date(dato).toLocaleDateString("da-DK", options);

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const month = formatMonth(event.dato);
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  return (
    <section className="page">
      <KalenderFilter />
      {(() => {
        let nextEventFound = false; // Track if the next event has been found across all months
        return Object.keys(groupedEvents).map((month) => (
          <div key={month}>
            <h2>{month}</h2>
            {groupedEvents[month].map((event, index) => {
              const isNextEvent =
                !nextEventFound && new Date(event.dato) > new Date(); // Only mark the first upcoming event
              if (isNextEvent) {
                nextEventFound = true; // Mark that the next event has been found
                console.log("Next event found:", event);
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
