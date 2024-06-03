import { useContext, useState } from "react";
import { Context, paciente } from "../../../context";
import { parseISO, differenceInYears, isBefore, subYears } from "date-fns";
interface PacienteInfoProps {
  p: paciente;
}
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function PacienteInfo({ p }: PacienteInfoProps) {
  const { formatarTelefone, atualizarPaciente } = useContext(Context)!;
  const [modalVisivel, setModalVisivel] = useState(false);
  function calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const dataNasc = parseISO(dataNascimento);
    let idade = differenceInYears(hoje, dataNasc);

    // Ajusta a idade se ainda não tiver completado o aniversário neste ano
    if (isBefore(hoje, subYears(new Date(), idade))) {
      idade--;
    }

    return idade;
  }
  function cmParaMetros(cm: number): number {
    return cm / 100;
  }
  function calcularIMC(pesoKG: number, alturaCM: number): number {
    const alturaM = cmParaMetros(alturaCM);
    return pesoKG / (alturaM * alturaM);
  }
  const initialValuesPaciente = {
    dataNascimento: p.dataNascimento,
    name: p.nome,
    telefone: p.telefone,
    peso: p.peso,
    altura: p.altura,
    convenio: p.convenio,
    codigoConvenio: p.codigoConvenio,
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
    dataNascimento: string | null;
    peso: number;
    altura: number;
    convenio: string;
    codigoConvenio: string;
  }

  function handleAtualizarPaciente(values: FormPacienteValues) {
    if (values.dataNascimento) {
      atualizarPaciente(
        values.name,
        values.telefone,
        values.dataNascimento,
        values.peso,
        values.altura,
        values.convenio,
        values.codigoConvenio
      );
      setModalVisivel(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-orange">
        {p.nome}{" "}
        <button
          onClick={() => setModalVisivel(true)}
          className="hover:text-[var(--primary-orange)] w-[30px]"
        >
          <i className="fa fa-pencil" aria-hidden="true"></i>
        </button>
      </h1>
      <div className="flex gap-6 justify-between flex-wrap max-w-[800px]">
        <p className="text-nowrap">
          <span className="font-bold">Idade:</span>{" "}
          {calcularIdade(p.dataNascimento)}
        </p>
        <p className="text-nowrap">
          <span className="font-bold">Peso:</span> {p.peso}kg
        </p>
        <p className="text-nowrap">
          <span className="font-bold">Altura:</span> {cmParaMetros(p.altura)}m
        </p>
        <p className="text-nowrap">
          <span className="font-bold">IMC:</span>{" "}
          {calcularIMC(p.peso, p.altura).toFixed(2)}
        </p>
        <p className="text-nowrap">
          <span className="font-bold">Telefone:</span>{" "}
          <a
            className="hover:text-[var(--primary-orange)]"
            href={`https://api.whatsapp.com/send?phone=${p.telefone}`}
            target="_blank"
          >
            {formatarTelefone(p.telefone)}
          </a>
        </p>
        <p className="text-nowrap">
          <span className="font-bold">Convênio:</span> {p.convenio}{" "}
          {p.codigoConvenio ? (
            <span>
              <span className="font-bold">Código:</span>
              {p.codigoConvenio}
            </span>
          ) : (
            ""
          )}
        </p>
      </div>
      {modalVisivel && (
        <div className="modal ">
          <div className="modal-content w-[400px] overflow-y-auto max-h-[90%]">
            <Formik
              enableReinitialize
              initialValues={initialValuesPaciente}
              onSubmit={handleAtualizarPaciente}
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

                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    <button
                      type="submit"
                      className="button-orange mx-auto mt-5"
                    >
                      Atualizar
                    </button>
                    <button
                      onClick={() => setModalVisivel(false)}
                      type="button"
                      className="button-orange mx-auto mt-5"
                    >
                      Cancelar
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
