import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Logo from "../../components/Logo";
import { useState } from "react";
import { Context } from "../../context";
import { useContext } from "react";

const initialValuesLogin = {
  email: "",
  password: "",
};
const validationSchemaLogin = Yup.object({
  email: Yup.string().email("Insira um e-mail válido").required("Obrigatório"),
  password: Yup.string()
    .min(6, "Senha muito curta")
    .max(50, "Senha muito longa")
    .required("Obrigatório"),
});

interface FormCadastroValues {
  name: string;
  email: string;
  password: string;
}
interface FormLoginValues {
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

export function Login() {
  const [isLogando, setIsLogando] = useState(true);
  const { signup, signin } = useContext(Context)!;
  function handleCadastro(values: FormCadastroValues) {
    console.log("cadastro: ", values);
    signup(values.name, values.email, values.password);
  }
  function handleLogin(values: FormLoginValues) {
    console.log("login: ", values);
    signin(values.email, values.password);
  }
  return (
    <div className="w-full h-[100vh] flex bg-orange">
      <div className="container-login glassmorphism-container">
        <Logo />
        {isLogando ? (
          <Formik
            enableReinitialize
            initialValues={initialValuesLogin}
            onSubmit={handleLogin}
            validationSchema={validationSchemaLogin}
          >
            {() => (
              <Form className="container-flex-col">
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
                  Login
                </button>

                <button
                  type="button"
                  className="mx-auto mt-5 underline"
                  onClick={() => setIsLogando(false)}
                >
                  Faça seu cadastro!
                </button>
              </Form>
            )}
          </Formik>
        ) : (
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
        )}
      </div>
    </div>
  );
}
