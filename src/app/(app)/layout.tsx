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
    <div className="flex min-h-[100dvh] flex-col bg-background antialiased">
      <header className="border-b border-border/40 bg-card/70 backdrop-blur-lg px-5 py-3.5">
        <div className="mx-auto flex max-w-lg items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-base font-extrabold tracking-tight">FIXA</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-6">
        {children}
      </main>

      <nav className="sticky bottom-0 border-t border-border/40 bg-card/80 backdrop-blur-lg safe-bottom">
        <div className="mx-auto flex max-w-lg">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3.5 text-xs font-semibold transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
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
