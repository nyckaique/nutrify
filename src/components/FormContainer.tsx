import React from "react";

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  toggleForm: () => void;
  toggleText: string;
  acessoTeste?: boolean;
  preencherCamposTeste?: () => void;
}

export default function FormContainer({
  title,
  children,
  onSubmit,
  toggleForm,
  toggleText,
  acessoTeste,
  preencherCamposTeste,
}: FormContainerProps) {
  return (
    <div className="container-flex-col">
      <h2 className="font-bold text-orange mt-5">{title}</h2>
      <form onSubmit={onSubmit} className="container-flex-col">
        {children}
        <button type="submit" className="button-orange mx-auto mt-5">
          {title}
        </button>
        {acessoTeste && preencherCamposTeste && (
          <button
            type="button"
            className="mt-2 underline"
            onClick={preencherCamposTeste}
          >
            Acesso para Teste
          </button>
        )}
        <button
          type="button"
          className="mx-auto mt-2 underline"
          onClick={toggleForm}
        >
          {toggleText}
        </button>
      </form>
    </div>
  );
}
