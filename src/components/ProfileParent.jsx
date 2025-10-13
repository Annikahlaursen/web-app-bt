import { Fragment } from "react";

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
            <a className="invite-parent">Inviter</a>
            <a className="plus-parent">Tilføj</a>
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
          <div className="profile-card-actions">
            <a className="plus-parent">Tilføj</a>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
