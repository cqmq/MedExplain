import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UrgentWarning } from "@/lib/types";
import { t, type Locale } from "@/lib/i18n";

interface UrgentWarningCardProps {
  warning: UrgentWarning;
  locale: Locale;
}

export function UrgentWarningCard({ warning, locale }: UrgentWarningCardProps) {
  const Icon = warning.has_red_flags ? AlertCircle : Info;

  return (
    <Alert variant={warning.has_red_flags ? "warning" : "info"} className="print-card">
      <Icon className="size-5" />
      <AlertTitle>
        {warning.has_red_flags
          ? t(locale, "report.warning.important")
          : t(locale, "report.warning.general")}
      </AlertTitle>
      <AlertDescription>{warning.message}</AlertDescription>
    </Alert>
  );
}
