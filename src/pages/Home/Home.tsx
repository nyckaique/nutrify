import Container from "../../components/Container";
import Pagetitle from "../../components/Pagetitle";
import Sidebar from "../../components/Sidebar";
import Userbar from "../../components/Userbar";
import PacientesTable from "./components/PacientesTable";

export function Home() {
  return (
    <div className="min-h-screen p-4 bg-orange flex overflow-auto">
      <Sidebar pageid={1} />
      <Container>
        <Userbar />
        <Pagetitle titulo="Pacientes" />
        <PacientesTable />
      </Container>
    </div>
  );
}
