import { Fragment } from "react";

export default function ProfileParent() {
  return (
    <Fragment>
      <div>
        <div className="profile-card">
          <div>
            <h3>Kontaktpersoner</h3>
          </div>
          <div className="profile-card-content">
            <p>
              Der er ingen kontaktpersoner tilknyttet. Tilføj en person direkte
              via tilføj eller sendt en invitation til personen via inviter.
            </p>
          </div>
          <div className="profile-card-actions">
            <a>Inviter</a>
            <a>Tilføj</a>
          </div>
        </div>

        <div className="profile-card">
          <div>
            <h3>Kontaktperson for</h3>
          </div>
          <div className="profile-card-content">
            <p>
              Du er ikke kontaktperosn for nogen endnu, hvis dette ønskes, kan
              du tilføje via tilføj.
            </p>
          </div>
          <div className="profile-card-actions profile-card-oneaction">
            <a>Tilføj</a>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
