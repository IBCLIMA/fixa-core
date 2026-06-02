import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getDb } from "@/db";
import { fotosOrden } from "@/db/schema";
import { eq, and, lt, sql } from "drizzle-orm";

// Runs daily via Vercel Cron - deletes videos older than 60 days
// Photos are kept permanently (useful for claims/disputes)

const VIDEO_RETENTION_DAYS = 60;

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - VIDEO_RETENTION_DAYS);

  // Find old videos
  const oldVideos = await db
    .select({ id: fotosOrden.id, url: fotosOrden.url })
    .from(fotosOrden)
    .where(
      and(
        eq(fotosOrden.esVideo, true),
        lt(fotosOrden.createdAt, cutoffDate)
      )
    );

  if (oldVideos.length === 0) {
    return NextResponse.json({ deleted: 0, message: "No old videos to clean up" });
  }

  // Delete from Vercel Blob
  let deletedCount = 0;
  for (const video of oldVideos) {
    try {
      await del(video.url);
      deletedCount++;
    } catch {
      // Blob may already be deleted - continue
    }
  }

  // Delete records from DB
  const videoIds = oldVideos.map((v) => v.id);
  await db
    .delete(fotosOrden)
    .where(
      and(
        eq(fotosOrden.esVideo, true),
        lt(fotosOrden.createdAt, cutoffDate)
      )
    );

  console.log(`[CRON] Cleaned up ${deletedCount} videos older than ${VIDEO_RETENTION_DAYS} days`);

  return NextResponse.json({
    deleted: deletedCount,
    total_found: oldVideos.length,
    retention_days: VIDEO_RETENTION_DAYS,
  });
}
