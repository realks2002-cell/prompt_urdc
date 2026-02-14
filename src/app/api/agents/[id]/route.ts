import { NextResponse } from "next/server";
import { readAgents, writeAgents } from "@/lib/agents-store";
import type { Prompt } from "@/types/prompt";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const items = await readAgents();
  const found = items.find((p) => p.id === id);
  if (!found) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<Prompt>;
    const items = await readAgents();
    const index = items.findIndex((p) => p.id === id);
    if (index === -1) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
    const current = items[index];
    const updated: Prompt = {
      ...current,
      title: body.title?.trim() ?? current.title,
      description: body.description !== undefined ? body.description.trim() : current.description,
      task: body.task?.trim() ?? current.task,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;
    await writeAgents(items);
    console.log(`[API] Agent 수정 성공: ${id}`);
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[API] Agent 수정 실패:", e);
    const errorMessage = e instanceof Error ? e.message : "수정 실패";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const items = await readAgents();
    const filtered = items.filter((p) => p.id !== id);
    if (filtered.length === items.length) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
    await writeAgents(filtered);
    console.log(`[API] Agent 삭제 성공: ${id}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[API] Agent 삭제 실패:", e);
    const errorMessage = e instanceof Error ? e.message : "삭제 실패";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
