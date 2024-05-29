import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context, ProviderProps } from "../context";

export function Private({ children }: ProviderProps) {
  const { signed, loading } = useContext(Context)!;
  if (loading) {
    return <div></div>;
  }
  if (!signed) {
    return <Navigate to="/" />;
  }
  return children;
}
