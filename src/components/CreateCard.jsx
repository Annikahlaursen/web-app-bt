import { Fragment, useState } from "react";
import UpdateCard from "./UpdateCard";

export default function CreateCard() {
  const [showUpdateCard, setShowUpdateCard] = useState(false);

  const handleSave = () => {
    setShowUpdateCard(true);
  };

  if (showUpdateCard) {
    return <UpdateCard />;
  }

  return (
    <Fragment>
      <div className="profile-info-parent">
        <div className="profile-card">
          <div>
            <form action="ProfileInfo" className="profile-form">
              <input
                type="text"
                className="profile-form-content"
                id="name"
                name="name"
                placeholder="Fornavn"
              />
              <input
                type="text"
                className="profile-form-content"
                id="lastname"
                name="lastname"
                placeholder="Efternavn"
              />
              <input
                type="date"
                className="profile-form-content"
                id="birthday"
                name="Fødselsdato"
              />
              <input
                type="email"
                className="profile-form-content"
                id="email"
                name="email"
                placeholder="Din email"
              />
              <input
                type="phone"
                className="profile-form-content"
                id="phone"
                name="phone"
                placeholder="Dit telefonnummer"
              />
              <input
                type="code"
                className="profile-form-content"
                id="code"
                name="code"
                placeholder="Adgangskode"
              />
              <input
                type="code"
                className="profile-form-content"
                id="code"
                name="code"
                placeholder="Gentag adgangskode"
              />
            </form>
          </div>
          <div className="profile-btns-actions">
            <button
              className="profile-btns profile-btns-actions-seperat"
              id="save-btn"
              onClick={handleSave}
            >
              Gem
            </button>
          </div>
        </div>
        <button className="profile-btns profile-btns-actions-seperat">
          Tilknyt login til FaceBook
        </button>
      </div>
    </Fragment>
  );
}
