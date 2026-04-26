"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, MessageSquare, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Hoy", href: "/hoy", icon: CalendarDays },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Mensajes", href: "/mensajes", icon: MessageSquare },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Header mínimo */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Wrench className="h-5 w-5 text-amber-500" />
          <span className="text-lg font-extrabold tracking-tight">FIXA</span>
          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
            CORE
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5">
        {children}
      </main>

      {/* Bottom nav — 3 botones grandes, usable con una mano */}
      <nav className="sticky bottom-0 border-t border-border bg-card safe-bottom">
        <div className="mx-auto flex max-w-lg">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3.5 text-xs font-semibold transition-colors",
                  isActive
                    ? "text-amber-500"
                    : "text-muted-foreground active:text-foreground"
                )}
              >
                <tab.icon className={cn("h-6 w-6", isActive && "fill-amber-500/20")} />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
