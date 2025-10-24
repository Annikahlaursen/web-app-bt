import { useEffect, useState } from "react";
import Logo from "/btp-logo.png";

export default function Splash({ duration = 1200 }) {
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const inTimer = setTimeout(() => setAnimateOut(true), duration - 300);
    const outTimer = setTimeout(() => {
      /* nothing: parent controls unmount */
    }, duration);
    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, [duration]);

  return (
    <div>
      <div className={`splash-root ${animateOut ? "splash-out" : ""}`}>
        <div className="splash-card">
          <img className="splash-logo" src={Logo} alt="logo" />
        </div>
      </div>
    </div>
  );
}
