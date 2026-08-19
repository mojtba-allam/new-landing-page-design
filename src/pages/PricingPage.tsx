import { useState } from "react";
import { Reveal } from "../lib/motion";
import { useI18n, tr } from "../lib/i18n";
import { PageShell, Sticker, usePageMeta } from "../components/PageShell";
import { IconArrow, IconCheck } from "../components/Icons";
import { PlanCard } from "../components/Social";
import { PLANS } from "../data";

const COMPARE: { label: { fa: string; en: string }; values: ({ fa: string; en: string } | boolean)[] }[] = [
  { label: { fa: "پروژه‌ها", en: "Projects" }, values: [{ fa: "۳", en: "3" }, { fa: "نامحدود", en: "Unlimited" }, { fa: "نامحدود", en: "Unlimited" }] },
  { label: { fa: "اعضای تیم", en: "Team members" }, values: [{ fa: "۵", en: "5" }, { fa: "نامحدود", en: "Unlimited" }, { fa: "نامحدود", en: "Unlimited" }] },
  { label: { fa: "بورد کانبان و لیستی", en: "Kanban & list boards" }, values: [true, true, true] },
  { label: { fa: "تقویم شمسی و ددلاین", en: "Native calendar & deadlines" }, values: [true, true, true] },
  { label: { fa: "اپلیکیشن موبایل و آفلاین", en: "Mobile apps & offline" }, values: [true, true, true] },
  { label: { fa: "گانت، تایم‌لاین و گراف", en: "Gantt, timeline & graph" }, values: [false, true, true] },
  { label: { fa: "اتوماسیون‌ها", en: "Automations" }, values: [false, { fa: "۵۰ قانون", en: "50 rules" }, { fa: "نامحدود", en: "Unlimited" }] },
  { label: { fa: "گزارش‌ها و تحلیل زنده", en: "Live reports & analytics" }, values: [false, true, true] },
  { label: { fa: "نقش‌ها و دسترسی دقیق", en: "Roles & granular access" }, values: [{ fa: "ساده", en: "Basic" }, true, true] },
  { label: { fa: "ثبت زمان و صورتحساب", en: "Time tracking & billing" }, values: [false, true, true] },
  { label: { fa: "API و وب‌هوک", en: "API & webhooks" }, values: [false, { fa: "خواندنی", en: "Read-only" }, { fa: "کامل", en: "Full" }] },
  { label: { fa: "SSO و حسابرسی", en: "SSO & audit logs" }, values: [false, false, true] },
  { label: { fa: "سرور اختصاصی (On-premise)", en: "Dedicated server (on-premise)" }, values: [false, false, true] },
  { label: { fa: "پشتیبانی", en: "Support" }, values: [{ fa: "انجمن", en: "Community" }, { fa: "ایمیل ویژه", en: "Priority email" }, { fa: "مدیر اختصاصی", en: "Dedicated manager" }] },
];

const PRICING_FAQ = [
  {
    q: { fa: "وسط دوره ارتقا بدهم چه می‌شود؟", en: "What if I upgrade mid-cycle?" },
    a: {
      fa: "دقیقاً به‌اندازهٔ روزهای باقی‌مانده، مابه‌التفاوت می‌پردازی — محاسبهٔ روزشمار، بدون گردکردن به ضرر تو.",
      en: "You only pay the difference for the remaining days — prorated to the day, never rounded against you.",
    },
  },
  {
    q: { fa: "تخفیف سازمانی و سالانه دارید؟", en: "Do you offer yearly or volume discounts?" },
    a: {
      fa: "بله؛ خرید سالانه ۲۰٪ ارزان‌تر است و تیم‌های بالای ۵۰ نفر، قیمت اختصاصی می‌گیرند. یک پیام در صفحهٔ تماس کافی است.",
      en: "Yes — yearly billing saves 20%, and teams over 50 get custom pricing. One message on the contact page is enough.",
    },
  },
  {
    q: { fa: "اگر فینولو به دردم نخورد؟", en: "What if Finolo isn't for me?" },
    a: {
      fa: "تا ۷ روز پس از اولین خرید، کل مبلغ برمی‌گردد — بدون سوال، بدون فرم ۱۰ صفحه‌ای. فقط یک ایمیل.",
      en: "Within 7 days of your first purchase, every toman is refunded — no questions, no 10-page form. Just one email.",
    },
  },
];

