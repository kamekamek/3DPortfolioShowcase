CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL UNIQUE,
    "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "projects" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "image" text NOT NULL,
    "link" text,
    "technologies" text[] DEFAULT '{}',
    "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "reviews" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "rating" integer NOT NULL,
    "comment" text NOT NULL,
    "created_at" timestamp DEFAULT now()
);
