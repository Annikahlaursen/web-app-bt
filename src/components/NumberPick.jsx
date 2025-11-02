import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getHoldById } from "../helper";

export default function NumberPick({ kamp, onChangeH, onChangeU }) {
  const [num1, setNum1] = useState("pick");
  const [num2, setNum2] = useState("pick");
  const [hold, setHold] = useState({});
  const params = useParams();

  const sum = (num1 ? Number(num1) : 0) + (num2 ? Number(num2) : 0);

  const showError = num1 !== "pick" && num2 !== "pick" && sum !== 10;

  useEffect(() => {
    if (onChangeH) onChangeH({ num1 });
  }, [num1]);

  useEffect(() => {
    if (onChangeU) onChangeU({ num2 });
  }, [num2]);

  useEffect(() => {
    getHoldById(useParams.hid).then((fetchedHold) => setHold(fetchedHold));
  }, [params.hid]);

  //get data from hold and klub based on kamp data
  const hjemmeholdNavn = hold?.[kamp?.hjemmehold]?.navn ?? "Hjemme";
  const udeholdNavn = hold?.[kamp?.udehold]?.navn ?? "Ude";

  return (
    <>
      {showError && <p className="show-error">Summen skal være 10!</p>}
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
          <p>{hjemmeholdNavn}</p>
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
          <p>{udeholdNavn}</p>
        </div>
      </div>
    </>
  );
}
