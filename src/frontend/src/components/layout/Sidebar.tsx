import { Wordmark } from "@/components/layout/Wordmark";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  HelpCircle,
  Home,
  LayoutDashboard,
  Printer,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType } from "react";

interface NavItem {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  ocid: string;
}

const PRIMARY_NAV: Array<NavItem> = [
  { label: "Home", to: "/home", icon: Home, ocid: "sidebar.home_link" },
  {
    label: "Start Printing",
    to: "/upload",
    icon: Printer,
    ocid: "sidebar.start_printing_link",
  },
  {
    label: "How It Works",
    to: "/how-it-works",
    icon: HelpCircle,
    ocid: "sidebar.how_it_works_link",
  },
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    ocid: "sidebar.dashboard_link",
  },
];

function isActivePath(pathname: string, to: string) {
  if (to === "/home") return pathname === "/" || pathname === "/home";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActivePath(pathname, item.to);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      data-ocid={item.ocid}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-quick",
        active
          ? "bg-secondary text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-smooth",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        className={cn(
          "h-4.5 w-4.5 shrink-0 transition-quick",
          active
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
        aria-hidden={true}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

/** Desktop sidebar navigation. Hidden below `lg`, where the sheet takes over. */
export function Sidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <aside
      data-ocid="sidebar"
      className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex"
    >
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Wordmark />
      </div>

      <nav
        aria-label="Main navigation"
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
      >
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.to} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <Link
          to="/admin"
          data-ocid="sidebar.admin_login_link"
          className={cn(
            "flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-quick",
            pathname.startsWith("/admin")
              ? "border-primary/40 bg-secondary text-primary"
              : "text-muted-foreground hover:border-primary/30 hover:bg-secondary hover:text-foreground",
          )}
        >
          <ShieldCheck className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Admin Login</span>
        </Link>
      </div>
    </aside>
  );
}

/** The same navigation rendered inside the mobile sheet. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="flex h-full flex-col">
      <nav
        aria-label="Mobile navigation"
        className="flex flex-1 flex-col gap-1 px-3 py-4"
      >
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.to}
            item={item}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          to="/admin"
          onClick={onNavigate}
          data-ocid="sidebar.mobile_admin_login_link"
          className={cn(
            "flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-quick",
            pathname.startsWith("/admin")
              ? "border-primary/40 bg-secondary text-primary"
              : "text-muted-foreground hover:border-primary/30 hover:bg-secondary hover:text-foreground",
          )}
        >
          <ShieldCheck className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Admin Login</span>
        </Link>
      </div>
    </div>
  );
}
