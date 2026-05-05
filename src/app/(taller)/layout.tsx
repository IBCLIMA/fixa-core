"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, ClipboardList, CalendarDays, Users, MoreHorizontal,
  Wrench, FileText, Receipt, Bell, Settings, Megaphone, BookOpen, Upload, HelpCircle, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BusquedaGlobal } from "./busqueda-global";
import { TrialBanner } from "./trial-banner";

const mainTabs = [
  { name: "Panel", href: "/", icon: LayoutDashboard },
  { name: "Órdenes", href: "/ordenes", icon: ClipboardList },
  { name: "Agenda", href: "/calendario", icon: CalendarDays },
  { name: "Clientes", href: "/clientes", icon: Users },
];

const moreTabs = [
  { name: "Presupuestos", href: "/presupuestos", icon: FileText },
  { name: "Facturación", href: "/facturacion", icon: Receipt },
  { name: "Avisos", href: "/avisos", icon: Bell },
  { name: "Ofertas", href: "/ofertas", icon: Megaphone },
  { name: "Equipo", href: "/equipo", icon: Users },
  { name: "Importar datos", href: "/importar", icon: Upload },
  { name: "Primeros pasos", href: "/primeros-pasos", icon: BookOpen },
  { name: "Admin", href: "/admin", icon: Shield },
  { name: "Ayuda", href: "/ayuda", icon: HelpCircle },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export default function TallerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <TrialBanner />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-stone-900">FIXA</span>
          </div>
          <BusquedaGlobal />
          <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 rounded-xl" } }} />
        </div>
      </header>

      {/* Desktop sidebar nav */}
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-1 border-r border-stone-200/60 bg-white/50 px-3 py-4">
          {[...mainTabs, ...moreTabs].map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </Link>
            );
          })}
        </aside>

        {/* Content */}
        <main className="flex-1 px-4 py-5 pb-24 lg:px-8 lg:py-6 lg:pb-6">{children}</main>
      </div>

      {/* WhatsApp flotante — soporte */}
      <a
        href="https://wa.me/34611433218?text=Hola%2C%20necesito%20ayuda%20con%20FIXA"
        target="_blank"
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:scale-110 transition-all duration-200"
        title="¿Necesitas ayuda? Escríbenos por WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="mx-auto max-w-lg px-3 pb-2">
          <div className="flex rounded-2xl bg-white/95 backdrop-blur-xl border border-stone-200/60 shadow-lg shadow-black/[0.04] p-1">
            {mainTabs.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 py-2.5 rounded-xl text-[10px] font-bold transition-all duration-200",
                    active
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-400 active:bg-stone-100"
                  )}
                >
                  <tab.icon className="h-[18px] w-[18px]" />
                  {tab.name}
                </Link>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-1 flex-col items-center gap-0.5 py-2.5 rounded-xl text-[10px] font-bold text-stone-400 active:bg-stone-100 transition-all duration-200">
                  <MoreHorizontal className="h-[18px] w-[18px]" />
                  Más
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                {moreTabs.map((tab) => (
                  <DropdownMenuItem key={tab.href} asChild>
                    <Link href={tab.href} className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />{tab.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  );
}
