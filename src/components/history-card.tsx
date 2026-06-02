"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReportListItem } from "@/lib/types";
import { formatDate, getInputTypeLabel, getReportTypeLabel } from "@/lib/utils";

interface HistoryCardProps {
  report: ReportListItem;
}

export function HistoryCard({ report }: HistoryCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteReport() {
    setDeleting(true);

    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not delete this report.");
      }

      toast.success("Report deleted.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete this report.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="transition-colors hover:border-[var(--color-border-default)] hover:bg-secondary/30">
      <CardContent className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-[var(--color-accent-teal)]">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="line-clamp-2 font-semibold">{report.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(report.createdAt)}
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="medical">{getReportTypeLabel(report.reportType)}</Badge>
          <Badge variant="info">{getInputTypeLabel(report.inputType)}</Badge>
          <Badge variant="outline">{report.language}</Badge>
        </div>

        <p className="mb-5 line-clamp-4 flex-1 text-sm leading-7 text-muted-foreground">
          {report.shortSummary}
        </p>

        <div className="flex items-center justify-between gap-2">
          <Button asChild variant="secondary">
            <Link href={`/reports/${report.id}`}>View report</Link>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Delete ${report.title}`}>
                <Trash2 className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this report?</DialogTitle>
                <DialogDescription>
                  This removes the saved report and its analysis from the local
                  SQLite database. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleting}
                  onClick={deleteReport}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
