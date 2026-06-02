import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-2xl border border-transparent bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground shadow-none transition-colors placeholder:text-muted-foreground hover:bg-secondary focus-visible:border-ring focus-visible:bg-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
