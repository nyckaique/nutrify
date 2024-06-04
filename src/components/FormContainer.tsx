import React from "react";

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  toggleForm: () => void;
  toggleText: string;
}

export default function FormContainer({
  title,
  children,
  onSubmit,
  toggleForm,
  toggleText,
}: FormContainerProps) {
  return (
    <div className="container-flex-col">
      <h2 className="font-bold text-orange mt-5">{title}</h2>
      <form onSubmit={onSubmit} className="container-flex-col">
        {children}
        <button type="submit" className="button-orange mx-auto mt-5">
          {title}
        </button>
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
