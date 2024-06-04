import Container from "../../components/Container";
import Pagetitle from "../../components/Pagetitle";
import Sidebar from "../../components/Sidebar";
import Userbar from "../../components/Userbar";
import { ContaConfig } from "./components/ContaConfig";
export function Conta() {
  return (
    <div className="min-h-screen bg-white p-4 bg-orange flex">
      <Sidebar pageid={3} />
      <Container>
        <Userbar />
        <Pagetitle titulo="Conta" />
        <ContaConfig />
      </Container>
    </div>
  );
}
