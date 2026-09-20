import { RecentPrintsList } from "@/components/RecentPrintsList";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { useBackend } from "@/hooks/useBackend";
import { formatPrice } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { FileText, IndianRupee, Printer, Upload } from "lucide-react";

export function DashboardPage() {
  const { actor, isReady } = useBackend();
  const navigate = useNavigate();

  const statsQuery = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserStats();
    },
    enabled: isReady,
  });

  const jobsQuery = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listJobs();
    },
    enabled: isReady,
  });

  const stats = statsQuery.data;
  const jobs = jobsQuery.data ?? [];
  const statsLoading = statsQuery.isLoading || !isReady;

  return (
    <div className="animate-fade-in">
      <section className="border-b border-border bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Every job you send through this PrintHub device, with page
                counts and status.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                data-ocid="dashboard.start_printing_button"
                className="rounded-full transition-smooth"
              >
                <Link to="/upload">
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Start Printing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {statsLoading ? (
            <>
              {["stat-skeleton-1", "stat-skeleton-2", "stat-skeleton-3"].map(
                (id) => (
                  <div
                    key={id}
                    data-ocid="dashboard.stats_loading_state"
                    className="rounded-lg border border-border bg-card p-6 shadow-card"
                  >
                    <div className="mb-4 h-11 w-11 animate-pulse-soft rounded-full bg-muted" />
                    <div className="mb-3 h-6 w-1/2 animate-pulse-soft rounded bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse-soft rounded bg-muted" />
                  </div>
                ),
              )}
            </>
          ) : (
            <>
              <StatCard
                icon={Printer}
                label="Total Prints"
                value={stats ? Number(stats.totalPrints).toLocaleString() : "0"}
                countTo={stats ? Number(stats.totalPrints) : 0}
                ocid="dashboard.stat_card.1"
              />
              <StatCard
                icon={IndianRupee}
                label="Total Spent"
                value={stats ? formatPrice(stats.totalSpent) : formatPrice(0n)}
                tone="success"
                ocid="dashboard.stat_card.2"
              />
              <StatCard
                icon={FileText}
                label="Saved Files"
                value={stats ? Number(stats.savedFiles).toLocaleString() : "0"}
                countTo={stats ? Number(stats.savedFiles) : 0}
                tone="accent"
                ocid="dashboard.stat_card.3"
              />
            </>
          )}
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Print History
            </h2>
            <p className="text-sm text-muted-foreground">
              {jobs.length > 0
                ? `${jobs.length} job${jobs.length === 1 ? "" : "s"} on this device`
                : "This device"}
            </p>
          </div>
          <div className="mt-4">
            <RecentPrintsList
              jobs={jobs}
              isLoading={jobsQuery.isLoading || !isReady}
              isError={jobsQuery.isError}
              onRetry={() => void jobsQuery.refetch()}
              onStartPrinting={() => void navigate({ to: "/upload" })}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
