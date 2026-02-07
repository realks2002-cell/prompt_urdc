import { NextResponse } from "next/server";
import { readPrompts, writePrompts } from "@/lib/prompts-store";
import type { Prompt } from "@/types/prompt";

type RouteParams = { params: Promise<{ id: string }> };

/** 단건 조회 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const prompts = await readPrompts();
  const found = prompts.find((p) => p.id === id);
  if (!found) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
  return NextResponse.json(found);
}

/** 수정 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<Prompt>;
    const prompts = await readPrompts();
    const index = prompts.findIndex((p) => p.id === id);
    if (index === -1) return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });

    const current = prompts[index];
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
    prompts[index] = updated;
    await writePrompts(prompts);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

/** 삭제 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const prompts = await readPrompts();
    const filtered = prompts.filter((p) => p.id !== id);
    if (filtered.length === prompts.length) {
      return NextResponse.json({ error: "찾을 수 없음" }, { status: 404 });
    }
    await writePrompts(filtered);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
