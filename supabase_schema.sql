-- 1. CREATE TENANTS TABLE
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    admin_password TEXT NOT NULL DEFAULT 'love',
    site_password TEXT NOT NULL DEFAULT 'love',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active',
    config JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES
DROP POLICY IF EXISTS "Allow public read access" ON tenants;
CREATE POLICY "Allow public read access" ON tenants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public write access" ON tenants;
CREATE POLICY "Allow public write access" ON tenants FOR ALL USING (true);
