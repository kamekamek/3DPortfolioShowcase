import { db } from "@/db";
import { projects } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// GET /api/projects
export async function GET() {
  try {
    const allProjects = await db.select().from(projects);
    return NextResponse.json(allProjects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(projects).values(body).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
