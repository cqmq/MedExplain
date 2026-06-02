# MedExplain AI — MVP Product Requirements Document (PRD)

> **AI-Powered Medical Report Simplification & Patient Understanding System**
> Single-shot build specification for **Claude Code (Opus)**.

-----

## 0. HOW TO USE THIS DOCUMENT (read first — for Claude Code)

You are building a **complete, working, runnable MVP** in one shot from this PRD. Treat every section as a hard requirement unless it is explicitly labeled *optional* or *future*.

**Your job:**

1. Scaffold a full **Next.js (App Router) + TypeScript** application exactly as described.
1. Implement **all four pages**, **all API routes**, the **database**, and the **AI integration** (with the exact system prompt and tool schema given in §11).
1. Support **three input methods**: **(a) pasted text, (b) uploaded PDF, (c) uploaded image** — all flowing into the same analysis pipeline.
1. Use the **exact JSON/tool schema** in §11 so output is always structured and reliable.
1. Enforce **every safety rule** in §15 (this is a medical-adjacent product — guardrails are non-negotiable).
1. Make it **run locally with zero external accounts**: use **SQLite via Prisma** for storage. The only secret required is `ANTHROPIC_API_KEY`.
1. After building, ensure `npm install` → `npx prisma migrate dev` → `npm run dev` produces a working app, and write a clear `README.md`.

**Build order is in §20. Acceptance criteria (definition of done) is in §19. Follow both.**

Do not ask clarifying questions — make sensible decisions and ship the full MVP. Where this PRD gives reference code, use it; where it gives prose specs, implement faithfully with clean, production-quality code.

-----

## 1. Product Overview

**MedExplain AI** is a web app that helps patients understand medical reports (lab results, blood/urine tests, radiology summaries, prescriptions, and doctor notes). A user **pastes text, uploads a PDF, or uploads an image** of their report. The AI returns a structured, plain-language explanation: a simple summary, key findings, a values table (normal/abnormal), explained medical terms, questions to ask their doctor, and safety notes. The result can be saved, revisited from a history dashboard, and exported to PDF.

**Positioning:** A patient-friendly assistant that helps people *understand* reports and *prepare for doctor visits*.
**It is explicitly NOT:** an AI doctor, a diagnosis tool, a treatment recommender, or a replacement for a medical professional.

### Why this beats “just pasting into a chatbot”

- **Structured, predictable output** every time (fixed sections, color-coded value statuses).
- **Hard safety boundaries** (no diagnosis, no medication advice).
- **Guided workflow + dashboard + PDF export** — feels like a real product, not a chat box.
- **Multi-modal input** (text/PDF/image) handled natively.

-----

## 2. Goals & Non-Goals

### Goals (MVP must achieve)

- Accept medical report input as **text, PDF, or image**.
- Produce a **structured, safe, plain-language explanation** via the Claude API.
- Present results in a **clean, calm, medical-grade UI** with color-coded value statuses.
- **Persist** every analysis to a local database and expose a **history dashboard**.
- Allow **PDF export** of any report’s explanation.
- Allow **deleting** saved reports.
- Be **deployable** (Vercel-ready) and **runnable locally** with a single API key.

### Non-Goals (out of scope for MVP — see §22)

- Real user authentication / accounts.
- Real medical-database or hospital/EHR integration.
- Diagnosis, prognosis, treatment, or prescription features.
- Appointment booking.
- Report-over-time comparison (future).
- OCR libraries (not needed — Claude reads images/PDFs natively).

-----

## 3. Target Users

- **Patients** receiving lab/scan/test results or doctor notes.
- **Families** helping relatives interpret documents.
- **Health/medical students** studying sample reports.
- **Small clinics** generating patient-friendly explanations after visits.
- (Evaluation context: a strong graduation/capstone project demonstrating applied AI, multi-modal document processing, structured output, responsible-AI guardrails, persistence, and polished UX.)

-----

## 4. Core User Flow

1. **Landing page** → hero + “Analyze a Report” and “Try a Demo Report” CTAs.
1. **Analyze page** → user provides input via one of three tabs/zones:
- **Paste text** (textarea), or
- **Upload PDF** (drag-and-drop or file picker), or
- **Upload image** (drag-and-drop or file picker; JPG/PNG/WebP).
1. User picks a **report type** (Blood test, Urine test, Radiology, Prescription, Doctor note, General, Not sure).
1. User picks **output language** (default English; also Turkish, Arabic — see §13.2).
1. User **ticks the consent/disclaimer checkbox** (required to enable Analyze).
1. User clicks **Analyze** → loading state with rotating messages.
1. API extracts/forwards content → calls Claude with the structured tool → saves to DB.
1. User lands on the **Report page** (`/reports/[id]`) showing all result sections.
1. User can **Download PDF**, **Copy summary**, **Analyze another**, or go to **History**.
1. **History/Dashboard** lists all saved reports; each opens its Report page; each can be deleted.

