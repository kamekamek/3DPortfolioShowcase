ALTER TABLE "projects" ALTER COLUMN "user_id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "user_id" DROP NOT NULL;