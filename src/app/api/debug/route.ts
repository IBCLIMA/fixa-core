import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check 1: Clerk auth
  try {
    const { userId } = await auth();
    checks.clerk = userId ? `OK (userId: ${userId.slice(0, 10)}...)` : "NO USER";
  } catch (e: any) {
    checks.clerk = `ERROR: ${e.message}`;
  }

  // Check 2: DATABASE_URL exists
  checks.database_url = process.env.DATABASE_URL ? "SET" : "MISSING";

  // Check 3: DB connection
  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT COUNT(*) as count FROM talleres`;
    checks.db_connection = `OK (${result[0].count} talleres)`;
  } catch (e: any) {
    checks.db_connection = `ERROR: ${e.message}`;
  }

  // Check 4: getTallerIdFromAuth
  try {
    const { getTallerIdFromAuth } = await import("@/lib/auth");
    const result = await getTallerIdFromAuth();
    checks.get_taller = `OK (tallerId: ${result.tallerId.slice(0, 8)}...)`;
  } catch (e: any) {
    checks.get_taller = `ERROR: ${e.message}`;
  }

  return NextResponse.json(checks, { status: 200 });
}
