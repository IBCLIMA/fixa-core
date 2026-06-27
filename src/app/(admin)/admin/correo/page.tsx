import { CorreoCliente } from "./correo-cliente";

export const metadata = {
  title: "Correo · FIXA Admin",
};

export default function CorreoPage() {
  // El guard de super-admin se aplica a nivel de layout en (admin)/admin/layout.tsx
  return <CorreoCliente />;
}
