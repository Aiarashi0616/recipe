import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { FloralAccent } from "@/components/FloralAccent";

export default async function ForgotPasswordPage(props: PageProps<"/forgot-password">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;
  const sent = searchParams.sent === "1";

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
      <div className="text-center">
        <FloralAccent className="mx-auto h-20 w-24" />
        <h1 className="mt-1 text-xl font-bold">パスワードを再設定</h1>
        <p className="mt-1 text-xs text-foreground/50">
          登録したメールアドレスに再設定用のリンクを送ります
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {sent ? (
        <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
          入力されたメールアドレス宛にメールを送信しました。届いたメール内のリンクから新しいパスワードを設定してください。
        </p>
      ) : (
        <form action={requestPasswordReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-full bg-accent px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-hover"
          >
            再設定メールを送る
          </button>
        </form>
      )}

      <p className="text-center text-sm text-foreground/60">
        <Link href="/login" className="text-accent underline">
          ログインに戻る
        </Link>
      </p>
    </div>
  );
}
