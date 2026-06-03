"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { HistoryCard } from "@/components/history-card";
import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportListItem } from "@/lib/types";

interface HistoryPageContentProps {
  items: ReportListItem[];
}

export function HistoryPageContent({ items }: HistoryPageContentProps) {
  const { t } = useLocale();

  return (
    <div className="content-container py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">{t("history.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("history.description")}</p>
        </div>
        <Button asChild>
          <Link href="/analyze">{t("home.analyze")}</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <span className="medical-icon-surface flex size-16 items-center justify-center rounded-3xl text-white">
              <ClipboardList className="size-7" />
            </span>
            <h2 className="mt-6 text-xl font-semibold">{t("history.empty.title")}</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
              {t("history.empty.description")}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/analyze">{t("history.empty.action")}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/analyze?demo=1">{t("history.demo")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((report) => (
            <HistoryCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
