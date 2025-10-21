import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "rounded-2xl border border-white/50 bg-white/30 text-foreground shadow-[0_18px_45px_-20px_rgba(15,23,42,0.6)] backdrop-blur-xl transition-all hover:bg-white/40 hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.65)] dark:border-white/15 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15",
        glassPrimary:
          "rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/70 via-primary/60 to-primary-glow/80 text-primary-foreground shadow-[0_22px_55px_-18px_rgba(34,197,94,0.6)] backdrop-blur-xl transition-all hover:from-primary/80 hover:via-primary/70 hover:to-primary-glow/90 hover:shadow-[0_28px_70px_-18px_rgba(34,197,94,0.65)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
