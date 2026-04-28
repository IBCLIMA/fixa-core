"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Users, MessageSquare, Wrench, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Hoy", href: "/app/hoy", icon: CalendarDays },
  { name: "Clientes", href: "/app/clientes", icon: Users },
  { name: "Mensajes", href: "/app/mensajes", icon: MessageSquare },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[100dvh] flex-col antialiased" style={{ background: "linear-gradient(180deg, #f8f7f4 0%, #f1f0ed 100%)" }}>
      {/* Header premium */}
      <header className="relative z-10">
        <div className="mx-auto max-w-lg px-5">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
                <Wrench className="h-[18px] w-[18px] text-white" />
              </div>
              <div>
                <span className="text-[15px] font-extrabold tracking-tight block leading-none">FIXA</span>
                <span className="text-[10px] text-stone-400 font-medium">Panel de taller</span>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-stone-200/60">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-lg flex-1 px-5 pb-24">{children}</main>

      {/* Bottom nav — iOS style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="mx-auto max-w-lg px-4 pb-2">
          <div className="flex rounded-2xl bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-lg shadow-black/[0.04] p-1">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 py-2.5 rounded-xl text-[10px] font-bold transition-all duration-200",
                    isActive
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-400 active:bg-stone-100"
                  )}
                >
                  <tab.icon className="h-[18px] w-[18px]" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
