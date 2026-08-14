"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FloralAccent } from "@/components/FloralAccent";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(
        "リンクの有効期限が切れているか、無効です。もう一度パスワード再設定をやり直してください。"
      );
      setStatus("idle");
      return;
    }

    setStatus("done");
    setTimeout(() => router.push("/"), 1500);
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
      <div className="text-center">
        <FloralAccent className="mx-auto h-20 w-24" />
        <h1 className="mt-1 text-xl font-bold">新しいパスワードを設定</h1>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {status === "done" ? (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
          パスワードを更新しました。ホーム画面に移動します…
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold">
              新しいパスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
            />
            <p className="text-xs text-foreground/50">6文字以上で設定してください</p>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 rounded-full bg-accent px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-hover disabled:opacity-60"
          >
            {status === "loading" ? "更新中…" : "パスワードを更新する"}
          </button>
        </form>
      )}
    </div>
  );
}
