import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Prompt } from "@/types/prompt";
import { readBlobJson, writeBlobJson } from "@/lib/blob-store";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "prompts.json");
const BLOB_PATH = "prompts.json";

function useBlob(): boolean {
  const hasToken = typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
  if (!hasToken && process.env.VERCEL) {
    console.warn("⚠️  Vercel 환경이지만 BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다!");
    console.warn("⚠️  Vercel에서는 파일 시스템이 읽기 전용이므로 저장이 실패합니다.");
    console.warn("⚠️  해결: Vercel Dashboard → Storage → Blob 생성 필요");
  }
  return hasToken;
}

/** JSON에서 전체 프롬프트 목록 읽기 (파일 또는 Vercel Blob) */
export async function readPrompts(): Promise<Prompt[]> {
  if (useBlob()) {
    console.log("[Store] Vercel Blob에서 읽기 시도");
    const data = await readBlobJson<Prompt[]>(BLOB_PATH);
    return Array.isArray(data) ? data : [];
  }
  try {
    console.log(`[Store] 로컬 파일에서 읽기: ${FILE_PATH}`);
    const raw = await readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Prompt[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[Store] 로컬 파일 읽기 실패:", error);
    return [];
  }
}

/** 전체 프롬프트 목록 저장 (파일 또는 Vercel Blob) */
export async function writePrompts(prompts: Prompt[]): Promise<void> {
  if (useBlob()) {
    console.log(`[Store] Vercel Blob에 저장 시도 (${prompts.length}개 항목)`);
    await writeBlobJson(BLOB_PATH, prompts);
    return;
  }
  try {
    console.log(`[Store] 로컬 파일에 저장: ${FILE_PATH} (${prompts.length}개 항목)`);
    await writeFile(FILE_PATH, JSON.stringify(prompts, null, 2), "utf-8");
    console.log("[Store] 로컬 파일 저장 성공");
  } catch (error) {
    console.error("[Store] 로컬 파일 저장 실패:", error);
    if (process.env.VERCEL) {
      throw new Error("Vercel 환경에서는 파일 시스템이 읽기 전용입니다. BLOB_READ_WRITE_TOKEN 환경 변수를 설정하세요.");
    }
    throw error;
  }
}
