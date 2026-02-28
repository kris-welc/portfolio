import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type WastelandVariant = "amber" | "toxic" | "rust" | "bone";

const variantStyles: Record<WastelandVariant, string> = {
  amber:
    "bg-waste-amber/8 border-waste-amber/20 text-waste-amber hover:bg-waste-amber/12",
  toxic:
    "bg-waste-toxic/6 border-waste-toxic/20 text-waste-toxic hover:bg-waste-toxic/10",
  rust: "bg-waste-rust/8 border-waste-rust/20 text-waste-rust-light hover:bg-waste-rust/12",
  bone: "bg-waste-bone/6 border-waste-bone/15 text-waste-sand hover:bg-waste-bone/10",
};

interface WastelandBadgeProps {
  readonly children: React.ReactNode;
  readonly variant?: WastelandVariant;
  readonly className?: string;
}

export function WastelandBadge({
  children,
  variant = "amber",
  className,
}: WastelandBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded font-mono text-[0.65rem] uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </Badge>
  );
}
