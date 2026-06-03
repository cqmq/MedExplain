"use client";

import { ShieldCheck } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

interface DisclaimerBannerProps {
  className?: string;
  compact?: boolean;
}

export function DisclaimerBanner({ className, compact = false }: DisclaimerBannerProps) {
  const { t } = useLocale();

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--color-info-notice-border)] bg-[var(--color-info-notice-bg)] p-4 text-sm leading-relaxed text-[var(--color-info-notice-text)] shadow-sm",
        compact && "rounded-xl p-3 text-xs",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-info-notice-icon-bg)] text-[var(--color-accent-blue)]">
          <ShieldCheck className="size-4.5" />
        </span>
        <p className="pt-0.5">{t("disclaimer.full")}</p>
      </div>
    </div>
  );
}

export function DisclaimerFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border bg-background">
      <div className="content-container py-4 text-center text-xs leading-relaxed text-muted-foreground">
        {t("disclaimer.footer")}
      </div>
    </footer>
  );
}
