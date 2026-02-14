import { NextResponse } from "next/server";
import { readMcps, writeMcps } from "@/lib/mcps-store";
import type { Prompt } from "@/types/prompt";

export async function GET() {
  const items = await readMcps();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Omit<Prompt, "id" | "createdAt" | "updatedAt">;
    const { title, task } = body;
    if (!title?.trim()) {
      return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 });
    }
    const items = await readMcps();
    const now = new Date().toISOString();
    const newItem: Prompt = {
      id: crypto.randomUUID(),
      title: title.trim(),
      task: task?.trim() ?? "",
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);
    await writeMcps(items);
    console.log(`[API] MCP 생성 성공: ${newItem.id}`);
    return NextResponse.json(newItem);
  } catch (e) {
    console.error("[API] MCP 생성 실패:", e);
    const errorMessage = e instanceof Error ? e.message : "저장 실패";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
