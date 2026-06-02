"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REPORT_TYPES } from "@/lib/utils";

interface ReportTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ReportTypeSelect({ value, onValueChange }: ReportTypeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id="report-type" aria-label="Report type">
        <SelectValue placeholder="Choose report type" />
      </SelectTrigger>
      <SelectContent>
        {REPORT_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
