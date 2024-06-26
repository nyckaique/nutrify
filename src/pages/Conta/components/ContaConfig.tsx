import { useContext, useState } from "react";
import { Context } from "../../../context";
import toast from "react-hot-toast";
import { auth, db, storage } from "../../../firebase/firebaseConnection";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { sendPasswordResetEmail } from "firebase/auth";

export function ContaConfig() {
  const { user, setUser, storageUser, darkMode } = useContext(Context)!;
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imagemAvatar, setImagemAvatar] = useState<File | null>(null);

  const [nome, setNome] = useState(user && user.nome);
  const [errorShow, setErrorShow] = useState(false);
  const [errorNome, setErrorNome] = useState("");
  const nomeRegex = /^[A-Za-zÀ-ÿ]{2,}(?: [A-Za-zÀ-ÿ]{2,})*$/;

  async function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nomeRegex.test(nome!)) {
      setErrorNome(
        "Nome e/ou sobrenome inválido. Cada um deve ter pelo menos 2 letras."
      );
      setErrorShow(true);
      e.preventDefault();
      return;
    } else if (nome!.length > 50) {
      setErrorNome("Nome muito longo.");
      setErrorShow(true);
      e.preventDefault();
      return;
    }
    setErrorShow(false);

    if (imagemAvatar === null && nome !== "") {
      const docRef = doc(db, "users", user!.uid);
      await updateDoc(docRef, {
        nome: nome,
      }).then(() => {
        const data = {
          ...user!,
          nome: nome!,
        };
        setUser(data);
        storageUser(data);
        toast.success("Informações atualizadas com sucesso!");
      });
    } else if (imagemAvatar !== null && nome !== "") {
      handleFileUpload();
    }
  }

  async function handleFileUpload() {
    const currentUid = user!.uid;
    if (imagemAvatar !== null) {
      const uploadRef = ref(
        storage,
        `images/${currentUid}/${imagemAvatar.name}`
      );
      uploadBytes(uploadRef, imagemAvatar).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
          const urlFoto = downloadUrl;
          const docRef = doc(db, "users", user!.uid);
          await updateDoc(docRef, {
            avatarUrl: urlFoto,
            nome: nome,
          }).then(() => {
            const data = {
              ...user!,
              nome: nome!,
              avatarUrl: urlFoto,
            };
            setUser(data);
            storageUser(data);
            toast.success("Informações atualizadas com sucesso!");
          });
        });
      });
    }
  }
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (
        image.type === "image/png" ||
        image.type === "image/jpg" ||
        image.type === "image/jpeg"
      ) {
        setImagemAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        toast.error("Por favor, selecione imagens do tipo PNG, JPG ou JPEG.");
      }
    }
  }
  async function handleResetEmail() {
    try {
      await sendPasswordResetEmail(auth, user!.email);
      toast.success("Um e-mail de redefinição de senha foi enviado.");
    } catch (error) {
      toast.error("Erro ao enviar e-mail de redefinição de senha.");
    }
  }

  return (
    <div
      className={`${
        darkMode ? "border-zinc-700" : "border-zinc-200"
      } rounded-lg shadowblack p-3 flex flex-col items-center  border-[1px] overflow-auto`}
    >
      <form
        method="post"
        onSubmit={formSubmit}
        className="flex flex-col gap-2 max-w-[500px] w-fit"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <label className="labelAvatar">
            <span>
              <i className="fa fa-cloud-upload" aria-hidden="true"></i>
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleFile}
            />
            {avatarUrl === null ? (
              <img
                src={"src/assets/avatar.png"}
                className="w-[150px] h-auto object-cover p-0 rounded-[50%] aspect-square"
                alt="Foto de Perfil"
              />
            ) : (
              <img
                src={avatarUrl}
                className="w-[150px] h-auto object-cover p-0 rounded-[50%] aspect-square"
                alt="Foto de Perfil"
              />
            )}
          </label>

          <div className="flex flex-col justify-evenly text-lg font-bold">
            <p>{user?.nome}</p>
            <p>{user?.email}</p>
          </div>
        </div>
        <label>Novo nome</label>
        <input
          type="text"
          name="name"
          className={`${
            darkMode
              ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
              : "border-zinc-200 bg-white text-[var(--primary-grey)]"
          } w-full p-2 rounded-md  border-2`}
          placeholder="Novo nome"
          value={nome!}
          onChange={(e) => setNome(e.target.value)}
        />
        {errorShow ? (
          <p className="text-orange text-sm font-bold">{errorNome}</p>
        ) : (
          <></>
        )}
        <label>Novo e-mail</label>
        <input
          type="text"
          name="email"
          className={`${
            darkMode
              ? "border-zinc-700 bg-[var(--primary-grey)] text-white"
              : "border-zinc-200 bg-white text-[var(--primary-grey)]"
          } w-full p-2 rounded-md  border-2 cursor-not-allowed`}
          placeholder="Novo email"
          value={user?.email}
          disabled
        />
        <div className="max-w-[400px]  flex justify-between gap-2 flex-wrap items-center">
          <button type="submit" className="button-orange flex-1">
            Atualizar informações
          </button>
          <button
            onClick={handleResetEmail}
            type="button"
            className="button-orange flex-1"
          >
            Redefinir senha
          </button>
        </div>
      </form>
    </div>
  );
}
