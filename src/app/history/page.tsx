import { HistoryPageContent } from "@/components/history-page-content";
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
    const analysis = parseAnalysis(report.analysis, report.language);

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

  return <HistoryPageContent items={items} />;
}
