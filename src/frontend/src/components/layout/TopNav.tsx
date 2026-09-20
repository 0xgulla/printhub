import { SidebarNav } from "@/components/layout/Sidebar";
import { Wordmark } from "@/components/layout/Wordmark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

/**
 * Mobile-only header. On desktop the left sidebar owns navigation, so this
 * renders just the hamburger that opens the same nav in a sheet.
 */
export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-md lg:hidden">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark />

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Open navigation menu"
              data-ocid="nav.menu_button"
              className="rounded-full"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            data-ocid="nav.sheet"
            className="flex w-72 flex-col bg-card p-0"
          >
            <SheetHeader className="border-b border-border px-5 py-4 text-left">
              <SheetTitle className="font-display">Menu</SheetTitle>
            </SheetHeader>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