const S = {
  monthly: { fa: "ماهانه", en: "Monthly" },
  yearly: { fa: "سالانه", en: "Yearly" },
  off: { fa: "۲۰٪ تخفیف", en: "20% off" },
  foot: {
    fa: "همهٔ پلن‌ها: SSL، بکاپ روزانه، تقویم شمسی و مهاجرت رایگان از ترلو و جیرا · قیمت‌ها به تومان و شامل مالیات",
    en: "Every plan: SSL, daily backups, the native calendar and free migration from Trello & Jira · Prices in toman, tax included",
  },
  compare: { fa: "مقایسهٔ کامل", en: "Full comparison" },
  featuresTh: { fa: "امکانات", en: "Features" },
  recommended: { fa: "پیشنهاد ما", en: "Recommended" },
  guarantee: { fa: "ضمانت ۷ روزه", en: "7-day guarantee" },
  guaranteeText: {
    fa: "اولین خرید را انجام بده؛ اگر تا ۷ روز راضی نبودی، همهٔ پول برمی‌گردد. بدون سوال.",
    en: "Make your first purchase; if you're not happy within 7 days, every toman comes back. No questions.",
  },
  allMoney: { fa: "همهٔ پول", en: "every toman" },
  moreQ: { fa: "سوال دیگری داری؟ قیمت تیم بزرگ؟ حرف بزنیم", en: "Another question? Big-team pricing? Let's talk" },
};

function Cell({ v }: { v: { fa: string; en: string } | boolean }) {
  if (v === true)
    return (
      <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-pine text-paper">
        <IconCheck className="w-3.5 h-3.5" />
      </span>
    );
  if (v === false) return <span className="inline-block w-4 h-[3px] rounded-full bg-ink/20" />;
  return <span className="font-black text-sm">{tr(v)}</span>;
}

