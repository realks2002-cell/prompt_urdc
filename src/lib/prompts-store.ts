import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Prompt } from "@/types/prompt";
import { readBlobJson, writeBlobJson } from "@/lib/blob-store";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "prompts.json");
const BLOB_PATH = "prompts.json";

function useBlob(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

/** JSON에서 전체 프롬프트 목록 읽기 (파일 또는 Vercel Blob) */
export async function readPrompts(): Promise<Prompt[]> {
  if (useBlob()) {
    const data = await readBlobJson<Prompt[]>(BLOB_PATH);
    return Array.isArray(data) ? data : [];
  }
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Prompt[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** 전체 프롬프트 목록 저장 (파일 또는 Vercel Blob) */
export async function writePrompts(prompts: Prompt[]): Promise<void> {
  if (useBlob()) {
    await writeBlobJson(BLOB_PATH, prompts);
    return;
  }
  await writeFile(FILE_PATH, JSON.stringify(prompts, null, 2), "utf-8");
}
