import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";

const filters = [
  { id: "alle", label: "Alle", color: "#000000" },
  { id: "holdkampe", label: "Holdkampe", color: "#bb1717" },
  { id: "staevner", label: "Stævner", color: "#035183" },
];

export default function KalenderFilter({ setFilter }) {
  const [active, setActive] = useState("alle"); //default er "alle"
  const [pillProps, setPillProps] = useState({
    left: 0,
    width: 0,
    color: "#000",
  });
  const containerRef = useRef(null);
  const btnRefs = useRef({});

  //Når active ændres, opdater pillens props
  useEffect(() => {
    const btn = btnRefs.current[active];

    if (btn && containerRef.current) {
      const rect = btn.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      let left = rect.left - containerRect.left;
      let width = rect.width;
      const color = filters.find((f) => f.id === active)?.color;

      const extraPadding = 12; // sørger for at tekst i pillen er centreret i ydre kanten

      // Justér pillen ved kanten
      if (active === "alle") {
        left = 0;
        width = rect.right - containerRect.left + extraPadding;
      } else if (active === "staevner") {
        width = containerRect.right - rect.left + extraPadding;
        left = rect.left - containerRect.left - extraPadding;
      } else {
        width = rect.width + extraPadding * 2;
        left = rect.left - containerRect.left - extraPadding;
      }

      setPillProps({ left, width, color });
    }
    setFilter(active);
  }, [active, setFilter]);

  return (
    <div className="kalender-filter">
      <div className="kalender-filter-container" ref={containerRef}>
        <motion.div
          className="active-pill"
          animate={{
            left: pillProps.left,
            width: pillProps.width,
            backgroundColor: pillProps.color,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        {filters.map((filter) => (
          <button
            key={filter.id}
            ref={(el) => (btnRefs.current[filter.id] = el)}
            onClick={() => setActive(filter.id)}
            className="kalender-filter-button"
          >
            <span
              className={`filter-label ${
                active === filter.id ? "active-label" : ""
              }`}
            >
              {filter.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
