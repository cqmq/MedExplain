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

interface ValuesTableProps {
  values: ValueRow[];
}

export function ValuesTable({ values }: ValuesTableProps) {
  if (values.length === 0) return null;

  return (
    <Card className="print-card">
      <CardHeader>
        <SectionHeading
          icon={ListChecks}
          title="Values explained"
          description="Statuses use only the reference ranges shown in your report."
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-44">Test</TableHead>
              <TableHead className="min-w-36">Your value</TableHead>
              <TableHead className="min-w-40">Reference range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-72">Simple meaning</TableHead>
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
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="leading-7 text-muted-foreground">
                  {row.simple_meaning}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
