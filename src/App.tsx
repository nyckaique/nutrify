import { BrowserRouter } from "react-router-dom";
import { Rotas } from "./routes/routes";
import Provider from "./context";
function App() {
  return (
    <BrowserRouter>
      <Provider>
        <Rotas />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
