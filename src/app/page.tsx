"use client";

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
import { useLocale } from "@/components/locale-provider";
import { getStatusLabel } from "@/lib/i18n";

const steps = [
  {
    icon: Upload,
    title: "home.step.upload.title",
    description: "home.step.upload.description",
  },
  {
    icon: Sparkles,
    title: "home.step.ai.title",
    description: "home.step.ai.description",
  },
  {
    icon: Download,
    title: "home.step.save.title",
    description: "home.step.save.description",
  },
] as const;

const features = [
  { icon: FileText, title: "home.feature.summary" },
  { icon: ListChecks, title: "home.feature.values" },
  { icon: BookOpen, title: "home.feature.terms" },
  { icon: MessageCircleQuestion, title: "home.feature.questions" },
  { icon: Download, title: "home.feature.pdf" },
  { icon: History, title: "home.feature.history" },
] as const;

export default function Home() {
  const { locale, t } = useLocale();

  return (
    <div>
      <section className="content-container grid gap-10 py-16 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)] px-3 py-1 text-sm font-medium text-[var(--color-accent-teal)]">
            <ShieldCheck className="size-4" />
            {t("home.badge")}
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            {t("home.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t("home.description")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/analyze">{t("home.analyze")}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/analyze?demo=1">{t("home.demo")}</Link>
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
                  <span className="font-semibold">{t("home.preview.title")}</span>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {t("home.preview.text")}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Normal", "Needs review", "Low"].map((status) => (
                  <div key={status} className="rounded-2xl border border-border p-4">
                    <p className="text-xs text-muted-foreground">
                      {t("home.preview.status")}
                    </p>
                    <p className="mt-1 font-semibold">
                      {getStatusLabel(status, locale)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <HelpCircle className="size-4 text-[var(--color-accent-blue)]" />
                  {t("home.preview.ask")}
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {t("home.preview.question")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="content-container py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-normal">{t("home.how.title")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("home.how.description")}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardContent className="p-6">
                <span className="medical-icon-surface mb-5 flex size-12 items-center justify-center rounded-2xl text-white">
                  <step.icon className="size-5" />
                </span>
                <h3 className="font-semibold">{t(step.title)}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {t(step.description)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-container py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-normal">{t("home.features.title")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("home.features.description")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-[var(--color-accent-teal)]">
                  <feature.icon className="size-5" />
                </span>
                <span className="font-medium">{t(feature.title)}</span>
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
          {t("home.cta.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {t("home.cta.description")}
        </p>
        <div className="mt-7">
          <Button asChild size="lg">
            <Link href="/analyze">{t("home.analyze")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