-----

## 5. Tech Stack (use exactly this)

|Layer            |Choice                                                       |Notes                                                                                                                               |
|-----------------|-------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
|Framework        |**Next.js (App Router) + TypeScript**                        |Use `create-next-app`, latest stable.                                                                                               |
|Styling          |**Tailwind CSS**                                             |As configured by shadcn/ui init.                                                                                                    |
|UI components    |**shadcn/ui**                                                |button, card, input, textarea, select, checkbox, tabs, table, badge, dialog, sonner (toast), skeleton, alert, separator, label.     |
|Icons            |**lucide-react**                                             |                                                                                                                                    |
|AI               |**`@anthropic-ai/sdk`**                                      |Claude API, native image + PDF support.                                                                                             |
|AI model         |**`claude-sonnet-4-6`** (default)                            |Best quality/cost balance for this task; vision-capable. Allow override to `claude-opus-4-8` via `MODEL` env var for higher quality.|
|Database         |**SQLite via Prisma**                                        |Zero external setup; ships as `file:./dev.db`. Swappable to Postgres/Supabase in prod.                                              |
|PDF export       |**Browser print (`window.print()`)** with print-optimized CSS|Reliable, zero-dependency. (Optional: `react-to-print`.)                                                                            |
|Deployment target|**Vercel**                                                   |App must build cleanly (`npm run build`).                                                                                           |


> **Reasoning to keep:** Claude 4 models accept **images** and **PDFs natively** through the Messages API, so **no OCR or pdf-parse library is required** — send the file bytes and let the model read it. This is more robust (handles scanned/low-quality reports) and far simpler than an OCR pipeline.

-----

## 6. Environment Variables

Create `.env.example` and `.env`:

```env
# Required — get from https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx

# Database (SQLite local file)
DATABASE_URL="file:./dev.db"

# Optional — defaults to claude-sonnet-4-6
MODEL=claude-sonnet-4-6
```

- **Never** expose `ANTHROPIC_API_KEY` to the client. All AI calls happen in server-side API routes only.
- Add `.env` and `dev.db` to `.gitignore`.

-----

## 7. Project Structure

```
medexplain-ai/
├── prisma/
│   └── schema.prisma
├── public/
│   └── (logo / favicon optional)
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout: header nav, toaster, theme
│   │   ├── globals.css               # Tailwind + print styles (@media print)
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── analyze/
│   │   │   └── page.tsx              # Analyze/input page (/analyze)
│   │   ├── reports/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Result + detail page (/reports/[id])
│   │   ├── history/
│   │   │   └── page.tsx              # Dashboard list (/history)
│   │   └── api/
│   │       ├── analyze/route.ts      # POST: run analysis, persist, return result
│   │       └── reports/
│   │           ├── route.ts          # GET: list reports
│   │           └── [id]/route.ts     # GET one, DELETE one
│   ├── components/
│   │   ├── ui/                        # shadcn/ui generated components
│   │   ├── site-header.tsx
│   │   ├── disclaimer-banner.tsx      # reusable safety banner
│   │   ├── input-tabs.tsx            # text / PDF / image input switcher
│   │   ├── report-type-select.tsx
│   │   ├── language-select.tsx
│   │   ├── analyze-form.tsx          # client component orchestrating the form + submit
│   │   ├── result/
│   │   │   ├── result-view.tsx       # composes all result cards (shared by analyze result + detail)
│   │   │   ├── summary-card.tsx
│   │   │   ├── urgent-warning-card.tsx
│   │   │   ├── key-findings-card.tsx
│   │   │   ├── values-table.tsx
│   │   │   ├── medical-terms-card.tsx
│   │   │   ├── doctor-questions-card.tsx
│   │   │   └── safety-notes-card.tsx
│   │   ├── report-actions.tsx        # Download PDF / Copy / Analyze another
│   │   └── history-card.tsx
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── ai.ts                     # SYSTEM_PROMPT + ANALYSIS_TOOL schema + helpers
│   │   ├── types.ts                  # TypeScript types for analysis result
│   │   ├── demo.ts                   # demo sample report text
│   │   └── utils.ts                  # cn(), status color mapping, title derivation
│   └── ...
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

-----

## 8. Data Model

### Prisma schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Report {
  id           String   @id @default(cuid())
  title        String                       // e.g. "Blood Test — Jun 2, 2026"
  reportType   String                       // user-selected type key
  inputType    String                       // "text" | "pdf" | "image"
  originalText String?                       // present for text input or extracted text; null for files
  sourceName   String?                       // original filename for PDF/image uploads
  language     String   @default("English")
  analysis     String                        // JSON string of the full analysis object (see §11)
  createdAt    DateTime @default(now())
}
```

