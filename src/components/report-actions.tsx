"use client";

import Link from "next/link";
import { Clipboard, FileDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ReportActionsProps {
  summary: string;
}

export function ReportActions({ summary }: ReportActionsProps) {
  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Summary copied.");
    } catch {
      toast.error("Could not copy the summary.");
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <Button type="button" variant="secondary" onClick={() => window.print()}>
        <FileDown className="size-4" />
        Download PDF
      </Button>
      <Button type="button" variant="outline" onClick={copySummary}>
        <Clipboard className="size-4" />
        Copy summary
      </Button>
      <Button asChild>
        <Link href="/analyze">
          <Plus className="size-4" />
          Analyze another
        </Link>
      </Button>
    </div>
  );
}
