import { put, list } from "@vercel/blob";

const BLOB_PREFIX = "data/";

/**
 * Vercel Blob에 JSON 문자열로 저장 (덮어쓰기)
 */
export async function writeBlobJson(pathname: string, data: unknown): Promise<void> {
  try {
    const key = pathname.startsWith(BLOB_PREFIX) ? pathname : `${BLOB_PREFIX}${pathname}`;
    await put(key, JSON.stringify(data, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    console.log(`[Blob] 저장 성공: ${key}`);
  } catch (error) {
    console.error(`[Blob] 저장 실패 (${pathname}):`, error);
    throw new Error(`Blob 저장 실패: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Vercel Blob에서 JSON 읽기. 없으면 null 반환.
 */
export async function readBlobJson<T>(pathname: string): Promise<T | null> {
  try {
    const key = pathname.startsWith(BLOB_PREFIX) ? pathname : `${BLOB_PREFIX}${pathname}`;
    const { blobs } = await list({ prefix: key, limit: 1 });
    const blob = blobs[0];
    if (!blob?.url) {
      console.log(`[Blob] 파일 없음: ${key}`);
      return null;
    }
    const res = await fetch(blob.url);
    if (!res.ok) {
      console.error(`[Blob] 읽기 실패 (${key}): HTTP ${res.status}`);
      return null;
    }
    const text = await res.text();
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      console.error(`[Blob] JSON 파싱 실패 (${key}):`, error);
      return null;
    }
  } catch (error) {
    console.error(`[Blob] 읽기 오류 (${pathname}):`, error);
    return null;
  }
}
