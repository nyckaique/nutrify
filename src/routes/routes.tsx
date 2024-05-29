import { Routes, Route } from "react-router-dom";
import { Login, Home } from "../pages";
import { Private } from "./Private";
export function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <Private>
            <Home />
          </Private>
        }
      />
    </Routes>
  );
}
