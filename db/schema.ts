import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  link: text("link"),
  technologies: text("technologies").array(),
  position: text("position").notNull().default("[0,0,0]"), // JSON string for x,y,z coordinates
  rotation: text("rotation").notNull().default("[0,0,0]"), // JSON string for x,y,z rotation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = z.infer<typeof selectProjectSchema>;
