import type { Express, Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "@db/schema";
import { createUser, findUserByEmail, verifyToken } from "./auth";
import { supabase } from "../client/src/lib/supabase";
import dotenv from 'dotenv';
import path from 'path';

// .envファイルを読み込む（絶対パスで指定）
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface AuthRequest extends Request {
  user?: any;
}

// 認証ミドルウェア
async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  const user = await verifyToken(token);
  if (!user) {
    return res.status(403).json({ message: "無効なトークンです" });
  }

  req.user = user;
  next();
}

export function setupRoutes(app: Express) {
  // 認証関連のエンドポイント
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body);
      
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "このメールアドレスは既に登録されています" });
      }

      const user = await createUser(name, email, password);
      const { data: authData } = await supabase.auth.getSession();
      res.status(201).json({ 
        user, 
        token: authData?.session?.access_token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return res.status(401).json({ message: "メールアドレスまたはパスワードが正しくありません" });
      }

      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "ユーザーが見つかりません" });
      }

      res.json({ 
        user,
        token: authData.session?.access_token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // プロジェクト関連のエンドポイント
  app.get("/api/projects", async (req, res) => {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // プロジェクト作成
  app.post("/api/projects", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { title, description, image, link, technologies } = req.body;
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: req.user.id,
          title,
          description,
          image,
          link,
          technologies
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // レビュー関連のエンドポイント
  app.post("/api/projects/:projectId/reviews", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { rating, comment } = req.body;
      const { data: review, error } = await supabase
        .from('reviews')
        .insert({
          project_id: req.params.projectId,
          user_id: req.user.id,
          rating,
          comment
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // プロジェクトのレビュー取得
  app.get("/api/projects/:projectId/reviews", async (req, res) => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('project_id', req.params.projectId);

      if (error) throw error;
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
}
