import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { HistoryCard } from "@/components/history-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { parseAnalysis } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
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

  const items = reports.map((report) => {
    const analysis = parseAnalysis(report.analysis);

    return {
      id: report.id,
      title: report.title,
      reportType: report.reportType,
      inputType: report.inputType as "text" | "pdf" | "image",
      language: report.language,
      createdAt: report.createdAt,
      shortSummary:
        analysis.simple_summary.length > 140
          ? `${analysis.simple_summary.slice(0, 137)}...`
          : analysis.simple_summary,
    };
  });

  return (
    <div className="content-container py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Report history</h1>
          <p className="mt-2 text-muted-foreground">
            Saved analyses are stored in the local SQLite database.
          </p>
        </div>
        <Button asChild>
          <Link href="/analyze">Analyze a Report</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <span className="medical-icon-surface flex size-16 items-center justify-center rounded-3xl text-white">
              <ClipboardList className="size-7" />
            </span>
            <h2 className="mt-6 text-xl font-semibold">No reports yet</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
              Analyze your first report to see it here. You can use pasted text,
              a PDF, an image, or the demo report.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/analyze">Analyze your first report</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/analyze?demo=1">Try demo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((report) => (
            <HistoryCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
