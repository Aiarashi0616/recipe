import { createClient } from "@/lib/supabase/server";

const FAILURE_THRESHOLD = 3;

export async function recordFetchSuccess(domain: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("fetch_failures")
    .upsert({ domain, consecutive_failures: 0, last_failed_at: null, last_error: null });
}

export async function recordFetchFailure(domain: string, error: string): Promise<void> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("fetch_failures")
    .select("consecutive_failures")
    .eq("domain", domain)
    .maybeSingle();

  await supabase.from("fetch_failures").upsert({
    domain,
    consecutive_failures: (existing?.consecutive_failures ?? 0) + 1,
    last_failed_at: new Date().toISOString(),
    last_error: error,
  });
}

export async function getFailingDomains(): Promise<
  { domain: string; consecutive_failures: number }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fetch_failures")
    .select("domain, consecutive_failures")
    .gte("consecutive_failures", FAILURE_THRESHOLD);

  if (error || !data) {
    return [];
  }
  return data;
}
