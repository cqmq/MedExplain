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
import { LOCALES, localeFromLanguage, t } from "@/lib/i18n";
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
  const locale = localeFromLanguage(report.language);

  return (
    <div className="space-y-6" dir={getDirection(report.language)}>
      <div className="print-only mb-6">
        <h1 className="text-2xl font-bold">{t(locale, "report.print.title")}</h1>
        <p className="mt-2 text-sm">{t(locale, "report.print.disclaimer")}</p>
      </div>

      <section className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="medical">{getReportTypeLabel(report.reportType, locale)}</Badge>
            <Badge variant="info">{getInputTypeLabel(report.inputType, locale)}</Badge>
            <Badge variant="outline">{LOCALES[locale].label}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-normal">{report.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            {t(locale, "report.created")} {formatDate(report.createdAt, locale)}
          </p>
        </div>
        <ReportActions summary={analysis.simple_summary} locale={locale} />
      </section>

      <UrgentWarningCard warning={analysis.urgent_warning} locale={locale} />
      <SummaryCard summary={analysis.simple_summary} locale={locale} />
      <KeyFindingsCard findings={analysis.key_findings} locale={locale} />
      <ValuesTable values={analysis.values_table} locale={locale} />
      <MedicalTermsCard terms={analysis.medical_terms} locale={locale} />
      <DoctorQuestionsCard questions={analysis.doctor_questions} locale={locale} />
      <SafetyNotesCard notes={analysis.safety_notes} locale={locale} />

      <Card className="print-card">
        <CardContent className="p-6">
          {report.inputType === "text" ? (
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold">
                <FileText className="size-5 text-[var(--color-accent-teal)]" />
                {t(locale, "report.original")}
              </summary>
              <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-secondary p-4 text-sm leading-7 text-muted-foreground">
                {report.originalText}
              </pre>
            </details>
          ) : (
            <p className="text-sm leading-7 text-muted-foreground">
              {t(locale, "report.uploaded")}{" "}
              <span className="font-medium text-foreground">
                {report.sourceName ?? t(locale, "report.uploadedFallback")}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      <DisclaimerBanner className="print-card" />
    </div>
  );
}
