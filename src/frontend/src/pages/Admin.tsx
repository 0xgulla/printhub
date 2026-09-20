import { AdminLoginForm } from "@/components/AdminLoginForm";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const CAPABILITIES = [
  "Monitor every print job across the network",
  "Track device health and paper levels",
  "Review revenue and settlement summaries",
];

export function AdminPage() {
  return (
    <div className="animate-fade-in">
      <section className="border-b border-border bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Admin Login
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Sign in to manage the PrintHub device network. This preview shows
            the sign-in experience only.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div className="order-2 lg:order-1">
          <h2 className="font-display text-xl font-semibold text-foreground">
            What administrators manage
          </h2>
          <ul className="mt-5 space-y-3">
            {CAPABILITIES.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-card"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/dashboard"
            data-ocid="admin.back_dashboard_link"
            className="mt-8 inline-flex items-center gap-2 rounded-full text-sm font-medium text-primary transition-quick hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </div>

        <div className="order-1 lg:order-2">
          <AdminLoginForm />
        </div>
      </section>
    </div>
  );
}
