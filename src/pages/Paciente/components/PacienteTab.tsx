import { useState } from "react";
import { paciente } from "../../../context";
import PacienteHistorico from "./PacienteHistorico";
interface PacienteInfoProps {
  p: paciente;
}

export default function PacienteTab({ p }: PacienteInfoProps) {
  const [tabid, setTabid] = useState(1);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full flex gap-2">
        <button
          className={
            tabid === 1
              ? "button-orange shadowblack flex items-center gap-2"
              : "button-orange-not-selected  text-gray flex items-center gap-2"
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
      {tabid === 2 ? <p>planos Alimentares</p> : ""}
      {tabid === 3 ? <p>receitas medicas</p> : ""}
      {tabid === 4 ? <p>exames</p> : ""}
    </div>
  );
}
