import { useContext, useState } from "react";
import { Context, paciente } from "../../../context";
import toast from "react-hot-toast";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { db, storage } from "../../../firebase/firebaseConnection";
import { doc, updateDoc } from "firebase/firestore";
import { parseISO, format, compareDesc } from "date-fns";
interface PacienteInfoProps {
  p: paciente;
}

export default function PacienteReceitasMedicas({ p }: PacienteInfoProps) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileAtual, setFileAtual] = useState<FileAtual | null>(null);
  const [modalDeleteVisivel, setModalDeleteVisivel] = useState(false);
  const [indexFile, setIndexFile] = useState<number | null>();
  const { paciente, excluirPlano } = useContext(Context)!;

  interface FileAtual {
    data: string;
    fileName: string;
  }
  async function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (file !== null) {
      const uploadRef = ref(storage, `receitas/${paciente!.id}/${file.name}`);
      uploadBytes(uploadRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
          const urlFile = downloadUrl;
          const fileName = file.name;
          const data = formatDate(new Date());
          const docRef = doc(db, "pacientes", paciente!.id);
          await updateDoc(docRef, {
            ...paciente,
            receitas: [...paciente!.receitas, { fileName, urlFile, data }],
          })
            .then(() => {
              toast.success("Adicionada receita médica com sucesso");
              setModalVisivel(false);
            })
            .catch(() => {
              toast.error("Não foi possível concluir a operação");
              setModalVisivel(false);
            });
        });
      });
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
    }
  }
  function ordenarPorData(
    files: {
      data: string;
      fileName: string;
      urlFile: string;
      originalIndex: number;
    }[]
  ) {
    return files.sort((a, b) =>
      compareDesc(parseISO(a.data), parseISO(b.data))
    );
  }
  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function formatarData(dataConsulta: string): string {
    const data = parseISO(dataConsulta);
    return format(data, "dd/MM/yyyy");
  }
  function handleExcluirFile(fileIndex: number) {
    const fileParaExcluir = p.receitas[fileIndex!];
    setIndexFile(fileIndex);
    setFileAtual({
      data: format(parseISO(fileParaExcluir.data), "yyyy-MM-dd"),
      fileName: fileParaExcluir.fileName,
    });
    setModalDeleteVisivel(true);
  }
  function handleConfirmarExclusao() {
    excluirPlano(indexFile!, `receitas/${paciente!.id}/${fileAtual!.fileName}`);
    setModalDeleteVisivel(false);
  }
  const filesComIndice = p.receitas.map((receitas, index) => ({
    ...receitas,
    originalIndex: index,
  }));
  const filesOrdenadas = ordenarPorData(filesComIndice);

  return (
    <div>
      <div className="p-3 shadowblack rounded-lg my-3 border-zinc-200 border-[1px] flex-1 overflow-hidden flex flex-col gap-3 ">
        <button
          className="button-orange shadowblack w-fit"
          onClick={() => setModalVisivel(true)}
        >
          Nova Receita Médica
        </button>
        {filesOrdenadas.length > 0 &&
          filesOrdenadas.map((receita, indexFiles) => (
            <div key={indexFiles}>
              <button
                onClick={() => handleExcluirFile(receita.originalIndex)}
                className="mr-4 hover:text-[var(--primary-orange)] w-[30px]"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
              <a
                className="hover:text-[var(--primary-orange)]"
                href={receita.urlFile}
                target="_blank"
              >
                {receita.fileName}
              </a>{" "}
              - {formatarData(receita.data)}
            </div>
          ))}
      </div>
      {modalVisivel && (
        <div className="modal">
          <div className="modal-content w-[400px]">
            <h2 className="font-bold mb-2">Adicionar nova receita médica</h2>
            <form method="post" onSubmit={formSubmit}>
              <input
                className="button-input-file mb-4"
                type="file"
                value={undefined}
                onChange={handleFile}
                accept=".doc,.docx,.pdf"
              />

              <button className="button-orange" type="submit">
                Confirmar
              </button>
              <button
                className="button-orange"
                type="button"
                onClick={() => setModalVisivel(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
      {modalDeleteVisivel && (
        <div className="modal">
          <div className="modal-content w-[400px]">
            <h2 className="font-bold mb-2">Confirmar Exclusão</h2>
            <p className="mb-2">
              Tem certeza que deseja excluir essa receita médica?
            </p>
            <p className="font-bold text-wrap">
              {fileAtual!.fileName} - {formatarData(fileAtual!.data!)}
            </p>
            <button className="button-orange" onClick={handleConfirmarExclusao}>
              Confirmar
            </button>
            <button
              className="button-orange"
              onClick={() => setModalDeleteVisivel(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
