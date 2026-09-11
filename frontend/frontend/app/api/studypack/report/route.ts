import { NextRequest, NextResponse } from "next/server";

type IssueReport = {
  id: string;
  pack_id: string;
  chapter_title: string;
  item_type: string;
  item_id?: string;
  reason: string;
  details?: string;
  status: "pending" | "reviewed" | "resolved";
  reported_at: string;
};

const reports: IssueReport[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pack_id, chapter_title, item_type, item_id, reason, details } = body;

    if (!reason) {
      return NextResponse.json({ detail: "Reason is required for issue reports" }, { status: 400 });
    }

    const reportRecord: IssueReport = {
      id: crypto.randomUUID(),
      pack_id: pack_id || "unknown",
      chapter_title: chapter_title || "General",
      item_type: item_type || "mcq",
      item_id: item_id || null,
      reason: String(reason),
      details: details ? String(details) : "",
      status: "pending",
      reported_at: new Date().toISOString(),
    };

    reports.push(reportRecord);
    return NextResponse.json({ status: "success", message: "Issue report submitted successfully", report: reportRecord });
  } catch (error) {
    console.error("Failed to submit issue report", error);
    return NextResponse.json({ detail: "Invalid request payload" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ count: reports.length, reports });
}
