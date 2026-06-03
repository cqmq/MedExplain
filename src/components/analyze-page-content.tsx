"use client";

import { AnalyzeForm } from "@/components/analyze-form";
import { useLocale } from "@/components/locale-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyzePageContentProps {
  demoText?: string;
}

export function AnalyzePageContent({ demoText }: AnalyzePageContentProps) {
  const { t } = useLocale();

  return (
    <div className="content-container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-normal">{t("analyze.title")}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t("analyze.description")}
          </p>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>{t("analyze.card")}</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyzeForm demoText={demoText} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
