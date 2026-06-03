"use client";

import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useLocale } from "@/components/locale-provider";
import { LOCALE_OPTIONS, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSelectProps {
  className?: string;
  onChange?: () => void;
}

export function LanguageSelect({ className, onChange }: LanguageSelectProps) {
  const { locale, setLocale, t } = useLocale();
  const currentLabel = LOCALE_OPTIONS.find((item) => item.code === locale)?.label;

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        setLocale(value as Locale);
        onChange?.();
      }}
    >
      <SelectTrigger
        id="language"
        aria-label={t("nav.language")}
        className={cn("min-w-36", className)}
      >
        <Globe className="size-4 opacity-70" />
        <span className="line-clamp-1">{currentLabel}</span>
      </SelectTrigger>
      <SelectContent>
        {LOCALE_OPTIONS.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
