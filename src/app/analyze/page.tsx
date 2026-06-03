import { AnalyzePageContent } from "@/components/analyze-page-content";
import { DEMO_REPORT } from "@/lib/demo";

type AnalyzePageProps = {
  searchParams: Promise<{ demo?: string }>;
};

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const params = await searchParams;
  const demo = params.demo === "1";

  return <AnalyzePageContent demoText={demo ? DEMO_REPORT : undefined} />;
}
