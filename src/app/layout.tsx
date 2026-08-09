import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FetchFailureBanner } from "@/components/FetchFailureBanner";
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
  title: "おうちレシピ帳",
  description: "材料タグでレシピを検索できる、おうち用レシピ帳です。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <header className="sticky top-0 z-10 border-b border-black/5 bg-[var(--background)]/90 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <a href="/" className="text-lg font-bold tracking-tight text-accent">
              🍽️ おうちレシピ帳
            </a>
            <a
              href="/recipes/new"
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover"
            >
              ＋ 登録
            </a>
          </div>
        </header>
        <FetchFailureBanner />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
