"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, ClipboardList, CalendarDays, Users, MoreHorizontal,
  Wrench, FileText, Receipt, Bell, Settings, Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BusquedaGlobal } from "./busqueda-global";

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
