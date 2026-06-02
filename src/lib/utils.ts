import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AnalysisResult, InputType, ValueStatus } from "@/lib/types";

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

export const BASELINE_SAFETY_NOTES = [
  "This explanation is for understanding only and is not a diagnosis.",
  "Please discuss these results with a licensed healthcare professional.",
];

export const GENERIC_URGENT_WARNING =
  "This summary cannot detect emergencies. If you experience chest pain, severe shortness of breath, fainting, confusion, severe bleeding, or severe pain, seek urgent medical care.";

export function getReportTypeLabel(value: string) {
  return REPORT_TYPES.find((type) => type.value === value)?.label ?? "Medical report";
}

export function getInputTypeLabel(value: string) {
  const labels: Record<InputType, string> = {
    text: "Text",
    pdf: "PDF",
    image: "Image",
  };

  return labels[value as InputType] ?? "Input";
}

export function getDirection(language?: string) {
  return language === "Arabic" ? "rtl" : "ltr";
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
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

export function deriveTitle(reportType: string, analysis?: AnalysisResult) {
  const detected = analysis?.detected_report_type?.trim();
  const type = detected || getReportTypeLabel(reportType);
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return `${type} - ${date}`;
}

export function parseAnalysis(value: string): AnalysisResult {
  const parsed = JSON.parse(value) as Partial<AnalysisResult>;

  return {
    detected_report_type: parsed.detected_report_type,
    simple_summary: parsed.simple_summary ?? "No summary was returned for this report.",
    key_findings: Array.isArray(parsed.key_findings) ? parsed.key_findings : [],
    values_table: Array.isArray(parsed.values_table) ? parsed.values_table : [],
    medical_terms: Array.isArray(parsed.medical_terms) ? parsed.medical_terms : [],
    doctor_questions: Array.isArray(parsed.doctor_questions)
      ? parsed.doctor_questions
      : [],
    safety_notes: Array.isArray(parsed.safety_notes)
      ? ensureBaselineSafetyNotes(parsed.safety_notes)
      : BASELINE_SAFETY_NOTES,
    urgent_warning: parsed.urgent_warning ?? {
      has_red_flags: false,
      message: GENERIC_URGENT_WARNING,
    },
  };
}

export function ensureBaselineSafetyNotes(notes: string[]) {
  const normalized = notes.map((note) => note.toLowerCase());
  const hasDiagnosis = normalized.some((note) => note.includes("diagnosis"));
  const hasProfessional = normalized.some(
    (note) =>
      note.includes("licensed") ||
      note.includes("doctor") ||
      note.includes("healthcare professional"),
  );

  return [
    ...notes,
    ...(hasDiagnosis ? [] : [BASELINE_SAFETY_NOTES[0]]),
    ...(hasProfessional ? [] : [BASELINE_SAFETY_NOTES[1]]),
  ];
}
