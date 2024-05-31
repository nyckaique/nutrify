import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { Context } from "../../../context";

const initialValuesPaciente = {
  name: "",
  telefone: "",
  dataNascimento: new Date(),
  peso: 0,
  altura: 0,
  convenio: "",
  codigoConvenio: "",
};
const validationSchemaPaciente = Yup.object({
  name: Yup.string()
    .matches(
      /^[A-Za-z]{3,}(?: [A-Za-z]{3,})*$/,
      "Nome e/ou sobrenome inválido. Cada um deve ter pelo menos 3 letras."
    )
    .max(50, "Nome muito longo")
    .required("Nome é obrigatório"),
  telefone: Yup.string()
    .matches(/^\d{10,11}$/, "O telefone deve conter 10 ou 11 dígitos.")
    .required("Telefone é obrigatório"),
  dataNascimento: Yup.date()
    .max(new Date(), "A data de nascimento não pode ser no futuro.")
    .required("Data de nascimento é obrigatória"),
  peso: Yup.number()
    .positive("O peso deve ser um número positivo.")
    .required("Peso é obrigatório"),
  altura: Yup.number()
    .positive("A altura deve ser um número positivo.")
    .required("Altura é obrigatória"),
  convenio: Yup.string()
    .max(30, "Nome de convênio muito longo")
    .required("Convênio é obrigatório"),
  codigoConvenio: Yup.string().max(
    30,
    "Nome do código do convênio muito longo"
  ),
});
interface FormPacienteValues {
  name: string;
  telefone: string;
  dataNascimento: Date;
  peso: number;
  altura: number;
  convenio: string;
  codigoConvenio: string;
}

export default function PacienteForm() {
  const { cadastrarPaciente } = useContext(Context)!;
  function handleLogin(values: FormPacienteValues) {
    cadastrarPaciente(
      values.name,
      values.telefone,
      values.dataNascimento,
      values.peso,
      values.altura,
      values.convenio,
      values.codigoConvenio
    );
  }
  return (
    <div className="overflow-hidden rounded-lg shadowblack border-zinc-200 border-[1px]">
      <div className="p-3 flex flex-col items-center scrollable-form">
        <Formik
          enableReinitialize
          initialValues={initialValuesPaciente}
          onSubmit={handleLogin}
          validationSchema={validationSchemaPaciente}
        >
          {() => (
            <Form className="container-flex-col max-w-[400px]">
              <div>Nome</div>
              <Field
                autoComplete="off"
                name="name"
                type="text"
                placeholder="Nome do paciente"
                className="input-light-text-color p-2 rounded-md border-zinc-200 border-2"
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="name" />
              </p>

              <div>Telefone</div>
              <Field
                name="telefone"
                type="text"
                placeholder="64912345678"
                className="input-light-text-color p-2 rounded-md border-zinc-200 border-2"
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="telefone" />
              </p>

              <div>Data de nascimento</div>
              <Field
                name="dataNascimento"
                type="date"
                placeholder=""
                className="input-light-text-color p-2 rounded-md border-zinc-200 border-2"
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="dataNascimento" />
              </p>

              <div>Peso (kg)</div>
              <Field
                name="peso"
                type="number"
                className="input-light-text-color p-2 rounded-md border-zinc-200 border-2"
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="peso" />
              </p>

              <div>Altura (cm)</div>
              <Field
                name="altura"
                type="number"
                className="input-light-text-color p-2 rounded-md border-zinc-200 border-2"
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="altura" />
              </p>

              <div>Convênio</div>
              <Field
                name="convenio"
                type="text"
                placeholder="Empresa de convênio"
                className="input-light-text-color p-2 rounded-md border-zinc-200 border-2"
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="convenio" />
              </p>

              <div>Código do Convênio</div>
              <Field
                name="codigoConvenio"
                type="text"
                placeholder="Código do convênio"
                className="input-light-text-color p-2 rounded-md border-zinc-200 border-2"
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="codigoConvenio" />
              </p>

              <button type="submit" className="button-orange mx-auto mt-5">
                Cadastrar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
