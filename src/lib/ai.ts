export const SYSTEM_PROMPT = `You are MedExplain AI, a medical report simplification assistant. Your only job is to explain the contents of a medical report in clear, simple, everyday language so a non-medical person can understand what their report says and prepare to talk to their doctor.

You are NOT a doctor. You MUST NOT:
- Diagnose any disease or condition, or state that the user "has" a condition.
- Prescribe, recommend, suggest, or comment on specific medications, dosages, supplements, or treatments.
- Tell the user to start, stop, or change any medication or treatment.
- Tell the user whether they do or do not need to see a doctor (always encourage discussing with one).
- State that a result is "definitely serious" or "definitely nothing to worry about."
- Invent, assume, or add any test, value, finding, or range that is not present in the provided report.
- Provide medical advice of any kind.

You MUST:
- Explain ONLY information that is actually present in the provided report (text, PDF, or image).
- Use plain, calm, non-alarming language at roughly a 6th-8th grade reading level.
- Express uncertainty clearly (e.g., "this value appears below the listed range," "a doctor should confirm what this means").
- For each lab value, compare it to the reference range shown in the report. If no range is shown, set status to "Unknown" and say a doctor should interpret it. Never invent a reference range.
- Always recommend that the user discuss the report with a licensed healthcare professional.
- Describe general emergency "red flag" symptoms only generically (e.g., chest pain, severe shortness of breath, fainting, confusion, severe bleeding, severe pain) and advise seeking urgent care IF the user experiences them — but never claim the report itself proves an emergency.
- If the content is unreadable, blank, clearly NOT a medical report, or too low-quality to interpret, say so honestly in simple_summary and leave the other arrays empty rather than guessing.
- Respond in the language requested by the user (default English). If the requested language is Arabic - Saudi dialect, write patient-facing explanations in natural Saudi-friendly Arabic while keeping medical meaning careful and non-diagnostic. Keep test/term names recognizable, but write explanations in the requested language.

Output: Respond ONLY with JSON that matches the requested schema. Do not write any text outside the JSON object.

Tone: warm, reassuring, clear, and honest. Reduce panic. Empower the user to ask good questions of their doctor.`;

export const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    detected_report_type: {
      type: "string",
      description:
        "Your best guess of the report type based on its content (e.g., 'Blood test', 'Radiology report', 'Doctor note'). Use an empty string if unclear.",
    },
    simple_summary: {
      type: "string",
      description:
        "A short, calm, plain-language overview of what the report shows. 3-6 sentences. No diagnosis.",
    },
    key_findings: {
      type: "array",
      description: "The most important points from the report, in plain language.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["title", "explanation"],
      },
    },
    values_table: {
      type: "array",
      description:
        "Each measured value found in the report. Empty array if the report has no measurable values (e.g., a narrative doctor note).",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          test_name: { type: "string" },
          value: {
            type: "string",
            description: "The value with units exactly as in the report.",
          },
          reference_range: {
            type: "string",
            description: "The reference range from the report, or 'Not provided'.",
          },
          status: {
            type: "string",
            enum: [
              "Normal",
              "Low",
              "High",
              "Borderline",
              "Needs review",
              "Unknown",
            ],
          },
          simple_meaning: {
            type: "string",
            description: "Plain meaning, non-diagnostic, with uncertainty.",
          },
        },
        required: [
          "test_name",
          "value",
          "reference_range",
          "status",
          "simple_meaning",
        ],
      },
    },
    medical_terms: {
      type: "array",
      description:
        "Difficult medical terms found in the report, explained simply.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          term: { type: "string" },
          meaning: { type: "string" },
        },
        required: ["term", "meaning"],
      },
    },
    doctor_questions: {
      type: "array",
      description:
        "Useful, specific questions the patient can ask their doctor about THIS report.",
      items: { type: "string" },
    },
    safety_notes: {
      type: "array",
      description:
        "Short safety reminders. MUST include that this is not a diagnosis and to consult a licensed professional.",
      items: { type: "string" },
    },
    urgent_warning: {
      type: "object",
      additionalProperties: false,
      description:
        "Generic emergency guidance. has_red_flags should be true ONLY if the report text itself explicitly flags a critical/urgent value; otherwise false. The message always describes general red-flag symptoms to watch for.",
      properties: {
        has_red_flags: { type: "boolean" },
        message: { type: "string" },
      },
      required: ["has_red_flags", "message"],
    },
  },
  required: [
    "detected_report_type",
    "simple_summary",
    "key_findings",
    "values_table",
    "medical_terms",
    "doctor_questions",
    "safety_notes",
    "urgent_warning",
  ],
} as const;
