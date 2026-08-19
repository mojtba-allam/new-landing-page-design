import { useMemo, useState } from "react";
import { Reveal, faNum } from "../lib/motion";
import { PageShell, Sheet, Sticker, usePageMeta } from "../components/PageShell";
import { IconArrow, IconBolt, IconCalendar, IconChart, IconKanban, IconShield } from "../components/Icons";

const CATS = [
  { id: "start", title: "شروع کار", desc: "اولین بورد، دعوت تیم، قالب‌ها", icon: "kanban", count: 12, tone: "bg-amber/50" },
  { id: "views", title: "نماهای بورد", desc: "لیستی، زمانی، کانبان، گراف، درختی", icon: "chart", count: 9, tone: "bg-sage" },
  { id: "auto", title: "اتوماسیون", desc: "قانون بساز، بقیه‌اش خودکار", icon: "bolt", count: 7, tone: "bg-sky-soft" },
  { id: "report", title: "گزارش‌ها و تحلیل", desc: "سرعت تیم، گلوگاه‌ها، برآیند", icon: "clock", count: 8, tone: "bg-amber/50" },
  { id: "bill", title: "صورتحساب", desc: "پلن‌ها، فاکتور، ارتقا و دانگرید", icon: "shield", count: 6, tone: "bg-sage" },
  { id: "api", title: "API و اتصال‌ها", desc: "وب‌هوک، تلگرام، ایمپورت/اکسپورت", icon: "bolt", count: 10, tone: "bg-sky-soft" },
];

const ARTICLES = [
  { cat: "start", title: "ساخت اولین بورد در ۶۰ ثانیه", time: "۳ دقیقه", hot: true },
  { cat: "start", title: "دعوت تیم و تنظیم نقش‌ها", time: "۴ دقیقه", hot: true },
  { cat: "start", title: "قالب‌های آماده: اسپرینت، محتوا، استخدام", time: "۲ دقیقه", hot: false },
  { cat: "views", title: "نمای گراف چیست و چه وقت به کار می‌آید؟", time: "۵ دقیقه", hot: true },
  { cat: "views", title: "جابجایی تسک با درگ‌ودراپ و میان‌برها", time: "۳ دقیقه", hot: false },
  { cat: "auto", title: "اولین اتوماسیون: خبردارکردن نفر بعدی", time: "۴ دقیقه", hot: true },
  { cat: "auto", title: "یادآور ددلاین به تلگرام", time: "۳ دقیقه", hot: false },
  { cat: "report", title: "خواندن گزارش سرعت تیم مثل یک اسکرام‌مستر", time: "۶ دقیقه", hot: false },
  { cat: "bill", title: "ارتقای وسط دوره و محاسبهٔ روزشمار", time: "۲ دقیقه", hot: false },
  { cat: "api", title: "ایمپورت یک‌کلیکه از ترلو", time: "۳ دقیقه", hot: true },
];

const STEPS = [
  { title: "بورد بساز", text: "اسم بگذار و قالب انتخاب کن — تسک‌های نمونه خودشان می‌آیند." },
  { title: "تیم را بیاور", text: "لینک دعوت بفرست؛ نقش‌ها را همان اول مشخص کن تا بعداً دردسر نشود." },
  { title: "قانون بگذار", text: "یک اتوماسیون ساده: «تسک تمام شد → نفر بعدی خبردار شود». معجزه می‌کند." },
  { title: "نگاه کن و تحویل بده", text: "گزارش‌ها خودشان به‌روز می‌شوند؛ جلسهٔ وضعیت، بازنشسته." },
];

function CatIcon({ kind, className }: { kind: string; className?: string }) {
  if (kind === "kanban") return <IconKanban className={className} />;
  if (kind === "chart") return <IconChart className={className} />;
  if (kind === "bolt") return <IconBolt className={className} />;
  if (kind === "clock")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2.2" />
      </svg>
    );
  if (kind === "shield") return <IconShield className={className} />;
  return <IconCalendar className={className} />;
}

