import Link from "next/link";
import {
  BookOpen,
  Download,
  FileImage,
  FileText,
  HelpCircle,
  History,
  ListChecks,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

const steps = [
  {
    icon: Upload,
    title: "Upload or paste",
    description: "Use text, a PDF, or a photo of your report.",
  },
  {
    icon: Sparkles,
    title: "AI explains it simply",
    description: "Get structured, patient-friendly explanations.",
  },
  {
    icon: Download,
    title: "Save or download",
    description: "Review history or print a clean PDF summary.",
  },
];

const features = [
  { icon: FileText, title: "Simple summary" },
  { icon: ListChecks, title: "Normal and abnormal values" },
  { icon: BookOpen, title: "Medical terms dictionary" },
  { icon: MessageCircleQuestion, title: "Doctor questions" },
  { icon: Download, title: "PDF export" },
  { icon: History, title: "Report history" },
];

export default function Home() {
  return (
    <div>
      <section className="content-container grid gap-10 py-16 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-teal-soft)] px-3 py-1 text-sm font-medium text-[var(--color-accent-teal)]">
            <ShieldCheck className="size-4" />
            For understanding reports, not diagnosis
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Understand your medical reports in simple language.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Paste, upload a PDF, or upload a photo of your report and get a
            clear explanation, key findings, doctor questions, and a
            downloadable summary.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/analyze">Analyze a Report</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/analyze?demo=1">Try a Demo Report</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden rounded-3xl bg-card">
          <CardContent className="p-0">
            <div className="border-b border-border bg-secondary p-5">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[var(--color-status-normal-text)]" />
                <span className="size-3 rounded-full bg-[var(--color-status-caution-text)]" />
                <span className="size-3 rounded-full bg-[var(--color-accent-blue)]" />
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-2xl bg-secondary p-4">
                <div className="mb-3 flex items-center gap-3">
                  <FileImage className="size-5 text-[var(--color-accent-teal)]" />
                  <span className="font-semibold">Blood test summary</span>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  Your report mostly shows values within the listed ranges. A few
                  values appear outside or near the edge of the report&apos;s ranges
                  and are good topics to discuss with your doctor.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Normal", "Needs review", "Low"].map((status) => (
                  <div key={status} className="rounded-2xl border border-border p-4">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="mt-1 font-semibold">{status}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <HelpCircle className="size-4 text-[var(--color-accent-blue)]" />
                  Ask your doctor
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  Should I repeat any of these tests, and when?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="content-container py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-normal">How it works</h2>
          <p className="mt-2 text-muted-foreground">
            A guided workflow for reports, scans, notes, and prescriptions.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardContent className="p-6">
                <span className="medical-icon-surface mb-5 flex size-12 items-center justify-center rounded-2xl text-white">
                  <step.icon className="size-5" />
                </span>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-container py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-normal">Features</h2>
          <p className="mt-2 text-muted-foreground">
            Works with text, PDFs, and images.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-[var(--color-accent-teal)]">
                  <feature.icon className="size-5" />
                </span>
                <span className="font-medium">{feature.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-container py-10">
        <DisclaimerBanner />
      </section>

      <section className="content-container py-14 text-center">
        <h2 className="text-3xl font-bold tracking-normal">
          Ready to simplify a report?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Start with pasted text, a PDF, a photo, or the built-in demo report.
        </p>
        <div className="mt-7">
          <Button asChild size="lg">
            <Link href="/analyze">Analyze a Report</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
