import { Fragment } from "react";
import Image from "../assets/icons/image-solid-full.svg";
import Pen from "../assets/icons/pen-solid-full.svg";
import Trash from "../assets/icons/trash-solid-full.svg";

export default function ProfileInfo() {
  return (
    <Fragment>
      <div className="profile-info-parent">
        <div>
          <div className="profile-card-header">
            <h3>Profilbillede</h3>
          </div>
          <div className="profile-card-content">
            <img src={Image} alt="Placeholder image" />
          </div>
          <div className="profile-card-actions">
            <button className="invite-parent">
              <img src={Pen} alt="Edit icon" />
              Rediger
            </button>
            <button className="plus-parent">
              <img src={Trash} alt="Delete icon" />
              Fjern
            </button>
          </div>
        </div>

        <div>
          <div className="profile-card-header">
            <h3>Kontaktperson for</h3>
          </div>
          <div className="profile-card-content">
            <form action="ProfileInfo" className="profile-form">
              <input type="text" id="name" name="name" placeholder="Fornavn" />
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Efternavn"
              />
              <input type="text" id="gender" name="gender" placeholder="Køn" />
              <input type="date" id="birthday" name="Fødselsdato" />
              <input
                type="text"
                id="adress"
                name="adress"
                placeholder="Adresse"
              />
              <input type="text" id="city" name="city" placeholder="By" />
              <input type="text" id="zip" name="zip" placeholder="Postnummer" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Din email"
              />
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Dit telefonnummer"
              />
            </form>
          </div>
          <div className="profile-btns-actions">
            <button className="plus-parent">Gem</button>
            <br />
            <button className="plus-parent">Log ud</button>
            <button className="plus-parent">Opdater adgangskode</button>
            <button className="plus-parent">Tilknyt login til Face ID</button>
            <button className="plus-parent">Indstillinger</button>
            <br />
            <button className="plus-parent">Slet profil</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
