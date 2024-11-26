-- プロジェクトテーブルのポリシー
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 誰でも閲覧可能
CREATE POLICY "プロジェクトの閲覧を許可" ON projects
  FOR SELECT USING (true);

-- 認証済みユーザーのみ作成可能
CREATE POLICY "認証済みユーザーのプロジェクト作成を許可" ON projects
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 管理者は全てのプロジェクトを更新可能、一般ユーザーは自分のプロジェクトのみ更新可能
CREATE POLICY "プロジェクトの更新を許可" ON projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR id = projects.user_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR id = projects.user_id)
    )
  );

-- 管理者は全てのプロジェクトを削除可能、一般ユーザーは自分のプロジェクトのみ削除可能
CREATE POLICY "プロジェクトの削除を許可" ON projects
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR id = projects.user_id)
    )
  );

-- レビューテーブルのポリシー
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 誰でも閲覧可能
CREATE POLICY "レビューの閲覧を許可" ON reviews
  FOR SELECT USING (true);

-- 認証済みユーザーのみ作成可能
CREATE POLICY "認証済みユーザーのレビュー作成を許可" ON reviews
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 管理者は全てのレビューを更新可能、一般ユーザーは自分のレビューのみ更新可能
CREATE POLICY "レビューの更新を許可" ON reviews
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR id = reviews.user_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR id = reviews.user_id)
    )
  );

-- 管理者は全てのレビューを削除可能、一般ユーザーは自分のレビューのみ削除可能
CREATE POLICY "レビューの削除を許可" ON reviews
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR id = reviews.user_id)
    )
  );

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

-- 管理者は全てのユーザーを更新可能、一般ユーザーは自分のプロフィールのみ更新可能
CREATE POLICY "ユーザーの更新を許可" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR id = users.id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR id = users.id)
    )
  );

-- 管理者のみユーザーの削除が可能
CREATE POLICY "ユーザーの削除を許可" ON users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );
