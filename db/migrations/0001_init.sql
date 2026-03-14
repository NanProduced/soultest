PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  cover_url TEXT,
  price REAL DEFAULT 0.99,
  landing_visible INTEGER NOT NULL DEFAULT 1 CHECK (landing_visible IN (0, 1)),
  current_draft_version_id TEXT,
  current_published_version_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_versions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  schema_version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  config_json TEXT NOT NULL,
  source_manifest_json TEXT,
  release_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  UNIQUE (quiz_id, version)
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('single_product', 'bundle', 'promo', 'custom_scope')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  sales_channel TEXT DEFAULT 'xiaohongshu',
  purchase_url TEXT,
  intro_mode TEXT DEFAULT 'code_gate' CHECK (intro_mode IN ('code_gate', 'free_entry', 'hybrid')),
  landing_visible INTEGER NOT NULL DEFAULT 1 CHECK (landing_visible IN (0, 1)),
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_quizzes (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  access_json TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  UNIQUE (product_id, quiz_id)
);

CREATE TABLE IF NOT EXISTS code_batches (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  strategy_type TEXT NOT NULL CHECK (strategy_type IN ('single_product', 'bundle', 'promo', 'custom_scope')),
  code_prefix TEXT,
  code_length INTEGER NOT NULL DEFAULT 8,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'expired', 'revoked')),
  expires_at TEXT,
  policy_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS codes (
  code TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  expires_at TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (batch_id) REFERENCES code_batches(id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  quiz_version_id TEXT NOT NULL,
  product_id TEXT,
  code TEXT,
  result_key TEXT,
  score_json TEXT,
  duration_sec INTEGER,
  shared INTEGER NOT NULL DEFAULT 0 CHECK (shared IN (0, 1)),
  client_info_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  FOREIGN KEY (quiz_version_id) REFERENCES quiz_versions(id),
  FOREIGN KEY (code) REFERENCES codes(code)
);

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quizzes_status_landing ON quizzes(status, landing_visible);
CREATE INDEX IF NOT EXISTS idx_quiz_versions_quiz_status ON quiz_versions(quiz_id, status);
CREATE INDEX IF NOT EXISTS idx_products_status_landing ON products(status, landing_visible);
CREATE INDEX IF NOT EXISTS idx_product_quizzes_product_sort ON product_quizzes(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_code_batches_product_status ON code_batches(product_id, status);
CREATE INDEX IF NOT EXISTS idx_codes_batch_status ON codes(batch_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_quiz_created_at ON submissions(quiz_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_code_created_at ON submissions(code, created_at DESC);

CREATE TRIGGER IF NOT EXISTS trg_quizzes_updated_at
AFTER UPDATE ON quizzes
FOR EACH ROW
BEGIN
  UPDATE quizzes SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_products_updated_at
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  UPDATE products SET updated_at = datetime('now') WHERE id = NEW.id;
END;
