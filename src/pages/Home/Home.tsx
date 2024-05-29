import Sidebar from "../../components/Sidebar";
export function Home() {
  // const { } = useContext(Context)!;
  return (
    <div className="min-h-screen p-4 bg-orange">
      <Sidebar pageid={1} />
    </div>
  );
}