> `analysis` is stored as a **JSON string** (SQLite has no native JSON column via Prisma). Parse with `JSON.parse` on read, `JSON.stringify` on write. Provide a typed helper in `lib/types.ts`.

### TypeScript analysis type (`lib/types.ts`)

```ts
export type ValueStatus =
  | "Normal" | "Low" | "High" | "Borderline" | "Needs review" | "Unknown";

export interface KeyFinding { title: string; explanation: string; }

export interface ValueRow {
  test_name: string;
  value: string;
  reference_range: string;
  status: ValueStatus;
  simple_meaning: string;
}

export interface MedicalTerm { term: string; meaning: string; }

export interface UrgentWarning { has_red_flags: boolean; message: string; }

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
```

-----

## 9. Input Handling (TEXT / PDF / IMAGE) — required, all three

The Analyze page must offer all three input modes. The client sends a **`multipart/form-data`** POST to `/api/analyze` with these fields:

|Field       |Type             |Notes                              |
|------------|-----------------|-----------------------------------|
|`reportType`|string           |one of the type keys in §13.1      |
|`language`  |string           |“English” | “Turkish” | “Arabic”   |
|`consent`   |string           |must be `"true"`                   |
|`text`      |string (optional)|present when input mode = text     |
|`file`      |File (optional)  |present when input mode = pdf/image|

**Server determines the input type from what was sent:**

- **Text:** `text` present and `>= 20` non-whitespace characters → send as a text content block.
- **PDF:** `file.type === "application/pdf"` → base64-encode bytes → send as a **`document`** content block. (Claude reads PDFs natively, including scanned ones.)
- **Image:** `file.type ∈ {image/jpeg, image/png, image/webp, image/gif}` → base64-encode → send as an **`image`** content block. (Claude reads images natively — no OCR.)

**Validation & limits (return friendly 400s):**

- Reject if no text and no file.
- Reject text shorter than 20 chars: *“Please paste a longer report (at least 20 characters) or upload a file.”*
- Reject unsupported file types: *“Unsupported file type. Upload a PDF or an image (JPG, PNG, WebP).”*
- Enforce size caps client- and server-side: **PDF ≤ 25 MB**, **image ≤ 5 MB**. Friendly message on exceed.
- Reject if `consent !== "true"`: *“Please confirm the disclaimer before analyzing.”*

**Client-side UX for files:** drag-and-drop zone + click-to-browse, show selected filename + size + a remove (×) button, and a thumbnail preview for images. Switching input tabs clears the other inputs.

-----

## 10. AI Integration — overview

- All AI calls run **server-side only** in `/api/analyze`.
- Use **tool use / structured output**: define a single tool `present_report_analysis` whose `input_schema` exactly matches the analysis structure, and force it with `tool_choice: { type: "tool", name: "present_report_analysis" }`. This guarantees valid, schema-conformant JSON every time (no fragile string parsing).
- Model: `process.env.MODEL || "claude-sonnet-4-6"`. `max_tokens: 8000`.
- The user message content array contains: the report content block (text/document/image) **plus** a text instruction block stating the selected report type and target language and asking the model to call the tool.

-----

## 11. AI Prompt & Output Schema (USE EXACTLY) — `lib/ai.ts`

### 11.1 System prompt (verbatim)

```ts
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
- Respond in the language requested by the user (default English). Keep test/term names recognizable, but write explanations in the requested language.

Output: Respond ONLY by calling the present_report_analysis tool with a complete, structured result. Do not write any text outside the tool call.

Tone: warm, reassuring, clear, and honest. Reduce panic. Empower the user to ask good questions of their doctor.`;
```

### 11.2 Tool / output schema (verbatim)

```ts
import Anthropic from "@anthropic-ai/sdk";

