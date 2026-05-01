"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Users,
  MoreHorizontal,
  Wrench,
  FileText,
  Receipt,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainTabs = [
  { name: "Hoy", href: "/", icon: LayoutDashboard },
  { name: "Órdenes", href: "/ordenes", icon: ClipboardList },
  { name: "Calendario", href: "/calendario", icon: CalendarDays },
  { name: "Clientes", href: "/clientes", icon: Users },
];

const moreTabs = [
  { name: "Presupuestos", href: "/presupuestos", icon: FileText },
  { name: "Facturación", href: "/facturacion", icon: Receipt },
  { name: "Avisos", href: "/avisos", icon: Bell },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export default function TallerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background antialiased">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl px-4 py-2.5 sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand shadow-md shadow-brand/20">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight">
              FIXA
            </span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 pb-24 lg:pb-5">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-bottom">
        <div className="mx-auto max-w-lg px-3 pb-2">
          <div className="flex rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-lg p-1">
            {mainTabs.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition-all duration-200",
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground active:bg-muted"
                  )}
                >
                  <tab.icon className="h-[18px] w-[18px]" />
                  {tab.name}
                </Link>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-1 flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-bold text-muted-foreground active:bg-muted transition-all duration-200">
                  <MoreHorizontal className="h-[18px] w-[18px]" />
                  Más
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreTabs.map((tab) => (
                  <DropdownMenuItem key={tab.name} asChild>
                    <Link
                      href={tab.href}
                      className="flex items-center gap-2"
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Sidebar — desktop (futuro, por ahora solo bottom nav) */}
    </div>
  );
}
