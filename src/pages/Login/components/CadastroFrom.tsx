import { Context } from "../../../context";
import { useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormCadastroValues {
  name: string;
  email: string;
  password: string;
}

const initialValuesCadastro = {
  name: "",
  email: "",
  password: "",
};
const validationSchemaCadastro = Yup.object({
  name: Yup.string()
    .matches(
      /^[A-Za-z]{3,}(?: [A-Za-z]{3,})*$/,
      "Nome e/ou sobrenome inválido. Cada um deve ter pelo menos 3 letras."
    )
    .max(50, "Nome muito longo")
    .required("Obrigatório"),
  email: Yup.string().email("Insira um e-mail válido").required("Obrigatório"),
  password: Yup.string()
    .min(6, "Senha muito curta")
    .max(50, "Senha muito longa")
    .required("Obrigatório"),
});
interface FormProps {
  setIsLogando: (boolean: boolean) => void;
}
export default function CadastroFrom({ setIsLogando }: FormProps) {
  const { signup } = useContext(Context)!;
  function handleCadastro(values: FormCadastroValues) {
    console.log("cadastro: ", values);
    signup(values.name, values.email, values.password);
  }
  return (
    <Formik
      enableReinitialize
      initialValues={initialValuesCadastro}
      onSubmit={handleCadastro}
      validationSchema={validationSchemaCadastro}
    >
      {() => (
        <Form className="container-flex-col">
          <div>Nome</div>
          <Field
            autoComplete="off"
            name="name"
            type="name"
            placeholder="Nome"
            className="input-light-text-color p-2 rounded-md glassmorphism-container"
          />
          <p className="text-orange text-sm font-bold">
            <ErrorMessage name="name" />
          </p>
          <div>E-mail</div>
          <Field
            autoComplete="off"
            name="email"
            type="email"
            placeholder="E-mail"
            className="input-light-text-color p-2 rounded-md glassmorphism-container"
          />
          <p className="text-orange text-sm font-bold">
            <ErrorMessage name="email" />
          </p>

          <div>Senha</div>
          <Field
            name="password"
            type="password"
            placeholder="Senha"
            className="input-light-text-color p-2 rounded-md glassmorphism-container"
          />
          <p className="text-orange text-sm font-bold">
            <ErrorMessage name="password" />
          </p>

          <button type="submit" className="button-orange mx-auto mt-5">
            Registrar
          </button>
          <button
            type="button"
            className="mx-auto mt-5 underline"
            onClick={() => setIsLogando(true)}
          >
            Faça login!
          </button>
        </Form>
      )}
    </Formik>
  );
}
