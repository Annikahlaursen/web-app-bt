//Hele denne side er skrevet med CoPilot,
// men baseret på at jeg skrevet en <select></select>
// ind og derefet promptede med
// "numbers = 10, then its all good, but if its does
//  not equal 10, then it comes with an error messege"

import { useState, useEffect } from "react";

export default function NumberPick({ onChangeH, onChangeU }) {
  const [num1, setNum1] = useState("pick");
  const [num2, setNum2] = useState("pick");

  const sum = (num1 ? Number(num1) : 0) + (num2 ? Number(num2) : 0);

  const showError = num1 !== "pick" && num2 !== "pick" && sum !== 10;

  useEffect(() => {
    if (onChangeH) onChangeH({ num1 });
  }, [num1]);

  useEffect(() => {
    if (onChangeU) onChangeU({ num2 });
  }, [num2]);

  return (
    <>
      {showError && (
        <p style={{ color: "red", textAlign: "center" }}>
          Summen skal være 10!
        </p>
      )}
      <div className="number-picker">
        <div className="number-hold">
          <select
            value={num1}
            onChange={(e) => setNum1(Number(e.target.value))}
          >
            <option value="pick">Vælg</option>
            {[...Array(11).keys()].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <p>Hjemmehold</p>
        </div>
        <div className="number-hold">
          <select
            value={num2}
            onChange={(e) => setNum2(Number(e.target.value))}
          >
            <option value="pick">Vælg</option>
            {[...Array(11).keys()].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <p>Udehold</p>
        </div>
      </div>
    </>
  );
}
