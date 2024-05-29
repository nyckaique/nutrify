import { BrowserRouter } from "react-router-dom";
import { Rotas } from "./routes/routes";
import Provider from "./context";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Provider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#000",
              color: "var(--primary-orange)",
            },
          }}
        />
        <Rotas />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
