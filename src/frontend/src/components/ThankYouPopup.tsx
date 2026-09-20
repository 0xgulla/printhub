import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

export interface ThankYouPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Celebration popup shown once a print job completes. Purely presentational —
 * the completion summary stays visible behind it.
 */
export function ThankYouPopup({ open, onOpenChange }: ThankYouPopupProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Thank you for using PrintHub"
      description="We hope we made printing a little easier for you."
      ocid="completed.thank_you_modal"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span
            className="absolute inset-0 animate-pulse-soft rounded-full bg-primary/15"
            aria-hidden="true"
          />
          <span
            className="absolute inset-2 animate-pulse-soft rounded-full bg-primary/20"
            style={{ animationDelay: "0.2s" }}
            aria-hidden="true"
          />
          <PartyPopper
            className="relative h-9 w-9 text-primary"
            aria-hidden="true"
          />
        </div>

        <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
          {["a", "b", "c", "d", "e"].map((key, index) => (
            <span
              key={key}
              className="h-2 w-2 animate-float rounded-full bg-primary/60"
              style={{ animationDelay: `${index * 0.15}s` }}
            />
          ))}
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Your document is ready to collect. Print again any time — we will be
          right here.
        </p>

        <Button
          type="button"
          onClick={() => onOpenChange(false)}
          data-ocid="completed.thank_you_close_button"
          className="mt-6 w-full rounded-full transition-smooth sm:w-auto"
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}
