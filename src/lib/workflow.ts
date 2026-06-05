import { Package, Search, FileText, CheckCircle, Wrench, Clock, CircleCheck, Truck } from "lucide-react";

// All possible phases (DB state name → display config)
export const allPhases = [
  { id: "recibido", label: "Recibidos", icon: Package, color: "bg-stone-500", bg: "bg-white", border: "border-stone-200", always: true },
  { id: "diagnostico", label: "Diagnóstico", icon: Search, color: "bg-blue-500", bg: "bg-blue-50/50", border: "border-blue-200", always: false },
  { id: "presupuestado", label: "Presupuestado", icon: FileText, color: "bg-amber-500", bg: "bg-amber-50/50", border: "border-amber-200", always: false },
  { id: "aprobado", label: "Aprobado", icon: CheckCircle, color: "bg-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-200", always: false },
  { id: "en_reparacion", label: "En reparación", icon: Wrench, color: "bg-orange-500", bg: "bg-orange-50/50", border: "border-orange-200", always: false },
  { id: "esperando_recambio", label: "Esp. recambio", icon: Clock, color: "bg-red-500", bg: "bg-red-50/50", border: "border-red-200", always: false },
  { id: "listo", label: "Finalizado", icon: CircleCheck, color: "bg-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-200", always: true },
  { id: "entregado", label: "Entregado", icon: Truck, color: "bg-stone-400", bg: "bg-stone-50/50", border: "border-stone-200", always: false },
] as const;

// Preset templates
export const workflowPresets: Record<string, { label: string; phases: string[] }> = {
  simple: {
    label: "Simple",
    phases: ["recibido", "presupuestado", "en_reparacion", "listo", "entregado"],
  },
  completo: {
    label: "Completo",
    phases: ["recibido", "presupuestado", "esperando_recambio", "en_reparacion", "listo", "entregado"],
  },
};

// Get active phases from taller config
export function getActivePhases(flujoTaller: any): string[] {
  if (!flujoTaller) return workflowPresets.simple.phases;
  if (typeof flujoTaller === "string") {
    return workflowPresets[flujoTaller]?.phases || workflowPresets.simple.phases;
  }
  if (Array.isArray(flujoTaller)) return flujoTaller;
  return workflowPresets.simple.phases;
}

// Get the column config for active phases
export function getKanbanColumns(activePhases: string[]) {
  return allPhases.filter((p) => activePhases.includes(p.id));
}

// Get valid next states for a given state within active phases
export function getNextStates(currentState: string, activePhases: string[]): string[] {
  const idx = activePhases.indexOf(currentState);
  if (idx === -1) return [];

  const next: string[] = [];
  // Forward: next phase in the workflow
  if (idx < activePhases.length - 1) {
    next.push(activePhases[idx + 1]);
  }
  // Always allow cancel
  next.push("cancelado");
  return next;
}

// Get valid previous states
export function getPrevStates(currentState: string, activePhases: string[]): string[] {
  const idx = activePhases.indexOf(currentState);
  if (idx <= 0) return [];
  // Can go back to previous phase
  return [activePhases[idx - 1]];
}

// Map a state to its kanban column (for states that aren't active columns, find nearest)
export function getColumnForState(estado: string, activePhases: string[]): string {
  if (activePhases.includes(estado)) return estado;
  // Find nearest active phase
  const allIds = allPhases.map((p) => p.id as string);
  const stateIdx = allIds.indexOf(estado);
  // Look backward for the nearest active phase
  for (let i = stateIdx; i >= 0; i--) {
    if (activePhases.includes(allIds[i])) return allIds[i];
  }
  return activePhases[0];
}
