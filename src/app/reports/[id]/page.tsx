import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseAnalysis } from "@/lib/utils";
import { ResultView } from "@/components/result/result-view";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const report = await prisma.report.findUnique({ where: { id } });

  if (!report) {
    return (
      <div className="content-container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold tracking-normal">Report not found</h1>
          <p className="mt-3 text-muted-foreground">
            This report may have been deleted, or the link may be incorrect.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="secondary">
              <Link href="/history">Go to History</Link>
            </Button>
            <Button asChild>
              <Link href="/analyze">Analyze a Report</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container py-10">
      <ResultView
        report={{
          id: report.id,
          title: report.title,
          reportType: report.reportType,
          inputType: report.inputType as "text" | "pdf" | "image",
          originalText: report.originalText,
          sourceName: report.sourceName,
          language: report.language,
          createdAt: report.createdAt,
          analysis: parseAnalysis(report.analysis),
        }}
      />
    </div>
  );
}
