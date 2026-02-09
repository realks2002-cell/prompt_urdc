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
      role: body.role?.trim() ?? current.role,
      task: body.task?.trim() ?? current.task,
      domain: body.domain?.trim() ?? current.domain,
      constraint: body.constraint?.trim() ?? current.constraint,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;
    await writeAgents(items);
    return NextResponse.json(updated);
<<<<<<< HEAD
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "수정 실패";
    console.error("Agent 수정 실패:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
=======
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
>>>>>>> c44cb223a1d60b812ffb517ae546240da1ded56f
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const items = await readAgents();
    const filtered = items.filter((p) => p.id !== id);
    if (filtered.length === items.length) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
    await writeAgents(filtered);
    return NextResponse.json({ ok: true });
<<<<<<< HEAD
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "삭제 실패";
    console.error("Agent 삭제 실패:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
=======
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
>>>>>>> c44cb223a1d60b812ffb517ae546240da1ded56f
  }
}
