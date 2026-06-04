import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCitasSemana } from "../actions/citas";
import { CalendarioView } from "./calendario-view";

function getWeekDates(baseDate?: string) {
  const now = baseDate ? new Date(baseDate + "T12:00:00") : new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }

  return {
    days,
    monday,
    start: days[0].toISOString().split("T")[0],
    end: days[6].toISOString().split("T")[0],
  };
}

function formatMondayParam(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ semana?: string }>;
}) {
  const params = await searchParams;
  const week = getWeekDates(params.semana);
  const citas = await getCitasSemana(week.start, week.end);

  // Calcular semanas anterior y siguiente
  const prevMonday = new Date(week.monday);
  prevMonday.setDate(prevMonday.getDate() - 7);
  const nextMonday = new Date(week.monday);
  nextMonday.setDate(nextMonday.getDate() + 7);

  // Detectar si es la semana actual
  const today = new Date();
  const currentWeek = getWeekDates();
  const isCurrentWeek = week.start === currentWeek.start;

  // Total citas de la semana
  const totalCitas = citas.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Calendario</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Organiza las citas de entrada de vehiculos.</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Semana del{" "}
            {week.days[0].toLocaleDateString("es-ES", { day: "numeric", month: "long" })} al{" "}
            {week.days[6].toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/calendario?semana=${formatMondayParam(prevMonday)}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          {!isCurrentWeek ? (
            <Link
              href="/calendario"
              className="flex h-10 items-center rounded-xl bg-brand px-4 text-white text-sm font-bold hover:bg-brand/90 transition-all duration-200 shadow-sm shadow-brand/20"
            >
              Hoy
            </Link>
          ) : (
            <span className="flex h-10 items-center rounded-xl bg-brand/10 px-4 text-brand text-sm font-bold">
              Esta semana
            </span>
          )}
          <Link
            href={`/calendario?semana=${formatMondayParam(nextMonday)}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-all duration-200 hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <CalendarioView days={week.days.map((d) => d.toISOString())} citas={citas} totalCitas={totalCitas} />
    </div>
  );
}
