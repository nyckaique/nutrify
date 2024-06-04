import { ReactNode, useContext } from "react";
import { Context } from "../context";

interface ContainerProps {
  children: ReactNode;
}
export default function Container({ children }: ContainerProps) {
  const { darkMode } = useContext(Context)!;
  return (
    <div
      className={` ${
        darkMode
          ? "bg-[var(--primary-grey)] text-white border-zinc-700"
          : "bg-white border-zinc-20 text-[var(--primary-grey)]"
      } w-full flex flex-col border-l shadowblack   rounded-r-lg  p-3 gap-6 overflow-auto`}
      style={{ height: "calc(100vh - 32px)" }}
    >
      {children}
    </div>
  );
}
