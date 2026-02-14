import { NextResponse } from "next/server";
import { readPrompts, writePrompts } from "@/lib/prompts-store";
import type { Prompt } from "@/types/prompt";

/** 목록 조회 */
export async function GET() {
  const prompts = await readPrompts();
  return NextResponse.json(prompts);
}

/** 새 프롬프트 생성 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Omit<Prompt, "id" | "createdAt" | "updatedAt">;
    const { title, task } = body;
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "제목은 필수입니다." },
        { status: 400 }
      );
    }
    const prompts = await readPrompts();
    const now = new Date().toISOString();
    const newPrompt: Prompt = {
      id: crypto.randomUUID(),
      title: title.trim(),
      task: task?.trim() ?? "",
      createdAt: now,
      updatedAt: now,
    };
    prompts.push(newPrompt);
    await writePrompts(prompts);
    console.log(`[API] 프롬프트 생성 성공: ${newPrompt.id}`);
    return NextResponse.json(newPrompt);
  } catch (e) {
    console.error("[API] 프롬프트 생성 실패:", e);
    const errorMessage = e instanceof Error ? e.message : "저장 실패";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
