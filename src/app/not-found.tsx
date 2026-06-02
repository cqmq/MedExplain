import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="content-container flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-normal">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
