//Hele denne side er skrevet med CoPilot,
// men baseret på at jeg skrevet en <select></select>
// ind og derefet promptede med
// "numbers = 10, then its all good, but if its does
//  not equal 10, then it comes with an error messege"

import { useState } from "react";

export default function NumberPick() {
  const [num1, setNum1] = useState("pick");
  const [num2, setNum2] = useState("pick");

  const sum =
    (num1 !== "pick" ? Number(num1) : 0) + (num2 !== "pick" ? Number(num2) : 0);

  const showError = num1 !== "pick" && num2 !== "pick" && sum !== 10;

  return (
    <div className="number-picker">
      <select value={num1} onChange={(e) => setNum1(e.target.value)}>
        <option value="pick">Vælg</option>
        {[...Array(11).keys()].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <select value={num2} onChange={(e) => setNum2(e.target.value)}>
        <option value="pick">Vælg</option>
        {[...Array(11).keys()].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      {showError && <p style={{ color: "red" }}>Summen skal være 10!</p>}
    </div>
  );
}
