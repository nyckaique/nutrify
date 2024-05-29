import Logo from "./Logo";
import { useContext } from "react";
import { Context } from "../context";
interface sidebarProps {
  pageid: number;
}
export default function Sidebar({ pageid }: sidebarProps) {
  const { logout } = useContext(Context)!;

  return (
    <div
      className="max-w-[200px] flex flex-col bg-white rounded-l-lg p-3 gap-4"
      style={{ height: "calc(100vh - 32px)" }}
    >
      <Logo />
      <button
        className={
          pageid === 1
            ? "button-orange flex items-center gap-2"
            : "button-orange-not-selected  text-gray flex items-center gap-2"
        }
      >
        <i className="fa fa-users" aria-hidden="true"></i>Pacientes
      </button>
      <button
        className={
          pageid === 2
            ? "button-orange flex items-center gap-2"
            : "button-orange-not-selected  text-gray flex items-center gap-2"
        }
      >
        <i className="fa fa-plus" aria-hidden="true"></i>Novo Paciente
      </button>
      <button
        className={
          pageid === 3
            ? "button-orange flex items-center gap-2"
            : "button-orange-not-selected  text-gray flex items-center gap-2"
        }
      >
        <i className="fa fa-cog" aria-hidden="true"></i>Conta
      </button>
      <button
        className={
          pageid === 4
            ? "button-orange flex items-center gap-2"
            : "button-orange-not-selected  text-gray flex items-center gap-2"
        }
        onClick={() => logout()}
      >
        <i className="fa fa-sign-out" aria-hidden="true"></i>
        Logout
      </button>
    </div>
  );
}
