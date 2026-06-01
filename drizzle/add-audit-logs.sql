-- Audit log system for RGPD/LOPDGDD compliance
-- Tracks WHO accessed/modified WHAT data and WHEN

-- Create the enum type for audit actions
DO $$ BEGIN
  CREATE TYPE accion_audit AS ENUM ('create', 'read', 'update', 'delete', 'export', 'login');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  taller_id UUID NOT NULL REFERENCES talleres(id),
  user_id TEXT NOT NULL,
  action accion_audit NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Index for efficient querying by taller and date (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_audit_logs_taller_created ON audit_logs(taller_id, created_at DESC);
