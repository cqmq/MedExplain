import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/result/section-heading";
import type { MedicalTerm } from "@/lib/types";
import { t, type Locale } from "@/lib/i18n";

interface MedicalTermsCardProps {
  terms: MedicalTerm[];
  locale: Locale;
}

export function MedicalTermsCard({ terms, locale }: MedicalTermsCardProps) {
  if (terms.length === 0) return null;

  return (
    <Card className="print-card">
      <CardHeader>
        <SectionHeading icon={BookOpen} title={t(locale, "report.terms.title")} />
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 md:grid-cols-2">
          {terms.map((term, index) => (
            <div key={`${term.term}-${index}`} className="rounded-2xl bg-secondary p-4">
              <dt className="font-semibold">{term.term}</dt>
              <dd className="mt-2 text-sm leading-7 text-muted-foreground">
                {term.meaning}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
