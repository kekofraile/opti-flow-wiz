import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2 text-base text-foreground ring-offset-background shadow-[0_14px_40px_-20px_rgba(15,23,42,0.45)] backdrop-blur-xl placeholder:text-muted-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:text-sm dark:bg-white/10 dark:border-white/15 dark:text-white/90 dark:placeholder:text-white/50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
