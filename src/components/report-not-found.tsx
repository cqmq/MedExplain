"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";

export function ReportNotFound() {
  const { t } = useLocale();

  return (
    <div className="content-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-normal">
          {t("report.notFound.title")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t("report.notFound.description")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/history">{t("report.notFound.history")}</Link>
          </Button>
          <Button asChild>
            <Link href="/analyze">{t("report.notFound.analyze")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
