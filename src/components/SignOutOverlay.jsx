import { Fragment } from "react";

export default function Overlay({ isOpen, onClose }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <div className="signout__container">
            <p>dsf</p>
          </div>
        </div>
      )}
    </Fragment>
  );
}
