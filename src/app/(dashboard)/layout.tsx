"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, CalendarDays, MessageSquare, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Citas", href: "/citas", icon: CalendarDays },
  { name: "Mensajes", href: "/mensajes", icon: MessageSquare },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Wrench className="h-5 w-5 text-amber-500" />
          <span className="text-lg font-bold tracking-tight">FIXA</span>
          <span className="text-xs text-muted-foreground">CORE</span>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {children}
      </main>

      {/* Bottom nav — mobile first */}
      <nav className="sticky bottom-0 border-t border-border bg-card">
        <div className="mx-auto flex max-w-2xl">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  isActive
                    ? "text-amber-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
