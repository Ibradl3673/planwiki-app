import type { TextareaHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-3xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition placeholder:text-black/40 focus:border-black/30 focus:ring-2 focus:ring-black/5",
        className,
      )}
      {...props}
    />
  );
}
