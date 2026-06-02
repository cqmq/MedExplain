import { describe, expect, it } from "vitest";
import {
  deriveTitle,
  ensureBaselineSafetyNotes,
  formatFileSize,
  getDirection,
  parseAnalysis,
  statusBadgeClass,
} from "@/lib/utils";

describe("utils", () => {
  it("maps status values to semantic token classes", () => {
    expect(statusBadgeClass("Normal")).toContain("--color-status-normal-bg");
    expect(statusBadgeClass("High")).toContain("--color-status-caution-bg");
    expect(statusBadgeClass("Unknown")).toContain("--color-status-unknown-bg");
  });

  it("derives readable report titles", () => {
    expect(deriveTitle("blood_test")).toContain("Blood test -");
    expect(
      deriveTitle("unsure", {
        detected_report_type: "Radiology report",
        simple_summary: "",
        key_findings: [],
        values_table: [],
        medical_terms: [],
        doctor_questions: [],
        safety_notes: [],
        urgent_warning: { has_red_flags: false, message: "" },
      }),
    ).toContain("Radiology report -");
  });

  it("normalizes parsed analysis and preserves baseline safety notes", () => {
    const analysis = parseAnalysis(
      JSON.stringify({
        simple_summary: "Readable summary.",
        safety_notes: ["Discuss this report with your doctor."],
      }),
    );

    expect(analysis.key_findings).toEqual([]);
    expect(analysis.safety_notes.join(" ")).toContain("not a diagnosis");
    expect(analysis.urgent_warning.has_red_flags).toBe(false);
  });

  it("adds missing safety requirements without duplicating present ones", () => {
    const notes = ensureBaselineSafetyNotes([
      "This is not a diagnosis.",
      "Consult a licensed healthcare professional.",
    ]);

    expect(notes).toHaveLength(2);
  });

  it("formats file sizes and RTL language direction", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(2 * 1024 * 1024)).toBe("2.0 MB");
    expect(getDirection("Arabic")).toBe("rtl");
    expect(getDirection("Turkish")).toBe("ltr");
  });
});
