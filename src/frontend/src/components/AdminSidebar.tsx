import { cn } from "@/lib/utils";
import {
  BarChart3,
  IndianRupee,
  LayoutDashboard,
  Printer,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminSectionId =
  | "dashboard"
  | "jobs"
  | "devices"
  | "customers"
  | "earnings"
  | "settings";

interface AdminSection {
  id: AdminSectionId;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_SECTIONS: Array<AdminSection> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Print Jobs", icon: BarChart3 },
  { id: "devices", label: "Devices", icon: Printer },
  { id: "customers", label: "Customers", icon: Users },
  { id: "earnings", label: "Earnings", icon: IndianRupee },
  { id: "settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  active: AdminSectionId;
  onSelect: (id: AdminSectionId) => void;
}

export function AdminSidebar({ active, onSelect }: AdminSidebarProps) {
  return (
    <nav
      aria-label="Admin sections"
      data-ocid="admin.sidebar"
      className="flex gap-2 overflow-x-auto rounded-lg border border-border bg-card p-2 shadow-card lg:flex-col lg:overflow-visible"
    >
      {ADMIN_SECTIONS.map((section) => {
        const Icon = section.icon;
        const isActive = section.id === active;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            aria-current={isActive ? "page" : undefined}
            data-ocid={`admin.${section.id}_tab`}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-quick",
              isActive
                ? "bg-primary text-primary-foreground shadow-card"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
