import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Logo from "../../components/Logo";
const initialValues = {
  email: "",
  password: "",
};
const validationSchema = Yup.object({
  email: Yup.string().email("Insira um e-mail válido").required("Obrigatório"),
  password: Yup.string()
    .min(6, "Senha muito curta")
    .max(50, "Senha muito longa")
    .required("Obrigatório"),
});
function handleLogin() {
  console.log("submit");
}
export function Login() {
  return (
    <div className="w-full h-[100vh] flex bg-orange">
      <div className="container-login glassmorphism-container">
        <Logo />
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleLogin}
          validationSchema={validationSchema}
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

              <div className="container-flex-row  mt-5 flex-wrap ">
                <button type="submit" className="button-orange">
                  Login
                </button>
                <button type="button" className="button-orange">
                  Registrar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