export const ANALYSIS_TOOL: Anthropic.Tool = {
  name: "present_report_analysis",
  description:
    "Return the structured, patient-friendly analysis of the medical report. Always call this tool with every required field populated based ONLY on the report content.",
  input_schema: {
    type: "object",
    properties: {
      detected_report_type: {
        type: "string",
        description: "Your best guess of the report type based on its content (e.g., 'Blood test', 'Radiology report', 'Doctor note').",
      },
      simple_summary: {
        type: "string",
        description: "A short, calm, plain-language overview of what the report shows. 3-6 sentences. No diagnosis.",
      },
      key_findings: {
        type: "array",
        description: "The most important points from the report, in plain language.",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            explanation: { type: "string" },
          },
          required: ["title", "explanation"],
        },
      },
      values_table: {
        type: "array",
        description: "Each measured value found in the report. Empty array if the report has no measurable values (e.g., a narrative doctor note).",
        items: {
          type: "object",
          properties: {
            test_name: { type: "string" },
            value: { type: "string", description: "The value with units exactly as in the report." },
            reference_range: { type: "string", description: "The reference range from the report, or 'Not provided'." },
            status: {
              type: "string",
              enum: ["Normal", "Low", "High", "Borderline", "Needs review", "Unknown"],
            },
            simple_meaning: { type: "string", description: "Plain meaning, non-diagnostic, with uncertainty." },
          },
          required: ["test_name", "value", "reference_range", "status", "simple_meaning"],
        },
      },
      medical_terms: {
        type: "array",
        description: "Difficult medical terms found in the report, explained simply.",
        items: {
          type: "object",
          properties: {
            term: { type: "string" },
            meaning: { type: "string" },
          },
          required: ["term", "meaning"],
        },
      },
      doctor_questions: {
        type: "array",
        description: "Useful, specific questions the patient can ask their doctor about THIS report.",
        items: { type: "string" },
      },
      safety_notes: {
        type: "array",
        description: "Short safety reminders. MUST include that this is not a diagnosis and to consult a licensed professional.",
        items: { type: "string" },
      },
      urgent_warning: {
        type: "object",
        description: "Generic emergency guidance. has_red_flags should be true ONLY if the report text itself explicitly flags a critical/urgent value; otherwise false. The message always describes general red-flag symptoms to watch for.",
        properties: {
          has_red_flags: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["has_red_flags", "message"],
      },
    },
    required: [
      "simple_summary",
      "key_findings",
      "values_table",
      "medical_terms",
      "doctor_questions",
      "safety_notes",
      "urgent_warning",
    ],
  },
};
```

### 11.3 Reference API route (`app/api/analyze/route.ts`)

```ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { SYSTEM_PROMPT, ANALYSIS_TOOL } from "@/lib/ai";
import { deriveTitle } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = process.env.MODEL || "claude-sonnet-4-6";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const reportType = (form.get("reportType") as string) || "general";
    const language = (form.get("language") as string) || "English";
    const consent = form.get("consent") as string;
    const text = form.get("text") as string | null;
    const file = form.get("file") as File | null;

    if (consent !== "true") {
      return NextResponse.json(
        { success: false, error: "Please confirm the disclaimer before analyzing." },
        { status: 400 }
      );
    }

    const content: Anthropic.MessageParam["content"] = [];
    let inputType: "text" | "pdf" | "image" = "text";
    let originalText: string | null = null;
    let sourceName: string | null = null;

    if (file && file.size > 0) {
      sourceName = file.name;
      const mime = file.type;
      const bytes = Buffer.from(await file.arrayBuffer());
      const base64 = bytes.toString("base64");

      if (mime === "application/pdf") {
        if (file.size > 25 * 1024 * 1024)
          return NextResponse.json({ success: false, error: "PDF is too large (max 25 MB)." }, { status: 400 });
        inputType = "pdf";
        content.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: base64 },
        } as any);
      } else if (IMAGE_TYPES.includes(mime)) {
        if (file.size > 5 * 1024 * 1024)
          return NextResponse.json({ success: false, error: "Image is too large (max 5 MB)." }, { status: 400 });
        inputType = "image";
        content.push({
          type: "image",
          source: { type: "base64", media_type: mime as any, data: base64 },
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Unsupported file type. Upload a PDF or an image (JPG, PNG, WebP)." },
          { status: 400 }
        );
      }
    } else if (text && text.trim().length >= 20) {
      inputType = "text";
      originalText = text.trim();
    } else {
      return NextResponse.json(
        { success: false, error: "Please paste a report (at least 20 characters) or upload a file." },
        { status: 400 }
      );
    }

    content.push({
      type: "text",
      text:
        `User-selected report type: ${reportType}\n` +
        `Write all explanations in this language: ${language}\n\n` +
        `Analyze the medical report ${inputType === "text" ? "below" : "in the attached file"} ` +
        `and call the present_report_analysis tool with the structured result. ` +
        `Only describe what is actually present. Do not diagnose or recommend treatment.` +
        (originalText ? `\n\n--- REPORT START ---\n${originalText}\n--- REPORT END ---` : ""),
    });

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools: [ANALYSIS_TOOL],
      tool_choice: { type: "tool", name: "present_report_analysis" },
      messages: [{ role: "user", content }],
    });

    const toolUse = message.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json(
        { success: false, error: "We could not analyze this report. Please try again." },
        { status: 502 }
      );
    }

    const analysis = toolUse.input as AnalysisResult;

    const report = await prisma.report.create({
      data: {
        title: deriveTitle(reportType, analysis),
        reportType,
        inputType,
        originalText,
        sourceName,
        language,
        analysis: JSON.stringify(analysis),
      },
    });

    return NextResponse.json({ success: true, id: report.id, analysis });
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong analyzing the report. Please try again." },
      { status: 500 }
    );
  }
}
```

> **Note on PDF support:** the `document` content block for PDFs is supported by Claude 4 models. If the runtime SDK version requires it, add the beta header when constructing the client (`new Anthropic({ apiKey, defaultHeaders: { "anthropic-beta": "pdfs-2024-09-25" } })`). If a PDF still fails, the friendly error path already tells the user to paste the text instead. Do **not** add an OCR dependency.

-----

## 12. API Endpoints (contracts)

### `POST /api/analyze`

- **Request:** `multipart/form-data` (see §9).
- **Success 200:** `{ "success": true, "id": "<reportId>", "analysis": AnalysisResult }`
- **Errors:** `400` (validation/consent), `502` (model returned no tool call), `500` (unexpected). Body: `{ "success": false, "error": "<friendly message>" }`.

### `GET /api/reports`

- Returns all reports, newest first, **without** the heavy `analysis`/`originalText` blobs (list view only needs metadata + a short summary).
- **200:** `{ "reports": [{ id, title, reportType, inputType, language, createdAt, shortSummary }] }`
  - `shortSummary` = first ~140 chars of `analysis.simple_summary`.

### `GET /api/reports/[id]`

- **200:** `{ report: { id, title, reportType, inputType, originalText, sourceName, language, createdAt, analysis: AnalysisResult } }`
- **404:** `{ "error": "Report not found." }`

### `DELETE /api/reports/[id]`

- Deletes the report.
- **200:** `{ "success": true }`  •  **404** if missing.

> The Report detail page and History page may also use **server components** that read from Prisma directly instead of going through these routes. Either approach is acceptable; keep `DELETE` and `GET list` as routes for the client-side actions.

-----

## 13. Pages & UI Specifications

Global: a **site header** (`site-header.tsx`) on all pages with the MedExplain AI wordmark/logo (use a Lucide icon such as `Stethoscope` or `HeartPulse`) and nav links: **Home**, **Analyze**, **History**. Include a persistent slim **disclaimer footer** on every page: *“MedExplain AI explains reports in simple language. It is not a diagnosis and does not replace a doctor.”*

### 13.1 Landing Page — `/`

Sections, top to bottom:

1. **Hero** — Title: *“Understand your medical reports in simple language.”* Subtitle: *“Paste, upload a PDF, or upload a photo of your report and get a clear explanation, key findings, doctor questions, and a downloadable summary.”* Primary CTA **“Analyze a Report”** → `/analyze`. Secondary CTA **“Try a Demo Report”** → `/analyze?demo=1` (pre-fills the demo text from `lib/demo.ts`).
1. **How it works** — 3 steps with icons: *Upload or paste your report → AI explains it simply → Save or download your summary.*
1. **Features** — cards: Simple summary, Normal/abnormal values, Medical terms dictionary, Doctor questions, PDF export, Report history. Mention **“Works with text, PDFs, and images.”**
1. **Safety section** — clear panel: *“Not a diagnosis. For understanding only. Always consult a licensed healthcare professional.”*
1. **Final CTA** — repeat “Analyze a Report.”

**Report type keys** (used app-wide; value → label):
`blood_test`→Blood test, `urine_test`→Urine test, `radiology`→Radiology report, `prescription`→Prescription, `doctor_note`→Doctor note, `general`→General medical report, `unsure`→I’m not sure.

### 13.2 Analyze Page — `/analyze` (the main working page)

A single card containing `analyze-form.tsx` (client component):

- **Input switcher** (`input-tabs.tsx`) with **three tabs**:
  - **Paste text** → large `Textarea` (placeholder shows an example). Character counter.
  - **Upload PDF** → drag-and-drop + browse; accepts `application/pdf`; shows filename + size + remove.
  - **Upload image** → drag-and-drop + browse; accepts JPG/PNG/WebP; shows preview thumbnail + remove.
  - Switching tabs clears other inputs so only one input is submitted.
- **Report type select** (`report-type-select.tsx`) — the keys above; default `unsure`.
- **Language select** (`language-select.tsx`) — English (default), Turkish, Arabic.
- **Consent checkbox** (`disclaimer-banner.tsx` + checkbox) — text: *“I understand this tool does not diagnose medical conditions or replace a doctor. It only explains my report in simple language.”* The **Analyze** button is **disabled** until checked **and** a valid input exists.
- **Analyze button** → builds `FormData`, POSTs to `/api/analyze`, shows **loading state** with rotating messages: *“Reading your report…” → “Simplifying medical terms…” → “Preparing your summary…”* (cycle every ~1.8s). On success, `router.push("/reports/" + id)`. On error, show a toast (sonner) with the server’s message.
- **Demo:** if `?demo=1`, auto-select the Paste-text tab and fill the textarea with `DEMO_REPORT` from `lib/demo.ts`, set report type to `blood_test`.

### 13.3 Report Page — `/reports/[id]` (results + detail; the most important page)

Server component fetches the report (Prisma) and renders `result-view.tsx`. If not found → friendly 404 with link back to History. Layout (each section is a shadcn `Card`):

- **Header row:** report title, created date, type badge, input-type badge (Text/PDF/Image), and `report-actions.tsx` (**Download PDF**, **Copy summary**, **Analyze another**).
- **A. Urgent warning** (`urgent-warning-card.tsx`) — render **only as a soft, non-alarming notice**. If `urgent_warning.has_red_flags` is true, use an amber `Alert` (not red panic); otherwise show a muted info note. Always show the generic red-flag guidance message.
- **B. Simple summary** (`summary-card.tsx`).
- **C. Key findings** (`key-findings-card.tsx`) — list of {title, explanation}.
- **D. Values table** (`values-table.tsx`) — shadcn `Table`, columns: **Test • Your value • Reference range • Status • Simple meaning**. Status rendered as a colored `Badge` (see §14 color mapping). If `values_table` is empty, hide this card.
- **E. Medical terms** (`medical-terms-card.tsx`) — term → meaning. Hide if empty.
- **F. Questions to ask your doctor** (`doctor-questions-card.tsx`) — checklist-style list (each item with a Lucide `HelpCircle`/`MessageCircleQuestion`). Include a small “Copy all questions” button.
- **G. Safety notes** (`safety-notes-card.tsx`) — always shown.
- **Original report** (collapsible) — if `inputType === "text"`, show `originalText` in a `<details>`/accordion. If file input, show *“Analyzed from uploaded file: {sourceName}”*.
- **Footer disclaimer** (always).

### 13.4 History / Dashboard — `/history`

- Heading + “Analyze a Report” button.
- Grid of `history-card.tsx` for each saved report: title, type badge, input-type badge, date, `shortSummary`, **View** (→ `/reports/[id]`) and **Delete** (confirmation `Dialog`; on confirm call `DELETE /api/reports/[id]`, then refresh list + success toast).
- **Empty state:** friendly illustration/icon + *“No reports yet. Analyze your first report to see it here.”* + CTA.

-----

## 14. Design System / Visual Style

Goal: **clean, calm, trustworthy, medical** — not a chatbot, not scary.

- **Background:** white / very light gray (`#ffffff` / `#f8fafc`). Dark mode optional but not required.
- **Accent:** calm medical **teal/blue** (e.g., Tailwind `teal-600` / `sky-600`) and a soft **green** for “healthy/normal.”
- **Cards:** rounded-2xl, soft shadow, generous padding, clear section titles with a small Lucide icon.
- **Typography:** clean sans (Inter or system). Comfortable line-height; summaries readable.
- **No aggressive reds** except genuine safety/urgent elements — and even those use **amber**, not alarming crimson, to avoid panic.
- **Value status → color mapping** (implement in `lib/utils.ts`, render as `Badge`):

