import LoginCard from "../components/SignInCard";
import Logo from "/btp-logo.png";

export default function LogInPage() {
  return (
    <div className="login-page">
      <div className="login-page-logo">
        <img id="login-logo" src={Logo} alt="Bordtennisportalen.dk logo" />
      </div>
      <div className="login-page">
        <LoginCard />
      </div>
    </div>
  );
}
