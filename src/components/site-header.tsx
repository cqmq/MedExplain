"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Menu } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { LanguageSelect } from "@/components/language-select";
import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", labelKey: "nav.home" },
  { href: "/analyze", labelKey: "nav.analyze" },
  { href: "/history", labelKey: "nav.history" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur">
      <div className="content-container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="medical-icon-surface flex size-10 items-center justify-center rounded-xl text-white">
            <HeartPulse className="size-5" />
          </span>
          <span className="hidden text-base font-semibold tracking-normal sm:inline">
            MedExplain AI
          </span>
        </Link>

        <nav
          aria-label={t("nav.primary")}
          className="hidden items-center rounded-full bg-secondary/70 p-1 md:flex"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSelect className="bg-background" />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="md:hidden"
              aria-label={t("nav.menu")}
            >
              <Menu className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="top-4 max-w-none translate-y-0 gap-5 rounded-2xl p-5 sm:max-w-sm data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="medical-icon-surface flex size-9 items-center justify-center rounded-xl text-white">
                  <HeartPulse className="size-4" />
                </span>
                MedExplain AI
              </DialogTitle>
            </DialogHeader>
            <nav aria-label={t("nav.mobile")} className="grid gap-2">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                      active && "bg-secondary text-foreground",
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                {t("nav.language")}
              </p>
              <LanguageSelect className="w-full" onChange={() => setOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
        active && "bg-background text-foreground shadow-sm",
      )}
    >
      {children}
    </Link>
  );
}
