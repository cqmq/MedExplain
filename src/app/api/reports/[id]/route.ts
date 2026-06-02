import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAnalysis } from "@/lib/utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const report = await prisma.report.findUnique({ where: { id } });

    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    return NextResponse.json({
      report: {
        ...report,
        analysis: parseAnalysis(report.analysis),
      },
    });
  } catch (err) {
    console.error("[/api/reports/[id] GET]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Could not load this report. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await prisma.report.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    await prisma.report.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      "[/api/reports/[id] DELETE]",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: "Could not delete this report. Please try again." },
      { status: 500 },
    );
  }
}
