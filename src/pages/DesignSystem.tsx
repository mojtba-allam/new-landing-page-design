import { useEffect, useState, type ReactNode } from "react";
import { Reveal, useInView, faNum } from "../lib/motion";
import { PageShell, Sheet, Sticker, usePageMeta } from "../components/PageShell";
import {
  IconArrow, IconBell, IconBolt, IconCalendar, IconChart, IconCheck, IconClock,
  IconDashboard, IconGantt, IconGraph, IconGrip, IconKanban, IconList, IconPlus,
  IconQuote, IconShield, IconSpark, IconTree, IconUsers, LogoMark,
} from "../components/Icons";

/* ================= helpers ================= */
function useCopy(): [string | null, (v: string) => void] {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (v: string) => {
    navigator.clipboard?.writeText(v).catch(() => {});
    setCopied(v);
    window.setTimeout(() => setCopied(null), 1400);
  };
  return [copied, copy];
}

function TokenChip({ label, value, onCopy, copied }: { label: string; value: string; onCopy: (v: string) => void; copied: boolean }) {
  return (
    <button
      onClick={() => onCopy(value)}
      className={`group inline-flex items-center gap-2 rounded-md border px-2 py-1 transition-all duration-200 ${
        copied ? "border-pine bg-pine text-paper" : "border-ink/20 bg-paper-deep/60 hover:border-ink hover:-translate-y-0.5"
      }`}
      title="کپی توکن"
    >
      <span className="text-[10px] font-black text-ink-soft group-hover:text-ink" dir="ltr">{label}</span>
      <span className="text-[10px] font-bold tabular-nums" dir="ltr">{copied ? "✓ کپی شد" : value}</span>
    </button>
  );
}

function SectionHead2({ id, num, title, desc }: { id: string; num: string; title: string; desc?: string }) {
  return (
    <Reveal>
      <div id={id} className="scroll-mt-28 flex items-center gap-4">
        <span className="font-display text-3xl text-verm tabular-nums">{num}</span>
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
        <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
      </div>
      {desc && <p className="mt-4 max-w-2xl text-ink-soft font-medium leading-8">{desc}</p>}
    </Reveal>
  );
}

/* ================= data ================= */
const CORE_COLORS = [
  { token: "--color-paper", hex: "#F5F2EB", name: "کاغذ", role: "بومِ پایهٔ صفحه؛ گرم و غیرسفید", big: true },
  { token: "--color-paper-deep", hex: "#ECE8DD", name: "کاغذ عمیق", role: "سطح فرورفته، هدر کارت‌ها" },
  { token: "--color-ink", hex: "#191712", name: "مرکاب", role: "متن اصلی، خطوط و سایه‌های سخت", big: true },
  { token: "--color-ink-soft", hex: "#55503F", name: "مرکاب نرم", role: "متن ثانویه و توضیحات" },
  { token: "--color-line", hex: "#DDD7C8", name: "خط", role: "جداکننده‌های کم‌رنگ" },
  { token: "--color-pine", hex: "#0F3B31", name: "سرو", role: "عمق، سطح تیره، موفقیت", big: true },
  { token: "--color-pine-deep", hex: "#0A2A23", name: "سرو تیره", role: "سکشن‌های تیرهٔ داخل پنل" },
  { token: "--color-pine-soft", hex: "#1C5244", name: "سرو روشن", role: "هاورِ سطوح سرو" },
  { token: "--color-verm", hex: "#F4471F", name: "ورمیلیون", role: "اکسنت اصلی؛ CTA، پیشرفت، تأکید", big: true },
  { token: "--color-verm-deep", hex: "#C93312", name: "ورمیلیون تیره", role: "هاورِ اکسنت، متن روی زمینهٔ روشن" },
  { token: "--color-amber", hex: "#FFC24B", name: "کهربا", role: "انرژی؛ برجسته‌سازی، در حال انجام", big: true },
  { token: "--color-sage", hex: "#DFE6D2", name: "مریم‌گلی", role: "چیپ‌های طراحی، پس‌زمینهٔ ملایم" },
  { token: "--color-sky-soft", hex: "#D9E4E0", name: "آبی‌مه", role: "چیپ‌های تست/اطلاعات" },
];

const SEMANTIC = [
  { key: "Primary", hex: "#F4471F", cls: "bg-verm", text: "text-verm", use: "اقدام اصلی، لینک‌ها، «انجام شد»، پیشرفت" },
  { key: "Secondary", hex: "#0F3B31", cls: "bg-pine", text: "text-pine", use: "عمق بصری، ثانویهٔ سنگین، موفقیت" },
  { key: "Accent", hex: "#FFC24B", cls: "bg-amber", text: "text-amber", use: "انرژی، هایلایت، «در حال انجام»، بج‌ها" },
  { key: "Success", hex: "#0F3B31", cls: "bg-pine", text: "text-pine", use: "تکمیل، عملیاتی، تأیید" },
  { key: "Warning", hex: "#FFC24B", cls: "bg-amber", text: "text-ink", use: "هشدار، ددلاین نزدیک" },
  { key: "Danger", hex: "#F4471F", cls: "bg-verm", text: "text-verm", use: "خطا، حذف، مسیر بحرانی" },
  { key: "Info", hex: "#D9E4E0", cls: "bg-sky-soft", text: "text-ink", use: "اطلاع‌رسانی خنثی" },
];

const TYPE_SCALE = [
  { name: "display / hero", px: "clamp(2.7rem → 6.2rem)", w: "800", lh: "1.02", sample: "هر تسک، جای خودش", cls: "font-display text-4xl sm:text-5xl" },
  { name: "h1 صفحه", px: "clamp(2.5rem → 4.8rem)", w: "800", lh: "1.10", sample: "قیمت، شفاف مثل تخته", cls: "font-display text-3xl sm:text-4xl" },
  { name: "h2 سکشن", px: "30–60px", w: "800", lh: "1.15", sample: "اعداد خودشان حرف می‌زنند", cls: "font-display text-2xl sm:text-3xl" },
  { name: "h3 کارت", px: "22–26px", w: "800", lh: "1.25", sample: "پنج نمای بورد", cls: "font-display text-xl sm:text-2xl" },
  { name: "body", px: "15–16px", w: "400–500", lh: "1.7–1.9", sample: "متن بدنه برای خواندنِ طولانی؛ حداکثر عرض ۶۵ کاراکتر تا چشم خسته نشود.", cls: "text-base" },
  { name: "label / control", px: "12–14px", w: "700", lh: "1.4", sample: "تغییر برچسب · افزودن تسک", cls: "text-sm font-bold" },
  { name: "caption / meta", px: "10–11px", w: "700", lh: "1.4", sample: "میانگین پاسخ: ۷ دقیقه", cls: "text-[11px] font-bold text-ink-soft" },
];

