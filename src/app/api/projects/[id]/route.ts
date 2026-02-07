import { NextResponse } from "next/server";
import { readProjects, writeProjects } from "@/lib/projects-store";
import type { Project, ProjectStep } from "@/types/project";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const projects = await readProjects();
  const found = projects.find((p) => p.id === id);
  if (!found) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { title?: string; steps?: ProjectStep[] };
    const projects = await readProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
    const current = projects[index];
    const updated: Project = {
      ...current,
      title: body.title?.trim() ?? current.title,
      steps: Array.isArray(body.steps) ? body.steps : current.steps,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = updated;
    await writeProjects(projects);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const projects = await readProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
    await writeProjects(filtered);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
