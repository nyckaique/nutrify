import { Context } from "../../../context";
import { useContext } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormContainer from "../../../components/FormContainer";

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

interface FormProps {
  setIsLogando: (boolean: boolean) => void;
}

export default function LoginForm({ setIsLogando }: FormProps) {
  const { signin } = useContext(Context)!;
  function handleLogin(values: { email: string; password: string }) {
    signin(values.email, values.password);
  }
  return (
    <Formik
      initialValues={initialValuesLogin}
      onSubmit={handleLogin}
      validationSchema={validationSchemaLogin}
    >
      {({ handleSubmit }) => (
        <FormContainer
          title="Login"
          onSubmit={handleSubmit}
          toggleForm={() => setIsLogando(false)}
          toggleText="Faça seu cadastro!"
        >
          <div>E-mail</div>
          <Field
            name="email"
            type="email"
            placeholder="E-mail"
            className="input-light-text-color p-2 rounded-md glassmorphism-container w-full"
          />
          <p className="text-orange text-sm font-bold">
            <ErrorMessage name="email" />
          </p>
          <div>Senha</div>
          <Field
            name="password"
            type="password"
            placeholder="Senha"
            className="input-light-text-color p-2 rounded-md glassmorphism-container w-full"
          />
          <p className="text-orange text-sm font-bold">
            <ErrorMessage name="password" />
          </p>
        </FormContainer>
      )}
    </Formik>
  );
}
