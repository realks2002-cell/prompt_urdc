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
    const { title, description, role, task, domain, constraint } = body;
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
      description: description?.trim() ?? "",
      role: role?.trim() ?? "",
      task: task?.trim() ?? "",
      domain: domain?.trim() ?? "",
      constraint: constraint?.trim() ?? "",
      createdAt: now,
      updatedAt: now,
    };
    prompts.push(newPrompt);
    await writePrompts(prompts);
    return NextResponse.json(newPrompt);
  } catch (e) {
<<<<<<< HEAD
    const errorMessage = e instanceof Error ? e.message : "저장 실패";
    console.error("Prompt 저장 실패:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
=======
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
>>>>>>> c44cb223a1d60b812ffb517ae546240da1ded56f
  }
}
