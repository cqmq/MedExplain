import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AnalysisResult, InputType, ValueStatus } from "@/lib/types";
import {
  DEFAULT_LOCALE,
  getBaselineSafetyNotes,
  getInputTypeLabel as getLocalizedInputTypeLabel,
  getLocaleDirection,
  getReportTypeLabel as getLocalizedReportTypeLabel,
  getUrgentWarning,
  localeFromLanguage,
  t,
  type Locale,
} from "@/lib/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const REPORT_TYPES = [
  { value: "blood_test", label: "Blood test" },
  { value: "urine_test", label: "Urine test" },
  { value: "radiology", label: "Radiology report" },
  { value: "prescription", label: "Prescription" },
  { value: "doctor_note", label: "Doctor note" },
  { value: "general", label: "General medical report" },
  { value: "unsure", label: "I'm not sure" },
] as const;

export const LANGUAGES = ["English", "Turkish", "Arabic"] as const;

export const BASELINE_SAFETY_NOTES = getBaselineSafetyNotes(DEFAULT_LOCALE);

export const GENERIC_URGENT_WARNING = getUrgentWarning(DEFAULT_LOCALE);

export function getReportTypeLabel(value: string, locale: Locale = DEFAULT_LOCALE) {
  return getLocalizedReportTypeLabel(value, locale);
}

export function getInputTypeLabel(value: string, locale: Locale = DEFAULT_LOCALE) {
  return getLocalizedInputTypeLabel(value as InputType, locale);
}

export function getDirection(language?: string) {
  return getLocaleDirection(localeFromLanguage(language));
}

export function formatDate(value: string | Date, locale: Locale = DEFAULT_LOCALE) {
  const dateLocale = locale === "ar" ? "ar-SA" : locale;
  return new Intl.DateTimeFormat(dateLocale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function statusBadgeClass(status: ValueStatus) {
  const classes: Record<ValueStatus, string> = {
    Normal:
      "border-[var(--color-status-normal-border)] bg-[var(--color-status-normal-bg)] text-[var(--color-status-normal-text)]",
    Low: "border-[var(--color-status-caution-border)] bg-[var(--color-status-caution-bg)] text-[var(--color-status-caution-text)]",
    High: "border-[var(--color-status-caution-border)] bg-[var(--color-status-caution-bg)] text-[var(--color-status-caution-text)]",
    Borderline:
      "border-[var(--color-status-borderline-border)] bg-[var(--color-status-borderline-bg)] text-[var(--color-status-borderline-text)]",
    "Needs review":
      "border-[var(--color-status-review-border)] bg-[var(--color-status-review-bg)] text-[var(--color-status-review-text)]",
    Unknown:
      "border-[var(--color-status-unknown-border)] bg-[var(--color-status-unknown-bg)] text-[var(--color-status-unknown-text)]",
  };

  return classes[status] ?? classes.Unknown;
}

export function deriveTitle(
  reportType: string,
  analysis?: AnalysisResult,
  locale: Locale = DEFAULT_LOCALE,
) {
  const detected = analysis?.detected_report_type?.trim();
  const type = detected || getReportTypeLabel(reportType, locale);
  const dateLocale = locale === "ar" ? "ar-SA" : locale;
  const date = new Intl.DateTimeFormat(dateLocale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return `${type} - ${date}`;
}

export function parseAnalysis(value: string, language?: string): AnalysisResult {
  const parsed = JSON.parse(value) as Partial<AnalysisResult>;
  const locale = localeFromLanguage(language);

  return {
    detected_report_type: parsed.detected_report_type,
    simple_summary: parsed.simple_summary ?? t(locale, "analysis.noSummary"),
    key_findings: Array.isArray(parsed.key_findings) ? parsed.key_findings : [],
    values_table: Array.isArray(parsed.values_table) ? parsed.values_table : [],
    medical_terms: Array.isArray(parsed.medical_terms) ? parsed.medical_terms : [],
    doctor_questions: Array.isArray(parsed.doctor_questions)
      ? parsed.doctor_questions
      : [],
    safety_notes: Array.isArray(parsed.safety_notes)
      ? ensureBaselineSafetyNotes(parsed.safety_notes, locale)
      : getBaselineSafetyNotes(locale),
    urgent_warning: parsed.urgent_warning ?? {
      has_red_flags: false,
      message: getUrgentWarning(locale),
    },
  };
}

export function ensureBaselineSafetyNotes(
  notes: string[],
  locale: Locale = DEFAULT_LOCALE,
) {
  const normalized = notes.map((note) => note.toLowerCase());
  const hasDiagnosis = normalized.some(
    (note) =>
      note.includes("diagnosis") ||
      note.includes("tanı") ||
      note.includes("تشخيص"),
  );
  const hasProfessional = normalized.some(
    (note) =>
      note.includes("licensed") ||
      note.includes("doctor") ||
      note.includes("healthcare professional") ||
      note.includes("doktor") ||
      note.includes("sağlık") ||
      note.includes("طبيب") ||
      note.includes("صحي"),
  );
  const baseline = getBaselineSafetyNotes(locale);

  return [
    ...notes,
    ...(hasDiagnosis ? [] : [baseline[0]]),
    ...(hasProfessional ? [] : [baseline[1]]),
  ];
}