|status      |color intent|Tailwind suggestion              |
|------------|------------|---------------------------------|
|Normal      |green       |`bg-emerald-100 text-emerald-800`|
|Low         |amber       |`bg-amber-100 text-amber-800`    |
|High        |amber       |`bg-amber-100 text-amber-800`    |
|Borderline  |yellow      |`bg-yellow-100 text-yellow-800`  |
|Needs review|blue        |`bg-sky-100 text-sky-800`        |
|Unknown     |gray        |`bg-slate-100 text-slate-700`    |

- **Responsive:** mobile-first; cards stack on small screens; the values table scrolls horizontally on mobile.
- **Loading:** skeletons / spinner with the rotating messages.
- **Print styles (`@media print`)** in `globals.css`: hide header/nav/footer/buttons (`.no-print`), expand all collapsibles, ensure cards print cleanly on white, keep the disclaimer visible. The **Download PDF** button calls `window.print()`.

-----

## 15. Safety & Compliance Requirements (NON-NEGOTIABLE)

These are enforced by the **system prompt (§11.1)**, the **schema**, and the **UI**:

- The product **never diagnoses**, never names a disease the user “has,” and never prescribes/changes medication or treatment.
- The product **never** says a result is “definitely serious” or “definitely fine.”
- The product **never invents** values or reference ranges not in the report.
- **Disclaimers must appear** on: the landing page, the analyze page (consent gate), the report page, and the **exported PDF**.
- `safety_notes` must always include “this is not a diagnosis” and “consult a licensed professional” — if the model omits them, the UI should still render a hard-coded baseline disclaimer card.
- The urgent/red-flag guidance is **generic** (“if you experience chest pain, severe shortness of breath, fainting, confusion, severe bleeding, or severe pain, seek urgent medical care”) and is presented calmly (amber, not red panic).
- Consent checkbox is **required** to enable analysis.

