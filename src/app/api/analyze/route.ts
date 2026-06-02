import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ResponseInputContent } from "openai/resources/responses/responses";
import { ANALYSIS_SCHEMA, SYSTEM_PROMPT } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import type { AnalysisResult } from "@/lib/types";
import { deriveTitle, ensureBaselineSafetyNotes } from "@/lib/utils";

export const runtime = "nodejs";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const PDF_LIMIT = 25 * 1024 * 1024;
const IMAGE_LIMIT = 5 * 1024 * 1024;
const MODEL = process.env.MODEL || "gpt-4o";

function jsonError(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const reportType = (form.get("reportType") as string) || "general";
    const language = (form.get("language") as string) || "English";
    const consent = form.get("consent") as string;
    const text = form.get("text") as string | null;
    const file = form.get("file") as File | null;

    if (consent !== "true") {
      return jsonError("Please confirm the disclaimer before analyzing.", 400);
    }

    const content: ResponseInputContent[] = [];
    let inputType: "text" | "pdf" | "image" = "text";
    let originalText: string | null = null;
    let sourceName: string | null = null;

    if (file && file.size > 0) {
      sourceName = file.name;
      const mime = file.type;

      if (mime === "application/pdf") {
        if (file.size > PDF_LIMIT) {
          return jsonError("PDF is too large (max 25 MB).", 400);
        }

        inputType = "pdf";
        const bytes = Buffer.from(await file.arrayBuffer());
        content.push({
          type: "input_file",
          filename: sourceName,
          file_data: `data:application/pdf;base64,${bytes.toString("base64")}`,
        });
      } else if (IMAGE_TYPES.includes(mime)) {
        if (file.size > IMAGE_LIMIT) {
          return jsonError("Image is too large (max 5 MB).", 400);
        }

        inputType = "image";
        const bytes = Buffer.from(await file.arrayBuffer());
        content.push({
          type: "input_image",
          detail: "auto",
          image_url: `data:${mime};base64,${bytes.toString("base64")}`,
        });
      } else {
        return jsonError(
          "Unsupported file type. Upload a PDF or an image (JPG, PNG, WebP).",
          400,
        );
      }
    } else if (text && text.trim().length >= 20) {
      inputType = "text";
      originalText = text.trim();
    } else {
      return jsonError(
        "Please paste a longer report (at least 20 characters) or upload a file.",
        400,
      );
    }

    content.push({
      type: "input_text",
      text:
        `User-selected report type: ${reportType}\n` +
        `Write all explanations in this language: ${language}\n\n` +
        `Analyze the medical report ${inputType === "text" ? "below" : "in the attached file"} ` +
        `and return the structured JSON result. Only describe what is actually present. ` +
        `Do not diagnose or recommend treatment.` +
        (originalText
          ? `\n\n--- REPORT START ---\n${originalText}\n--- REPORT END ---`
          : ""),
    });

    const openai = getOpenAIClient();
    const response = await openai.responses.create({
      model: MODEL,
      max_output_tokens: 8000,
      instructions: SYSTEM_PROMPT,
      input: [
        {
          role: "user",
          content,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "present_report_analysis",
          description:
            "Return the structured, patient-friendly analysis of the medical report based only on the report content.",
          strict: true,
          schema: ANALYSIS_SCHEMA,
        },
      },
    });

    const outputText = response.output_text;

    if (!outputText) {
      return jsonError("We could not analyze this report. Please try again.", 502);
    }

    let parsed: AnalysisResult;
    try {
      parsed = JSON.parse(outputText) as AnalysisResult;
    } catch {
      return jsonError("We could not analyze this report. Please try again.", 502);
    }

    const analysis = {
      ...parsed,
      safety_notes: ensureBaselineSafetyNotes(
        parsed.safety_notes ?? [],
      ),
    };

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
    console.error("[/api/analyze]", err instanceof Error ? err.message : err);
    return jsonError("Something went wrong analyzing the report. Please try again.", 500);
  }
}
