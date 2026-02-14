import type { Prompt } from "@/types/prompt";

/** 한 건 프롬프트를 마크다운 문자열로 변환 */
export function promptToMarkdown(prompt: Prompt): string {
  const lines: string[] = [
    `# ${prompt.title}`,
    "",
  ];
  if (prompt.task?.trim()) {
    lines.push(prompt.task.trim(), "");
  }
  return lines.join("\n").trimEnd();
}

/** 여러 프롬프트를 하나의 마크다운 문서로 변환 */
export function promptsToMarkdown(prompts: Prompt[]): string {
  return prompts.map((p) => promptToMarkdown(p)).join("\n\n---\n\n");
}

/** 파일명에 쓸 수 있도록 제목 정리 */
export function safeFileName(title: string, maxLength = 80): string {
  const safe = title.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim();
  if (!safe) return "prompt";
  return safe.length > maxLength ? safe.slice(0, maxLength) : safe;
}
