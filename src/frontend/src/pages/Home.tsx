import { DevicePrinterIllustration } from "@/components/DevicePrinterIllustration";
import { FeatureCard } from "@/components/FeatureCard";
import { HeroIllustration } from "@/components/HeroIllustration";
import { StepCard } from "@/components/StepCard";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileUp,
  Printer,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  Wifi,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Quick & Easy",
    description:
      "Upload a document and send it to a printer in under a minute — no software to install.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Printing",
    description:
      "Your files stay private. Jobs are released only after you confirm the print.",
  },
  {
    icon: Sparkles,
    title: "AI Paper Check",
    description:
      "PrintHub AI scans every page and flags blank or wasted sheets before you print.",
  },
  {
    icon: Wifi,
    title: "Works With Any Printer",
    description:
      "The portable PrintHub device links your phone to the printer already in the room.",
  },
];

const STEPS = [
  {
    icon: FileUp,
    title: "Upload a PDF",
    description:
      "Choose the document you want printed from your phone or laptop.",
  },
  {
    icon: Sparkles,
    title: "PrintHub AI Checks It",
    description:
      "Every page is inspected so blank or duplicate sheets never waste paper.",
  },
  {
    icon: Wifi,
    title: "The Device Sends It",
    description:
      "Your portable PrintHub device passes the job to a connected printer.",
  },
  {
    icon: Printer,
    title: "The Document Prints",
    description:
      "The printer lays down your pages while you watch the progress live.",
  },
  {
    icon: ScanLine,
    title: "You Get the Document",
    description:
      "Collect the finished pages — printed exactly the way you sent them.",
  },
];

export function HomePage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-subtle">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-card">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              AI paper-saving analysis
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Print Smarter,
              <br />
              <span className="text-primary">Anywhere.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              PrintHub turns your phone into a print station. Upload a PDF, let
              our AI check it, and a small portable device sends it to a
              connected printer — no computer, no cables, no queue.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                data-ocid="home.start_printing_button"
                className="w-full rounded-full transition-smooth sm:w-auto"
              >
                <Link to="/upload">
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Start Printing
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                data-ocid="home.how_it_works_button"
                className="w-full rounded-full transition-smooth sm:w-auto"
              >
                <Link to="/how-it-works">
                  See how it works
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <HeroIllustration className="animate-slide-up" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              ocid={`home.feature_card.${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Five plain steps take your file from upload to printed pages.
            </p>
          </div>

          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, index) => (
              <StepCard
                key={step.title}
                index={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                ocid={`home.step.${index + 1}`}
              />
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            From Your File to Printed Pages
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each stage hands off to the next, so you always know where your
            document is.
          </p>
        </div>

        <WorkflowDiagram className="mt-12" />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
              One small device, any printer in the room
            </h3>
            <p className="mt-4 text-muted-foreground">
              The portable PrintHub device is the bridge between your phone and
              the printer. It receives your checked document wirelessly and
              forwards it to the connected printer, so you never need to find a
              cable, a driver, or a desktop.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Pairs with the printer already in the room",
                "Sends only the pages you approved",
                "Shows live progress while it prints",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <DevicePrinterIllustration />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-lg border border-border bg-gradient-primary px-6 py-12 text-center shadow-card sm:px-12">
          <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground">
            Ready to print?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Start with a document and we will handle the rest — AI checking,
            printing, and live tracking.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              data-ocid="home.cta_start_printing_button"
              className="w-full rounded-full transition-smooth sm:w-auto"
            >
              <Link to="/upload">
                <Upload className="h-4 w-4" aria-hidden="true" />
                Start Printing
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
