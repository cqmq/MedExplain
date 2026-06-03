import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/result/section-heading";
import type { KeyFinding } from "@/lib/types";
import { t, type Locale } from "@/lib/i18n";

interface KeyFindingsCardProps {
  findings: KeyFinding[];
  locale: Locale;
}

export function KeyFindingsCard({ findings, locale }: KeyFindingsCardProps) {
  if (findings.length === 0) return null;

  return (
    <Card className="print-card">
      <CardHeader>
        <SectionHeading
          icon={CheckCircle2}
          title={t(locale, "report.findings.title")}
          description={t(locale, "report.findings.description")}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {findings.map((finding, index) => (
            <article key={`${finding.title}-${index}`} className="rounded-2xl bg-secondary p-4">
              <h3 className="font-semibold">{finding.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {finding.explanation}
              </p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
