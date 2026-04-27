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
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Wrench className="h-5 w-5 text-amber-500" />
          <span className="text-lg font-extrabold tracking-tight">FIXA</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5">
        {children}
      </main>

      <nav className="sticky bottom-0 border-t border-border bg-card">
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
                    ? "text-amber-500"
                    : "text-muted-foreground active:text-foreground"
                )}
              >
                <tab.icon className="h-6 w-6" />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