export default function Help() {
  usePageMeta(
    "مرکز راهنما | فینولو",
    "آموزش‌های کوتاه و کاربردی فینولو — از ساخت اولین بورد تا اتوماسیون و API. با جستجوی زنده و مقاله‌های محبوب."
  );

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ARTICLES.filter((a) => (cat === "all" || a.cat === cat) && (query === "" || a.title.includes(query)));
  }, [q, cat]);

  return (
    <PageShell
      crumb="مرکز راهنما"
      index="۰۷"
      sticker="راهنما"
      title={
        <>
          یاد بگیر، <span className="text-verm">سریع</span>
        </>
      }
      lead="هیچ مقاله‌ای بیشتر از ۶ دقیقه وقتت را نمی‌گیرد. چون هدف ما این است که برگردی سرِ کارت — نه اینکه در مستندات غرق شوی."
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* search */}
        <Reveal className="mt-12">
          <div className="relative max-w-2xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft pointer-events-none">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m20 20-4.8-4.8" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="چی می‌خوای یاد بگیری؟ مثلاً «اتوماسیون»…"
              className="w-full rounded-full border-[1.5px] border-ink bg-paper py-4 ps-14 pe-6 font-medium shadow-[5px_5px_0_0_rgba(25,23,18,1)] focus:shadow-[2px_2px_0_0_rgba(244,71,31,0.7)] focus:border-verm outline-none transition-all duration-200"
            />
          </div>
        </Reveal>

        {/* categories */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATS.map((c, i) => (
            <Reveal key={c.id} delay={i * 80} variant="scale">
              <button
                onClick={() => {
                  setCat(cat === c.id ? "all" : c.id);
                  document.getElementById("articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`card-tilt w-full text-start rounded-2xl border-[1.5px] border-ink p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)] ${c.tone} ${cat === c.id ? "outline outline-[3px] outline-verm outline-offset-4" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-12 h-12 grid place-items-center rounded-full border-[1.5px] border-ink bg-paper">
                    <CatIcon kind={c.icon} className="w-6 h-6" />
                  </span>
                  <span className="text-[11px] font-black text-ink-soft border border-dashed border-ink/40 rounded-full px-2.5 py-1 tabular-nums">
                    {faNum(c.count)} مقاله
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl">{c.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft font-semibold">{c.desc}</p>
              </button>
            </Reveal>
          ))}
        </div>

        {/* articles list */}
        <section id="articles" className="mt-16 scroll-mt-28">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-3xl">
                مقاله‌ها <span className="text-verm text-xl">({faNum(filtered.length)})</span>
              </h2>
              {cat !== "all" && (
                <button onClick={() => setCat("all")} className="text-sm font-bold text-verm link-underline">
                  حذف فیلتر ✕
                </button>
              )}
            </div>
          </Reveal>
          <div className="mt-7 grid lg:grid-cols-2 gap-4">
            {filtered.map((a, i) => (
              <Reveal key={a.title} delay={Math.min(i * 60, 300)}>
                <a
                  href="#/contact"
                  className="group flex items-center gap-4 rounded-2xl border-[1.5px] border-ink bg-paper px-5 py-4 shadow-[4px_4px_0_0_rgba(25,23,18,1)] hover:shadow-[6px_6px_0_0_rgba(244,71,31,1)] hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-paper-deep border border-ink/20 text-ink-soft group-hover:bg-verm group-hover:text-paper group-hover:border-ink transition-colors duration-300">
                    <CatIcon kind={CATS.find((c) => c.id === a.cat)?.icon ?? "kanban"} className="w-5 h-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <strong className="block font-black truncate">{a.title}</strong>
                    <span className="text-xs font-bold text-ink-soft">خواندن: {a.time}</span>
                  </span>
                  {a.hot && <Sticker tone="bg-amber text-ink" className="rotate-3! shrink-0 hidden sm:inline-block">محبوب</Sticker>}
                  <IconArrow className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4-step path */}
        <section className="mt-20">
          <Reveal>
            <div className="flex items-center gap-4">
              <Sticker tone="bg-pine text-paper">مسیر ۱۰ دقیقه‌ای</Sticker>
              <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
            </div>
          </Reveal>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 110}>
                <div className={`relative h-full rounded-2xl border-[1.5px] border-ink p-6 shadow-[5px_5px_0_0_rgba(25,23,18,1)] ${i === 3 ? "bg-verm text-paper" : i % 2 ? "bg-amber/40" : "bg-paper"}`}>
                  <span className={`font-display text-5xl ${i === 3 ? "text-amber" : "text-verm"}`}>{faNum(i + 1)}</span>
                  <h3 className="mt-3 font-display text-xl">{s.title}</h3>
                  <p className={`mt-2 text-sm leading-7 font-medium ${i === 3 ? "text-paper/85" : "text-ink-soft"}`}>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* support CTA */}
        <Reveal variant="scale" className="mt-20">
          <Sheet className="bg-ink text-paper relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-dark opacity-60" aria-hidden />
            <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 text-center sm:text-start">
                <h3 className="font-display text-2xl sm:text-3xl">مقاله‌اش نبود؟ خودمان جواب می‌دهیم.</h3>
                <p className="mt-2 text-paper/65 font-medium">پشتیبانی تلگرام، میانگین پاسخ ۷ دقیقه — سوال‌های تکراری هم تبدیل به مقاله می‌شوند.</p>
              </div>
              <a href="#/contact" className="group inline-flex items-center gap-3 bg-amber text-ink rounded-full px-8 py-3.5 font-bold hover:bg-paper transition-colors duration-300 whitespace-nowrap">
                سوال بپرس
                <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
            </div>
          </Sheet>
        </Reveal>
      </div>
    </PageShell>
  );
}
