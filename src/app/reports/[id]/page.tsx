import { prisma } from "@/lib/prisma";
import { parseAnalysis } from "@/lib/utils";
import { ReportNotFound } from "@/components/report-not-found";
import { ResultView } from "@/components/result/result-view";

export const dynamic = "force-dynamic";

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const report = await prisma.report.findUnique({ where: { id } });

  if (!report) {
    return <ReportNotFound />;
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
          analysis: parseAnalysis(report.analysis, report.language),
        }}
      />
    </div>
  );
}
