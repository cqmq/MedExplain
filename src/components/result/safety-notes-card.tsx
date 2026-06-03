import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/result/section-heading";
import { ensureBaselineSafetyNotes } from "@/lib/utils";
import { t, type Locale } from "@/lib/i18n";

interface SafetyNotesCardProps {
  notes: string[];
  locale: Locale;
}

export function SafetyNotesCard({ notes, locale }: SafetyNotesCardProps) {
  const safeNotes = ensureBaselineSafetyNotes(notes, locale);

  return (
    <Card className="print-card">
      <CardHeader>
        <SectionHeading icon={ShieldCheck} title={t(locale, "report.safety.title")} />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {safeNotes.map((note, index) => (
            <li key={`${note}-${index}`} className="flex gap-3 text-sm leading-7">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-accent-teal)]" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
