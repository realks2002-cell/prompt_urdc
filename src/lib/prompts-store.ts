import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Prompt } from "@/types/prompt";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "prompts.json");

/** JSON 파일에서 전체 프롬프트 목록 읽기 */
export async function readPrompts(): Promise<Prompt[]> {
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Prompt[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** 전체 프롬프트 목록을 JSON 파일에 저장 */
export async function writePrompts(prompts: Prompt[]): Promise<void> {
  await writeFile(FILE_PATH, JSON.stringify(prompts, null, 2), "utf-8");
}
