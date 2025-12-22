"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Xmark } from "iconoir-react";

type FilterChipProps = {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
};

const FilterChip = React.forwardRef<HTMLDivElement, FilterChipProps>(
  ({ children, isActive = false, onClick, onRemove, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm",
          "cursor-pointer border transition-colors",
          isActive
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background border-border hover:bg-muted"
        )}
        onClick={onClick}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="hover:bg-destructive/20 ml-1 rounded-full p-0.5"
          >
            <Xmark className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);

FilterChip.displayName = "FilterChip";

export default FilterChip;
