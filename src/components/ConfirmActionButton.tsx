"use client";

import { useTransition } from "react";

export function ConfirmActionButton({
  action,
  confirmMessage,
  label = "削除",
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmMessage)) {
          startTransition(() => action());
        }
      }}
      className="shrink-0 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-red-300 hover:text-red-500 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
