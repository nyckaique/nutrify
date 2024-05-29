import Logo from "../../components/Logo";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import CadastroFrom from "./components/CadastroFrom";

export function Login() {
  const [isLogando, setIsLogando] = useState(true);
  return (
    <div className="w-full h-[100vh] flex bg-orange">
      <div className="container-login glassmorphism-container">
        <Logo />
        {isLogando ? (
          <LoginForm setIsLogando={setIsLogando} />
        ) : (
          <CadastroFrom setIsLogando={setIsLogando} />
        )}
      </div>
    </div>
  );
}
