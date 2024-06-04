import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}
export default function Container({ children }: ContainerProps) {
  return (
    <div
      className="w-full flex flex-col bg-white border-l shadowblack border-zinc-200  rounded-r-lg  p-3 gap-6 overflow-auto"
      style={{ height: "calc(100vh - 32px)" }}
    >
      {children}
    </div>
  );
}
