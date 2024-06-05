// ToasterComponent.tsx
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Context } from "../context";

export default function ToasterComponent() {
  const { darkMode } = useContext(Context)!;

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 5000,
        style: {
          background: darkMode ? "#000" : "#fff",
          color: "var(--primary-orange)",
        },
      }}
    />
  );
}
