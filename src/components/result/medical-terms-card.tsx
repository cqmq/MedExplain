import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/result/section-heading";
import type { MedicalTerm } from "@/lib/types";

interface MedicalTermsCardProps {
  terms: MedicalTerm[];
}

export function MedicalTermsCard({ terms }: MedicalTermsCardProps) {
  if (terms.length === 0) return null;

  return (
    <Card className="print-card">
      <CardHeader>
        <SectionHeading icon={BookOpen} title="Medical terms" />
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
