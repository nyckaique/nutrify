import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { Context } from "../../../context";

const initialValuesPaciente = {
  dataNascimento: new Date(),
  name: "",
  telefone: "",
  peso: 0,
  altura: 0,
  convenio: "",
  codigoConvenio: "",
};
const validationSchemaPaciente = Yup.object({
  name: Yup.string()
    .matches(
      /^[A-Za-zÀ-ÿ]{2,}(?: [A-Za-zÀ-ÿ]{2,})*$/,
      "Nome e/ou sobrenome inválido. Cada um deve ter pelo menos 2 letras."
    )
    .max(50, "Nome muito longo")
    .required("Obrigatório"),
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
  const { cadastrarPaciente, darkMode } = useContext(Context)!;
  function handleNovoPaciente(
    values: FormPacienteValues,
    { resetForm }: FormikHelpers<FormPacienteValues>
  ) {
    if (values.dataNascimento) {
      cadastrarPaciente(
        values.name,
        values.telefone,
        values.dataNascimento,
        values.peso,
        values.altura,
        values.convenio,
        values.codigoConvenio
      );
      resetForm();
    }
  }
  return (
    <div
      className={`${
        darkMode ? "border-zinc-700" : "border-zinc-200"
      } overflow-hidden rounded-lg shadowblack  border-[1px]`}
    >
      <div className="p-3 flex flex-col items-center scrollable-form">
        <Formik
          enableReinitialize
          initialValues={initialValuesPaciente}
          onSubmit={handleNovoPaciente}
          validationSchema={validationSchemaPaciente}
        >
          {({ isSubmitting }) => (
            <Form className="container-flex-col max-w-[400px]">
              <div>Nome</div>
              <Field
                autoComplete="off"
                name="name"
                type="text"
                placeholder="Nome do paciente"
                className={`${
                  darkMode
                    ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
                    : "border-zinc-200 bg-white text-[var(--primary-grey)]"
                } w-full p-2 rounded-md  border-2`}
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="name" />
              </p>

              <div>Telefone</div>
              <Field
                name="telefone"
                type="text"
                placeholder="64912345678"
                className={`${
                  darkMode
                    ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
                    : "border-zinc-200 bg-white text-[var(--primary-grey)]"
                } w-full p-2 rounded-md  border-2`}
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="telefone" />
              </p>

              <div>Data de nascimento</div>
              <Field
                name="dataNascimento"
                type="date"
                placeholder=""
                className={`${
                  darkMode
                    ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
                    : "border-zinc-200 bg-white text-[var(--primary-grey)]"
                } w-full p-2 rounded-md  border-2`}
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="dataNascimento" />
              </p>

              <div>Peso (kg)</div>
              <Field
                name="peso"
                type="number"
                className={`${
                  darkMode
                    ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
                    : "border-zinc-200 bg-white text-[var(--primary-grey)]"
                } w-full p-2 rounded-md  border-2`}
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="peso" />
              </p>

              <div>Altura (cm)</div>
              <Field
                name="altura"
                type="number"
                className={`${
                  darkMode
                    ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
                    : "border-zinc-200 bg-white text-[var(--primary-grey)]"
                } w-full p-2 rounded-md  border-2`}
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="altura" />
              </p>

              <div>Convênio</div>
              <Field
                name="convenio"
                type="text"
                placeholder="Empresa de convênio"
                className={`${
                  darkMode
                    ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
                    : "border-zinc-200 bg-white text-[var(--primary-grey)]"
                } w-full p-2 rounded-md  border-2`}
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="convenio" />
              </p>

              <div>Código do Convênio</div>
              <Field
                name="codigoConvenio"
                type="text"
                placeholder="Código do convênio"
                className={`${
                  darkMode
                    ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
                    : "border-zinc-200 bg-white text-[var(--primary-grey)]"
                } w-full p-2 rounded-md  border-2`}
              />
              <p className="text-orange text-sm font-bold">
                <ErrorMessage name="codigoConvenio" />
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-orange mx-auto mt-5"
              >
                Cadastrar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
