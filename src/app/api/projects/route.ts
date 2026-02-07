import { NextResponse } from "next/server";
import { readProjects, writeProjects } from "@/lib/projects-store";
import type { Project } from "@/types/project";

export async function GET() {
  const projects = await readProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { title?: string };
    const title = body.title?.trim() ?? "새 프로젝트";
    const projects = await readProjects();
    const now = new Date().toISOString();
    const newProject: Project = {
      id: crypto.randomUUID(),
      title,
      steps: [],
      createdAt: now,
      updatedAt: now,
    };
    projects.push(newProject);
    await writeProjects(projects);
    return NextResponse.json(newProject);
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
