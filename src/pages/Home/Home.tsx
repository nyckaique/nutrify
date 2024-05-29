import { useContext } from "react";
import { Context } from "../../context";
export function Home() {
  const { logout } = useContext(Context)!;
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
