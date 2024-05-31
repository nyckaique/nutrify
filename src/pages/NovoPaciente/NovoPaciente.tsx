import Container from "../../components/Container";
import Pagetitle from "../../components/Pagetitle";
import Sidebar from "../../components/Sidebar";
import Userbar from "../../components/Userbar";
import PacienteForm from "./components/PacienteForm";
export function NovoPaciente() {
  return (
    <div className="min-h-screen p-4 bg-orange flex">
      <Sidebar pageid={2} />
      <Container>
        <Userbar />
        <Pagetitle titulo="Novo Paciente" />
        <PacienteForm />
      </Container>
    </div>
  );
}
