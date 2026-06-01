import { getDb } from "@/db";
import { auditLogs } from "@/db/schema";

type AuditAction = "create" | "read" | "update" | "delete" | "export" | "login";

export function logAudit(params: {
  tallerId: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
}): void {
  const db = getDb();

  // Fire-and-forget: don't block the critical path
  db.insert(auditLogs)
    .values({
      tallerId: params.tallerId,
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: params.details ?? null,
    })
    .then(() => {})
    .catch((err) => {
      console.error("[audit] Error logging audit entry:", err);
    });
}
