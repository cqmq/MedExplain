import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/result/section-heading";

interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="print-card">
      <CardHeader>
        <SectionHeading icon={FileText} title="Simple summary" />
      </CardHeader>
      <CardContent>
        <p className="text-base leading-8 text-foreground">{summary}</p>
      </CardContent>
    </Card>
  );
}
