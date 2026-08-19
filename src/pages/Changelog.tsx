import { useState } from "react";
import { Reveal } from "../lib/motion";
import { PageShell, Sticker, usePageMeta } from "../components/PageShell";

type ChangeType = "new" | "improve" | "fix";

const TYPE_META: Record<ChangeType, { label: string; cls: string }> = {
  new: { label: "جدید", cls: "bg-pine text-paper" },
  improve: { label: "بهبود", cls: "bg-amber text-ink" },
  fix: { label: "رفع اشکال", cls: "bg-verm text-paper" },
};

const RELEASES: { version: string; date: string; title: string; items: { type: ChangeType; text: string }[] }[] = [
  {
    version: "۳٫۲",
    date: "۱۲ مهر ۱۴۰۴",
    title: "نمای درختی و گرافِ وابستگی",
    items: [
      { type: "new", text: "نمای درختی: ساختار پروژه مثل یک نقشهٔ ذهنی، با بازوبسته‌کردن گروه‌ها و شمارندهٔ پیشرفت هر شاخه." },
      { type: "new", text: "گراف وابستگی با مسیر بحرانی — تسک‌هایی که اسپرینت را گروگان گرفته‌اند، حالا قرمز چشمک می‌زنند." },
      { type: "improve", text: "رندر بوردهای بالای ۵۰۰ تسک، ۳ برابر سریع‌تر شد (مجازی‌سازی لیست)." },
      { type: "fix", text: "مشکل دوتایی‌شدن اعلان‌ها هنگام تغییر هم‌زمان دو کاربر برطرف شد." },
    ],
  },
  {
    version: "۳٫۱",
    date: "۲۸ شهریور ۱۴۰۴",
    title: "اپ موبایل، بازنویسی کامل",
    items: [
      { type: "new", text: "حالت آفلاین واقعی: در مترو تسک بساز، جابه‌جا کن، نظر بگذار — همه‌چیز بعداً سینک می‌شود." },
      { type: "new", text: "ویجت‌های iOS و اندروید برای دیدن تسک‌های امروز بدون بازکردن اپ." },
      { type: "improve", text: "مصرف باتری اپ تا ۴۰٪ کاهش یافت." },
    ],
  },
  {
    version: "۳٫۰",
    date: "۱۵ شهریور ۱۴۰۴",
    title: "اتوماسیون‌ها آمدند",
    items: [
      { type: "new", text: "موتور قانون‌ها: «وقتی X شد، Y کن» — ۲۴ قالب آماده برای شروع." },
      { type: "new", text: "اتصال رسمی به تلگرام: یادآور ددلاین و خلاصهٔ روزانهٔ تیم، داخل چت." },
      { type: "improve", text: "صفحهٔ تنظیمات اعلان‌ها از نو طراحی شد — سکوت، پیش‌فرض شد." },
      { type: "fix", text: "اعداد فارسی در خروجی اکسل، حالا واقعاً فارسی‌اند." },
    ],
  },
  {
    version: "۲٫۴",
    date: "۲ مرداد ۱۴۰۴",
    title: "گزارش‌های زنده",
    items: [
      { type: "new", text: "داشبورد برآیند: سرعت تیم، نرخ تکمیل و گلوگاه‌ها بدون هیچ تنظیمی." },
      { type: "new", text: "گزارش ساعات قابل‌صورتحساب برای تیم‌های پروژه‌ای و ایجنسی‌ها." },
      { type: "improve", text: "گانت: درگ برای جابه‌جایی کل بازه با یک حرکت، وابستگی‌ها خودشان دنبال می‌شوند." },
    ],
  },
  {
    version: "۲٫۳",
    date: "۱۸ تیر ۱۴۰۴",
    title: "مهاجرت، بدون درد",
    items: [
      { type: "new", text: "ایمپورت یک‌کلیکه از ترلو و جیرا با تبدیل خودکار تاریخ‌ها به شمسی." },
      { type: "new", text: "ایمپورت از فایل اکسل با پیش‌نمایش و مپ‌کردن ستون‌ها." },
      { type: "fix", text: "تایپ فارسی در فیلد جستجو با کیبوردهای خاص، اصلاح شد." },
    ],
  },
];

