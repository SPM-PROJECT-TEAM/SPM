import { NextRequest, NextResponse } from "next/server";

const DIKSHA_URL = "https://diksha.gov.in/api/content/v1/search";

type DikshaContent = {
  identifier?: string;
  name?: string;
  board?: string;
  gradeLevel?: string[] | string;
  subject?: string[] | string;
  topics?: string[] | string;
  contentType?: string;
  medium?: string;
};

function asArray(value: string[] | string | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const board = searchParams.get("board");
  if (!board) return NextResponse.json({ detail: "board is required" }, { status: 400 });

  const grade = searchParams.get("grade");
  const subject = searchParams.get("subject");
  const filters: Record<string, string[]> = { board: [board] };
  if (grade) filters.gradeLevel = [grade];
  if (subject) filters.subject = [subject];

  try {
    const response = await fetch(DIKSHA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        request: {
          filters,
          limit: 24,
          offset: 0,
          fields: ["identifier", "name", "board", "gradeLevel", "subject", "topics", "contentType", "medium"],
        },
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`DIKSHA returned ${response.status}`);
    const payload = await response.json();
    const result = payload.result ?? {};
    const items = (result.content ?? []).map((item: DikshaContent) => ({
      diksha_identifier: item.identifier ?? crypto.randomUUID(),
      title: item.name ?? item.identifier ?? "Untitled resource",
      board: item.board ?? null,
      grade_levels: asArray(item.gradeLevel),
      subjects: asArray(item.subject),
      topics: asArray(item.topics),
      content_type: item.contentType ?? null,
      medium: item.medium ?? null,
    }));
    return NextResponse.json({ source_count: result.count ?? items.length, fetched_at: new Date().toISOString(), items });
  } catch (error) {
    console.error("DIKSHA curriculum search failed", error);
    return NextResponse.json({ detail: "DIKSHA curriculum service is unavailable" }, { status: 502 });
  }
}
