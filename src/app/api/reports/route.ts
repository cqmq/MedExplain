import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAnalysis } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        reportType: true,
        inputType: true,
        language: true,
        createdAt: true,
        analysis: true,
      },
    });

    return NextResponse.json({
      reports: reports.map((report) => {
        const analysis = parseAnalysis(report.analysis);

        return {
          id: report.id,
          title: report.title,
          reportType: report.reportType,
          inputType: report.inputType,
          language: report.language,
          createdAt: report.createdAt,
          shortSummary:
            analysis.simple_summary.length > 140
              ? `${analysis.simple_summary.slice(0, 137)}...`
              : analysis.simple_summary,
        };
      }),
    });
  } catch (err) {
    console.error("[/api/reports]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Could not load reports. Please try again." },
      { status: 500 },
    );
  }
}
