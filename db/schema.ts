import { pgTable, text, uuid, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Supabase Authと連携するユーザーテーブル
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    // RLSポリシー: ユーザーは自分のデータのみ参照可能
    rls_select: sql`auth.uid() = ${table.id}`,
    rls_insert: sql`auth.uid() = ${table.id}`,
    rls_update: sql`auth.uid() = ${table.id}`,
    rls_delete: sql`auth.uid() = ${table.id}`,
  };
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  link: text("link"),
  technologies: text("technologies").array().default([]),
  position: text("position").notNull().default("[0,0,0]"),
  rotation: text("rotation").notNull().default("[0,0,0]"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    // RLSポリシー: 読み取りは全員可能、作成・更新・削除は所有者または管理者のみ
    rls_select: sql`true`,
    rls_insert: sql`auth.uid() = ${table.userId}`,
    rls_update: sql`auth.uid() = ${table.userId} OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )`,
    rls_delete: sql`auth.uid() = ${table.userId} OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )`,
  };
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id),
  userId: uuid("user_id").references(() => users.id).notNull().default(sql`auth.uid()`),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    // RLSポリシー: 読み取りは全員可能、作成は認証済みユーザー、更新・削除は所有者または管理者のみ
    rls_select: sql`true`,
    rls_insert: sql`auth.uid() = ${table.userId}`,
    rls_update: sql`auth.uid() = ${table.userId} OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )`,
    rls_delete: sql`auth.uid() = ${table.userId} OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )`,
  };
});

// Review schemas
export const insertReviewSchema = createInsertSchema(reviews);
export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = z.infer<typeof selectReviewSchema>;

// User schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(2),
  isAdmin: z.boolean().default(false),
});
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

// Project schemas
export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = z.infer<typeof selectProjectSchema>;

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const projectsWithUsers = pgTable("projects_with_users", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  link: text("link"),
  technologies: text("technologies").array().default([]),
  position: text("position").notNull().default("[0,0,0]"),
  rotation: text("rotation").notNull().default("[0,0,0]"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  creatorName: text("creator_name").notNull(),
});

export const selectProjectWithUserSchema = createSelectSchema(projectsWithUsers);
export type ProjectWithUser = z.infer<typeof selectProjectWithUserSchema>;
