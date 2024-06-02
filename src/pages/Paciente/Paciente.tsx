import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Container from "../../components/Container";
import Userbar from "../../components/Userbar";
import Pagetitle from "../../components/Pagetitle";
import PacienteInfo from "./components/PacienteInfo";
import { useContext, useEffect } from "react";
import { Context } from "../../context";
import PacienteTab from "./components/PacienteTab";

export function Paciente() {
  const location = useLocation();
  const { id } = location.state || {};
  const { loadPaciente, paciente } = useContext(Context)!;
  useEffect(() => {
    loadPaciente(id);
  }, [id]);
  return (
    <div className="min-h-screen p-4 bg-orange flex">
      <Sidebar pageid={1} />
      <Container>
        <Userbar />
        <Pagetitle titulo="Paciente" />
        <div className="rounded-lg shadowblack p-3 border-zinc-200 border-[1px] h-full flex flex-col gap-3 overflow-hidden">
          {paciente && <PacienteInfo p={paciente} />}
          {paciente && <PacienteTab p={paciente} />}
        </div>
      </Container>
    </div>
  );
}
