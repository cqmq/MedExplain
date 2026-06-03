"use client";

import Link from "next/link";
import { Clipboard, FileDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { t, type Locale } from "@/lib/i18n";

interface ReportActionsProps {
  summary: string;
  locale: Locale;
}

export function ReportActions({ summary, locale }: ReportActionsProps) {
  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success(t(locale, "report.toast.summaryCopied"));
    } catch {
      toast.error(t(locale, "report.toast.summaryError"));
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <Button type="button" variant="secondary" onClick={() => window.print()}>
        <FileDown className="size-4" />
        {t(locale, "report.action.pdf")}
      </Button>
      <Button type="button" variant="outline" onClick={copySummary}>
        <Clipboard className="size-4" />
        {t(locale, "report.action.copy")}
      </Button>
      <Button asChild>
        <Link href="/analyze">
          <Plus className="size-4" />
          {t(locale, "report.action.another")}
        </Link>
      </Button>
    </div>
  );
}
