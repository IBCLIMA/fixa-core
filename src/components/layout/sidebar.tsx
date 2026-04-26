"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  ClipboardList,
  FileText,
  Receipt,
  CalendarDays,
  Settings,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vehículos", href: "/vehiculos", icon: Car },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Órdenes", href: "/ordenes", icon: ClipboardList },
  { name: "Presupuestos", href: "/presupuestos", icon: FileText },
  { name: "Facturación", href: "/facturacion", icon: Receipt },
  { name: "Calendario", href: "/calendario", icon: CalendarDays },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Wrench className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight">Solcraft</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">Solcraft v0.1.0</p>
      </div>
    </aside>
  );
}