**Allowed phrasing examples** (for the model & UI copy): *“This value appears above the listed reference range,” “A doctor should confirm what this means,” “You may want to ask your doctor whether…”*
**Forbidden:** *“You have diabetes,” “Take 1000 IU of vitamin D,” “Stop your medication,” “You don’t need a doctor.”*

-----

## 16. Demo / Sample Data (`lib/demo.ts`)

Ship a realistic demo so “Try a Demo Report” works offline-of-mind for evaluators:

```ts
export const DEMO_REPORT = `Complete Blood Count & Metabolic Panel
Patient: (sample)   Date: 2026-06-02
Hemoglobin: 14.2 g/dL (Ref: 13.0-17.0)
White Blood Cells (WBC): 11.5 x10^9/L (Ref: 4.0-11.0)
Platelets: 250 x10^9/L (Ref: 150-400)
Vitamin D (25-OH): 14 ng/mL (Ref: 30-100)
Fasting Glucose: 98 mg/dL (Ref: 70-99)
Total Cholesterol: 205 mg/dL (Ref: <200)
Notes: Patient reports occasional fatigue.`;
```

Expected behavior on this demo: Hemoglobin/Platelets/Glucose ≈ Normal; WBC slightly High; Vitamin D Low; Cholesterol Borderline/High; clear “not a diagnosis”; doctor questions about vitamin D and cholesterol follow-up.

