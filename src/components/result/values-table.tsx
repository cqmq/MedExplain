import { ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionHeading } from "@/components/result/section-heading";
import type { ValueRow } from "@/lib/types";
import { statusBadgeClass } from "@/lib/utils";
import { getStatusLabel, t, type Locale } from "@/lib/i18n";

interface ValuesTableProps {
  values: ValueRow[];
  locale: Locale;
}

export function ValuesTable({ values, locale }: ValuesTableProps) {
  if (values.length === 0) return null;

  return (
    <Card className="print-card">
      <CardHeader>
        <SectionHeading
          icon={ListChecks}
          title={t(locale, "report.values.title")}
          description={t(locale, "report.values.description")}
        />
      </CardHeader>
      <CardContent>
        <div className="hidden md:block print:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-44">{t(locale, "report.values.test")}</TableHead>
              <TableHead className="min-w-36">{t(locale, "report.values.value")}</TableHead>
              <TableHead className="min-w-40">{t(locale, "report.values.range")}</TableHead>
              <TableHead>{t(locale, "report.values.status")}</TableHead>
              <TableHead className="min-w-72">{t(locale, "report.values.meaning")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.map((row, index) => (
              <TableRow key={`${row.test_name}-${index}`}>
                <TableCell className="font-medium">{row.test_name}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.reference_range}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusBadgeClass(row.status)}>
                    {getStatusLabel(row.status, locale)}
                  </Badge>
                </TableCell>
                <TableCell className="leading-7 text-muted-foreground">
                  {row.simple_meaning}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>

        <div className="grid gap-3 md:hidden print:hidden">
          {values.map((row, index) => (
            <article
              key={`${row.test_name}-${index}`}
              className="rounded-2xl border border-border bg-secondary/50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t(locale, "report.values.test")}
                  </p>
                  <h3 className="mt-1 font-semibold">{row.test_name}</h3>
                </div>
                <Badge
                  variant="outline"
                  className={statusBadgeClass(row.status)}
                >
                  {getStatusLabel(row.status, locale)}
                </Badge>
              </div>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="grid gap-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t(locale, "report.values.value")}
                  </dt>
                  <dd>{row.value}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t(locale, "report.values.range")}
                  </dt>
                  <dd>{row.reference_range}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t(locale, "report.values.meaning")}
                  </dt>
                  <dd className="leading-7 text-muted-foreground">
                    {row.simple_meaning}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
