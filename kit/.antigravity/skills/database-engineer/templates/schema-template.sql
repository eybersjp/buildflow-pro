-- Database Schema Template
-- BuildFlow Pro — Database Engineer Skill
-- Replace [app_name], [table_name] with actual values

-- ═══════════════════════════════════════════
-- EXTENSION SETUP
-- ═══════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════
-- TENANTS TABLE
-- ═══════════════════════════════════════════
CREATE TABLE tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- PROFILES TABLE (extends Supabase auth.users)
-- ═══════════════════════════════════════════
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('super_admin', 'admin', 'manager', 'member', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ═══════════════════════════════════════════
-- EXAMPLE BUSINESS TABLE
-- Replace with your actual business entities
-- ═══════════════════════════════════════════
CREATE TABLE [table_name]s (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'active',
  created_by    UUID NOT NULL REFERENCES profiles(id),
  updated_by    UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ -- soft delete
);

CREATE INDEX idx_[table_name]s_tenant_id ON [table_name]s(tenant_id);
CREATE INDEX idx_[table_name]s_status ON [table_name]s(tenant_id, status);
CREATE INDEX idx_[table_name]s_created_at ON [table_name]s(tenant_id, created_at DESC);

-- ═══════════════════════════════════════════
-- AUDIT LOG TABLE (Required for production)
-- ═══════════════════════════════════════════
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  actor_id    UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID NOT NULL,
  action      TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'publish', 'approve', 'reject')),
  changes     JSONB,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id, created_at DESC);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id, created_at DESC);

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view profiles in their tenant"
  ON profiles FOR SELECT
  USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Business Table
ALTER TABLE [table_name]s ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tenant records"
  ON [table_name]s FOR SELECT
  USING (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    AND deleted_at IS NULL
  );

CREATE POLICY "Users can create records in their tenant"
  ON [table_name]s FOR INSERT
  WITH CHECK (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their tenant records"
  ON [table_name]s FOR UPDATE
  USING (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER [table_name]s_updated_at
  BEFORE UPDATE ON [table_name]s
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════
-- ROLLBACK (save in database/rollback/)
-- ═══════════════════════════════════════════
-- DROP TABLE IF EXISTS audit_log;
-- DROP TABLE IF EXISTS [table_name]s;
-- DROP TABLE IF EXISTS profiles;
-- DROP TABLE IF EXISTS tenants;
