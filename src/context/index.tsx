import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "../firebase/firebaseConnection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export interface ProviderProps {
  children: ReactNode;
}
interface ContextType {
  signed: boolean;
  user: user | undefined | null;
  setUser: (user: user) => void;
  signup: (nome: string, email: string, senha: string) => void;
  signin: (email: string, senha: string) => void;
  logout: () => void;
  loading: boolean;
}
export interface user {
  uid: string;
  nome: string;
  email: string;
  avatarUrl: string | null;
}

export const Context = createContext<ContextType | undefined>(undefined);
export default function Provider({ children }: ProviderProps) {
  const [user, setUser] = useState<user | null>();
  const [loading, setLoading] = useState(true);
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
      .catch((error) => {
        console.log(error);
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
        toast.success("Login feio com sucesso");
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
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
      }}
    >
      {children}
    </Context.Provider>
  );
}
