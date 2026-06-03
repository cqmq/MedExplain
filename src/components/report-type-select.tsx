"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/components/locale-provider";
import { REPORT_TYPES } from "@/lib/utils";
import { getReportTypeLabel } from "@/lib/i18n";

interface ReportTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ReportTypeSelect({ value, onValueChange }: ReportTypeSelectProps) {
  const { locale, t } = useLocale();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id="report-type" aria-label={t("analyze.reportType")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {REPORT_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {getReportTypeLabel(type.value, locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
