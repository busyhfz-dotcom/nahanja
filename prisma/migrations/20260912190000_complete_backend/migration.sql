CREATE TABLE IF NOT EXISTS "audio_tracks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "chapter_id" uuid NOT NULL REFERENCES "chapters"("id") ON DELETE CASCADE,
  "title" text,
  "audio_url" text NOT NULL,
  "duration_seconds" integer,
  "format" text,
  "bitrate_kbps" integer,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "plan" text NOT NULL,
  "status" text NOT NULL DEFAULT 'active',
  "starts_at" timestamptz NOT NULL DEFAULT now(),
  "ends_at" timestamptz,
  "cancelled_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "subscription_id" uuid REFERENCES "subscriptions"("id") ON DELETE SET NULL,
  "amount" numeric(12,2) NOT NULL,
  "currency" text NOT NULL DEFAULT 'IRR',
  "provider" text,
  "provider_ref" text UNIQUE,
  "status" text NOT NULL DEFAULT 'pending',
  "paid_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "books_author_id_idx" ON "books"("author_id");
CREATE INDEX IF NOT EXISTS "chapters_book_id_order_index_idx" ON "chapters"("book_id", "order_index");
CREATE INDEX IF NOT EXISTS "audio_tracks_chapter_id_idx" ON "audio_tracks"("chapter_id");
CREATE INDEX IF NOT EXISTS "user_library_user_id_idx" ON "user_library"("user_id");
CREATE INDEX IF NOT EXISTS "user_library_book_id_idx" ON "user_library"("book_id");
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_status_idx" ON "subscriptions"("user_id", "status");
CREATE INDEX IF NOT EXISTS "payments_user_id_created_at_idx" ON "payments"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "payments_subscription_id_idx" ON "payments"("subscription_id");
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS subscriptions_set_updated_at ON "subscriptions";
CREATE TRIGGER subscriptions_set_updated_at
BEFORE UPDATE ON "subscriptions"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
