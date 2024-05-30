import Container from "../../components/Container";
import Pagetitle from "../../components/Pagetitle";
import Sidebar from "../../components/Sidebar";
import Userbar from "../../components/Userbar";
export function Home() {
  // const { } = useContext(Context)!;
  return (
    <div className="min-h-screen p-4 bg-orange flex">
      <Sidebar pageid={1} />
      <Container>
        <Userbar />
        <Pagetitle titulo="Pacientes" />
      </Container>
    </div>
  );
}
