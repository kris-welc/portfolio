import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  readonly className?: string;
}

export function StatusIndicator({ className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full bg-waste-toxic status-live",
        className
      )}
    />
  );
}
