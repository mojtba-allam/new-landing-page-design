import { useState } from "react";
import { Reveal, faNum } from "../lib/motion";
import { PageShell, Sticker, usePageMeta } from "../components/PageShell";
import { IconArrow, IconCheck } from "../components/Icons";
import { PlanCard } from "../components/Social";
import { PLANS } from "../data";

const COMPARE: { label: string; values: (string | boolean)[] }[] = [
  { label: "پروژه‌ها", values: ["۳", "نامحدود", "نامحدود"] },
  { label: "اعضای تیم", values: ["۵", "نامحدود", "نامحدود"] },
  { label: "بورد کانبان و لیستی", values: [true, true, true] },
  { label: "تقویم شمسی و ددلاین", values: [true, true, true] },
  { label: "اپلیکیشن موبایل و آفلاین", values: [true, true, true] },
  { label: "گانت، تایم‌لاین و گراف", values: [false, true, true] },
  { label: "اتوماسیون‌ها", values: [false, "۵۰ قانون", "نامحدود"] },
  { label: "گزارش‌ها و تحلیل زنده", values: [false, true, true] },
  { label: "نقش‌ها و دسترسی دقیق", values: ["ساده", true, true] },
  { label: "ثبت زمان و صورتحساب", values: [false, true, true] },
  { label: "API و وب‌هوک", values: [false, "خواندنی", "کامل"] },
  { label: "SSO و حسابرسی", values: [false, false, true] },
  { label: "سرور اختصاصی (On-premise)", values: [false, false, true] },
  { label: "پشتیبانی", values: ["انجمن", "ایمیل ویژه", "مدیر اختصاصی"] },
];

const PRICING_FAQ = [
  { q: "وسط دوره ارتقا بدهم چه می‌شود؟", a: "دقیقاً به‌اندازهٔ روزهای باقی‌مانده، مابه‌التفاوت می‌پردازی — محاسبهٔ روزشمار، بدون گردکردن به ضرر تو." },
  { q: "تخفیف سازمانی و سالانه دارید؟", a: "بله؛ خرید سالانه ۲۰٪ ارزان‌تر است و تیم‌های بالای ۵۰ نفر، قیمت اختصاصی می‌گیرند. یک پیام در صفحهٔ تماس کافی است." },
  { q: "اگر فینولو به دردم نخورد؟", a: "تا ۷ روز پس از اولین خرید، کل مبلغ برمی‌گردد — بدون سوال، بدون فرم ۱۰ صفحه‌ای. فقط یک ایمیل." },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true)
    return (
      <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-pine text-paper">
        <IconCheck className="w-3.5 h-3.5" />
      </span>
    );
  if (v === false) return <span className="inline-block w-4 h-[3px] rounded-full bg-ink/20" />;
  return <span className="font-black text-sm">{v}</span>;
}

export default function PricingPage() {
  usePageMeta(
    "قیمت‌گذاری | فینولو",
    "قیمت شفاف فینولو — پلن رایگان برای همیشه، حرفه‌ای ۸۹۰ هزار تومان و سازمانی. مقایسهٔ کامل امکانات و ضمانت ۷ روزهٔ بازگشت وجه."
  );

  const [yearly, setYearly] = useState(true);

  return (
    <PageShell
      crumb="قیمت‌گذاری"
      index="۱۰"
      sticker="تومان"
      title={
        <>
          قیمت، <span className="text-verm">شفاف</span> مثل خودِ تخته
        </>
      }
      lead="بدون هزینهٔ پنهان، بدون «تماس بگیرید» برای فهمیدن قیمت، بدون دورهٔ آزمایشیِ گروگانی. جدول مقایسه را هم پایین بگذار — بخوان و تصمیم بگیر."
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* toggle */}
        <Reveal className="mt-10">
          <div className="inline-flex items-center gap-3 border-[1.5px] border-ink bg-paper rounded-full p-1.5 shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${!yearly ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`}
            >
              ماهانه
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 flex items-center gap-2 ${yearly ? "bg-verm text-paper" : "text-ink-soft hover:text-ink"}`}
            >
              سالانه
              <span className={`text-[10px] rounded-full px-2 py-0.5 font-black ${yearly ? "bg-paper text-verm" : "bg-verm/15 text-verm"}`}>۲۰٪ تخفیف</span>
            </button>
          </div>
        </Reveal>

        {/* cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-7 items-stretch max-w-5xl">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 120} variant="scale">
              <div className={plan.featured ? "md:-translate-y-4" : ""}>
                <PlanCard plan={plan} yearly={yearly} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center text-sm text-ink-soft font-medium">
          همهٔ پلن‌ها: SSL، بکاپ روزانه، تقویم شمسی و مهاجرت رایگان از ترلو و جیرا · قیمت‌ها به تومان و شامل مالیات
        </Reveal>

        {/* comparison table */}
        <section className="mt-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <Sticker tone="bg-amber text-ink">مقایسهٔ کامل</Sticker>
              <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
            </div>
          </Reveal>
          <Reveal variant="scale" className="mt-8">
            <div className="overflow-x-auto overscroll-x-contain rounded-2xl border-[1.5px] border-ink bg-paper shadow-[8px_8px_0_0_rgba(25,23,18,1)]">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b-[1.5px] border-ink bg-paper-deep">
                    <th className="text-start px-6 py-5 font-display text-lg w-[34%]">امکانات</th>
                    {PLANS.map((p) => (
                      <th key={p.name} className={`px-4 py-5 font-display text-lg ${p.featured ? "text-verm" : ""}`}>
                        {p.name}
                        {p.featured && <span className="block text-[10px] font-black text-ink-soft">پیشنهاد ما</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row, i) => (
                    <tr key={row.label} className={`border-b border-ink/10 transition-colors hover:bg-amber/20 ${i % 2 ? "bg-paper-deep/40" : ""}`}>
                      <td className="px-6 py-4 font-bold">{row.label}</td>
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
              <h3 className="mt-5 font-display text-3xl">ضمانت ۷ روزه</h3>
              <p className="mt-3 text-paper/85 font-medium leading-7 text-sm">
                اولین خرید را انجام بده؛ اگر تا ۷ روز راضی نبودی، <strong className="text-amber">همهٔ پول</strong> برمی‌گردد. بدون سوال.
              </p>
            </div>
          </Reveal>
          <div className="space-y-4">
            {PRICING_FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 100}>
                <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
                  <strong className="font-display text-lg block">{f.q}</strong>
                  <p className="mt-2 text-ink-soft font-medium leading-7 text-[15px]">{f.a}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={320}>
              <a href="#/contact" className="group inline-flex items-center gap-3 font-bold text-verm link-underline">
                سوال دیگری داری؟ قیمت تیم بزرگ؟ حرف بزنیم
                <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