const SPACING = [
  { t: "2XS", v: 4 }, { t: "XS", v: 8 }, { t: "SM", v: 12 }, { t: "MD", v: 16 },
  { t: "LG", v: 24 }, { t: "XL", v: 32 }, { t: "2XL", v: 48 }, { t: "3XL", v: 64 }, { t: "4XL", v: 96 },
];

const RADIUS = [
  { t: "XS", v: "6px", cls: "rounded-[6px]" },
  { t: "SM", v: "8px", cls: "rounded-lg" },
  { t: "MD", v: "12px", cls: "rounded-xl" },
  { t: "LG", v: "16px", cls: "rounded-2xl" },
  { t: "XL", v: "24px", cls: "rounded-[24px]" },
  { t: "Pill", v: "9999px", cls: "rounded-full" },
];

const SHADOWS = [
  { t: "shadow-1", css: "var(--shadow-1)", use: "دکمه‌های کوچک، چیپ‌ها" },
  { t: "shadow-2", css: "var(--shadow-2)", use: "کارت‌های تعاملی، فرم‌ها" },
  { t: "shadow-3", css: "var(--shadow-3)", use: "بلیت‌ها، بنرهای مهم" },
  { t: "shadow-4", css: "var(--shadow-4)", use: "بورد کانبان، قاب پنجره" },
];

const MOTION = [
  { t: "--dur-1 · 150ms", use: "هاور، فشرده‌شدن دکمه" },
  { t: "--dur-2 · 200ms", use: "تعویض رنگ، چیپ‌ها" },
  { t: "--dur-3 · 300ms", use: "کارت‌ها، منوها" },
  { t: "--dur-4 · 450ms", use: "ورود پنل‌ها" },
  { t: "--dur-5 · 600ms", use: "Reveal هنگام اسکرول" },
  { t: "--dur-6 · 900ms", use: "line-mask تیترها" },
];

const ICONS: { name: string; el: (c: string) => ReactNode }[] = [
  { name: "kanban", el: (c) => <IconKanban className={c} /> },
  { name: "gantt", el: (c) => <IconGantt className={c} /> },
  { name: "bolt", el: (c) => <IconBolt className={c} /> },
  { name: "chart", el: (c) => <IconChart className={c} /> },
  { name: "calendar", el: (c) => <IconCalendar className={c} /> },
  { name: "shield", el: (c) => <IconShield className={c} /> },
  { name: "grip", el: (c) => <IconGrip className={c} /> },
  { name: "bell", el: (c) => <IconBell className={c} /> },
  { name: "arrow", el: (c) => <IconArrow className={c} /> },
  { name: "check", el: (c) => <IconCheck className={c} /> },
  { name: "plus", el: (c) => <IconPlus className={c} /> },
  { name: "quote", el: (c) => <IconQuote className={c} /> },
  { name: "spark", el: (c) => <IconSpark className={c} /> },
  { name: "list", el: (c) => <IconList className={c} /> },
  { name: "graph", el: (c) => <IconGraph className={c} /> },
  { name: "tree", el: (c) => <IconTree className={c} /> },
  { name: "dashboard", el: (c) => <IconDashboard className={c} /> },
  { name: "users", el: (c) => <IconUsers className={c} /> },
  { name: "clock", el: (c) => <IconClock className={c} /> },
];

const PRINCIPLES = [
  { n: "۰۱", t: "گرمای کاغذ، دقتِ مرکب", d: "پالت، کاغذِ گرم و مرکابِ غلیظ است — نه سفیدِ بیمارستانی، نه خاکستری SaaS. رنگ فقط وقتی وارد می‌شود که معنا داشته باشد: ورمیلیون یعنی اقدام، کهربا یعنی انرژی، سرو یعنی عمق." },
  { n: "۰۲", t: "سایه، زبانِ عمق است", d: "سایه‌های آفستِ سخت، امضای فینولویند. هر چه عنصر مهم‌تر، آفست بزرگ‌تر. در هاور، سایه کوتاه می‌شود و عنصر به‌سمت کاربر بلند می‌شود — فیزیکِ کاغذ روی میز." },
  { n: "۰۳", t: "تضادِ اندازه، سلسله‌مراتب", d: "تیتر نمایشی ۶ برابرِ کپشن است. سلسله‌مراتب با وزن و رنگِ کم ساخته نمی‌شود — با پرشِ جسورانهٔ اندازه ساخته می‌شود تا چشم بدون فکر کردن مسیرش را پیدا کند." },
  { n: "۰۴", t: "همه‌چیز زنده، هیچ‌چیز پر سروصدا نیست", d: "پالس، شمارندهٔ زنده، اسکرول-Reveal و خط‌خطیِ مارکی حس جریان می‌دهند؛ اما هر حرکت باید دلیلی داشته باشد و با prefers-reduced-motion خاموش شود." },
  { n: "۰۵", t: "راست‌چین، از استخوان", d: "چیدمان با ویژگی‌های منطقی (padding-inline, inset-inline-start) ساخته شده؛ جهت با یک صفت عوض می‌شود و همه‌چیز آینه می‌شود — بدون یک‌خط کدِ اضافه." },
  { n: "۰۶", t: "دسترس‌پذیری، کفِ کار است", d: "کنتراست AA، فوکوسِ همیشه‌مرئی، هدف لمسی ۴۴px، حالت‌های خطا با متن و نه فقط رنگ، و کاهش حرکت برای کسانی که نیاز دارند." },
];

const TOC = [
  { id: "principles", label: "DNA و اصول" },
  { id: "colors", label: "رنگ‌ها" },
  { id: "typography", label: "تایپوگرافی" },
  { id: "spacing", label: "فاصله و شبکه" },
  { id: "shape", label: "شکل و شعاع" },
  { id: "elevation", label: "سطح و سایه" },
  { id: "motion", label: "حرکت" },
  { id: "icons", label: "آیکون‌ها" },
  { id: "components", label: "کامپوننت‌ها" },
];

