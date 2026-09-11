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
  resolved_at?: string;
  resolved_by?: string;
};

export const reports: IssueReport[] = [];

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
      item_id: item_id || undefined,
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

// PATCH: Update report status from teacher dashboard
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { report_id, status, resolved_by } = body;

    if (!report_id || !status) {
      return NextResponse.json({ detail: "report_id and status are required" }, { status: 400 });
    }

    const validStatuses = ["pending", "reviewed", "resolved"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ detail: "Invalid status. Use: pending, reviewed, resolved" }, { status: 400 });
    }

    const report = reports.find((r) => r.id === report_id);
    if (!report) {
      return NextResponse.json({ detail: "Report not found" }, { status: 404 });
    }

    report.status = status;
    if (status === "resolved") {
      report.resolved_at = new Date().toISOString();
      report.resolved_by = resolved_by || "Teacher";
    }

    return NextResponse.json({ status: "success", message: "Report status updated", report });
  } catch (error) {
    console.error("Report PATCH error", error);
    return NextResponse.json({ detail: "Invalid request" }, { status: 400 });
  }
}