export default function PricingPage() {
  const { isFa } = useI18n();
  const [yearly, setYearly] = useState(true);

  usePageMeta(
    isFa ? "قیمت‌گذاری | فینولو" : "Pricing | Finolo",
    isFa
      ? "قیمت شفاف فینولو — پلن رایگان برای همیشه، حرفه‌ای ۸۹۰ هزار تومان و سازمانی. مقایسهٔ کامل امکانات و ضمانت ۷ روزهٔ بازگشت وجه."
      : "Transparent Finolo pricing — Free forever, Pro and Enterprise. Full feature comparison and a 7-day money-back guarantee."
  );

  return (
    <PageShell
      crumb={isFa ? "قیمت‌گذاری" : "Pricing"}
      index={isFa ? "۱۰" : "10"}
      sticker={isFa ? "تومان" : "Plans"}
      title={
        isFa ? (
          <>
            قیمت، <span className="text-verm">شفاف</span> مثل خودِ تخته
          </>
        ) : (
          <>
            Pricing, <span className="text-verm">transparent</span> as the board
          </>
        )
      }
      lead={
        isFa
          ? "بدون هزینهٔ پنهان، بدون «تماس بگیرید» برای فهمیدن قیمت، بدون دورهٔ آزمایشیِ گروگانی. جدول مقایسه را هم پایین بگذار — بخوان و تصمیم بگیر."
          : "No hidden fees, no “contact us to learn the price”, no hostage trials. The comparison table is right below — read it and decide."
      }
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* toggle */}
        <Reveal className="mt-10">
          <div className="inline-flex items-center gap-3 border-[1.5px] border-ink bg-paper rounded-full p-1.5 shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${!yearly ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`}
            >
              {tr(S.monthly)}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 flex items-center gap-2 ${yearly ? "bg-verm text-paper" : "text-ink-soft hover:text-ink"}`}
            >
              {tr(S.yearly)}
              <span className={`text-[10px] rounded-full px-2 py-0.5 font-black ${yearly ? "bg-paper text-verm" : "bg-verm/15 text-verm"}`}>{tr(S.off)}</span>
            </button>
          </div>
        </Reveal>

        {/* cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-7 items-stretch max-w-5xl">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name.fa} delay={i * 120} variant="scale">
              <div className={plan.featured ? "md:-translate-y-4" : ""}>
                <PlanCard plan={plan} yearly={yearly} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center text-sm text-ink-soft font-medium">{tr(S.foot)}</Reveal>

        {/* comparison table */}
        <section className="mt-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <Sticker tone="bg-amber text-ink">{tr(S.compare)}</Sticker>
              <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
            </div>
          </Reveal>
          <Reveal variant="scale" className="mt-8">
            <div className="overflow-x-auto overscroll-x-contain rounded-2xl border-[1.5px] border-ink bg-paper shadow-[8px_8px_0_0_rgba(25,23,18,1)]">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b-[1.5px] border-ink bg-paper-deep">
                    <th className="text-start px-6 py-5 font-display text-lg w-[34%]">{tr(S.featuresTh)}</th>
                    {PLANS.map((p) => (
                      <th key={p.name.fa} className={`px-4 py-5 font-display text-lg ${p.featured ? "text-verm" : ""}`}>
                        {tr(p.name)}
                        {p.featured && <span className="block text-[10px] font-black text-ink-soft">{tr(S.recommended)}</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row, i) => (
                    <tr key={row.label.fa} className={`border-b border-ink/10 transition-colors hover:bg-amber/20 ${i % 2 ? "bg-paper-deep/40" : ""}`}>
                      <td className="px-6 py-4 font-bold">{tr(row.label)}</td>
                      {row.values.map((v, j) => (
                        <td key={j} className={`px-4 py-4 text-center ${j === 1 ? "bg-verm/5 border-x border-verm/15" : ""}`}>
                          <Cell v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* guarantee + faq */}
        <div className="mt-20 grid lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
          <Reveal>
            <div className="rounded-2xl border-[1.5px] border-ink bg-verm text-paper p-8 shadow-[7px_7px_0_0_rgba(25,23,18,1)] -rotate-1 text-center">
              <span className="inline-grid place-items-center w-16 h-16 rounded-full bg-paper text-verm border-[1.5px] border-ink rotate-6">
                <IconCheck className="w-8 h-8" />
              </span>
              <h3 className="mt-5 font-display text-3xl">{tr(S.guarantee)}</h3>
              <p className="mt-3 text-paper/85 font-medium leading-7 text-sm">
                {isFa ? (
                  <>
                    اولین خرید را انجام بده؛ اگر تا ۷ روز راضی نبودی، <strong className="text-amber">همهٔ پول</strong> برمی‌گردد. بدون سوال.
                  </>
                ) : (
                  <>
                    Make your first purchase; if you're not happy within 7 days, <strong className="text-amber">every toman</strong> comes back. No questions.
                  </>
                )}
              </p>
            </div>
          </Reveal>
          <div className="space-y-4">
            {PRICING_FAQ.map((f, i) => (
              <Reveal key={f.q.fa} delay={i * 100}>
                <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
                  <strong className="font-display text-lg block">{tr(f.q)}</strong>
                  <p className="mt-2 text-ink-soft font-medium leading-7 text-[15px]">{tr(f.a)}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={320}>
              <a href="#/contact" className="group inline-flex items-center gap-3 font-bold text-verm link-underline">
                {tr(S.moreQ)}
                <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
