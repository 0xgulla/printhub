import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  ocid?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  ocid,
}: FeatureCardProps) {
  return (
    <Card
      data-ocid={ocid}
      className={cn(
        "group rounded-lg border-border shadow-card transition-smooth hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
    >
      <CardContent>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="font-display text-base font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
