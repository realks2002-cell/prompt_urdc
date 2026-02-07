import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Prompt } from "@/types/prompt";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "mcps.json");

export async function readMcps(): Promise<Prompt[]> {
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Prompt[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function writeMcps(items: Prompt[]): Promise<void> {
  await writeFile(FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
}
