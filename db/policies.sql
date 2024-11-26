-- プロジェクトテーブルのポリシー
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 誰でも閲覧可能
CREATE POLICY "プロジェクトの閲覧を許可" ON projects
  FOR SELECT USING (true);

-- 認証済みユーザーのみ作成可能
CREATE POLICY "認証済みユーザーのプロジェクト作成を許可" ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分のプロジェクトのみ更新可能
CREATE POLICY "自分のプロジェクトの更新を許可" ON projects
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 自分のプロジェクトのみ削除可能
CREATE POLICY "自分のプロジェクトの削除を許可" ON projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- レビューテーブルのポリシー
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 誰でも閲覧可能
CREATE POLICY "レビューの閲覧を許可" ON reviews
  FOR SELECT USING (true);

-- 認証済みユーザーのみ作成可能
CREATE POLICY "認証済みユーザーのレビュー作成を許可" ON reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分のレビューのみ更新可能
CREATE POLICY "自分のレビューの更新を許可" ON reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 自分のレビューのみ削除可能
CREATE POLICY "自分のレビューの削除を許可" ON reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- ユーザーテーブルのポリシー
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ユーザーの基本情報（名前）は誰でも閲覧可能
CREATE POLICY "ユーザーの基本情報の閲覧を許可" ON users
  FOR SELECT
  USING (true);

-- 認証済みユーザーの登録を許可
CREATE POLICY "認証済みユーザーの登録を許可" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 自分のプロフィールのみ更新可能
CREATE POLICY "自分のプロフィールの更新を許可" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 自分のプロフィールのみ削除可能
CREATE POLICY "自分のプロフィールの削除を許可" ON users
  FOR DELETE
  USING (auth.uid() = id);
