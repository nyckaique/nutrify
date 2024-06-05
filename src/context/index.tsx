import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useState, useEffect, ReactNode } from "react";
import { auth, db, storage } from "../firebase/firebaseConnection";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteObject, ref } from "firebase/storage";

export interface ProviderProps {
  children: ReactNode;
}
interface ContextType {
  signed: boolean;
  user: User | undefined | null;
  setUser: (user: User) => void;
  signup: (nome: string, email: string, senha: string) => Promise<void>;
  signin: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  storageUser: (data: {
    uid: string;
    nome: string;
    email: string;
    avatarUrl: string | null;
  }) => void;
  cadastrarPaciente: (
    name: string,
    telefone: string,
    dataNascimento: Date,
    peso: number,
    altura: number,
    convenio: string,
    codigoConvenio?: string
  ) => Promise<void>;
  pacientes: PacienteResumo[] | undefined;
  loadPacientes: (uid: string) => Promise<void>;
  deletarPaciente: (id: string) => Promise<void>;
  loadPaciente: (id: string) => Promise<void>;
  paciente: Paciente | undefined;
  formatarTelefone: (num: string) => string;
  novaConsulta: (
    data: string,
    peso: number,
    notas: string,
    indexHistorico?: number
  ) => Promise<void>;
  excluirConsulta: (indexHistorico: number) => Promise<void>;
  atualizarPaciente: (
    name: string,
    telefone: string,
    dataNascimento: string,
    peso: number,
    altura: number,
    convenio: string,
    codigoConvenio?: string
  ) => Promise<void>;
  excluirPlano: (indexPlano: number, filePath: string) => Promise<void>;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkmode: boolean) => void;
}
export interface PacienteResumo {
  id: string;
  nome: string;
  ultimaConsulta: string;
  telefone: string;
}
export interface Paciente {
  id: string;
  userId: string;
  nome: string;
  altura: number;
  peso: number;
  dataNascimento: string;
  telefone: string;
  convenio: string;
  codigoConvenio: string;
  exames: [{ data: string; fileName: string; urlFile: string; id: string }];
  historico: [{ data: string; peso: number; notas: string }];
  planos: [{ data: string; fileName: string; urlFile: string; id: string }];
  receitas: [{ data: string; fileName: string; urlFile: string; id: string }];
}
export interface User {
  uid: string;
  nome: string;
  email: string;
  avatarUrl: string | null;
}

