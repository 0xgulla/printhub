import { StepCard } from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Eraser, FileUp, ScanLine, Settings2, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: FileUp,
    title: "Upload PDF",
    description: "Add a PDF from your device to start a print job.",
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description:
      "Every page is inspected to find blank, nearly blank, and low-content pages.",
  },
  {
    icon: Eraser,
    title: "Remove Blank Pages",
    description:
      "Drop the pages you do not need so you only print what matters.",
  },
  {
    icon: Settings2,
    title: "Customize Printing",
    description: "Set paper size, colour, copies, and a custom page range.",
  },
  {
    icon: ScanLine,
    title: "Printing & Completed",
    description:
      "Follow live progress page by page, then review your completion summary.",
  },
];

export function HowItWorksPage() {
  return (
    <div className="animate-fade-in">
      <section className="border-b border-border bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
            How It Works
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            PrintHub takes a PDF from your device to finished pages in five
            guided steps.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative">
          <div
            className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
            aria-hidden="true"
          />
          <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <StepCard
                key={step.title}
                index={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                ocid={`how.step.${index + 1}`}
                className="animate-slide-up"
              />
            ))}
          </ol>
        </div>

        <div className="mt-14 overflow-hidden rounded-lg border border-border bg-gradient-primary px-6 py-12 text-center shadow-card sm:px-12">
          <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground">
            Ready to send your first job?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Upload a PDF and let PrintHub handle the rest.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              data-ocid="how.cta_upload_button"
              className="w-full rounded-full transition-smooth sm:w-auto"
            >
              <Link to="/upload">Upload &amp; Print</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-ocid="how.cta_start_printing_button"
              className="w-full rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground transition-smooth hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            >
              <Link to="/upload">Start Printing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
