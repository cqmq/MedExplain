import { AnalyzeForm } from "@/components/analyze-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_REPORT } from "@/lib/demo";

type AnalyzePageProps = {
  searchParams: Promise<{ demo?: string }>;
};

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const params = await searchParams;
  const demo = params.demo === "1";

  return (
    <div className="content-container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-normal">Analyze a report</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Paste report text, upload a PDF, or upload a clear image. The output
            will be structured for understanding and doctor-visit preparation.
          </p>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Report input</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyzeForm demoText={demo ? DEMO_REPORT : undefined} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
