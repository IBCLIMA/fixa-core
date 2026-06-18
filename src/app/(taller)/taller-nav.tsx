"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, ClipboardList, CalendarDays, Users, MoreHorizontal,
  FileText, Receipt, Bell, Settings, Megaphone, Upload, HelpCircle, Shield, FileCheck,
  ChevronLeft, Columns3, BarChart3,
} from "lucide-react";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BusquedaGlobal } from "./busqueda-global";
import { NotificationsBell } from "./notifications-bell";
import { TrialBanner } from "./trial-banner";
import type { RolUsuario } from "@/lib/auth";

// ─── Navigation structure ───────────────────────────────

const mainNav = [
  { name: "Panel", href: "/", icon: LayoutDashboard },
  { name: "Taller", href: "/taller-board", icon: Columns3 },
  { name: "Ordenes", href: "/ordenes", icon: ClipboardList },
  { name: "Agenda", href: "/calendario", icon: CalendarDays },
  { name: "Clientes", href: "/clientes", icon: Users },
];

const gestionNav = [
  { name: "Presupuestos", href: "/presupuestos", icon: FileText, roles: ["admin", "mecanico", "recepcion"] },
  { name: "Documentos", href: "/documentos", icon: FileCheck, roles: ["admin", "recepcion"] },
  { name: "Facturacion", href: "/facturacion", icon: Receipt, roles: ["admin", "recepcion"] },
  { name: "Avisos", href: "/avisos", icon: Bell, roles: ["admin", "mecanico", "recepcion"] },
  { name: "Ofertas", href: "/ofertas", icon: Megaphone, roles: ["admin", "recepcion"] },
  { name: "Métricas", href: "/metricas", icon: BarChart3, roles: ["admin"] },
];

const adminNav = [
  { name: "Equipo", href: "/equipo", icon: Users, roles: ["admin"] },
  { name: "Importar", href: "/importar", icon: Upload, roles: ["admin", "recepcion"] },
  { name: "Configuracion", href: "/configuracion", icon: Settings, roles: ["admin"] },
];

// Mobile bottom nav only shows the 4 main items
const mobileNav = mainNav;

const SIDEBAR_COLLAPSED_KEY = "fixa-sidebar-collapsed";

