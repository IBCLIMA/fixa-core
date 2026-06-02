import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const checks: Record<string, "ok" | "error"> = {
    db: "error",
    auth: "error",
    storage: "error",
  };

  // Check database connection
  try {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      await sql`SELECT 1`;
      checks.db = "ok";
    }
  } catch (e) {
    console.error("Health check - DB error:", e);
  }

  // Check Clerk auth service
  if (process.env.CLERK_SECRET_KEY) {
    checks.auth = "ok";
  }

  // Check Vercel Blob storage
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    checks.storage = "ok";
  }

  const allOk = Object.values(checks).every((v) => v === "ok");
  const status = allOk ? "ok" : "degraded";
  const timestamp = new Date().toISOString();

  // Only return detailed infrastructure info if the health check secret matches
  const showDetails = request.headers.get("x-health-secret") === process.env.HEALTH_CHECK_SECRET;
  if (showDetails) {
    return NextResponse.json(
      { status, checks, timestamp },
      { status: allOk ? 200 : 503 }
    );
  } else {
    return NextResponse.json(
      { status, timestamp },
      { status: allOk ? 200 : 503 }
    );
  }
}
