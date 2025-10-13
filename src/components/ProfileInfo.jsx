import { Fragment } from "react";
import Image from "../assets/icons/image-solid-full.svg";
import Pen from "../assets/icons/pen-solid-full.svg";
import Trash from "../assets/icons/trash-solid-full.svg";

export default function ProfileInfo() {
  return (
    <Fragment>
      <div className="profile-info-parent">
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Profilbillede</h3>
          </div>
          <div className="profile-info-card-image profile-card-content">
            <img src={Image} alt="Placeholder image" />
          </div>
          <div className="profile-card-actions">
            <a id="profile-card-actions-seperat">
              <img src={Pen} alt="Edit icon" style={{ width: "1.5rem" }} />
              Rediger
            </a>
            <a id="profile-card-actions-seperat">
              <img src={Trash} alt="Delete icon" style={{ width: "1.5rem" }} />
              Fjern
            </a>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Personlige oplysninger</h3>
          </div>
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
              <select
                id="gender"
                name="gender"
                className="profile-form-content"
              >
                <option value="women">Kvinde</option>
                <option value="men">Mand</option>
                <option value="other">Andet</option>
              </select>
              <input
                type="date"
                className="profile-form-content"
                id="birthday"
                name="Fødselsdato"
              />
              <input
                type="text"
                className="profile-form-content"
                id="adress"
                name="adress"
                placeholder="Adresse"
              />
              <input
                type="text"
                className="profile-form-content"
                id="city"
                name="city"
                placeholder="By"
              />
              <input
                type="text"
                className="profile-form-content"
                id="zip"
                name="zip"
                placeholder="Postnummer"
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
            </form>
          </div>
          <div className="profile-btns-actions">
            <button
              className="profile-btns profile-btns-actions-seperat"
              id="save-btn"
            >
              Gem
            </button>
            <br />
            <button className="profile-btns profile-btns-actions-seperat">
              Log ud
            </button>
            <button className="profile-btns profile-btns-actions-seperat">
              Opdater adgangskode
            </button>
            <button className="profile-btns profile-btns-actions-seperat">
              Tilknyt login til Face ID
            </button>
            <button className="profile-btns profile-btns-actions-seperat">
              Indstillinger
            </button>
            <br />
            <button className="profile-btns profile-btns-actions-seperat">
              Slet profil
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
