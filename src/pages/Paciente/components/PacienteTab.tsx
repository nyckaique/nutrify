import { useState } from "react";
import { Paciente } from "../../../context";
import PacienteHistorico from "./PacienteHistorico";
import PacienteFiles from "./PacienteFiles";
interface PacienteInfoProps {
  p: Paciente;
}

export default function PacienteTab({ p }: PacienteInfoProps) {
  const [tabid, setTabid] = useState(1);

  return (
    <div className="flex flex-col h-full w-full min-w-fit">
      <div className="mx-auto w-fit sm:w-full flex gap-2 p-4  flex-col sm:flex-row">
        <button
          className={
            tabid === 1
              ? "button-orange shadowblack flex items-center gap-2"
              : "button-orange-not-selected text-gray flex items-center gap-2"
          }
          onClick={() => setTabid(1)}
        >
          Histórico
        </button>
        <button
          className={
            tabid === 2
              ? "button-orange shadowblack flex items-center gap-2"
              : "button-orange-not-selected  text-gray flex items-center gap-2"
          }
          onClick={() => setTabid(2)}
        >
          Planos Alimentares
        </button>
        <button
          className={
            tabid === 3
              ? "button-orange shadowblack flex items-center gap-2"
              : "button-orange-not-selected  text-gray flex items-center gap-2"
          }
          onClick={() => setTabid(3)}
        >
          Receitas Médicas
        </button>
        <button
          className={
            tabid === 4
              ? "button-orange shadowblack flex items-center gap-2"
              : "button-orange-not-selected  text-gray flex items-center gap-2"
          }
          onClick={() => setTabid(4)}
        >
          Exames
        </button>
      </div>
      {tabid === 1 ? <PacienteHistorico p={p} /> : ""}
      {tabid === 2 ? <PacienteFiles p={p} path="planos" /> : ""}
      {tabid === 3 ? <PacienteFiles p={p} path="receitas" /> : ""}
      {tabid === 4 ? <PacienteFiles p={p} path="exames" /> : ""}
    </div>
  );
}