export const Context = createContext<ContextType | undefined>(undefined);
export default function Provider({ children }: ProviderProps) {
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);
  const [pacientes, setPacientes] = useState<PacienteResumo[]>();
  const [paciente, setPaciente] = useState<Paciente>();
  const [expanded, setExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem("@nutrifyUser");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function signup(nome: string, email: string, senha: string) {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        const uid = value.user.uid;
        await setDoc(doc(db, "users", uid), {
          nome: nome,
          avatarUrl: null,
        }).then(() => {
          const data = {
            uid: uid,
            nome: nome,
            email: value.user.email!,
            avatarUrl: null,
          };
          setUser(data);
          storageUser(data);
          toast.success("Cadastro feio com sucesso");
          navigate("/home");
        });
      })
      .catch(() => {
        toast.error("Cadastro deu erro");
      });
  }

  async function signin(email: string, senha: string) {
    await signInWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        const uid = value.user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const data = {
          uid: uid,
          nome: docSnap.data()?.nome,
          email: value.user.email!,
          avatarUrl: docSnap.data()?.avatarUrl,
        };
        setUser(data);
        storageUser(data);
        loadPacientes(uid);
        toast.success("Login feio com sucesso");
        navigate("/home");
      })
      .catch(() => {
        toast.error("Login deu erro");
      });
  }

  function storageUser(data: {
    uid: string;
    nome: string;
    email: string;
    avatarUrl: string | null;
  }) {
    localStorage.setItem("@nutrifyUser", JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@nutrifyUser");
    setUser(null);
  }

  async function cadastrarPaciente(
    name: string,
    telefone: string,
    dataNascimento: Date,
    peso: number,
    altura: number,
    convenio: string,
    codigoConvenio: string = ""
  ) {
    await addDoc(collection(db, "pacientes"), {
      userId: user!.uid,
      nomePaciente: name,
      telefone: telefone,
      dataNascimento: dataNascimento,
      peso: peso,
      altura: altura,
      convenio: convenio,
      codigoConvenio: codigoConvenio,
      historico: [],
      planos: [],
      receitas: [],
      exames: [],
    })
      .then(() => {
        toast.success("Paciente cadastrado com sucesso!");
      })
      .catch(() => {
        toast.error("Não foi possível realizar o cadastro no momento");
      });
  }
  function ordenar(a: PacienteResumo, b: PacienteResumo) {
    if (a.nome < b.nome) {
      return -1;
    }
    if (a.nome > b.nome) {
      return 1;
    }
    return 0;
  }

  async function loadPacientes(uid: string) {
    const docsRef = collection(db, "pacientes");
    const q = query(docsRef, where("userId", "==", uid));
    onSnapshot(q, (snapshot) => {
      const lista: PacienteResumo[] = [];
      snapshot.forEach((doc) => {
        const historico = doc.data().historico;
        const ultimaConsulta =
          historico && historico.length > 0
            ? historico[historico.length - 1].data
            : "nenhuma consulta";
        lista.push({
          id: doc.id,
          nome: doc.data().nomePaciente,
          ultimaConsulta: ultimaConsulta,
          telefone: doc.data().telefone,
        });
      });
      lista.sort(ordenar);
      setPacientes(lista);
    });
  }

  async function deletarPaciente(id: string) {
    const docRef = doc(db, "pacientes", id);
    await deleteDoc(docRef)
      .then(() => {
        toast.success("Deletado com sucesso!");
      })
      .catch(() => {
        toast.error("Não foi possível deletar!");
      });
  }

  async function loadPaciente(id: string) {
    const docRef = doc(db, "pacientes", id);
    onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const paciente: Paciente = {
          id: id,
          userId: snapshot.data().userId,
          nome: snapshot.data().nomePaciente,
          altura: snapshot.data().altura,
          peso: snapshot.data().peso,
          dataNascimento: snapshot.data().dataNascimento,
          telefone: snapshot.data().telefone,
          convenio: snapshot.data().convenio,
          codigoConvenio: snapshot.data().codigoConvenio,
          exames: snapshot.data().exames,
          historico: snapshot.data().historico,
          planos: snapshot.data().planos,
          receitas: snapshot.data().receitas,
        };
        setPaciente(paciente);
      }
    });
  }

  function formatarTelefone(num: string): string {
    const numero = num.replace(/\D/g, "");
    if (numero.length === 10) {
      return numero.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (numero.length === 11) {
      return numero.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else {
      return "Número inválido";
    }
  }

  async function novaConsulta(
    data: string,
    peso: number,
    notas: string,
    indexHistorico?: number
  ) {
    const docRef = doc(db, "pacientes", paciente!.id);
    if (indexHistorico !== undefined && indexHistorico >= 0) {
      const novoHistorico = [...paciente!.historico];
      novoHistorico[indexHistorico] = { data, peso, notas };

      await updateDoc(docRef, {
        ...paciente,
        historico: novoHistorico,
      })
        .then(() => {
          toast.success("Consulta atualizada com sucesso");
        })
        .catch(() => {
          toast.error("Não foi possível concluir a operação no momento");
        });
    } else {
      await updateDoc(docRef, {
        ...paciente,
        historico: [...paciente!.historico, { data, peso, notas }],
      })
        .then(() => {
          toast.success("Consulta adicionada com sucesso");
        })
        .catch(() => {
          toast.error("Não foi possível concluir a operação no momento");
        });
    }
  }

  async function excluirConsulta(indexHistorico: number) {
    const docRef = doc(db, "pacientes", paciente!.id);
    const novoHistorico = paciente!.historico.filter(
      (_, index) => index !== indexHistorico
    );
    try {
      await updateDoc(docRef, {
        ...paciente,
        historico: novoHistorico,
      });
      toast.success("Consulta excluída com sucesso");
    } catch (error) {
      toast.error("Não foi possível concluir a operação no momento");
    }
  }

  async function atualizarPaciente(
    name: string,
    telefone: string,
    dataNascimento: string,
    peso: number,
    altura: number,
    convenio: string,
    codigoConvenio: string = ""
  ) {
    const docRef = doc(db, "pacientes", paciente!.id);
    await updateDoc(docRef, {
      ...paciente,
      nomePaciente: name,
      telefone: telefone,
      dataNascimento: dataNascimento,
      peso: peso,
      altura: altura,
      convenio: convenio,
      codigoConvenio: codigoConvenio,
    })
      .then(() => {
        toast.success("Atualizado com sucesso");
      })
      .catch(() => {
        toast.error("Não foi possível atualizar os dados do paciente");
      });
  }

  async function excluirPlano(indexPlano: number, filePath: string) {
    const docRef = doc(db, "pacientes", paciente!.id);
    const fileRef = ref(storage, filePath);
    const novoPlano = paciente!.planos.filter(
      (_, index) => index !== indexPlano
    );
    try {
      await updateDoc(docRef, {
        ...paciente,
        planos: novoPlano,
      });
      await deleteObject(fileRef);
      toast.success("Plano excluído com sucesso");
    } catch (error) {
      toast.error("Não foi possível concluir a operação no momento");
    }
  }

  return (
    <Context.Provider
      value={{
        signed: !!user,
        user,
        setUser,
        signup,
        signin,
        logout,
        loading,
        storageUser,
        cadastrarPaciente,
        pacientes,
        loadPacientes,
        deletarPaciente,
        loadPaciente,
        paciente,
        formatarTelefone,
        novaConsulta,
        excluirConsulta,
        atualizarPaciente,
        excluirPlano,
        expanded,
        setExpanded,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </Context.Provider>
  );
}
