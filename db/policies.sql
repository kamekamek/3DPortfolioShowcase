-- ユーザーテーブルのポリシー
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分のデータのみ参照可能" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のデータのみ更新可能" ON users
  FOR UPDATE USING (auth.uid() = id);

-- プロジェクトテーブルのポリシー
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "プロジェクトは誰でも閲覧可能" ON projects
  FOR SELECT USING (true);

CREATE POLICY "認証済みユーザーのみプロジェクト作成可能" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "プロジェクトは作成者または管理者のみ更新可能" ON projects
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "プロジェクトは作成者または管理者のみ削除可能" ON projects
  FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- レビューテーブルのポリシー
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "レビューは誰でも閲覧可能" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "認証済みユーザーのみレビュー作成可能" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "レビューは作成者または管理者のみ更新可能" ON reviews
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "レビューは作成者または管理者のみ削除可能" ON reviews
  FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- プロジェクト一覧ビューのポリシー
ALTER TABLE projects_with_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "プロジェクト一覧は誰でも閲覧可能" ON projects_with_users
  FOR SELECT USING (true);

-- Storageのポリシー
-- 画像のアップロード権限（認証済みユーザーのみ）
CREATE POLICY "authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio' AND
  (LOWER(RIGHT(name, 4)) = '.jpg' OR
   LOWER(RIGHT(name, 4)) = '.png' OR
   LOWER(RIGHT(name, 4)) = '.gif')
);

-- 画像の読み取り権限（全ユーザー）
CREATE POLICY "anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio');

-- 画像の削除権限（所有者または管理者のみ）
CREATE POLICY "owners or admins can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio' AND 
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  )
);
