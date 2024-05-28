import { BrowserRouter } from "react-router-dom";
import { Rotas } from "./routes/routes";
// import Provider from "@/context";
function App() {
  return (
    // <Provider>
    <BrowserRouter>
      <Rotas />
    </BrowserRouter>
    // </Provider>
  );
}

export default App;
