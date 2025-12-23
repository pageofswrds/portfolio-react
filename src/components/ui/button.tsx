import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md font-mono text-btn-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:tw-opacity-50 aria-disabled:tw-pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "text-tx-button! bg-bg-button hover:bg-bg-button-hover active:bg-bg-button-pressed",
        secondary:
          "text-tx-primary! bg-bg-card hover:bg-bg-button-hover active:bg-bg-button-pressed hover:text-tx-button! active:text-tx-button!",
        brand:
          "text-tx-primary! bg-bg-button-brand hover:bg-bg-button-hover active:bg-bg-button-pressed hover:text-tx-button! active:text-tx-button!",
        tertiary:
          "text-tx-primary! bg-bg-primary hover:bg-bg-hover active:bg-bg-pressed",
        ghost:
          "text-tx-primary! bg-bg-button/0 hover:bg-bg-hover active:bg-bg-pressed",
        ghostalt:
          "text-tx-tertiary! bg-bg-button/0 hover:text-tx-primary! active:text-tx-primary!",
        tab: "rounded-none text-tx-tertiary! border-b-[1px] border-bd/0 hover:bg-bg-disabled active:bg-bg-hover",
        chipinactive:
          "text-tx-secondary! bg-bg-secondary hover:bg-bg-button-hover active:bg-bg-button-pressed",
        chipactive:
          "text-tx-brand! bg-bg-brand hover:bg-bg-button-hover active:bg-bg-button-pressed",
      },
      size: {
        xs: "text-btn-xs h-[1.75rem] rounded-md px-2 py-1.5",
        sm: "text-btn-sm h-[2rem] rounded-md px-2.5 py-1.5",
        md: "text-btn-md h-[2.25rem] rounded-md px-2.5 py-1.5",
        lg: "text-btn-lg h-[2.75rem] rounded-md px-3 py-2.5",
        tab: "text-xs pt-1.5 pb-[7px] px-1 ",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