/* ================= page ================= */
export default function DesignSystem() {
  usePageMeta(
    "سیستم دیزاین فینولو | تم کاهگی و ورمیلیون",
    "DNA طراحی فینولو — پالت رنگی، تایپوگرافی، فاصله‌ها، سایه‌ها، حرکت و کتابخانهٔ کامپوننت‌ها با توکن‌های رسمی CSS."
  );

  const [copied, copy] = useCopy();
  const [active, setActive] = useState("principles");
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const ids = TOC.map((t) => t.id);
    const onScroll = () => {
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 180) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <PageShell
      crumb="سیستم دیزاین"
      index="۱۲"
      sticker="DNA"
      title={
        <>
          یک زبان بصری، <span className="text-verm">یک محصول</span>
        </>
      }
      lead="هر رنگ، فاصله، سایه و حرکتِ فینولو از همین سند می‌آید — توکن‌های رسمیِ پایین را کپی کن، اصول را بخوان، و هر صفحهٔ جدید را با همین DNA بساز. تم مرجع: کاهگی و ورمیلیون (روشن و تیره)."
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12 items-start">
          {/* ---------- sticky TOC ---------- */}
          <nav className="hidden lg:block sticky top-28" aria-label="فهرست سیستم دیزاین">
            <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-4 shadow-[5px_5px_0_0_rgba(25,23,18,1)]">
              <div className="text-[11px] font-black text-ink-soft px-3 pb-3 border-b border-dashed border-ink/25">فهرست سند</div>
              <ul className="mt-3 space-y-1">
                {TOC.map((t, i) => (
                  <li key={t.id}>
                    <a
                      href={`#/design-system`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition-all duration-200 ${
                        active === t.id ? "bg-ink text-paper translate-x-0 shadow-[2px_2px_0_0_rgba(244,71,31,1)]" : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                      }`}
                    >
                      <span className={`font-display text-xs w-5 ${active === t.id ? "text-amber" : "text-verm"}`}>{faNum(i + 1).padStart(2, "۰")}</span>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-dashed border-ink/25 px-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-ink-soft">
                  <span className="w-3 h-3 rounded-full bg-verm" />
                  <span className="w-3 h-3 rounded-full bg-amber" />
                  <span className="w-3 h-3 rounded-full bg-pine" />
                  <span className="w-3 h-3 rounded-full bg-paper border border-ink/40" />
                </div>
                <p className="mt-2 text-[10px] font-bold text-ink-soft leading-4">
                  برای دیدن دارک‌مود، دکمهٔ ماه گوشهٔ صفحه را بزن.
                </p>
              </div>
            </div>
          </nav>

          {/* ---------- content ---------- */}
          <div className="min-w-0 space-y-24">
            {/* ================= 1. DNA ================= */}
            <section>
              <SectionHead2 id="principles" num="۰۱" title="DNA و جهت طراحی" />
              <Reveal delay={100} className="mt-8">
                <div className="rounded-2xl border-[1.5px] border-ink bg-pine text-paper p-7 sm:p-9 shadow-[8px_8px_0_0_rgba(25,23,18,1)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-dark opacity-50" aria-hidden />
                  <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
                    <div>
                      <Sticker tone="bg-amber text-ink">جهت بصری</Sticker>
                      <h3 className="mt-4 font-display text-2xl sm:text-3xl leading-[1.4]">
                        «روزنامهٔ خوش‌دستِ ایرانی» × «ابزار کارِ جدی»
                      </h3>
                      <p className="mt-4 text-paper/75 font-medium leading-8 text-[15px]">
                        محصول، مدیریت پروژه برای تیم‌های ایرانی است؛ استفادهٔ روزانه، تراکم متوسط‌به‌بالا، دسکتاپ-اول.
                        پس زبان بصری نه SaaSِ بنفشِ عمومی است و نه بازی کودکانه — کاغذِ گرم و مرکابِ قاطع، با یک
                        ورمیلیون که فقط وقتی لازم است داد می‌زند. کجیِ استیکرها و سایه‌های آفست، دست‌ساز بودن را
                        می‌رسانند؛ شبکهٔ دقیق و اعداد tabular، جدیت را.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ["محصول", "SaaS مدیریت پروژه"],
                        ["کاربر", "تیم‌های فنی/محصول ایرانی"],
                        ["تراکم", "متوسط رو به بالا"],
                        ["لحن", "جدی با لبخند"],
                        ["پلتفرم", "دسکتاپ-اول، RTL"],
                        ["دسترس‌پذیری", "AA + کاهش حرکت"],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-xl border border-paper/20 bg-paper/5 p-3">
                          <div className="text-[10px] font-black text-amber">{k}</div>
                          <div className="mt-1 text-xs font-bold text-paper/85 leading-5">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="mt-8 grid md:grid-cols-2 gap-x-10">
                {PRINCIPLES.map((p, i) => (
                  <Reveal key={p.n} delay={(i % 2) * 100}>
                    <div className={`flex gap-5 border-t-[1.5px] border-ink/15 py-6 ${i % 2 ? "md:translate-y-6" : ""}`}>
                      <span className="font-display text-3xl text-verm/50 tabular-nums shrink-0">{p.n}</span>
                      <div>
                        <h4 className="font-display text-xl">{p.t}</h4>
                        <p className="mt-2 text-[14.5px] text-ink-soft font-medium leading-7">{p.d}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ================= 2. Colors ================= */}
            <section>
              <SectionHead2
                id="colors"
                num="۰۲"
                title="سیستم رنگ"
                desc="هر رنگ یک توکن معنایی دارد و یک مسئولیت. روی هر نمونه بزن تا مقدارش کپی شود. در حالت تیره، توکن‌ها خودکار به نسخهٔ درخشان‌تر می‌روند."
              />
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {CORE_COLORS.map((c, i) => (
                  <Reveal key={c.token} delay={Math.min(i * 60, 360)} variant="scale">
                    <button
                      onClick={() => copy(c.hex)}
                      className={`card-tilt group w-full text-start rounded-2xl border-[1.5px] border-ink bg-paper overflow-hidden shadow-[5px_5px_0_0_rgba(25,23,18,1)] ${c.big ? "sm:col-span-1" : ""}`}
                      title={`کپی ${c.hex}`}
                    >
                      <div className="h-20 border-b-[1.5px] border-ink relative" style={{ background: c.hex }}>
                        {copied === c.hex && (
                          <span className="absolute inset-0 grid place-items-center bg-ink/70 text-paper text-xs font-black">کپی شد ✓</span>
                        )}
                      </div>
                      <div className="p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="font-display text-base">{c.name}</strong>
                          <span className="text-[10px] font-black text-ink-soft tabular-nums" dir="ltr">{c.hex}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-ink-soft font-medium leading-4">{c.role}</p>
                        <div className="mt-2 text-[9.5px] font-bold text-verm" dir="ltr">{c.token}</div>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>

              <Reveal className="mt-10">
                <h3 className="font-display text-xl">رنگ‌های معنایی و حالت‌های تعامل</h3>
              </Reveal>
              <div className="mt-5 rounded-2xl border-[1.5px] border-ink bg-paper shadow-[6px_6px_0_0_rgba(25,23,18,1)] overflow-x-auto overscroll-x-contain">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="bg-paper-deep border-b-[1.5px] border-ink text-[11px] font-black text-ink-soft">
                      <th className="text-start px-5 py-3">نقش</th>
                      <th className="text-start px-5 py-3">نمونه</th>
                      <th className="text-start px-5 py-3">مقدار</th>
                      <th className="text-start px-5 py-3">کاربرد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SEMANTIC.map((s) => (
                      <tr key={s.key} className="border-b border-ink/10 hover:bg-paper-deep/60 transition-colors">
                        <td className="px-5 py-3.5 font-black">{s.key}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-md border border-ink/20 ${s.cls}`} />
                            <span className={`rounded-full px-3 py-1 text-[11px] font-black ${s.cls} ${s.text === "text-ink" ? "text-ink" : "text-paper"}`}>
                              نمونه
                            </span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 tabular-nums font-bold text-ink-soft text-xs" dir="ltr">{s.hex}</td>
                        <td className="px-5 py-3.5 text-[12.5px] font-medium text-ink-soft">{s.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Reveal className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-xs font-black text-ink-soft">حالت‌های تعامل:</span>
                <button className="rounded-full bg-verm text-paper px-5 py-2 text-sm font-bold shadow-[3px_3px_0_0_rgba(25,23,18,1)]">پیش‌فرض</button>
                <button className="rounded-full bg-verm text-paper px-5 py-2 text-sm font-bold brightness-110 shadow-[3px_3px_0_0_rgba(25,23,18,1)]">هاور (روشن‌تر + جابه‌جایی)</button>
                <button className="rounded-full bg-verm text-paper px-5 py-2 text-sm font-bold translate-x-[2px] translate-y-[2px] shadow-[1px_1px_0_0_rgba(25,23,18,1)]">فعال (فشرده)</button>
                <button className="rounded-full bg-verm/50 text-paper/80 px-5 py-2 text-sm font-bold" disabled>غیرفعال (۵۰٪)</button>
                <button className="rounded-full border-[1.5px] border-ink bg-paper px-5 py-2 text-sm font-bold outline outline-2 outline-amber outline-offset-2">فوکوس (کهربا)</button>
              </Reveal>
            </section>

            {/* ================= 3. Typography ================= */}
            <section>
              <SectionHead2
                id="typography"
                num="۰۳"
                title="تایپوگرافی"
                desc="یک خانواده، دو نقش: یکان بخ ExtraBold برای نمایش، وزن‌های ۴۰۰–۷۰۰ برای خواندن. انگلیسی: Archivo Black + Space Grotesk. اعداد همیشه tabular تا در جدول نلغزند."
              />
              <Reveal delay={100} className="mt-8">
                <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-7 sm:p-9 shadow-[7px_7px_0_0_rgba(25,23,18,1)]">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="font-display text-6xl sm:text-7xl leading-none">
                      آبان<span className="text-verm">۱۲۳</span>
                    </div>
                    <div className="text-xs font-bold text-ink-soft leading-6">
                      Yekan Bakh · وزیرمتن (fallback)
                      <br />
                      EN: Archivo Black / Space Grotesk
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-dashed border-ink/25 grid sm:grid-cols-4 gap-4 text-[11px] font-bold text-ink-soft">
                    <span>وزن نمایش: <strong className="text-ink">800</strong></span>
                    <span>وزن تیترها: <strong className="text-ink">800</strong></span>
                    <span>وزن بدنه: <strong className="text-ink">400–500</strong></span>
                    <span>ترکینگ نمایش: <strong className="text-ink" dir="ltr">-0.01em</strong></span>
                  </div>
                </div>
              </Reveal>

              <div className="mt-8 space-y-4">
                {TYPE_SCALE.map((r, i) => (
                  <Reveal key={r.name} delay={Math.min(i * 70, 350)}>
                    <div className="grid md:grid-cols-[180px_1fr] gap-3 md:gap-8 items-baseline border-b border-dashed border-ink/20 pb-5">
                      <div>
                        <div className="font-black text-sm">{r.name}</div>
                        <div className="mt-1 text-[10.5px] font-bold text-ink-soft tabular-nums" dir="ltr">
                          {r.px} · w{r.w} · lh {r.lh}
                        </div>
                      </div>
                      <div className={`${r.cls} leading-[1.3]`}>{r.sample}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ================= 4. Spacing & layout ================= */}
            <section>
              <SectionHead2
                id="spacing"
                num="۰۴"
                title="فاصله، شبکه و چیدمان"
                desc="مقیاس ۴پیکسلیِ قابل‌پیش‌بینی. کانتینر max-w-7xl با حاشیهٔ px-5/px-8؛ سکشن‌ها py-24 تا py-32 تنفس می‌کنند؛ گریدها ۲ تا ۴ ستونه با gap-5 تا gap-8."
              />
              <Reveal className="mt-8">
                <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 sm:p-7 shadow-[6px_6px_0_0_rgba(25,23,18,1)]">
                  <div className="space-y-2.5">
                    {SPACING.map((s) => (
                      <div key={s.t} className="flex items-center gap-4">
                        <span className="w-10 text-[11px] font-black text-ink-soft shrink-0">{s.t}</span>
                        <span className="h-4 rounded-sm bg-verm/85 transition-all duration-300 hover:bg-verm" style={{ width: `${s.v * 2.4}px` }} />
                        <span className="text-[11px] font-bold text-ink-soft tabular-nums" dir="ltr">{s.v}px</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-dashed border-ink/25 flex flex-wrap gap-3">
                    <TokenChip label="--space-md" value="16px" onCopy={copy} copied={copied === "16px"} />
                    <TokenChip label="--space-xl" value="32px" onCopy={copy} copied={copied === "32px"} />
                    <TokenChip label="--space-3xl" value="64px" onCopy={copy} copied={copied === "64px"} />
                  </div>
                </div>
              </Reveal>

              <div className="mt-6 grid sm:grid-cols-3 gap-5">
                {[
                  { bp: "< 640px", rule: "موبایل: تک‌ستونی، بورد اسکرول افقی، اسلایدرها جای گرید را می‌گیرند" },
                  { bp: "640–1024px", rule: "تبلت: گرید ۲ستونه، سایدبار پنل به تب‌های افقی تبدیل می‌شود" },
                  { bp: "> 1024px", rule: "دسکتاپ: ۳–۴ ستونه، سربرگ‌های چسبان، بج‌های شناور از قاب بیرون می‌زنند" },
                ].map((b, i) => (
                  <Reveal key={b.bp} delay={i * 100}>
                    <div className="h-full rounded-2xl border-[1.5px] border-ink bg-paper-deep/60 p-5 hover:bg-amber/30 hover:-translate-y-1 transition-all duration-300">
                      <div className="font-display text-lg tabular-nums" dir="ltr">{b.bp}</div>
                      <p className="mt-2 text-[12.5px] text-ink-soft font-medium leading-6">{b.rule}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ================= 5. Shape ================= */}
            <section>
              <SectionHead2 id="shape" num="۰۵" title="شکل و شعاع" desc="شعاع‌ها کوچک و جدی‌اند: ۶ تا ۲۴ پیکسل + قرص. فقط استیکرها و واترمارک‌ها می‌چرخند؛ لبه‌ها صاف و قاطع. مرزها: ۱px ظریف، ۱٫۵px استاندارد، ۲px جسور." />
              <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-4">
                {RADIUS.map((r, i) => (
                  <Reveal key={r.t} delay={i * 60} variant="scale">
                    <div className="group text-center">
                      <div className={`mx-auto h-16 w-16 sm:h-20 sm:w-20 border-[1.5px] border-ink bg-amber/50 ${r.cls} group-hover:bg-verm/80 group-hover:border-verm transition-colors duration-300`} />
                      <div className="mt-2 text-[11px] font-black">{r.t}</div>
                      <div className="text-[10px] font-bold text-ink-soft tabular-nums" dir="ltr">{r.v}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-8 grid sm:grid-cols-3 gap-5">
                {[
                  { t: "مرز ظریف", cls: "border border-ink/15", use: "جدول‌ها، جداکننده‌های داخلی" },
                  { t: "مرز استاندارد", cls: "border-[1.5px] border-ink", use: "کارت‌ها، دکمه‌ها، ورودی‌ها" },
                  { t: "خط‌چین", cls: "border-[1.5px] border-dashed border-ink/40", use: "جاهای خالی، لبهٔ بلیت، راهنما" },
                ].map((b) => (
                  <div key={b.t} className={`rounded-2xl ${b.cls} p-5 bg-paper`}>
                    <strong className="font-display text-base">{b.t}</strong>
                    <p className="mt-1 text-xs text-ink-soft font-medium">{b.use}</p>
                  </div>
                ))}
              </Reveal>
            </section>

            {/* ================= 6. Elevation ================= */}
            <section>
              <SectionHead2
                id="elevation"
                num="۰۶"
                title="سطح و ارتفاع"
                desc="چهار پلهٔ آفست سخت روی کاغذ؛ در دارک‌مود همان پله‌ها به سایهٔ نرم + حاشیهٔ نوری تبدیل می‌شوند. هاور یعنی بلند شدن: سایه بزرگ‌ترِ ورمیلیون و جابه‌جایی ۴ پیکسل به بالا."
              />
              <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                {SHADOWS.map((s, i) => (
                  <Reveal key={s.t} delay={i * 90} variant="scale">
                    <div className="h-full rounded-2xl border-[1.5px] border-ink bg-paper p-5" style={{ boxShadow: s.css }}>
                      <div className="font-display text-lg" dir="ltr">{s.t}</div>
                      <p className="mt-1.5 text-[11.5px] text-ink-soft font-medium leading-5">{s.use}</p>
                      <TokenChip label={s.t} value={s.css} onCopy={copy} copied={copied === s.css} />
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-6 flex flex-wrap items-center gap-6">
                <button className="rounded-full bg-verm text-paper px-7 py-3.5 font-bold shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:shadow-[2px_2px_0_0_rgba(25,23,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200">
                  هاور را روی من امتحان کن
                </button>
                <p className="text-xs font-bold text-ink-soft max-w-xs leading-6">
                  فیزیک: در حالت آرام، سایه بزرگ است (عنصر بالاست). با لمس، عنصر پایین می‌آید و سایه کوتاه می‌شود — مثل فشار دادن دکمهٔ واقعی.
                </p>
              </Reveal>
            </section>

            {/* ================= 7. Motion ================= */}
            <section>
              <SectionHead2
                id="motion"
                num="۰۷"
                title="حرکت و ریتم"
                desc="منحنی امضا: cubic-bezier(0.19, 0.65, 0.22, 1) — شروع سریع، فرود آرام. فقط transform و opacity انیمیت می‌شوند و prefers-reduced-motion همه را خاموش می‌کند."
              />
              <div className="mt-8 grid lg:grid-cols-[1fr_1.3fr] gap-8 items-start">
                <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[5px_5px_0_0_rgba(25,23,18,1)]">
                  <h3 className="font-display text-lg">پله‌های زمانی</h3>
                  <ul className="mt-4 space-y-2.5">
                    {MOTION.map((m) => (
                      <li key={m.t} className="flex items-center justify-between gap-3 border-b border-dashed border-ink/15 pb-2.5">
                        <span className="text-[11.5px] font-black tabular-nums" dir="ltr">{m.t}</span>
                        <span className="text-[11.5px] font-medium text-ink-soft">{m.use}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <TokenChip label="--ease-brand" value="cubic-bezier(.19,.65,.22,1)" onCopy={copy} copied={copied === "cubic-bezier(.19,.65,.22,1)"} />
                    <TokenChip label="--dur-3" value="300ms" onCopy={copy} copied={copied === "300ms"} />
                  </div>
                </div>

                <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[7px_7px_0_0_rgba(25,23,18,1)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg">دموی زنده</h3>
                    <button
                      onClick={() => setReplay((r) => r + 1)}
                      className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-amber px-4 py-2 text-xs font-black shadow-[3px_3px_0_0_rgba(25,23,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(25,23,18,1)] transition-all duration-150"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
                      </svg>
                      پخش دوباره
                    </button>
                  </div>

                  <div key={replay} className="mt-5 space-y-5">
                    <div>
                      <div className="text-[10.5px] font-black text-ink-soft mb-2">Reveal (اسکرول / ورود)</div>
                      <div className="reveal in flex gap-3">
                        {[0, 120, 240].map((d) => (
                          <span key={d} className="reveal in inline-block h-9 flex-1 rounded-lg bg-pine" style={{ transitionDelay: `${d}ms` }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10.5px] font-black text-ink-soft mb-2">mask-line (تیتر)</div>
                      <div className="font-display text-2xl">
                        <span className="mask-line in"><span style={{ transitionDelay: "100ms" }}>این تیتر</span></span>
                        <span className="mask-line in"><span style={{ transitionDelay: "280ms" }}>بالا می‌آید.</span></span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10.5px] font-black text-ink-soft mb-2">gantt-bar (کشیدن نمودار)</div>
                      <div className="space-y-2">
                        {[
                          ["bg-verm", "70%", "0ms"],
                          ["bg-amber", "45%", "150ms"],
                          ["bg-pine", "85%", "300ms"],
                        ].map(([c, w, d]) => (
                          <div key={c} className="h-4 rounded-md bg-paper-deep overflow-hidden">
                            <div className={`gantt-bar in h-full ${c}`} style={{ width: w, animationDelay: d }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="text-[10.5px] font-black text-ink-soft mb-2">pulse-dot</div>
                        <span className="relative flex w-3 h-3">
                          <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-verm" />
                          <span className="relative inline-flex w-3 h-3 rounded-full bg-verm" />
                        </span>
                      </div>
                      <div>
                        <div className="text-[10.5px] font-black text-ink-soft mb-2">drift</div>
                        <span className="drift inline-block w-8 h-8 rounded-full bg-amber border-[1.5px] border-ink" />
                      </div>
                      <div>
                        <div className="text-[10.5px] font-black text-ink-soft mb-2">spin-slow</div>
                        <svg viewBox="0 0 100 100" className="spin-slow w-9 h-9 text-pine" fill="none" stroke="currentColor" strokeWidth="6">
                          <circle cx="50" cy="50" r="40" strokeDasharray="8 10" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= 8. Icons ================= */}
            <section>
              <SectionHead2
                id="icons"
                num="۰۸"
                title="آیکون‌نگاری"
                desc="همهٔ آیکون‌ها خطی، با stroke حدود ۱٫۸، سرِ گرد و currentColor — تا با متن رنگ بگیرند. اندازه‌ها: ۱۴ (متن)، ۱۸ (کنترل)، ۲۴ (تیتر کارت)، ۳۲+ (تزئینی). فاصلهٔ آیکون تا متن ۶–۸px."
              />
              <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-3">
                {ICONS.map((ic, i) => (
                  <Reveal key={ic.name} delay={Math.min(i * 40, 300)} variant="scale">
                    <div className="group rounded-xl border-[1.5px] border-ink/15 bg-paper aspect-square grid place-items-center hover:border-ink hover:bg-amber/50 hover:-translate-y-1 hover:-rotate-3 transition-all duration-300 cursor-default" title={ic.name}>
                      {ic.el("w-6 h-6 text-ink group-hover:text-verm transition-colors duration-300")}
                    </div>
                  </Reveal>
                ))}
                <Reveal delay={320} variant="scale">
                  <div className="group rounded-xl border-[1.5px] border-ink bg-verm aspect-square grid place-items-center shadow-[3px_3px_0_0_rgba(25,23,18,1)] hover:-translate-y-1 transition-all duration-300 cursor-default" title="logo">
                    <LogoMark className="w-7 h-7" />
                  </div>
                </Reveal>
              </div>
            </section>

            {/* ================= 9. Components ================= */}
            <section>
              <SectionHead2
                id="components"
                num="۰۹"
                title="کتابخانهٔ کامپوننت"
                desc="همهٔ الگوهای واقعی محصول — همان‌هایی که در صفحات می‌بینی. دکمه‌ها و کارت‌ها با همان کلاس‌های سایت رندر شده‌اند تا نمونه‌ها «نمایش» نباشند، «خودِ سیستم» باشند."
              />

              {/* buttons */}
              <Reveal className="mt-8">
                <h3 className="font-display text-xl">دکمه‌ها</h3>
              </Reveal>
              <Reveal delay={80}>
                <div className="mt-4 rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)] flex flex-wrap items-center gap-4">
                  <button className="rounded-full bg-verm text-paper px-7 py-3.5 font-bold shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:shadow-[2px_2px_0_0_rgba(25,23,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200">
                    اصلی
                  </button>
                  <button className="rounded-full bg-ink text-paper px-7 py-3.5 font-bold shadow-[5px_5px_0_0_rgba(244,71,31,1)] hover:shadow-[2px_2px_0_0_rgba(244,71,31,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200">
                    مرکابی
                  </button>
                  <button className="rounded-full border-[1.5px] border-ink px-7 py-3.5 font-bold hover:bg-ink hover:text-paper transition-colors duration-300">
                    ثانویه
                  </button>
                  <button className="rounded-full bg-amber text-ink px-7 py-3.5 font-bold border-[1.5px] border-ink hover:bg-ink hover:text-amber transition-colors duration-300">
                    تأکیدی
                  </button>
                  <button className="group inline-flex items-center gap-2 font-bold text-verm link-underline">
                    لینک
                    <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </button>
                  <button className="w-11 h-11 grid place-items-center rounded-full border-[1.5px] border-ink bg-amber shadow-[3px_3px_0_0_rgba(25,23,18,1)] hover:rotate-12 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200" aria-label="افزودن">
                    <IconPlus className="w-4 h-4" />
                  </button>
                  <button className="rounded-full bg-verm text-paper px-7 py-3.5 font-bold opacity-50 pointer-events-none">غیرفعال</button>
                  <button className="inline-flex items-center gap-2.5 rounded-full bg-verm text-paper px-7 py-3.5 font-bold opacity-80 pointer-events-none">
                    <span className="w-4 h-4 rounded-full border-2 border-paper/40 border-t-paper animate-spin" />
                    در حال بارگذاری
                  </button>
                </div>
              </Reveal>

              {/* stickers, badges, chips */}
              <Reveal className="mt-10">
                <h3 className="font-display text-xl">استیکر، بج و چیپ وضعیت</h3>
              </Reveal>
              <Reveal delay={80}>
                <div className="mt-4 rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)] flex flex-wrap items-center gap-4">
                  <Sticker>جدید</Sticker>
                  <Sticker tone="bg-amber text-ink">محبوب‌ترین</Sticker>
                  <Sticker tone="bg-pine text-paper">عملیاتی</Sticker>
                  <Sticker tone="bg-ink text-paper">دارک</Sticker>
                  <span className="h-px w-6 border-t border-dashed border-ink/40" />
                  <span className="rounded-full bg-sage text-ink px-3 py-1 text-[11px] font-bold">طراحی</span>
                  <span className="rounded-full bg-amber/70 text-ink px-3 py-1 text-[11px] font-bold">در حال انجام</span>
                  <span className="rounded-full bg-verm text-paper px-3 py-1 text-[11px] font-bold">انجام شد</span>
                  <span className="rounded-full bg-paper-deep text-ink-soft px-3 py-1 text-[11px] font-bold border border-ink/15">بایگانی</span>
                  <span className="h-px w-6 border-t border-dashed border-ink/40" />
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-pine bg-sage rounded-full px-3 py-1.5">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-pine" />
                      <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-pine" />
                    </span>
                    زنده
                  </span>
                </div>
              </Reveal>

              {/* inputs */}
              <Reveal className="mt-10">
                <h3 className="font-display text-xl">فرم و ورودی</h3>
              </Reveal>
              <Reveal delay={80}>
                <div className="mt-4 rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)] grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black mb-2">پیش‌فرض</label>
                    <input className="w-full rounded-xl border-[1.5px] border-ink bg-paper px-4 py-3 font-medium placeholder:text-ink-soft/50 focus:border-verm focus:shadow-[3px_3px_0_0_rgba(244,71,31,0.5)] outline-none transition-all duration-200" placeholder="تسک جدید بنویس…" />
                  </div>
                  <div>
                    <label className="block text-sm font-black mb-2">خطا + پیام</label>
                    <input className="w-full rounded-xl border-[1.5px] border-verm bg-verm/5 px-4 py-3 font-medium outline-none shadow-[3px_3px_0_0_rgba(244,71,31,0.4)]" defaultValue="sara@" />
                    <p className="mt-1.5 text-xs font-bold text-verm" role="alert">ایمیل درست وارد نشده.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-black mb-2">انتخاب برچسب (کنترل چیپی)</label>
                    <div className="flex flex-wrap gap-2">
                      {["طراحی", "توسعه", "تست"].map((t, i) => (
                        <button key={t} className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-bold transition-all duration-200 ${i === 1 ? "bg-ink text-paper border-ink shadow-[3px_3px_0_0_rgba(244,71,31,1)]" : "border-ink/30 hover:border-ink hover:-translate-y-0.5"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black mb-2">جستجو</label>
                    <div className="relative">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft">
                        <circle cx="10.5" cy="10.5" r="6.5" />
                        <path d="m20 20-4.8-4.8" />
                      </svg>
                      <input className="w-full rounded-full border-[1.5px] border-ink bg-paper py-3 ps-11 pe-4 font-medium placeholder:text-ink-soft/50 focus:border-verm outline-none transition-all duration-200" placeholder="جستجو در پروژه…" />
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* cards, tickets, table */}
              <Reveal className="mt-10">
                <h3 className="font-display text-xl">کارت، بلیت و جدول</h3>
              </Reveal>
              <div className="mt-4 grid lg:grid-cols-3 gap-6">
                <Reveal variant="scale">
                  <div className="card-tilt -rotate-1 rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)]">
                    <div className="flex items-center justify-between">
                      <span className="w-11 h-11 grid place-items-center rounded-full border-[1.5px] border-ink bg-amber/50"><IconBolt className="w-5 h-5" /></span>
                      <span className="font-display text-3xl text-verm tabular-nums">۶۲٪</span>
                    </div>
                    <h4 className="mt-4 font-display text-xl">کارت محتوایی</h4>
                    <p className="mt-2 text-sm text-ink-soft font-medium leading-7">سطحِ محتوا هرگز شیشه‌ای یا شناورِ کاذب نیست — کاغذِ صاف، مرز قاطع، یک سایهٔ آفست.</p>
                  </div>
                </Reveal>
                <Reveal delay={100} variant="scale">
                  <div className="ticket-card rotate-1 rounded-xl border-[1.5px] border-ink bg-paper overflow-hidden shadow-[7px_7px_0_0_rgba(25,23,18,1)]">
                    <span className="block h-2.5 bg-verm" />
                    <div className="p-6">
                      <div className="font-display text-4xl tabular-nums">۲٬۴۰۰<span className="text-verm text-2xl">+</span></div>
                      <div className="mt-1 font-bold">بلیت آماری</div>
                      <div className="mt-4 pt-4 border-t-2 border-dashed border-ink/20 flex items-center gap-[2.5px]">
                        {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3].map((w, i) => (
                          <span key={i} className="bg-ink/80 rounded-[1px]" style={{ width: `${w * 1.4}px`, height: `${8 + ((i * 5) % 12)}px` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={200} variant="scale">
                  <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)]">
                    <h4 className="font-display text-lg">جدول داده</h4>
                    <table className="mt-3 w-full text-[12px]">
                      <thead>
                        <tr className="text-ink-soft text-[10px] font-black border-b-2 border-ink/15">
                          <th className="text-start py-1.5">تسک</th>
                          <th className="text-start py-1.5">وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["تقویم شمسی", "انجام شد", "bg-verm text-paper"],
                          ["API نسخه ۲", "در حال انجام", "bg-amber/70 text-ink"],
                          ["تست پرداخت", "برای انجام", "bg-paper-deep text-ink-soft"],
                        ].map(([t, s, c]) => (
                          <tr key={t} className="border-b border-ink/8 hover:bg-paper-deep/60 transition-colors">
                            <td className="py-2 font-bold">{t}</td>
                            <td className="py-2"><span className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${c}`}>{s}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>
              </div>

              {/* charts */}
              <Reveal className="mt-10">
                <h3 className="font-display text-xl">نمودارها و بازخورد</h3>
              </Reveal>
              <div className="mt-4 grid lg:grid-cols-3 gap-6">
                <Reveal variant="scale">
                  <SparkDemo />
                </Reveal>
                <Reveal delay={100} variant="scale">
                  <div className="h-full rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)]">
                    <h4 className="font-display text-lg">میله‌ای + دونات</h4>
                    <div className="mt-4 flex items-end gap-1.5 h-20">
                      {[40, 65, 50, 80, 62, 90, 74].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm bg-pine hover:bg-verm transition-colors duration-200" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-4">
                      <svg viewBox="0 0 42 42" className="w-16 h-16 -rotate-90">
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(25,23,18,0.12)" strokeWidth="6" />
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-verm)" strokeWidth="6" strokeDasharray="45 55" />
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-amber)" strokeWidth="6" strokeDasharray="30 70" strokeDashoffset="-45" />
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-pine)" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-75" />
                      </svg>
                      <div className="space-y-1 text-[10.5px] font-bold">
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-verm" /> انجام شد ۴۵٪</span>
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-amber" /> در جریان ۳۰٪</span>
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-pine" /> باز ۲۵٪</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={200} variant="scale">
                  <div className="h-full rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)] space-y-3">
                    <h4 className="font-display text-lg">اعلان‌ها</h4>
                    {[
                      ["bg-pine text-paper", "تسک «تقویم شمسی» تکمیل شد", <IconCheck key="i" className="w-4 h-4" />],
                      ["bg-amber text-ink", "ددلاین «تست پرداخت»: فردا", <IconBell key="i" className="w-4 h-4" />],
                      ["bg-verm text-paper", "مسیر بحرانی عقب افتاد", <IconBolt key="i" className="w-4 h-4" />],
                    ].map(([cls, txt, ic], i) => (
                      <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[12.5px] font-bold shadow-[3px_3px_0_0_rgba(25,23,18,0.8)] ${cls}`}>
                        {ic}
                        {txt}
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

              {/* avatar group + progress + empty */}
              <div className="mt-6 grid sm:grid-cols-3 gap-6">
                <Reveal>
                  <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[5px_5px_0_0_rgba(25,23,18,1)]">
                    <h4 className="font-display text-base">گروه آواتار</h4>
                    <div className="mt-3 flex -space-x-2.5" dir="ltr">
                      {["bg-verm", "bg-pine", "bg-ink", "bg-amber text-ink", "bg-pine-soft"].map((c, i) => (
                        <span key={i} className={`w-10 h-10 grid place-items-center rounded-full border-2 border-paper text-[11px] font-bold text-paper ${c} hover:-translate-y-1 transition-transform duration-200`}>
                          {["س", "ا", "ن", "غ", "ک"][i]}
                        </span>
                      ))}
                      <span className="w-10 h-10 grid place-items-center rounded-full border-2 border-dashed border-ink/40 text-ink-soft text-[11px] font-black hover:border-ink transition-colors">+۳</span>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={90}>
                  <ProgressDemo />
                </Reveal>
                <Reveal delay={180}>
                  <div className="h-full rounded-2xl border-[1.5px] border-dashed border-ink/40 bg-paper-deep/50 p-6 grid place-items-center text-center">
                    <div>
                      <IconInbox className="w-10 h-10 mx-auto text-ink-soft/60" />
                      <h4 className="mt-3 font-display text-base">حالت خالی</h4>
                      <p className="mt-1 text-xs text-ink-soft font-medium">هنوز تسکی اینجا نیست — اولی را بساز.</p>
                      <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-verm link-underline">
                        <IconPlus className="w-3.5 h-3.5" />
                        تسک جدید
                      </button>
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>

            {/* footer note */}
            <Reveal variant="scale">
              <div className="rounded-2xl border-[1.5px] border-ink bg-ink text-paper p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-dark opacity-50" aria-hidden />
                <div className="relative">
                  <h3 className="font-display text-2xl sm:text-3xl">قانون طلایی</h3>
                  <p className="mt-3 text-paper/70 font-medium leading-8 max-w-xl mx-auto text-[15px]">
                    وقتی UI جدیدی لازم شد، طراحیِ جدا نساز — این سیستم را گسترش بده.
                    هیچ رنگِ تصادفی، هیچ فاصلهٔ دل‌بخواهی، هیچ سایهٔ بی‌قانونی.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <a href="#/" className="rounded-full bg-amber text-ink px-6 py-3 font-bold hover:bg-paper transition-colors duration-300">دیدن محصول با همین DNA</a>
                    <a href="#/features" className="rounded-full border-[1.5px] border-paper/40 px-6 py-3 font-bold hover:bg-paper hover:text-ink transition-colors duration-300">ویژگی‌ها</a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ---------- small demos ---------- */
function SparkDemo() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`h-full rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[6px_6px_0_0_rgba(25,23,18,1)] ${inView ? "in" : ""}`}>
      <h4 className="font-display text-lg">خطی (اسپارک)</h4>
      <svg viewBox="0 0 220 80" className="mt-4 w-full" fill="none">
        <path d="M0 66h220" stroke="rgba(25,23,18,0.15)" strokeDasharray="3 5" />
        <path d="M0 40h220" stroke="rgba(25,23,18,0.15)" strokeDasharray="3 5" />
        <path className="spark-path" d="M4 62C30 58 44 44 64 46s30 16 50 10 28-26 46-28 34 6 56-16" stroke="var(--color-verm)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="214" cy="12" r="4.5" fill="var(--color-verm)" stroke="var(--color-paper)" strokeWidth="2" />
      </svg>
      <p className="mt-3 text-[11px] font-bold text-ink-soft">با ورود به دید، مسیر کشیده می‌شود — دوباره اسکرول کن تا ببینی.</p>
    </div>
  );
}

function ProgressDemo() {
  const [pct, setPct] = useState(38);
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[5px_5px_0_0_rgba(25,23,18,1)]">
      <h4 className="font-display text-base">پیشرفت تعاملی</h4>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0" dir="ltr">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90 progress-ring">
            <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(25,23,18,0.12)" strokeWidth="7" />
            <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-verm)" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C} />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[11px] font-black tabular-nums">{faNum(pct)}٪</span>
        </div>
        <input type="range" min={0} max={100} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="flex-1 accent-[#F4471F]" aria-label="درصد پیشرفت" />
      </div>
    </div>
  );
}

function IconInbox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 13.5 6.5 5h11L20 13.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-5.5Z" />
      <path d="M4 13.5h4.5l1.5 2.5h4l1.5-2.5H20" />
    </svg>
  );
}
