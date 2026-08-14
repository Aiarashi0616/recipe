import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FetchFailureBanner } from "@/components/FetchFailureBanner";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "分けっこみんなごはん",
  description: "材料タグでレシピを検索できる、おうち用レシピ帳です。",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <header className="sticky top-0 z-10 border-b border-black/5 bg-[var(--background)]/90 backdrop-blur">
          <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-3">
            <a
              href="/"
              className="whitespace-nowrap text-[23px] font-bold tracking-tight text-accent"
            >
              🍽️ 分けっこみんなごはん
            </a>
            {user && (
              <div className="flex items-center gap-2">
                <a
                  href="/family"
                  className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-accent hover:text-accent"
                >
                  家族
                </a>
                <a
                  href="/recipes/new"
                  className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover"
                >
                  ＋ 登録
                </a>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-foreground/60 transition hover:border-accent hover:text-accent"
                  >
                    ログアウト
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>
        <FetchFailureBanner />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