-----

## 17. Error Handling & Edge Cases

Handle gracefully (friendly messages, never crash):

- Empty input / too-short text / no file → 400 with guidance.
- Unsupported file type / oversized file → 400 with guidance.
- Consent not given → 400.
- Anthropic API failure / timeout / no tool call → 502/500 with *“We could not analyze this report. Please try again.”*
- Non-medical or unreadable content → the model returns a summary explaining it could not interpret the document; UI renders that summary and a prompt to try clearer input.
- Database write/read failure → 500 toast; do not lose the analysis on screen if possible.
- `/reports/[id]` with bad id → friendly 404 page with link to History.
- Show client-side validation before submit (disable Analyze appropriately).

-----

## 18. Security & Privacy

- `ANTHROPIC_API_KEY` is **server-only**; never sent to the browser or logged.
- Do not log full report contents to the console in production.
- Provide **Delete** for every report (user control over their data).
- README must state: *“Designed with privacy-first principles. This MVP stores reports locally in SQLite for demo purposes. A production deployment would add authentication, encryption at rest/in transit, access controls, and applicable healthcare-compliance measures.”*
- No third-party analytics in the MVP.

-----

## 19. Acceptance Criteria (Definition of Done)

The MVP is complete when **all** of these are true:

1. `npm install` → `npx prisma migrate dev --name init` → `npm run dev` starts the app with **no errors**.
1. **Landing page** renders with hero, how-it-works, features, safety section, and working CTAs.
1. **Analyze page** supports **all three inputs** (paste text, upload PDF, upload image), report-type select, language select, and a working consent gate.
1. Submitting any of the three input types calls `/api/analyze`, which calls Claude with the **forced tool**, receives **schema-valid structured output**, saves to the DB, and redirects to `/reports/[id]`.
1. **Report page** renders all sections (summary, key findings, values table with color-coded statuses, medical terms, doctor questions, safety notes, urgent notice), hides empty sections appropriately, and shows the original text (text input) or source filename (file input).
1. **Download PDF** produces a clean printable summary (via print styles) including the disclaimer.
1. **Copy summary** and **Copy all questions** work.
1. **History page** lists saved reports newest-first with View + Delete (with confirm); empty state shown when none.
1. **Delete** removes a report and updates the list.
1. **Safety:** disclaimers appear on landing, analyze, report, and PDF; the app never diagnoses or recommends medication (verified by the system prompt + a manual demo run).
1. **“Try a Demo Report”** pre-fills the demo and yields a sensible structured result.
1. App is responsive on mobile and `npm run build` succeeds.
1. `README.md` documents setup, env vars, run/build commands, and the privacy note.

