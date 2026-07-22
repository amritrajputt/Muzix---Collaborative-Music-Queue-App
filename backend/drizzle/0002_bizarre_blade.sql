DROP TABLE IF EXISTS "history" CASCADE;--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN IF NOT EXISTS "expires_at" timestamp DEFAULT now() NOT NULL;