-- 既存のテーブル定義
CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL UNIQUE,
    "created_at" timestamp DEFAULT now()
);

-- is_adminカラムの追加
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_admin" boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS "projects" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "image" text NOT NULL,
    "link" text,
    "technologies" text NOT NULL,  -- 配列から文字列に変更
    "position" numeric(10,6)[] DEFAULT ARRAY[0, 0, 0],
    "rotation" numeric(10,6)[] DEFAULT ARRAY[0, 0, 0],
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "reviews" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "rating" integer NOT NULL,
    "comment" text NOT NULL,
    "created_at" timestamp DEFAULT now()
);

-- プロジェクト情報とユーザー名を結合したビューの作成
CREATE OR REPLACE VIEW "projects_with_users" WITH (security_barrier) AS
SELECT 
    p.*,
    u.name as creator_name
FROM 
    projects p
    JOIN users u ON p.user_id = u.id
WITH CHECK OPTION;

-- トリガーの作成: プロジェクトの更新時にupdated_atを自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 認証ユーザーの自動同期用トリガー関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email, is_admin)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Anonymous'),
        NEW.email,
        false
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.usersテーブルの変更を監視するトリガー
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 既存のテーブルのtechnologiesカラムを変更
ALTER TABLE projects 
    ALTER COLUMN technologies TYPE text,
    ALTER COLUMN technologies SET NOT NULL;
