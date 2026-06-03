import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { DisclaimerFooter } from "@/components/disclaimer-banner";
import { LocaleProvider } from "@/components/locale-provider";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { DEFAULT_LOCALE, isLocale, LOCALE_STORAGE_KEY, LOCALES } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "MedExplain AI",
  description:
    "Understand medical reports in simple language with structured, safety-aware AI explanations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get(LOCALE_STORAGE_KEY)?.value;
  const hasSavedLocale = isLocale(savedLocale);
  const initialLocale = hasSavedLocale ? savedLocale : DEFAULT_LOCALE;
  const localeMeta = LOCALES[initialLocale];

  return (
    <html
      lang={localeMeta.htmlLang}
      dir={localeMeta.direction}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <LocaleProvider
          initialLocale={initialLocale}
          useClientStorageFallback={!hasSavedLocale}
        >
          <SkipLink />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <DisclaimerFooter />
          <Toaster richColors position="top-right" />
        </LocaleProvider>
      </body>
    </html>
  );
}
