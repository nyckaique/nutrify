import { useContext } from "react";
import { Context, paciente } from "../../../context";
import { parseISO, differenceInYears, isBefore, subYears } from "date-fns";
interface PacienteInfoProps {
  p: paciente;
}

export default function PacienteInfo({ p }: PacienteInfoProps) {
  const { formatarTelefone } = useContext(Context)!;
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-orange">{p.nome}</h1>
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
    </div>
  );
}
