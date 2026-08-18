"use client";

import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/app/actions/admin-auth";

const initialState: LoginFormState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="w-full rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-ink"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-ink"
        />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="rounded-sm bg-error/10 px-3.5 py-2.5 text-sm text-error">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-maroon px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-maroon-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
