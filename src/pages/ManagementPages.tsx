import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { AdminPage } from "./admin/AdminPage";
import { VendedorPage } from "./VendedorPage";

export function RutaUsuario({
  children,
}: {
  children: ReactNode;
}) {
  const { usuarioActual } = useStore();

  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function RutaPersonal({ children }: { children: ReactNode }) {
  const { usuarioActual } = useStore();
  if (!usuarioActual) return <Navigate to="/login" replace />;
  if (usuarioActual.rol === "cliente") return <Navigate to="/catalogo" replace />;
  return <>{children}</>;
}

export function Gestion() {
  const { usuarioActual } = useStore();
  return usuarioActual?.rol === "administrador" ? (
    <AdminPage />
  ) : (
    <VendedorPage />
  );
}
