import { Fragment } from "react";
import Image from "/image-solid-full.svg";
import Pen from "/pen-solid-full.svg";

export default function Update() {
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
          <div className="profile-card-actions profile-card-oneaction">
            <a id="profile-card-actions-seperat">
              <img src={Pen} alt="Edit icon" style={{ width: "1.5rem" }} />
              Rediger
            </a>
          </div>
        </div>
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Personlige oplysninger</h3>
          </div>
          <div>
            <form action="ProfileInfo" className="profile-form">
              <select
                id="gender"
                name="gender"
                className="profile-form-content"
              >
                <option value="women">Kvinde</option>
                <option value="men">Mand</option>
                <option value="other">Andet</option>
              </select>
              <select
                id="gender"
                name="gender"
                className="profile-form-content"
              >
                <option value="women">Kvinde</option>
                <option value="men">Mand</option>
                <option value="other">Andet</option>
              </select>
            </form>
          </div>
        </div>
        <div className="profile-btns-actions">
          <button
            className="profile-btns profile-btns-actions-seperat"
            id="save-btn"
          >
            Gem
          </button>
          <button
            className="profile-btns profile-btns-actions-seperat"
            id="save-btn"
          >
            Spring over
          </button>
        </div>
      </div>
    </Fragment>
  );
}
