"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { InputMode, InputTabs } from "@/components/input-tabs";
import { LanguageSelect } from "@/components/language-select";
import { ReportTypeSelect } from "@/components/report-type-select";
import { getDirection } from "@/lib/utils";

const LOADING_MESSAGES = [
  "Reading your report...",
  "Simplifying medical terms...",
  "Preparing your summary...",
];

const PDF_LIMIT = 25 * 1024 * 1024;
const IMAGE_LIMIT = 5 * 1024 * 1024;

interface AnalyzeFormProps {
  demoText?: string;
}

export function AnalyzeForm({ demoText }: AnalyzeFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>(demoText ? "text" : "text");
  const [text, setText] = useState(demoText ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState(demoText ? "blood_test" : "unsure");
  const [language, setLanguage] = useState("English");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;

    const interval = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % LOADING_MESSAGES.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const inputValid = useMemo(() => {
    if (mode === "text") return text.trim().length >= 20;
    if (!file) return false;
    if (mode === "pdf") return file.type === "application/pdf" && file.size <= PDF_LIMIT;

    return (
      ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
      file.size <= IMAGE_LIMIT
    );
  }, [file, mode, text]);

  const canAnalyze = inputValid && consent && !loading;

  function handleModeChange(nextMode: InputMode) {
    setMode(nextMode);
    setFile(null);
    clearImagePreview();
    if (nextMode !== "text") setText("");
  }

  function clearImagePreview() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }

  function handleFilePick(selected: File) {
    if (mode === "pdf") {
      if (selected.type !== "application/pdf") {
        toast.error("Upload a PDF file for this tab.");
        return;
      }
      if (selected.size > PDF_LIMIT) {
        toast.error("PDF is too large (max 25 MB).");
        return;
      }
    }

    if (mode === "image") {
      if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
        toast.error("Upload a JPG, PNG, or WebP image.");
        return;
      }
      if (selected.size > IMAGE_LIMIT) {
        toast.error("Image is too large (max 5 MB).");
        return;
      }
    }

    if (mode === "image") {
      clearImagePreview();
      setImagePreview(URL.createObjectURL(selected));
    } else {
      clearImagePreview();
    }

    setFile(selected);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canAnalyze) return;

    setLoading(true);
    setMessageIndex(0);

    const formData = new FormData();
    formData.set("reportType", reportType);
    formData.set("language", language);
    formData.set("consent", consent ? "true" : "false");

    if (mode === "text") {
      formData.set("text", text.trim());
    } else if (file) {
      formData.set("file", file);
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        success?: boolean;
        id?: string;
        error?: string;
      };

      if (!response.ok || !data.success || !data.id) {
        throw new Error(data.error || "We could not analyze this report.");
      }

      router.push(`/reports/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={getDirection(language)}>
      <InputTabs
        mode={mode}
        text={text}
        file={file}
        imagePreview={imagePreview}
        onModeChange={handleModeChange}
        onTextChange={setText}
        onFilePick={handleFilePick}
        onRemoveFile={() => {
          setFile(null);
          clearImagePreview();
        }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report type</Label>
          <ReportTypeSelect value={reportType} onValueChange={setReportType} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Output language</Label>
          <LanguageSelect value={language} onValueChange={setLanguage} />
        </div>
      </div>

      <div className="space-y-4">
        <DisclaimerBanner />
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-4">
          <Checkbox
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            aria-label="Confirm medical disclaimer"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            I understand this tool does not diagnose medical conditions or replace a
            doctor. It only explains my report in simple language.
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {loading ? LOADING_MESSAGES[messageIndex] : "Your report is stored locally after analysis."}
        </p>
        <Button type="submit" size="lg" disabled={!canAnalyze} className="sm:min-w-44">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing
            </>
          ) : (
            "Analyze report"
          )}
        </Button>
      </div>
    </form>
  );
}
