-- Nahanja editorial database, migration 0001.
-- Apply to a NEW dedicated Neon database, never to the existing member database.
-- The site and admin app remain separate deployments.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS content_type (
  name text PRIMARY KEY CHECK (name ~ '^[a-z][a-z0-9_]*$'),
  label_fa text NOT NULL,
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL REFERENCES content_type(name),
  stable_key text NOT NULL UNIQUE CHECK (length(stable_key) BETWEEN 3 AND 160),
  slug text,
  draft_revision_id uuid,
  archived_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug),
  UNIQUE (id, kind)
);

CREATE INDEX IF NOT EXISTS content_item_kind_live_idx
  ON content_item(kind, created_at) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS content_revision (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES content_item(id) ON DELETE RESTRICT,
  version integer NOT NULL CHECK (version > 0),
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  note text,
  UNIQUE(item_id, version),
  UNIQUE(item_id, id)
);

ALTER TABLE content_item
  ADD CONSTRAINT content_item_draft_revision_fk
  FOREIGN KEY (id, draft_revision_id) REFERENCES content_revision(item_id, id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE IF NOT EXISTS media_asset (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_provider text NOT NULL CHECK (storage_provider IN ('vercel_blob','neon_storage','s3','external')),
  object_key text NOT NULL,
  public_url text,
  mime_type text NOT NULL,
  byte_size bigint CHECK (byte_size >= 0),
  sha256 text CHECK (sha256 IS NULL OR sha256 ~ '^[0-9a-f]{64}$'),
  width integer CHECK (width > 0),
  height integer CHECK (height > 0),
  duration_ms integer CHECK (duration_ms >= 0),
  alt_fa text,
  caption_fa text,
  state text NOT NULL DEFAULT 'processing'
    CHECK (state IN ('processing','ready','failed','retired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(storage_provider, object_key)
);

-- Each content revision owns its exact relations and media references.
-- This makes previews and older releases deterministic.
CREATE TABLE IF NOT EXISTS revision_relation (
  revision_id uuid NOT NULL REFERENCES content_revision(id) ON DELETE CASCADE,
  field_name text NOT NULL CHECK (field_name ~ '^[a-z][a-z0-9_]*$'),
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  target_item_id uuid NOT NULL REFERENCES content_item(id) ON DELETE RESTRICT,
  label text,
  PRIMARY KEY (revision_id, field_name, ordinal)
);

CREATE INDEX IF NOT EXISTS revision_relation_target_idx
  ON revision_relation(target_item_id);

CREATE TABLE IF NOT EXISTS revision_media (
  revision_id uuid NOT NULL REFERENCES content_revision(id) ON DELETE CASCADE,
  slot text NOT NULL CHECK (slot ~ '^[a-z][a-z0-9_]*$'),
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  media_id uuid NOT NULL REFERENCES media_asset(id) ON DELETE RESTRICT,
  crop jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(crop) = 'object'),
  PRIMARY KEY (revision_id, slot, ordinal)
);

CREATE INDEX IF NOT EXISTS revision_media_asset_idx ON revision_media(media_id);

CREATE TABLE IF NOT EXISTS admin_account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_provider text NOT NULL,
  identity_subject text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('viewer','editor','publisher','moderator','owner')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(identity_provider, identity_subject)
);

ALTER TABLE content_revision
  ADD CONSTRAINT content_revision_author_fk
  FOREIGN KEY (created_by) REFERENCES admin_account(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS publication_release (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_no bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  label text,
  source text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES admin_account(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS release_entry (
  release_id uuid NOT NULL REFERENCES publication_release(id) ON DELETE RESTRICT,
  item_id uuid NOT NULL REFERENCES content_item(id) ON DELETE RESTRICT,
  revision_id uuid NOT NULL,
  PRIMARY KEY (release_id, item_id),
  FOREIGN KEY (item_id, revision_id) REFERENCES content_revision(item_id, id)
);

CREATE TABLE IF NOT EXISTS active_release (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  release_id uuid NOT NULL REFERENCES publication_release(id) ON DELETE RESTRICT,
  switched_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS member_submission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL UNIQUE REFERENCES content_item(id) ON DELETE RESTRICT,
  source_member_id text,
  source_submission_id text,
  review_status text NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending','approved','rejected')),
  reviewed_by uuid REFERENCES admin_account(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_submission_id)
);

CREATE TABLE IF NOT EXISTS audit_event (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid REFERENCES admin_account(id) ON DELETE SET NULL,
  action text NOT NULL,
  item_id uuid REFERENCES content_item(id) ON DELETE SET NULL,
  revision_id uuid REFERENCES content_revision(id) ON DELETE SET NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(details) = 'object'),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_event_item_time_idx
  ON audit_event(item_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS import_source (
  source_key text PRIMARY KEY,
  source_commit text NOT NULL,
  imported_at timestamptz NOT NULL DEFAULT now(),
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO content_type(name, label_fa) VALUES
  ('author','نویسنده'), ('book','کتاب'), ('experience','تجربه'),
  ('world','جهان'), ('mood','حال‌وهوا'), ('collection','مجموعه'),
  ('photo','عکس تحریریه'), ('member_work','اثر عضو'),
  ('community_voice','صدای جامعه'), ('page','صفحه'),
  ('section','بخش صفحه'), ('ui_copy','متن رابط'),
  ('podcast','پادکست مستقل آینده'), ('video','ویدئو آینده')
ON CONFLICT (name) DO NOTHING;

COMMIT;

