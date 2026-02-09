<<<<<<< HEAD
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
=======
import { readFile, writeFile } from "fs/promises";
>>>>>>> c44cb223a1d60b812ffb517ae546240da1ded56f
import path from "path";
import type { Prompt } from "@/types/prompt";
import { readBlobJson, writeBlobJson } from "@/lib/blob-store";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "prompts.json");
const BLOB_PATH = "prompts.json";

function useBlob(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

<<<<<<< HEAD
/** data 디렉토리가 없으면 생성 */
async function ensureDataDir(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

=======
>>>>>>> c44cb223a1d60b812ffb517ae546240da1ded56f
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
<<<<<<< HEAD
  await ensureDataDir();
=======
>>>>>>> c44cb223a1d60b812ffb517ae546240da1ded56f
  await writeFile(FILE_PATH, JSON.stringify(prompts, null, 2), "utf-8");
}
