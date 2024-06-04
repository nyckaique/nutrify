import { useContext, useState } from "react";
import { Context, Paciente } from "../../../context";
import { parseISO, format, compareDesc } from "date-fns";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
interface PacienteInfoProps {
  p: Paciente;
}

export default function PacienteHistorico({ p }: PacienteInfoProps) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalDeleteVisivel, setModalDeleteVisivel] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [consultaAtual, setConsultaAtual] =
    useState<FormNovaConsultaValues | null>(null);
  const [indexHistorico, setIndexHistorico] = useState<number | null>();

  const { novaConsulta, excluirConsulta } = useContext(Context)!;
  const initialValuesNovaConsulta = consultaAtual || {
    dataConsulta: null,
    peso: 0,
    notas: "",
  };
  const validationSchemaNovaConsulta = Yup.object({
    dataConsulta: Yup.date()
      .max(new Date(), "A data da consulta não pode ser no futuro.")
      .required("Data da consulta é obrigatória"),
    peso: Yup.number()
      .positive("O peso deve ser um número positivo.")
      .required("Peso é obrigatório"),
    notas: Yup.string()
      .max(600, "Descrição da consulta muito longa")
      .required("Descrição da consulta é obrigatória"),
  });
  interface FormNovaConsultaValues {
    dataConsulta: string | null;
    peso: number;
    notas: string;
  }
  function formatarData(dataConsulta: string): string {
    const data = parseISO(dataConsulta);
    return format(data, "dd/MM/yyyy");
  }

  function ordenarPorData(
    historico: {
      data: string;
      peso: number;
      notas: string;
      originalIndex: number;
    }[]
  ) {
    return historico.sort((a, b) =>
      compareDesc(parseISO(a.data), parseISO(b.data))
    );
  }

  const historicoComIndice = p.historico.map((consulta, index) => ({
    ...consulta,
    originalIndex: index,
  }));

  const historicoOrdenado = ordenarPorData(historicoComIndice);

  function handleNovaConsulta(values: FormNovaConsultaValues) {
    if (values.dataConsulta) {
      if (atualizando) {
        novaConsulta(
          values.dataConsulta,
          values.peso,
          values.notas,
          indexHistorico!
        );
        setAtualizando(false);
        setConsultaAtual(null);
        setIndexHistorico(null);
      } else {
        novaConsulta(values.dataConsulta, values.peso, values.notas);
      }
      setModalVisivel(false);
    }
  }
  function handleCancelar() {
    setModalVisivel(false);
    setModalDeleteVisivel(false);
    setAtualizando(false);
    setConsultaAtual(null);
    setIndexHistorico(null);
  }
  function handleEditarConsulta(historicoIndex: number) {
    setIndexHistorico(historicoIndex);
    const consultaParaEditar = p.historico[historicoIndex];
    setConsultaAtual({
      dataConsulta: format(parseISO(consultaParaEditar.data), "yyyy-MM-dd"),
      peso: consultaParaEditar.peso,
      notas: consultaParaEditar.notas,
    });
    setAtualizando(true);
    setModalVisivel(true);
  }
  function handleExcluirConsulta(historicoIndex: number) {
    setIndexHistorico(historicoIndex);
    const consultaParaExcluir = p.historico[historicoIndex];
    setConsultaAtual({
      dataConsulta: format(parseISO(consultaParaExcluir.data), "yyyy-MM-dd"),
      peso: consultaParaExcluir.peso,
      notas: consultaParaExcluir.notas,
    });
    setModalDeleteVisivel(true);
  }
  function handleConfirmarExclusao() {
    excluirConsulta(indexHistorico!);
    setConsultaAtual(null);
    setModalDeleteVisivel(false);
  }
  return (
    <div>
      <div className="py-4 h-full w-full min-h-[200px] border-t-2 flex-1 flex flex-col gap-3">
        <button
          className="ml-4 button-orange shadowblack w-fit"
          onClick={() => setModalVisivel(true)}
        >
          Nova Consulta
        </button>

        <div className="h-full flex flex-col gap-3 py-3">
          {historicoOrdenado.length > 0 &&
            historicoOrdenado.map((consulta, index) => (
              <p key={index}>
                <button
                  onClick={() => handleEditarConsulta(consulta.originalIndex)}
                  className="mr-4 hover:text-[var(--primary-orange)] w-[30px]"
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button
                  onClick={() => handleExcluirConsulta(consulta.originalIndex)}
                  className="mr-4 hover:text-[var(--primary-orange)] w-[30px]"
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </button>
                {formatarData(consulta.data)} - Peso: {consulta.peso}kg -{" "}
                {consulta.notas}{" "}
              </p>
            ))}
        </div>
      </div>

      {modalVisivel && (
        <div className="modal ">
          <div className="modal-content w-[400px]">
            <h2 className="font-bold mb-2">
              {atualizando
                ? "Atualizar informações da consulta"
                : "Adicionar nova consulta"}
            </h2>
            <Formik
              enableReinitialize
              initialValues={initialValuesNovaConsulta}
              onSubmit={handleNovaConsulta}
              validationSchema={validationSchemaNovaConsulta}
            >
              {() => (
                <Form className="container-flex-col max-w-[400px] items-center">
                  <div>Data da consulta</div>
                  <Field
                    name="dataConsulta"
                    type="date"
                    placeholder=""
                    className="w-fit input-light-text-color p-2 rounded-md border-zinc-200 border-2"
                  />
                  <p className="text-orange text-sm font-bold">
                    <ErrorMessage name="dataConsulta" />
                  </p>

                  <div>Peso (kg)</div>
                  <Field
                    name="peso"
                    type="number"
                    className="w-[100px] input-light-text-color p-2 rounded-md border-zinc-200 border-2"
                  />
                  <p className="text-orange text-sm font-bold">
                    <ErrorMessage name="peso" />
                  </p>

                  <div>Anotações sobre a consulta</div>
                  <Field
                    name="notas"
                    as="textarea"
                    type="text"
                    placeholder="Descreva a consulta"
                    className="w-full input-light-text-color p-2 rounded-md border-zinc-200 border-2"
                  />
                  <p className="text-orange text-sm font-bold">
                    <ErrorMessage name="notas" />
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="button-orange">
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className="button-orange"
                      onClick={handleCancelar}
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
      {modalDeleteVisivel && (
        <div className="modal">
          <div className="modal-content w-[400px]">
            <h2 className="font-bold mb-2">Confirmar Exclusão</h2>
            <p className="mb-2">
              Tem certeza que deseja excluir essa consulta?
            </p>
            <p className="font-bold text-wrap">
              {formatarData(consultaAtual!.dataConsulta!)} - Peso:{" "}
              {consultaAtual?.peso}kg - {consultaAtual?.notas}{" "}
            </p>
            <button className="button-orange" onClick={handleConfirmarExclusao}>
              Confirmar
            </button>
            <button className="button-orange" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
