import { put, list } from "@vercel/blob";

const BLOB_PREFIX = "data/";

/**
 * Vercel Blob에 JSON 문자열로 저장 (덮어쓰기)
 */
export async function writeBlobJson(pathname: string, data: unknown): Promise<void> {
  const key = pathname.startsWith(BLOB_PREFIX) ? pathname : `${BLOB_PREFIX}${pathname}`;
  await put(key, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
  });
}

/**
 * Vercel Blob에서 JSON 읽기. 없으면 null 반환.
 */
export async function readBlobJson<T>(pathname: string): Promise<T | null> {
  const key = pathname.startsWith(BLOB_PREFIX) ? pathname : `${BLOB_PREFIX}${pathname}`;
  const { blobs } = await list({ prefix: key, limit: 1 });
  const blob = blobs[0];
  if (!blob?.url) return null;
  const res = await fetch(blob.url);
  if (!res.ok) return null;
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
