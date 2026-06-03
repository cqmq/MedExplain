"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/locale-provider";
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
import { LOCALES, localeFromLanguage } from "@/lib/i18n";

interface HistoryCardProps {
  report: ReportListItem;
}

export function HistoryCard({ report }: HistoryCardProps) {
  const router = useRouter();
  const { locale, t } = useLocale();
  const reportLocale = localeFromLanguage(report.language);
  const [deleting, setDeleting] = useState(false);

  async function deleteReport() {
    setDeleting(true);

    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(t("history.toast.deleteError"));
      }

      toast.success(t("history.toast.deleted"));
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("history.toast.deleteError"));
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
              {formatDate(report.createdAt, locale)}
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="medical">
            {getReportTypeLabel(report.reportType, reportLocale)}
          </Badge>
          <Badge variant="info">{getInputTypeLabel(report.inputType, reportLocale)}</Badge>
          <Badge variant="outline">{LOCALES[reportLocale].label}</Badge>
        </div>

        <p className="mb-5 line-clamp-4 flex-1 text-sm leading-7 text-muted-foreground">
          {report.shortSummary}
        </p>

        <div className="flex items-center justify-between gap-2">
          <Button asChild variant="secondary">
            <Link href={`/reports/${report.id}`}>{t("history.view")}</Link>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${t("history.deleteAria")} ${report.title}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("history.deleteTitle")}</DialogTitle>
                <DialogDescription>
                  {t("history.deleteDescription")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    {t("history.cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleting}
                  onClick={deleteReport}
                >
                  {deleting ? t("history.deleting") : t("history.delete")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
