-- lessons: one row per lesson (260 total across 52 weeks)
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY,
  week INTEGER NOT NULL,
  day_in_week INTEGER NOT NULL,
  module INTEGER NOT NULL,
  lesson_in_module INTEGER NOT NULL,
  is_consolidation INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  skill_focus TEXT NOT NULL
);

-- steps: 3 steps per lesson (warmup / core / apply), each optionally linked to a video
CREATE TABLE IF NOT EXISTS steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id),
  step_order INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('warmup','core','apply')),
  video_id TEXT,
  video_title TEXT,
  video_url TEXT,
  instruction TEXT NOT NULL,
  bpm_target INTEGER,
  stamina_target_seconds INTEGER,
  UNIQUE(lesson_id, step_order)
);

-- progress: watch and drill completion state per step (single user, no auth)
CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  step_id INTEGER NOT NULL REFERENCES steps(id),
  type TEXT NOT NULL CHECK(type IN ('watch','drill')),
  done INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(step_id, type)
);

-- personal_bests: one row per skill key, overwritten when a new best is logged
CREATE TABLE IF NOT EXISTS personal_bests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_key TEXT NOT NULL UNIQUE,
  value REAL NOT NULL,
  unit TEXT NOT NULL,
  logged_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- bpm_log: full history of every value logged per lesson and skill (for trend display)
CREATE TABLE IF NOT EXISTS bpm_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id),
  skill_key TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT NOT NULL,
  logged_at TEXT NOT NULL DEFAULT (datetime('now'))
);
