import { Fragment } from "react";
import { NavLink } from "react-router";

export default function ProfileParent() {
  return (
    <Fragment>
      <div className="profile-info-parent">
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Kontaktpersoner</h3>
          </div>
          <div className="profile-card-content">
            <p>
              Der er ingen kontaktpersoner tilknyttet. Tilføj en person direkte
              via tilføj eller sendt en invitation til personen via inviter.
            </p>
          </div>
          <div className="profile-card-actions">
            <NavLink to="/error" className="plus-parent">
              Inviter
            </NavLink>
            <NavLink to="/error" className="plus-parent">
              Tilføj
            </NavLink>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Kontaktperson for</h3>
          </div>
          <div className="profile-card-content">
            <p>
              Du er ikke kontaktperosn for nogen endnu, hvis dette ønskes, kan
              du tilføje via tilføj.
            </p>
          </div>
          <div className="profile-card-actions profile-card-oneaction">
            <NavLink to="/error" className="plus-parent">
              Tilføj
            </NavLink>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
