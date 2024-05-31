import { useContext } from "react";
import { Context } from "../context";
export default function Userbar() {
  const { user } = useContext(Context)!;
  return (
    <div className="flex items-center justify-between p-2 gap-2 rounded-lg bg-[var(--primary-orange)] min-w-[200px] w-fit h-[90px] shadowblack">
      <img
        src={user?.avatarUrl ? user.avatarUrl : "src/assets/avatar.png"}
        alt=""
        className="w-[74px] h-auto object-cover p-0 rounded-[50%] aspect-square"
      />
      <p className="font-bold text-xl text-white">Bem vindo {user?.nome}!</p>
    </div>
  );
}
