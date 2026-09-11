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
    const rawItems: DikshaContent[] = result.content ?? [];

    const items = rawItems.map((item: DikshaContent) => ({
      diksha_identifier: item.identifier ?? crypto.randomUUID(),
      title: item.name ?? item.identifier ?? "Untitled resource",
      board: item.board ?? null,
      grade_levels: asArray(item.gradeLevel),
      subjects: asArray(item.subject),
      topics: asArray(item.topics),
      content_type: item.contentType ?? null,
      medium: item.medium ?? null,
    }));

    const count = result.count ?? items.length;

    return NextResponse.json({
      found: items.length > 0,
      source_count: count,
      fetched_at: new Date().toISOString(),
      items,
      message: items.length > 0 ? `Found ${count} DIKSHA curriculum resources.` : "No official DIKSHA textbook resources found for this search.",
    });
  } catch (error) {
    console.error("DIKSHA curriculum search failed", error);
    return NextResponse.json({
      found: false,
      source_count: 0,
      fetched_at: new Date().toISOString(),
      items: [],
      message: "The official curriculum source is currently unavailable.",
    }, { status: 200 }); // Return 200 with found: false so frontend empty state works cleanly
  }
}
