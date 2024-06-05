import { BrowserRouter } from "react-router-dom";
import { Rotas } from "./routes/routes";
import Provider from "./context";
import ToasterComponent from "./components/ToasterComponent";

function App() {
  return (
    <BrowserRouter>
      <Provider>
        <ToasterComponent />
        <Rotas />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
