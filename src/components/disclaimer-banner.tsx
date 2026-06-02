import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclaimerBannerProps {
  className?: string;
  compact?: boolean;
}

export function DisclaimerBanner({ className, compact = false }: DisclaimerBannerProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--color-accent-blue-soft)] bg-[var(--color-accent-blue-soft)] p-4 text-sm leading-relaxed text-foreground",
        compact && "rounded-xl p-3 text-xs",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--color-accent-blue)]" />
        <p>
          MedExplain AI explains reports in simple language. It is not a diagnosis
          and does not replace a doctor. Always discuss your report with a licensed
          healthcare professional.
        </p>
      </div>
    </div>
  );
}

export function DisclaimerFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="content-container py-4 text-center text-xs leading-relaxed text-muted-foreground">
        MedExplain AI explains reports in simple language. It is not a diagnosis
        and does not replace a doctor.
      </div>
    </footer>
  );
}
