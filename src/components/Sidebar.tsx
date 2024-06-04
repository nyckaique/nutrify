import { useContext } from "react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { Context } from "../context";
interface sidebarProps {
  pageid: number;
}
export default function Sidebar({ pageid }: sidebarProps) {
  const { logout, expanded, setExpanded } = useContext(Context)!;
  const navigate = useNavigate();

  function handleNavigate(pagenumber: number) {
    switch (pagenumber) {
      case 1:
        navigate("/home");
        break;
      case 2:
        navigate("/novopaciente");
        break;
      case 3:
        navigate("/conta");
        break;
    }
  }
  return (
    <div
      className={
        expanded ? "sidebar sidebar-expanded" : "sidebar sidebar-not-expanded"
      }
      style={{ height: "calc(100vh - 32px)" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`transition-all hover:text-[var(--primary-orange)] h-[40px] flex items-center ${
          expanded ? "justify-end" : "justify-center"
        }`}
      >
        {expanded ? (
          <i className="fa fa-arrow-left ml-auto" aria-hidden="true"></i>
        ) : (
          <i className="fa fa-arrow-right" aria-hidden="true"></i>
        )}
      </button>
      <Logo expanded={expanded} />
      <div className="flex flex-col gap-3 mx-auto">
        <button
          className={
            pageid === 1
              ? "button-orange shadowblack flex items-center gap-2"
              : "button-orange-not-selected  text-gray flex items-center gap-2"
          }
          onClick={() => handleNavigate(1)}
        >
          <i className="fa fa-users" aria-hidden="true"></i>
          {expanded ? "Pacientes" : ""}
        </button>
        <button
          className={
            pageid === 2
              ? "button-orange shadowblack flex items-center gap-2"
              : "button-orange-not-selected  text-gray flex items-center gap-2"
          }
          onClick={() => handleNavigate(2)}
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
          {expanded ? "Novo Paciente" : ""}
        </button>
        <button
          className={
            pageid === 3
              ? "button-orange shadowblack flex items-center gap-2"
              : "button-orange-not-selected  text-gray flex items-center gap-2"
          }
          onClick={() => handleNavigate(3)}
        >
          <i className="fa fa-cog" aria-hidden="true"></i>
          {expanded ? "Conta" : ""}
        </button>
        <button
          className={
            "button-orange-not-selected  text-gray flex items-center gap-2"
          }
          onClick={() => logout()}
        >
          <i className="fa fa-sign-out" aria-hidden="true"></i>
          {expanded ? "Logout" : ""}
        </button>
      </div>
    </div>
  );
}
