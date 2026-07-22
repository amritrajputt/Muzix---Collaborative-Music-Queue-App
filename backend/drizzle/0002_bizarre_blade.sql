DROP TABLE "history" CASCADE;--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN "expires_at" timestamp DEFAULT now() NOT NULL;