import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      to="/home"
      data-ocid="nav.home_link"
      aria-label="PrintHub home"
      className={cn(
        "group flex items-center gap-2 rounded-md transition-quick",
        className,
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-card transition-smooth group-hover:shadow-card-hover">
        <Printer className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        PrintHub
      </span>
    </Link>
  );
}
