// Recently-viewed units — client-only, localStorage (no store bump).
const KEY = "trimurty.recent.v1";

export function pushRecent(id: string) {
  try {
    const arr: string[] = JSON.parse(localStorage.getItem(KEY) || "[]").filter((x: string) => x !== id);
    arr.unshift(id);
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 8)));
  } catch {
    /* ignore */
  }
}

export function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
