import { CalendarDays, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { ReportActions } from "@/components/report-actions";
import { DoctorQuestionsCard } from "@/components/result/doctor-questions-card";
import { KeyFindingsCard } from "@/components/result/key-findings-card";
import { MedicalTermsCard } from "@/components/result/medical-terms-card";
import { SafetyNotesCard } from "@/components/result/safety-notes-card";
import { SummaryCard } from "@/components/result/summary-card";
import { UrgentWarningCard } from "@/components/result/urgent-warning-card";
import { ValuesTable } from "@/components/result/values-table";
import type { ReportDetail } from "@/lib/types";
import {
  formatDate,
  getDirection,
  getInputTypeLabel,
  getReportTypeLabel,
} from "@/lib/utils";

interface ResultViewProps {
  report: ReportDetail;
}

export function ResultView({ report }: ResultViewProps) {
  const { analysis } = report;

  return (
    <div className="space-y-6" dir={getDirection(report.language)}>
      <div className="print-only mb-6">
        <h1 className="text-2xl font-bold">MedExplain AI Report Summary</h1>
        <p className="mt-2 text-sm">
          This explanation is not a diagnosis and does not replace a doctor.
        </p>
      </div>

      <section className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="medical">{getReportTypeLabel(report.reportType)}</Badge>
            <Badge variant="info">{getInputTypeLabel(report.inputType)}</Badge>
            <Badge variant="outline">{report.language}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-normal">{report.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            Created {formatDate(report.createdAt)}
          </p>
        </div>
        <ReportActions summary={analysis.simple_summary} />
      </section>

      <UrgentWarningCard warning={analysis.urgent_warning} />
      <SummaryCard summary={analysis.simple_summary} />
      <KeyFindingsCard findings={analysis.key_findings} />
      <ValuesTable values={analysis.values_table} />
      <MedicalTermsCard terms={analysis.medical_terms} />
      <DoctorQuestionsCard questions={analysis.doctor_questions} />
      <SafetyNotesCard notes={analysis.safety_notes} />

      <Card className="print-card">
        <CardContent className="p-6">
          {report.inputType === "text" ? (
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold">
                <FileText className="size-5 text-[var(--color-accent-teal)]" />
                Original report text
              </summary>
              <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-secondary p-4 text-sm leading-7 text-muted-foreground">
                {report.originalText}
              </pre>
            </details>
          ) : (
            <p className="text-sm leading-7 text-muted-foreground">
              Analyzed from uploaded file:{" "}
              <span className="font-medium text-foreground">
                {report.sourceName ?? "Uploaded file"}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      <DisclaimerBanner className="print-card" />
    </div>
  );
}
