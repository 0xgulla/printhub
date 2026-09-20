import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";

interface FieldErrors {
  username?: string;
  password?: string;
}

/**
 * UI/demo-only admin sign-in. It validates the fields locally and confirms
 * that authentication is not wired up yet — it never navigates anywhere.
 */
export function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (username.trim().length === 0) {
      nextErrors.username = "Enter your admin username.";
    }
    if (password.length === 0) {
      nextErrors.password = "Enter your password.";
    }
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      data-ocid="admin.login_form"
      className="rounded-lg border border-border bg-card p-6 shadow-card sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Administrator sign in
          </h2>
          <p className="text-sm text-muted-foreground">
            Restricted to PrintHub network operators.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="admin-username">Username</Label>
          <Input
            id="admin-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setSubmitted(false);
            }}
            aria-invalid={errors.username ? true : undefined}
            aria-describedby={
              errors.username ? "admin-username-error" : undefined
            }
            placeholder="admin"
            data-ocid="admin.username_input"
          />
          {errors.username ? (
            <p
              id="admin-username-error"
              data-ocid="admin.username_error"
              className="text-sm font-medium text-destructive"
            >
              {errors.username}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setSubmitted(false);
            }}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={
              errors.password ? "admin-password-error" : undefined
            }
            placeholder="••••••••"
            data-ocid="admin.password_input"
          />
          {errors.password ? (
            <p
              id="admin-password-error"
              data-ocid="admin.password_error"
              className="text-sm font-medium text-destructive"
            >
              {errors.password}
            </p>
          ) : null}
        </div>
      </div>

      <Button
        type="submit"
        data-ocid="admin.login_button"
        className="mt-6 w-full rounded-full transition-smooth"
      >
        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
        Login
      </Button>

      {submitted ? (
        <output
          data-ocid="admin.login_notice"
          className="mt-4 block rounded-lg border border-primary/30 bg-secondary px-4 py-3 text-sm font-medium text-primary"
        >
          Admin authentication will be connected later.
        </output>
      ) : null}
    </form>
  );
}
