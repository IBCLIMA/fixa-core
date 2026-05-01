import { CalendarDays } from "lucide-react";
import { getCitasSemana } from "../actions/citas";
import { CalendarioView } from "./calendario-view";

function getWeekDates() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }

  return {
    days,
    start: days[0].toISOString().split("T")[0],
    end: days[6].toISOString().split("T")[0],
  };
}

export default async function CalendarioPage() {
  const week = getWeekDates();
  const citas = await getCitasSemana(week.start, week.end);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Calendario</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Semana del{" "}
            {week.days[0].toLocaleDateString("es-ES", { day: "numeric", month: "long" })} al{" "}
            {week.days[6].toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      <CalendarioView days={week.days.map((d) => d.toISOString())} citas={citas} />
    </div>
  );
}
