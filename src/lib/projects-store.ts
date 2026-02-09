import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { Project } from "@/types/project";
import { readBlobJson, writeBlobJson } from "@/lib/blob-store";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "projects.json");
const BLOB_PATH = "projects.json";

function useBlob(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

/** data 디렉토리가 없으면 생성 */
async function ensureDataDir(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readProjects(): Promise<Project[]> {
  if (useBlob()) {
    const data = await readBlobJson<Project[]>(BLOB_PATH);
    return Array.isArray(data) ? data : [];
  }
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Project[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  if (useBlob()) {
    await writeBlobJson(BLOB_PATH, projects);
    return;
  }
  await ensureDataDir();
  await writeFile(FILE_PATH, JSON.stringify(projects, null, 2), "utf-8");
}
