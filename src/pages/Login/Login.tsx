import Logo from "../../components/Logo";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import CadastroFrom from "./components/CadastroFrom";

export function Login() {
  const [isLogando, setIsLogando] = useState(true);
  return (
    <div className="w-full h-[100vh] flex flex-col items-center bg-orange">
      <div className="container-login glassmorphism-container">
        <Logo expanded={true} />
        {isLogando ? (
          <LoginForm setIsLogando={setIsLogando} />
        ) : (
          <CadastroFrom setIsLogando={setIsLogando} />
        )}
      </div>
      <p className="pb-2">
        Desenvolvido por{" "}
        <a
          className="underline"
          href="https://linkedin.com/in/nycollaskaique"
          target="_blank"
        >
          Nycollas Kaique
        </a>
      </p>
    </div>
  );
}
