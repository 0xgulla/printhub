import { cn } from "@/lib/utils";
import { FileImage, FileText, FileType2 } from "lucide-react";

interface FloatingChip {
  id: string;
  label: string;
  icon: typeof FileText;
  className: string;
  delay: string;
}

const CHIPS: Array<FloatingChip> = [
  {
    id: "pdf",
    label: "PDF",
    icon: FileText,
    className: "-left-2 top-6 sm:left-0 sm:top-10",
    delay: "0s",
  },
  {
    id: "image",
    label: "Image",
    icon: FileImage,
    className: "right-0 top-0 sm:right-2",
    delay: "1.2s",
  },
  {
    id: "word",
    label: "Word",
    icon: FileType2,
    className: "-right-1 bottom-16 sm:right-0 sm:bottom-20",
    delay: "2.4s",
  },
];

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex justify-center", className)}>
      <div
        className="absolute inset-6 -z-10 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <img
        src="/assets/generated/hero-printer.dim_1024x1024.png"
        alt="Illustration of a printer producing a document, surrounded by PDF, image, and Word file icons"
        className="w-full max-w-md animate-float drop-shadow-xl"
        width={1024}
        height={1024}
      />

      {CHIPS.map((chip) => (
        <span
          key={chip.id}
          aria-hidden="true"
          style={{ animationDelay: chip.delay }}
          className={cn(
            "absolute flex animate-float items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-card-hover",
            chip.className,
          )}
        >
          <chip.icon className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-medium text-foreground">
            {chip.label}
          </span>
        </span>
      ))}
    </div>
  );
}
