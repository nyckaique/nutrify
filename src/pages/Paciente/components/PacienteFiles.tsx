import { useContext, useEffect, useState } from "react";
import { Context, Paciente } from "../../../context";
import toast from "react-hot-toast";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { db, storage } from "../../../firebase/firebaseConnection";
import { doc, updateDoc } from "firebase/firestore";
import { parseISO, format, compareDesc } from "date-fns";
import { v4 as uuidv4 } from "uuid";
interface PacienteInfoProps {
  p: Paciente;
  path: "exames" | "planos" | "receitas";
}

export default function PacienteFiles({ p, path }: PacienteInfoProps) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileAtual, setFileAtual] = useState<FileAtual | null>(null);
  const [modalDeleteVisivel, setModalDeleteVisivel] = useState(false);
  const [indexFile, setIndexFile] = useState<number | null>();
  const [id, setId] = useState<string>();
  const [texto, setTexto] = useState<string>("");
  const { paciente, excluirFile, darkMode } = useContext(Context)!;

  interface FileAtual {
    data: string;
    fileName: string;
    urlFile: string;
    id: string;
  }
  async function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (file !== null) {
      const uploadRef = ref(
        storage,
        `${path}/${paciente!.id}/${id}/${file.name}`
      );
      uploadBytes(uploadRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
          const urlFile = downloadUrl;
          const fileName = file.name;
          const data = formatDate(new Date());
          const docRef = doc(db, "pacientes", paciente!.id);

          await updateDoc(docRef, {
            ...paciente,
            [path]: [...paciente![path], { fileName, urlFile, data, id }],
          })
            .then(() => {
              toast.success(`Adicionado arquivo com sucesso!`);
              setModalVisivel(false);
            })
            .catch(() => {
              toast.error("Não foi possível concluir a operação.");
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
      setId(uuidv4());
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function formatarData(dataConsulta: string): string {
    const data = parseISO(dataConsulta);
    return format(data, "dd/MM/yyyy");
  }
  function handleExcluirFile(fileIndex: number) {
    const fileParaExcluir = p[path][fileIndex!];
    setIndexFile(fileIndex);
    setFileAtual({
      data: format(parseISO(fileParaExcluir.data), "yyyy-MM-dd"),
      fileName: fileParaExcluir.fileName,
      urlFile: fileParaExcluir.urlFile,
      id: fileParaExcluir.id,
    });
    setModalDeleteVisivel(true);
  }
  function handleConfirmarExclusao() {
    excluirFile(
      indexFile!,
      `${path}/${paciente!.id}/${id}/${fileAtual!.fileName}`,
      path
    );
    setModalDeleteVisivel(false);
  }
  const filesComIndice = p[path].map((path, index) => ({
    ...path,
    originalIndex: index,
  }));
  const filesOrdenadas = ordenarPorData(filesComIndice);
  function handleTexto(path: string) {
    switch (path) {
      case "planos": {
        setTexto("Adicionar Plano Alimentar");
        break;
      }
      case "exames": {
        setTexto("Adicionar Exame Médico");
        break;
      }
      case "receitas": {
        setTexto("Adicionar Receita Médica");
        break;
      }
    }
  }
  // handleTexto(path);
  useEffect(() => {
    handleTexto(path);
  }, []);

  return (
    <div>
      <div className="py-4 h-full w-full flex-1 border-t-2 overflow-y-auto flex flex-col gap-3 ">
        <button
          className="ml-4 button-orange shadowblack w-fit"
          onClick={() => setModalVisivel(true)}
        >
          {texto}
        </button>

        <div className="flex flex-col gap-3 py-3 h-full">
          {filesOrdenadas.length > 0 &&
            filesOrdenadas.map((exame, indexFiles) => (
              <div key={indexFiles}>
                <button
                  onClick={() => handleExcluirFile(exame.originalIndex)}
                  className="mr-4 hover:text-[var(--primary-orange)] w-[30px]"
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </button>
                <a
                  className="hover:text-[var(--primary-orange)]"
                  href={exame.urlFile}
                  target="_blank"
                >
                  {exame.fileName}
                </a>{" "}
                - {formatarData(exame.data)}
              </div>
            ))}
        </div>
      </div>

      {modalVisivel && (
        <div className="modal">
          <div
            className={`modal-content w-[400px] max-w-[80%] overflow-x-auto ${
              darkMode
                ? "bg-[var(--primary-grey)] text-white"
                : "bg-white text-[var(--primary-grey)]"
            }`}
          >
            <h2 className="font-bold mb-2 text-xl">{texto}</h2>
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
          <div
            className={`modal-content w-[400px] max-w-[80%] overflow-x-auto ${
              darkMode
                ? "bg-[var(--primary-grey)] text-white"
                : "bg-white text-[var(--primary-grey)]"
            }`}
          >
            <h2 className="font-bold mb-2 text-xl">Confirmar Exclusão</h2>
            <p className="mb-2">Tem certeza que deseja excluir?</p>
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