export function TallerNav({ children, rol }: { children: React.ReactNode; rol: RolUsuario }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored === "true") setCollapsed(true);
    } catch {}
  }, []);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
    } catch {}
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const filteredGestion = gestionNav.filter((t) => t.roles.includes(rol));
  const filteredAdmin = adminNav.filter((t) => t.roles.includes(rol));

  // All items for mobile "More" dropdown
  const moreItems = [...filteredGestion, ...filteredAdmin];

  return (
    <div className="flex min-h-[100dvh] flex-col antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <TrialBanner />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm shadow-black/[0.04]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-14">
          <Link href="/">
            <FixaLogo size="sm" />
          </Link>
          <BusquedaGlobal />
          <div className="flex items-center gap-2">
            <div className="transition-transform duration-200 hover:scale-105">
              <NotificationsBell />
            </div>
            <div className="transition-transform duration-200 hover:scale-105">
              <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 rounded-xl" } }} />
            </div>
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <aside
          className={cn(
            "hidden lg:flex shrink-0 flex-col bg-white/50 py-4 transition-all duration-300 ease-in-out relative",
            collapsed ? "w-16 px-2" : "w-56 px-3"
          )}
          style={{ borderRight: "1px solid rgba(120, 113, 108, 0.08)" }}
        >
          {/* Main section */}
          <div className="space-y-0.5">
            {mainNav.map((tab) => (
              <SidebarLink key={tab.href} tab={tab} active={isActive(tab.href)} collapsed={collapsed} />
            ))}
          </div>

          {/* Gestion section */}
          {filteredGestion.length > 0 && (
            <>
              <div className="my-3 h-px bg-stone-200/30" />
              {!collapsed && (
                <div className="flex items-center gap-1.5 px-3 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Gestion</p>
                </div>
              )}
              <div className="space-y-0.5">
                {filteredGestion.map((tab) => (
                  <SidebarLink key={tab.href} tab={tab} active={isActive(tab.href)} collapsed={collapsed} />
                ))}
              </div>
            </>
          )}

          {/* Admin section */}
          {filteredAdmin.length > 0 && (
            <>
              <div className="my-3 h-px bg-stone-200/30" />
              {!collapsed && (
                <div className="flex items-center gap-1.5 px-3 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Ajustes</p>
                </div>
              )}
              <div className="space-y-0.5">
                {filteredAdmin.map((tab) => (
                  <SidebarLink key={tab.href} tab={tab} active={isActive(tab.href)} collapsed={collapsed} />
                ))}
              </div>
            </>
          )}

          {/* Help at bottom */}
          <div className="mt-auto pt-3">
            <div className="h-px bg-stone-200/30 mb-3" />
            <SidebarLink
              tab={{ name: "Ayuda", href: "/ayuda", icon: HelpCircle }}
              active={isActive("/ayuda")}
              collapsed={collapsed}
              showDot="emerald"
            />
          </div>

          {/* Collapse toggle */}
          <button
            onClick={toggleCollapsed}
            className="mt-2 flex items-center justify-center h-8 w-8 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all duration-200 self-center"
            aria-label={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1 px-4 py-5 pb-24 lg:px-8 lg:py-6 lg:pb-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="mx-auto max-w-lg px-3 pb-2">
          <div className="flex rounded-2xl bg-white/95 backdrop-blur-xl border border-stone-200/60 shadow-lg shadow-black/[0.04] p-1">
            {mobileNav.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] py-2 rounded-xl text-[10px] font-bold transition-all duration-200",
                    active
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-400 active:bg-stone-100"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </Link>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] py-2 rounded-xl text-[10px] font-bold text-stone-400 active:bg-stone-100 transition-all duration-200 cursor-pointer">
                  <MoreHorizontal className="h-5 w-5" />
                  Mas
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                {moreItems.map((tab) => (
                  <DropdownMenuItem key={tab.href} asChild>
                    <Link href={tab.href} className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />{tab.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/ayuda" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />Ayuda
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  );
}

function SidebarLink({
  tab,
  active,
  collapsed,
  showDot,
}: {
  tab: { name: string; href: string; icon: any };
  active: boolean;
  collapsed: boolean;
  showDot?: "emerald" | "orange";
}) {
  return (
    <Link
      href={tab.href}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center px-2" : "px-3",
        active
          ? "bg-stone-100 text-stone-900 font-semibold"
          : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
      )}
      title={collapsed ? tab.name : undefined}
    >
      {/* Left accent bar for active state */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-orange-500" />
      )}

      {/* Icon with optional active background */}
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-200 shrink-0",
          active
            ? "bg-orange-500/10 text-orange-600"
            : "text-stone-400 group-hover:text-stone-600"
        )}
      >
        <tab.icon className="h-4 w-4" />
      </span>

      {/* Text - animate opacity for collapse */}
      <span
        className={cn(
          "truncate transition-all duration-300",
          collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
        )}
      >
        {tab.name}
      </span>

      {/* Optional dot indicator */}
      {showDot && !collapsed && (
        <span
          className={cn(
            "ml-auto h-2 w-2 rounded-full shrink-0",
            showDot === "emerald" && "bg-emerald-500 shadow-sm shadow-emerald-500/50",
            showDot === "orange" && "bg-orange-500 shadow-sm shadow-orange-500/50"
          )}
        />
      )}
      {showDot && collapsed && (
        <span
          className={cn(
            "absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full",
            showDot === "emerald" && "bg-emerald-500",
            showDot === "orange" && "bg-orange-500"
          )}
        />
      )}
    </Link>
  );
}
