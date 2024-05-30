export default function PacientesTable() {
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
            {Array.from({ length: 20 }).map((_, index) => (
              <tr key={index}>
                <td className="p-2">Maria josé</td>
                <td className="p-2 text-center">30/05/2024</td>
                <td className="p-2 text-center">
                  <p className="hover:text-[var(--primary-orange)]">
                    <a
                      href="https://api.whatsapp.com/send?phone=5564992673386"
                      target="_blank"
                    >
                      (64)91234-5678
                    </a>
                  </p>
                </td>
                <td className="p-2">
                  <button className="hover:text-[var(--primary-orange)] w-full">
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </button>
                </td>
                <td className="p-2">
                  <button className="hover:text-[var(--primary-orange)] w-full">
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
