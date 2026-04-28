"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, MessageSquare, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Hoy", href: "/app/hoy", icon: CalendarDays },
  { name: "Clientes", href: "/app/clientes", icon: Users },
  { name: "Mensajes", href: "/app/mensajes", icon: MessageSquare },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-muted/30 antialiased">
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-xl px-5 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight">FIXA</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5">{children}</main>

      <nav className="sticky bottom-0 border-t border-border/50 bg-white/80 backdrop-blur-xl safe-bottom">
        <div className="mx-auto flex max-w-lg">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-3 text-[11px] font-semibold transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground active:text-foreground"
                )}
              >
                <tab.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
