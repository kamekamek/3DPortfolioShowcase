import type { Express } from "express";
import { db } from "../db";
import { projects } from "@db/schema";
import { eq } from "drizzle-orm";

export function setupRoutes(app: Express) {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await db.select().from(projects);
      res.json(allProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, parseInt(req.params.id)))
        .limit(1);
      
      if (project.length === 0) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      
      res.json(project[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Update project position/rotation
  app.patch("/api/projects/:id/transform", async (req, res) => {
    const { position, rotation } = req.body;
    try {
      await db
        .update(projects)
        .set({ 
          position: JSON.stringify(position),
          rotation: JSON.stringify(rotation)
        })
        .where(eq(projects.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update project transform" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const result = await db.insert(projects).values(req.body).returning();
      res.status(201).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });
}