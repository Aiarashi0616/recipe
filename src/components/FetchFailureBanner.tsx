import { getFailingDomains } from "@/lib/fetchFailures";

export async function FetchFailureBanner() {
  let failingDomains: { domain: string; consecutive_failures: number }[] = [];
  try {
    failingDomains = await getFailingDomains();
  } catch {
    return null;
  }

  if (failingDomains.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-black/5 bg-amber-100/60 px-4 py-2 text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
      <div className="mx-auto max-w-2xl">
        {failingDomains.map(({ domain, consecutive_failures }) => (
          <p key={domain}>
            ⚠️ {domain} の自動取得が{consecutive_failures}
            回連続で失敗しています。手動での材料・作り方の入力をご検討ください。
          </p>
        ))}
      </div>
    </div>
  );
}
