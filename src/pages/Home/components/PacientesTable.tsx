import { useContext, useState, useEffect } from "react";
import { Context, PacienteResumo } from "../../../context";
import { useNavigate } from "react-router-dom";

export default function PacientesTable() {
  const { user, pacientes, loadPacientes, deletarPaciente, formatarTelefone } =
    useContext(Context)!;
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<PacienteResumo | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    loadPacientes(user!.uid);
  }, []);
  const [filtro, setFiltro] = useState("");

  const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(event.target.value);
  };

  const pacientesFiltrados = filtro
    ? pacientes!.filter((paciente) =>
        paciente.nome.toLowerCase().includes(filtro.toLowerCase())
      )
    : pacientes;

  function handleDeletarPaciente(paciente: PacienteResumo) {
    setModalVisivel(true);
    setPacienteSelecionado(paciente);
  }
  function handleConfirmarExclusao() {
    if (pacienteSelecionado) {
      deletarPaciente(pacienteSelecionado.id); // Função de exclusão do paciente
      setModalVisivel(false);
      setPacienteSelecionado(null);
    }
  }
  function handleCancelarExclusao() {
    setModalVisivel(false);
    setPacienteSelecionado(null);
  }
  function handleVisualizarPaciente(id: string) {
    navigate("/paciente", { state: { id } });
  }

  return (
    <div className="overflow-hidden rounded-lg shadowblack">
      <div className="scrollable-table">
        <table className="bg-white ">
          <thead>
            <tr>
              <th className="p-2 sticky top-0 bg-[var(--primary-orange)]">
                <p className="flex gap-2 items-center">
                  Nome{" "}
                  <input
                    className="p-1 rounded-lg bg-white bg-opacity-30 placeholder:text-white max-w-[180px]  sticky top-0"
                    type="text"
                    placeholder="Buscar pelo nome..."
                    value={filtro}
                    onChange={handleFiltroChange}
                  />
                </p>
              </th>
              <th className="p-2 sticky top-0 bg-[var(--primary-orange)]">
                Última consulta
              </th>
              <th className="p-2 sticky top-0 bg-[var(--primary-orange)]">
                Telefone
              </th>
              <th className="p-2 sticky top-0 bg-[var(--primary-orange)]">
                Visualizar
              </th>
              <th className="p-2 sticky top-0 bg-[var(--primary-orange)]">
                Excluir
              </th>
            </tr>
          </thead>

          <tbody>
            {pacientesFiltrados?.map((paciente: PacienteResumo) => (
              <tr key={paciente.id}>
                <td className="p-2">{paciente.nome}</td>
                <td className="p-2 text-center">{paciente.ultimaConsulta}</td>
                <td className="p-2 text-center">
                  <p className="hover:text-[var(--primary-orange)]">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${paciente.telefone}`}
                      target="_blank"
                    >
                      {formatarTelefone(paciente.telefone)}
                    </a>
                  </p>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleVisualizarPaciente(paciente.id)}
                    className="hover:text-[var(--primary-orange)] w-full"
                  >
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeletarPaciente(paciente)}
                    className="hover:text-[var(--primary-orange)] w-full"
                  >
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalVisivel && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="font-bold mb-2">Confirmar Exclusão</h2>
            <p className="mb-2">
              Tem certeza que deseja excluir{" "}
              <span className="font-bold">{pacienteSelecionado?.nome}</span>?
            </p>
            <button className="button-orange" onClick={handleConfirmarExclusao}>
              Confirmar
            </button>
            <button className="button-orange" onClick={handleCancelarExclusao}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
