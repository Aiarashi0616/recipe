import {
  addFamilyMember,
  addHouseholdRule,
  getFamilyMembers,
  getHouseholdRules,
  removeFamilyMember,
  removeHouseholdRule,
} from "@/app/actions/family";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";
import {
  MEAL_STAGES,
  PERSON_TYPES,
  PORTION_SIZES,
  TASTE_PREFERENCES,
} from "@/lib/constants";

const fieldClass =
  "rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 outline-none focus:border-accent dark:bg-white/5";

export default async function FamilyPage() {
  const [members, rules] = await Promise.all([getFamilyMembers(), getHouseholdRules()]);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold">家族プロフィール</h1>
          <p className="mt-1 text-sm text-foreground/60">
            献立のおすすめ組み合わせで、アレルギー・苦手な食材を避けるために使われます。
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {members.length === 0 && (
            <p className="text-sm text-foreground/50">まだ登録されていません。</p>
          )}
          {members.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {m.display_name}
                    {m.age_label && (
                      <span className="ml-1 text-xs font-normal text-foreground/50">
                        （{m.age_label}）
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    {m.person_type}・{m.meal_stage}・1食の量：{m.portion_size}・味の好み：
                    {m.taste_preference}
                  </p>
                </div>
                <ConfirmActionButton
                  action={removeFamilyMember.bind(null, m.id)}
                  confirmMessage={`${m.display_name}を削除しますか？`}
                />
              </div>

              {(m.allergies || m.disliked_foods || m.liked_foods || m.dietary_restriction) && (
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  {m.allergies && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-600 dark:bg-red-950/30 dark:text-red-300">
                      アレルギー：{m.allergies}
                    </span>
                  )}
                  {m.disliked_foods && (
                    <span className="rounded-full bg-tag-bg px-2.5 py-1 text-tag-fg">
                      苦手：{m.disliked_foods}
                    </span>
                  )}
                  {m.liked_foods && (
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">
                      好き：{m.liked_foods}
                    </span>
                  )}
                  {m.dietary_restriction && (
                    <span className="rounded-full bg-tag-bg px-2.5 py-1 text-tag-fg">
                      食事制限：{m.dietary_restriction}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          action={addFamilyMember}
          className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm dark:bg-white/5"
        >
          <h2 className="font-semibold">家族を追加</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="display_name" className="text-sm font-semibold">
                呼び名
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                required
                placeholder="ママ・パパ・○○ちゃん"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="age_label" className="text-sm font-semibold">
                年齢・月齢
              </label>
              <input
                id="age_label"
                name="age_label"
                type="text"
                placeholder="31歳 / 8ヶ月"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="person_type" className="text-sm font-semibold">
                区分
              </label>
              <select id="person_type" name="person_type" required className={fieldClass}>
                {PERSON_TYPES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="meal_stage" className="text-sm font-semibold">
                食事段階
              </label>
              <select id="meal_stage" name="meal_stage" className={fieldClass} defaultValue="大人">
                {MEAL_STAGES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="portion_size" className="text-sm font-semibold">
                1食の量
              </label>
              <select
                id="portion_size"
                name="portion_size"
                className={fieldClass}
                defaultValue="普通"
              >
                {PORTION_SIZES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="taste_preference" className="text-sm font-semibold">
                味の好み
              </label>
              <select
                id="taste_preference"
                name="taste_preference"
                className={fieldClass}
                defaultValue="普通"
              >
                {TASTE_PREFERENCES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="allergies" className="text-sm font-semibold">
              アレルギー・除去食材
            </label>
            <input
              id="allergies"
              name="allergies"
              type="text"
              placeholder="卵、乳など（カンマ区切り）"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="disliked_foods" className="text-sm font-semibold">
              苦手な食材
            </label>
            <input
              id="disliked_foods"
              name="disliked_foods"
              type="text"
              placeholder="ピーマン、魚など（カンマ区切り）"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="liked_foods" className="text-sm font-semibold">
              好きな食材
            </label>
            <input
              id="liked_foods"
              name="liked_foods"
              type="text"
              placeholder="鶏肉、うどんなど"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dietary_restriction" className="text-sm font-semibold">
              食事制限
            </label>
            <input
              id="dietary_restriction"
              name="dietary_restriction"
              type="text"
              placeholder="なし / ○○"
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-full bg-accent px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-accent-hover"
          >
            追加する
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold">我が家のルール</h2>
          <p className="mt-1 text-sm text-foreground/60">
            平日は30分以内、週○回は魚、野菜を多めに、など。現時点では献立提案の自動判定には使われず、一覧として保存されます。
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {rules.length === 0 && (
            <li className="text-sm text-foreground/50">まだ登録されていません。</li>
          )}
          {rules.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-black/5 bg-white/70 px-4 py-2.5 text-sm dark:bg-white/5"
            >
              <span>{r.rule_text}</span>
              <ConfirmActionButton
                action={removeHouseholdRule.bind(null, r.id)}
                confirmMessage="このルールを削除しますか？"
              />
            </li>
          ))}
        </ul>

        <form action={addHouseholdRule} className="flex gap-2">
          <input
            name="rule_text"
            type="text"
            placeholder="例：平日は30分以内で作れるものにする"
            className={`w-full ${fieldClass}`}
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            追加
          </button>
        </form>
      </section>
    </div>
  );
}
