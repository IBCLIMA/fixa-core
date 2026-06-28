"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, Receipt, BarChart3, Activity, LifeBuoy, Mail, ScrollText, Shield, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Resumen", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Talleres", href: "/admin/talleres", icon: Building2 },
  { name: "Cobros", href: "/admin/cobros", icon: Receipt },
  { name: "Métricas", href: "/admin/metricas", icon: BarChart3 },
  { name: "Actividad", href: "/admin/actividad", icon: Activity },
  { name: "Soporte", href: "/admin/soporte", icon: LifeBuoy, badgeKey: "soporte" as const },
  { name: "Correo", href: "/admin/correo", icon: Mail, badgeKey: "correo" as const },
  { name: "Auditoría", href: "/admin/auditoria", icon: ScrollText },
];

export function AdminNav({ soporteNuevos = 0 }: { soporteNuevos?: number }) {
  const pathname = usePathname();
  const [correoNuevos, setCorreoNuevos] = useState(0);

  // Sondeo ligero del nº de correos no leídos (IMAP STATUS) para el badge de Correo.
  // En cliente y cada 60s para no meter latencia de IMAP en cada carga de página.
  useEffect(() => {
    let activo = true;
    const cargar = () =>
      fetch("/api/admin/correo/no-leidos")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (activo && d) setCorreoNuevos(d.noLeidos ?? 0);
        })
        .catch(() => {});
    cargar();
    const id = setInterval(cargar, 60000);
    return () => {
      activo = false;
      clearInterval(id);
    };
  }, []);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(item.href, item.exact);
        const badge =
          item.badgeKey === "soporte" && soporteNuevos > 0
            ? soporteNuevos
            : item.badgeKey === "correo" && correoNuevos > 0
              ? correoNuevos
              : null;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-zinc-800/80 text-white"
                : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100"
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-red-500" />
            )}
            <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-red-400" : "text-zinc-500 group-hover:text-zinc-300")} />
            <span className="truncate">{item.name}</span>
            {badge !== null && (
              <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {badge}
              </span>
            )}
          </Link>
        );
      })}

      <div className="my-3 h-px bg-zinc-800" />

      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-800/40 hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <span>Volver a FIXA</span>
      </Link>
    </nav>
  );
}

export function AdminBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-900/30">
        <Shield className="h-5 w-5 text-white" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-extrabold tracking-tight text-white">FIXA <span className="text-zinc-500 font-bold">· Admin</span></p>
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Centro de mando</p>
      </div>
    </div>
  );
}
