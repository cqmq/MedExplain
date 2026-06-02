"use client";

import { Clipboard, MessageCircleQuestion } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeading } from "@/components/result/section-heading";

interface DoctorQuestionsCardProps {
  questions: string[];
}

export function DoctorQuestionsCard({ questions }: DoctorQuestionsCardProps) {
  if (questions.length === 0) return null;

  async function copyQuestions() {
    try {
      await navigator.clipboard.writeText(questions.map((q) => `- ${q}`).join("\n"));
      toast.success("Questions copied.");
    } catch {
      toast.error("Could not copy the questions.");
    }
  }

  return (
    <Card className="print-card">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <SectionHeading
          icon={MessageCircleQuestion}
          title="Questions to ask your doctor"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="no-print shrink-0"
          onClick={copyQuestions}
        >
          <Clipboard className="size-4" />
          Copy all
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {questions.map((question, index) => (
            <li key={`${question}-${index}`} className="flex gap-3 rounded-2xl bg-secondary p-4">
              <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-[var(--color-accent-blue)]" />
              <span className="text-sm leading-7">{question}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