-----

## 20. Build Order (follow this sequence)

1. **Scaffold:** `create-next-app` (TypeScript, App Router, Tailwind, `src/` dir, import alias `@/*`). Init **shadcn/ui** and add the components listed in §5. Install `@anthropic-ai/sdk`, `prisma`, `@prisma/client`, `lucide-react`.
1. **Prisma:** add `schema.prisma` (§8), create `lib/prisma.ts` singleton, run `prisma migrate dev`.
1. **Lib:** implement `lib/ai.ts` (system prompt + tool — verbatim from §11), `lib/types.ts`, `lib/demo.ts`, `lib/utils.ts` (`cn`, `statusBadgeClass`, `deriveTitle`).
1. **API routes:** `/api/analyze` (reference code §11.3), `/api/reports`, `/api/reports/[id]`.
1. **Layout & header:** root layout with `site-header`, sonner `<Toaster/>`, global + print CSS.
1. **Landing page** (§13.1).
1. **Analyze flow:** `input-tabs`, `report-type-select`, `language-select`, `analyze-form` with loading states + demo support (§13.2).
1. **Result components** (`result/*`) + **Report page** `/reports/[id]` (§13.3) + `report-actions`.
1. **History page** `/history` + `history-card` + delete dialog (§13.4).
1. **Polish:** responsive checks, empty/error states, skeletons, demo run, then write `README.md`. Run `npm run build` and fix any type/lint errors.

-----

## 21. Setup & Run Commands (put in README)

```bash
# 1. Install
npm install

# 2. Configure secrets
cp .env.example .env
#   then edit .env and set ANTHROPIC_API_KEY=...

# 3. Database
npx prisma migrate dev --name init

# 4. Run
npm run dev          # http://localhost:3000

# Build (for Vercel)
npm run build && npm start
```

**Deploy (Vercel):** push to GitHub, import in Vercel, set `ANTHROPIC_API_KEY` (and `DATABASE_URL`) as env vars. For Vercel persistence, note that SQLite is ephemeral on serverless — for a graded local/demo build SQLite is fine; for a hosted demo, swap `datasource` to a hosted Postgres (e.g., Supabase/Neon) and run `prisma migrate deploy`.

-----

## 22. Out of Scope (Future Improvements)

- Image OCR libraries (not needed — handled natively by the model).
- Real authentication / patient accounts (Supabase Auth).
- Doctor/Admin role & review dashboard.
- Report-over-time comparison & trend charts.
- “Chat with your report” (scoped Q&A about the uploaded report only).
- Additional languages (Pashto, Dari, etc.) and voice explanation.
- Hospital/EHR integration, appointment-prep checklists, shareable links.

-----

## 23. Appendix — Example structured output (shape only)

```json
{
  "detected_report_type": "Blood test",
  "simple_summary": "Your report mostly shows values within the usual ranges, but your vitamin D appears low and your white blood cell count appears slightly high. Your cholesterol is a little above the listed range. These are things to discuss with your doctor, especially if you feel tired.",
  "key_findings": [
    { "title": "Vitamin D appears low", "explanation": "The value is below the reference range listed in your report." },
    { "title": "White blood cells appear slightly high", "explanation": "The value is a little above the listed range; a doctor should interpret this." }
  ],
  "values_table": [
    { "test_name": "Vitamin D (25-OH)", "value": "14 ng/mL", "reference_range": "30-100 ng/mL", "status": "Low", "simple_meaning": "Below the listed range; your doctor can advise what this means for you." },
    { "test_name": "Hemoglobin", "value": "14.2 g/dL", "reference_range": "13.0-17.0 g/dL", "status": "Normal", "simple_meaning": "Within the listed range." }
  ],
  "medical_terms": [
    { "term": "Hemoglobin", "meaning": "A protein in red blood cells that carries oxygen." },
    { "term": "WBC", "meaning": "White blood cells, which help your body fight infection." }
  ],
  "doctor_questions": [
    "Is my low vitamin D something I should act on?",
    "Should I repeat any of these tests, and when?",
    "Could my slightly high white blood cell count be related to how I feel?"
  ],
  "safety_notes": [
    "This explanation is for understanding only and is not a diagnosis.",
    "Please discuss these results with a licensed healthcare professional."
  ],
  "urgent_warning": {
    "has_red_flags": false,
    "message": "This summary cannot detect emergencies. If you experience chest pain, severe shortness of breath, fainting, confusion, severe bleeding, or severe pain, seek urgent medical care."
  }
}
```

-----

*End of PRD. Build the full MVP as specified above.*