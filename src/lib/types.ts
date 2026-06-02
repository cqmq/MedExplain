export type ValueStatus =
  | "Normal"
  | "Low"
  | "High"
  | "Borderline"
  | "Needs review"
  | "Unknown";

export type InputType = "text" | "pdf" | "image";

export interface KeyFinding {
  title: string;
  explanation: string;
}

export interface ValueRow {
  test_name: string;
  value: string;
  reference_range: string;
  status: ValueStatus;
  simple_meaning: string;
}

export interface MedicalTerm {
  term: string;
  meaning: string;
}

export interface UrgentWarning {
  has_red_flags: boolean;
  message: string;
}

export interface AnalysisResult {
  detected_report_type?: string;
  simple_summary: string;
  key_findings: KeyFinding[];
  values_table: ValueRow[];
  medical_terms: MedicalTerm[];
  doctor_questions: string[];
  safety_notes: string[];
  urgent_warning: UrgentWarning;
}

export interface ReportListItem {
  id: string;
  title: string;
  reportType: string;
  inputType: InputType;
  language: string;
  createdAt: string | Date;
  shortSummary: string;
}

export interface ReportDetail {
  id: string;
  title: string;
  reportType: string;
  inputType: InputType;
  originalText: string | null;
  sourceName: string | null;
  language: string;
  createdAt: string | Date;
  analysis: AnalysisResult;
}
