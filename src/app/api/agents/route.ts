import { NextResponse } from "next/server";
import { readAgents, writeAgents } from "@/lib/agents-store";
import type { Prompt } from "@/types/prompt";

export async function GET() {
  const items = await readAgents();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Omit<Prompt, "id" | "createdAt" | "updatedAt">;
    const { title, description, role, task, domain, constraint } = body;
    if (!title?.trim()) {
      return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 });
    }
    const items = await readAgents();
    const now = new Date().toISOString();
    const newItem: Prompt = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim() ?? "",
      role: role?.trim() ?? "",
      task: task?.trim() ?? "",
      domain: domain?.trim() ?? "",
      constraint: constraint?.trim() ?? "",
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    await writeAgents(items);
    return NextResponse.json(newItem);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "저장 실패";
    console.error("Agent 저장 실패:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
