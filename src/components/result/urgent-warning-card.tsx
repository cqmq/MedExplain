import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UrgentWarning } from "@/lib/types";

interface UrgentWarningCardProps {
  warning: UrgentWarning;
}

export function UrgentWarningCard({ warning }: UrgentWarningCardProps) {
  const Icon = warning.has_red_flags ? AlertCircle : Info;

  return (
    <Alert variant={warning.has_red_flags ? "warning" : "info"} className="print-card">
      <Icon className="size-5" />
      <AlertTitle>
        {warning.has_red_flags ? "Important note from the report" : "General safety note"}
      </AlertTitle>
      <AlertDescription>{warning.message}</AlertDescription>
    </Alert>
  );
}