export default function Changelog() {
  usePageMeta(
    "تغییرات نسخه‌ها | فینولو",
    "تاریخچهٔ به‌روزرسانی‌های فینولو — نسخه‌های جدید، بهبودها و رفع اشکال‌ها. شفاف دربارهٔ چیزی که ساختیم و چیزی که شکست."
  );

  const [filter, setFilter] = useState<"all" | ChangeType>("all");

  return (
    <PageShell
      crumb="تغییرات نسخه‌ها"
      index="۰۹"
      sticker="نسخه"
      title={
        <>
          هر هفته، <span className="text-verm">یک قدم</span> جلوتر
        </>
      }
      lead="اینجا می‌نویسیم چه ساختیم، چه بهتر شد و چه چیزی را شکستیم و درست کردیم. بدون «بهبودهای جزئی و رفع اشکالات عمومی» — واقعاً جزئی‌جات."
    >
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        {/* filters */}
        <Reveal className="mt-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full border-[1.5px] px-5 py-2 text-sm font-bold transition-all duration-200 ${
                filter === "all" ? "bg-ink text-paper border-ink shadow-[3px_3px_0_0_rgba(244,71,31,1)]" : "border-ink/30 hover:border-ink"
              }`}
            >
              همه
            </button>
            {(Object.keys(TYPE_META) as ChangeType[]).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(filter === t ? "all" : t)}
                className={`rounded-full border-[1.5px] px-5 py-2 text-sm font-bold transition-all duration-200 ${
                  filter === t ? `${TYPE_META[t].cls} border-ink shadow-[3px_3px_0_0_rgba(25,23,18,1)]` : "border-ink/30 hover:border-ink"
                }`}
              >
                {TYPE_META[t].label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* timeline */}
        <div className="mt-12 relative">
          <span className="absolute top-2 bottom-2 start-[19px] sm:start-[27px] border-s-[3px] border-dashed border-ink/25" aria-hidden />
          <div className="space-y-10">
            {RELEASES.map((r, i) => {
              const items = r.items.filter((it) => filter === "all" || it.type === filter);
              if (items.length === 0) return null;
              return (
                <Reveal key={r.version} delay={Math.min(i * 80, 320)}>
                  <article className="relative ps-14 sm:ps-20">
                    {/* version node */}
                    <span className={`absolute start-0 top-0 grid place-items-center w-10 h-10 sm:w-14 sm:h-14 rounded-full border-[1.5px] border-ink font-display text-base sm:text-xl shadow-[3px_3px_0_0_rgba(25,23,18,1)] ${i === 0 ? "bg-verm text-paper -rotate-6" : "bg-amber rotate-3"}`}>
                      {r.version}
                    </span>
                    <div className={`rounded-2xl border-[1.5px] border-ink bg-paper p-6 sm:p-7 shadow-[6px_6px_0_0_rgba(25,23,18,1)] ${i === 0 ? "outline outline-[3px] outline-verm outline-offset-4" : ""}`}>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display text-2xl">نسخهٔ {r.version} — {r.title}</h2>
                        {i === 0 && <Sticker>آخرین نسخه</Sticker>}
                        <span className="ms-auto text-xs font-bold text-ink-soft tabular-nums">{r.date}</span>
                      </div>
                      <ul className="mt-5 space-y-3.5">
                        {items.map((it) => (
                          <li key={it.text} className="flex items-start gap-3">
                            <span className={`mt-0.5 shrink-0 text-[10px] font-black rounded-full px-2.5 py-1 border border-ink/60 ${TYPE_META[it.type].cls}`}>
                              {TYPE_META[it.type].label}
                            </span>
                            <span className="text-[15px] font-medium text-ink-soft leading-7">{it.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* older + rss */}
        <Reveal className="mt-14">
          <div className="rounded-2xl border-[1.5px] border-dashed border-ink/40 bg-paper-deep/70 p-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <strong className="font-display text-xl">نسخه‌های قدیمی‌تر</strong>
              <p className="mt-1 text-sm text-ink-soft font-medium">از نسخهٔ ۰٫۱ (مهر ۱۳۹۹) تا ۲٫۲ — ۴۷ انتشار، همه مستند.</p>
            </div>
            <a href="#/contact" className="inline-flex items-center gap-2 border-[1.5px] border-ink rounded-full px-6 py-3 font-bold hover:bg-ink hover:text-paper transition-colors duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
                <circle cx="6" cy="18" r="1.8" fill="currentColor" />
                <path d="M4.5 11.5A8 8 0 0 1 12.5 19.5M4.5 5a14.5 14.5 0 0 1 14.5 14.5" />
              </svg>
              آرشیو کامل
            </a>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
