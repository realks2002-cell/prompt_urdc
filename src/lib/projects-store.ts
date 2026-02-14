import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Project } from "@/types/project";
import { readBlobJson, writeBlobJson } from "@/lib/blob-store";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "projects.json");
const BLOB_PATH = "projects.json";

function useBlob(): boolean {
  const hasToken = typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
  if (!hasToken && process.env.VERCEL) {
    console.warn("⚠️  Vercel 환경이지만 BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다!");
  }
  return hasToken;
}

export async function readProjects(): Promise<Project[]> {
  if (useBlob()) {
    console.log("[ProjectStore] Vercel Blob에서 읽기 시도");
    const data = await readBlobJson<Project[]>(BLOB_PATH);
    return Array.isArray(data) ? data : [];
  }
  try {
    console.log(`[ProjectStore] 로컬 파일에서 읽기: ${FILE_PATH}`);
    const raw = await readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Project[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[ProjectStore] 로컬 파일 읽기 실패:", error);
    return [];
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  if (useBlob()) {
    console.log(`[ProjectStore] Vercel Blob에 저장 시도 (${projects.length}개 항목)`);
    await writeBlobJson(BLOB_PATH, projects);
    return;
  }
  try {
    console.log(`[ProjectStore] 로컬 파일에 저장: ${FILE_PATH} (${projects.length}개 항목)`);
    await writeFile(FILE_PATH, JSON.stringify(projects, null, 2), "utf-8");
    console.log("[ProjectStore] 로컬 파일 저장 성공");
  } catch (error) {
    console.error("[ProjectStore] 로컬 파일 저장 실패:", error);
    if (process.env.VERCEL) {
      throw new Error("Vercel 환경에서는 파일 시스템이 읽기 전용입니다. BLOB_READ_WRITE_TOKEN 환경 변수를 설정하세요.");
    }
    throw error;
  }
}
