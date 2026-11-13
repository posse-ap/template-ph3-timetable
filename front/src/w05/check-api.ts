// W5：自分の Laravel が返す /api/courses を本物の fetch で取り、W2 の isCourse に通す（このファイルは書き換えない）
// 動かし方：リポジトリの一番上で docker compose up -d をしてから、front/ で pnpm w05
import { isCourse } from "../w02/api.ts";

const url = process.env.API_URL ?? "http://localhost:8080/api/courses";

// isCourse は true/false しか返さないので、合わなかった授業は列ごとに「何が届いたか」を出す
const want: Record<string, string> = {
  id: "数", code: "文字", name: "文字", teacher: "文字か null", day: "1〜5の数",
  period: "数", room: "文字", credits: "数", required: "true か false",
};
function describe(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") return `文字 "${value}"`;
  return `${typeof value} ${JSON.stringify(value)}`;
}
function reasons(item: unknown): string[] {
  if (typeof item !== "object" || item === null) return [`授業がオブジェクトではない（${describe(item)}）`];
  const row = item as Record<string, unknown>;
  return Object.keys(want)
    .filter((key) => !isCourse({ ...validSample, [key]: row[key] }))
    .map((key) => (key in row ? `${key} が ${describe(row[key])}（ほしいのは${want[key]}）` : `${key} がない`));
}
// 列を1つずつ差し替えて isCourse に聞くための、形の合った授業
const validSample = { id: 1, code: "CS101", name: "プログラミング入門", teacher: null, day: 1, period: 1, room: "J101", credits: 2, required: true };

let response: Response;
try {
  response = await fetch(url, { headers: { Accept: "application/json" } });
} catch {
  console.log(`${url} につながりませんでした。docker compose up -d をしたか確かめてください`);
  process.exit(1);
}
console.log(`GET ${url} → ${response.status}`);
const body: unknown = await response.json().catch(() => null);
if (typeof body !== "object" || body === null || !("data" in body) || !Array.isArray(body.data)) {
  console.log("本文が { \"data\": [ ... ] } の形ではありませんでした");
  console.log(JSON.stringify(body)?.slice(0, 300));
  process.exit(1);
}
const bad = body.data.filter((item) => !isCourse(item));
console.log(`届いた授業：${body.data.length}件`);
console.log(`合わなかった授業：${bad.length}件`);
for (const item of bad.slice(0, 10)) {
  const id = typeof item === "object" && item !== null && "id" in item ? item.id : "?";
  console.log(`  id ${id}: ${reasons(item).join("、")}`);
}
if (bad.length > 10) console.log(`  ……ほか${bad.length - 10}件`);
