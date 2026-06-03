import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/result/section-heading";
import { t, type Locale } from "@/lib/i18n";

interface SummaryCardProps {
  summary: string;
  locale: Locale;
}

export function SummaryCard({ summary, locale }: SummaryCardProps) {
  return (
    <Card className="print-card">
      <CardHeader>
        <SectionHeading icon={FileText} title={t(locale, "report.summary.title")} />
      </CardHeader>
      <CardContent>
        <p className="text-base leading-8 text-foreground">{summary}</p>
      </CardContent>
    </Card>
  );
}
