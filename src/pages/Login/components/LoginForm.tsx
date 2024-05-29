import { Context } from "../../../context";
import { useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

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
interface FormLoginValues {
  email: string;
  password: string;
}
interface FormProps {
  setIsLogando: (boolean: boolean) => void;
}

export default function LoginForm({ setIsLogando }: FormProps) {
  const { signin } = useContext(Context)!;
  function handleLogin(values: FormLoginValues) {
    console.log("login: ", values);
    signin(values.email, values.password);
  }
  return (
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
  );
}
