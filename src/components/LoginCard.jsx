import { Fragment, useState } from "react";
import { useNavigate } from "react-router";
import CreateCard from "./CreateCard";

export default function Login() {
  const navigate = useNavigate();
  const [showCreateCard, setShowCreateCard] = useState(false);

  const handleLogin = () => {
    navigate("/");
  };

  const handleCreateAccount = () => {
    setShowCreateCard(true);
  };

  if (showCreateCard) {
    return <CreateCard />;
  }

  return (
    <Fragment>
      <div className="profile-info-parent">
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
          </form>
        </div>
        <div className="profile-btns-actions">
          <button
            className="profile-btns profile-btns-actions-seperat"
            id="save-btn"
            onClick={handleLogin}
          >
            Log på
          </button>
          <p>Glemt adgangskode?</p>
          <button
            className="profile-btns profile-btns-actions-seperat"
            id="save-btn"
            onClick={handleCreateAccount}
          >
            Opret ny konto
          </button>
          <p>Eller</p>
          <button className="profile-btns profile-btns-actions-seperat">
            Log ind med Facebook
          </button>
          <button className="profile-btns profile-btns-actions-seperat">
            Log ind med Google
          </button>
        </div>
      </div>
    </Fragment>
  );
}
