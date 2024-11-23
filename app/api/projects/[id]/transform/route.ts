import { db } from "@/db";
import { projects } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// PATCH /api/projects/[id]/transform
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { position, rotation } = await request.json();
    await db
      .update(projects)
      .set({
        position: JSON.stringify(position),
        rotation: JSON.stringify(rotation),
      })
      .where(eq(projects.id, parseInt(params.id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project transform" },
      { status: 500 }
    );
  }
}
