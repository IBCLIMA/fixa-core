import { LifeBuoy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDb } from "@/db";
import { feedback } from "@/db/schema";
import { desc } from "drizzle-orm";
import { FeedbackList } from "../feedback-list";

export const metadata = {
  title: "Soporte · FIXA Admin",
};

export default async function SoportePage() {
  const db = getDb();

  const feedbackList = await db.select().from(feedback).orderBy(desc(feedback.createdAt)).limit(100);
  const feedbackNuevos = feedbackList.filter((f) => f.estado === "nuevo").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <LifeBuoy className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Soporte</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sugerencias, incidencias y consultas de los talleres</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Buzón de feedback
            {feedbackNuevos > 0 && (
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">{feedbackNuevos} nuevo{feedbackNuevos > 1 ? "s" : ""}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackList items={feedbackList} />
        </CardContent>
      </Card>
    </div>
  );
}
