import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { FloralAccent } from "@/components/FloralAccent";

export default async function SignupPage(props: PageProps<"/signup">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
      <div className="text-center">
        <FloralAccent className="mx-auto h-20 w-24" />
        <h1 className="mt-1 text-xl font-bold">分けっこみんなごはんに新規登録</h1>
        <p className="mt-1 text-xs text-foreground/50">無料で登録できます</p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <form action={signUp} className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
          />
          <p className="text-xs text-foreground/50">6文字以上で設定してください</p>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-full bg-accent px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-hover"
        >
          登録する
        </button>
      </form>

      <p className="text-center text-sm text-foreground/60">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-accent underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
