import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
      <div className="text-center">
        <p className="text-2xl">🍽️</p>
        <h1 className="mt-2 text-xl font-bold">おうちレシピ帳にログイン</h1>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <form action={signIn} className="flex flex-col gap-4">
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
            className="rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-full bg-accent px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-hover"
        >
          ログイン
        </button>
      </form>

      <p className="text-center text-sm text-foreground/60">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-accent underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
