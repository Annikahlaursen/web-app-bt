import SignInCard from "../components/SignInCard";
import Logo from "/btp-logo.png";
export default function SignInPage() {
  return (
    <div className="login-page">
      <div className="login-page-logo">
        <img id="login-logo" src={Logo} alt="Bordtennisportalen.dk logo" />
      </div>
      <div className="login-page">
        <SignInCard />
      </div>
    </div>
  );
}
