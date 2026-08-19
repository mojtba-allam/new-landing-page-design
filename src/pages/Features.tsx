import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Reveal, faNum, usePrefersReducedMotion } from "../lib/motion";
import { PageShell, Sheet, Sticker, usePageMeta } from "../components/PageShell";
import { IconArrow, IconBolt, IconCheck } from "../components/Icons";

/* ================= content ================= */
const RAIL = [
  { id: "workspace", n: "۰۱", label: "ورک‌اسپیس" },
  { id: "projects", n: "۰۲", label: "پروژه‌ها" },
  { id: "views", n: "۰۳", label: "۵ نما" },
  { id: "team", n: "۰۴", label: "تیم و دعوت" },
  { id: "mcp", n: "۰۵", label: "MCP" },
  { id: "ai", n: "۰۶", label: "AI" },
  { id: "chat", n: "۰۷", label: "چت‌روم" },
  { id: "docs", n: "۰۸", label: "دانش" },
  { id: "alerts", n: "۰۹", label: "هشدارها" },
  { id: "cicd", n: "۱۰", label: "CI/CD" },
];

const VIEWS = [
  { id: "kanban", label: "کانبان" },
  { id: "list", label: "لیست" },
  { id: "graph", label: "گراف" },
  { id: "timeline", label: "تایم‌لاین" },
  { id: "tree", label: "درختی" },
] as const;
type ViewId = (typeof VIEWS)[number]["id"];

const AI_PRESETS = [
  {
    prompt: "راه‌اندازی فروشگاه آنلاین",
    tasks: ["انتخاب پلتفرم و دامنه", "طراحی صفحهٔ محصول", "اتصال درگاه پرداخت", "تست خرید سرتاسری", "کمپین رونمایی"],
  },
  {
    prompt: "برگزاری رویداد استارتاپی",
    tasks: ["رزرو سالن و پذیرایی", "دعوت از سخنران‌ها", "طراحی پوستر و بلیت", "هماهنگی اسپانسرها", "برنامهٔ روز اجرا"],
  },
  {
    prompt: "توسعهٔ اپلیکیشن موبایل",
    tasks: ["طراحی رابط کاربری", "پیاده‌سازی API", "تست روی دستگاه‌ها", "انتشار در استورها", "مانیتورینگ کرش‌ها"],
  },
];

const CHAT = [
  { who: "نیما", text: "تسک تقویم شمسی رفت «در حال انجام» 🙌", tone: "bg-sage" },
  { who: "سارا", text: "عالی! دمو رو پنجشنبه می‌ذاریم؟", tone: "bg-amber/60" },
  { who: "کاوه", text: "من تست‌ها رو تا چهارشنبه تموم می‌کنم ✅", tone: "bg-sky-soft" },
  { who: "لیلا", text: "سرعت بورد ۲ برابر شد، باورم نمیشه", tone: "bg-paper-deep" },
];

const MORE = [
  "تقویم شمسی", "اپ موبایل و آفلاین", "API و وب‌هوک", "ورود دومرحله‌ای",
  "ایمپورت از ترلو و جیرا", "گزارش‌های زنده", "ثبت زمان و صورتحساب",
  "اعداد و تاریخ فارسی", "میان‌برهای کیبورد", "تم‌های رنگی", "حق دسترسی دقیق", "جستجوی سراسری",
];

/* ================= tiny visuals ================= */
function MiniKanban() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {[3, 2, 1].map((count, ci) => (
        <div key={ci} className="rounded-xl border-[1.5px] border-ink/15 bg-paper-deep/60 p-2 space-y-2">
          <span className="block h-1.5 w-8 rounded-full bg-ink/20" />
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={`block h-8 rounded-lg border border-ink/15 transition-transform duration-300 hover:-translate-y-0.5 ${
                ci === 2 ? "bg-pine/15" : ci === 1 && i === 0 ? "bg-amber/60" : "bg-paper"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MiniList() {
  return (
    <div className="space-y-2">
      {["طراحی صفحهٔ ورود", "تست پرداخت ریالی", "اتصال تقویم شمسی", "بهینه‌سازی سرعت"].map((t, i) => (
        <div key={t} className="flex items-center gap-3 rounded-lg border border-ink/12 bg-paper px-3 py-2.5 hover:border-verm/50 hover:translate-x-1 transition-all duration-300">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${i === 3 ? "bg-pine" : i === 2 ? "bg-amber" : "bg-ink/25"}`} />
          <span className="text-xs font-bold text-ink-soft truncate">{t}</span>
          <span className="ms-auto text-[10px] font-bold text-ink/40 tabular-nums">{faNum(i + 1)}</span>
        </div>
      ))}
    </div>
  );
}

function MiniGraph() {
  return (
    <svg viewBox="0 0 300 110" className="w-full" fill="none">
      <path d="M40 55 H110 M140 35 H220 M140 75 H220 M40 55 C75 55 75 35 110 35 M40 55 C75 55 75 75 110 75" stroke="#F4471F" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
      {[
        [40, 55, "#191712"], [110, 35, "#FFC24B"], [110, 75, "#FFC24B"], [220, 35, "#0F3B31"], [220, 75, "#0F3B31"],
      ].map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="13" fill={c as string} stroke="#F5F2EB" strokeWidth="2.5" />
        </g>
      ))}
      <circle cx="270" cy="55" r="10" fill="none" stroke="#F4471F" strokeWidth="2" strokeDasharray="3 4" />
    </svg>
  );
}

function MiniTimeline() {
  return (
    <div className="space-y-2.5" dir="rtl">
      {[
        { w: "45%", s: "6%", c: "bg-verm" },
        { w: "35%", s: "30%", c: "bg-amber" },
        { w: "50%", s: "12%", c: "bg-pine" },
        { w: "28%", s: "55%", c: "bg-ink/60" },
      ].map((b, i) => (
        <div key={i} className="relative h-6 rounded-md bg-paper-deep/70 border border-ink/10 overflow-hidden">
          <span className={`absolute top-1 bottom-1 rounded ${b.c} transition-all duration-500 hover:brightness-110`} style={{ insetInlineStart: b.s, width: b.w }} />
        </div>
      ))}
      <span className="absolute top-0 bottom-0 border-s-2 border-dashed border-amber" style={{ insetInlineStart: "40%" }} />
    </div>
  );
}

function MiniTree() {
  return (
    <div className="space-y-1.5 text-xs font-bold">
      <div className="flex items-center gap-2 text-ink">
        <span className="w-2 h-2 rotate-45 bg-verm" /> پروژهٔ فینولو ۳٫۰
      </div>
      {[
        ["طراحی", 2, "ms-4"], ["توسعه", 3, "ms-4"], ["رشد و تست", 1, "ms-4"],
      ].map(([label, n, ind]) => (
        <div key={label as string}>
          <div className={`flex items-center gap-2 text-ink-soft ${ind}`}>
            <span className="w-4 border-t-[1.5px] border-ink/30" />
            <span className="w-2 h-2 rounded-full bg-amber" /> {label as string}
          </div>
          {Array.from({ length: n as number }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 text-ink/50 ms-12">
              <span className="w-3 border-t border-ink/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-pine/50" /> زیرتسک {faNum(i + 1)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ================= row shell ================= */
function FeatureRow({
  id, n, title, desc, flip = false, visual, wide = false,
}: {
  id: string; n: string; title: React.ReactNode; desc: string; flip?: boolean; visual: React.ReactNode; wide?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className={`grid items-center gap-8 lg:gap-14 ${wide ? "lg:grid-cols-[1fr_1.35fr]" : "lg:grid-cols-2"}`}>
        <Reveal className={flip ? "lg:order-2" : ""}>
          <div className="flex items-center gap-4">
            <span className="font-display text-5xl text-verm/90 leading-none tabular-nums">{n}</span>
            <span className="h-[3px] w-10 bg-amber rotate-[-4deg] rounded-full" />
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.2]">{title}</h2>
          <p className="mt-4 text-ink-soft leading-8 font-medium text-[15px] max-w-md">{desc}</p>
        </Reveal>
        <Reveal variant="scale" delay={120} className={flip ? "lg:order-1" : ""}>
          {visual}
        </Reveal>
      </div>
    </section>
  );
}

function VisualCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card-tilt rounded-2xl border-[1.5px] border-ink bg-paper p-6 shadow-[7px_7px_0_0_rgba(25,23,18,1)] ${className}`}>
      {children}
    </div>
  );
}

/* ================= interactive: 5 views ================= */
function ViewsDemo() {
  const [view, setView] = useState<ViewId>("kanban");
  return (
    <VisualCard>
      <div className="flex flex-wrap gap-2 mb-5">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`rounded-full border-[1.5px] px-4 py-1.5 text-sm font-bold transition-all duration-200 ${
              view === v.id ? "bg-ink text-paper border-ink shadow-[2px_2px_0_0_rgba(244,71,31,1)]" : "border-ink/25 text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div key={view} className="panel-in min-h-[150px]">
        {view === "kanban" && <MiniKanban />}
        {view === "list" && <MiniList />}
        {view === "graph" && <MiniGraph />}
        {view === "timeline" && <MiniTimeline />}
        {view === "tree" && <MiniTree />}
      </div>
      <p className="mt-4 text-[11px] font-bold text-ink-soft">یک داده، پنج روایت — بدون کپی و بدون همگام‌سازی.</p>
    </VisualCard>
  );
}

/* ================= interactive: AI prompt lab ================= */
function AiLab() {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(true);
  const tasks = AI_PRESETS[idx].tasks;

  useEffect(() => {
    if (!running) return;
    if (shown >= tasks.length) {
      setRunning(false);
      return;
    }
    const t = window.setTimeout(() => setShown((s) => s + 1), 420);
    return () => window.clearTimeout(t);
  }, [running, shown, tasks.length]);

  const run = (i: number) => {
    setIdx(i);
    setShown(0);
    setRunning(true);
  };

  return (
    <VisualCard className="bg-ink text-paper border-ink">
      <div className="flex items-center gap-2 text-[11px] font-black text-amber">
        <IconBolt className="w-4 h-4" />
        آزمایشگاه پرامپت — همین‌جا امتحان کن
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {AI_PRESETS.map((p, i) => (
          <button
            key={p.prompt}
            onClick={() => run(i)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
              i === idx ? "bg-verm text-paper border-verm" : "border-paper/25 text-paper/60 hover:border-paper/60 hover:text-paper"
            }`}
          >
            {p.prompt}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-pine-deep/60 border border-paper/15 px-4 py-3 text-sm font-medium text-paper/80 min-h-[42px]" dir="rtl">
        «{AI_PRESETS[idx].prompt}»<span className="ai-caret text-amber font-black">▍</span>
      </div>
      <div className="mt-4 space-y-2">
        {tasks.slice(0, shown).map((t, i) => (
          <div key={t} className="task-in flex items-center gap-2.5 rounded-lg bg-paper/8 border border-paper/12 px-3 py-2" style={{ animationDelay: `${i * 40}ms` }}>
            <span className="w-5 h-5 grid place-items-center rounded-full bg-verm text-paper shrink-0">
              <IconCheck className="w-3 h-3" />
            </span>
            <span className="text-xs font-bold text-paper/85">{t}</span>
          </div>
        ))}
        {running && shown < tasks.length && (
          <div className="flex items-center gap-2 text-[11px] font-bold text-paper/40">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-paper/25 border-t-amber animate-spin" />
            در حال ساخت ستون‌ها و تسک‌ها…
          </div>
        )}
      </div>
    </VisualCard>
  );
}

/* ================= living: chat ================= */
function ChatDemo() {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced ? CHAT.length : 2);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setShown((s) => (s >= CHAT.length ? 2 : s + 1)), 2400);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <VisualCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[11px] font-black text-ink-soft">
          <span className="relative flex w-2 h-2">
            <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-pine" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-pine" />
          </span>
          چت‌روم «فینولو ۳٫۰» — ۴ نفر آنلاین
        </div>
      </div>
      <div className="space-y-3 min-h-[190px]">
        {CHAT.slice(0, shown).map((m) => (
          <div key={m.who + m.text} className="msg-in flex items-start gap-2.5">
            <span className={`w-8 h-8 shrink-0 grid place-items-center rounded-full text-[10px] font-black text-ink border border-ink/20 ${m.tone}`}>
              {m.who.slice(0, 2)}
            </span>
            <div className={`rounded-2xl rounded-ss-md border border-ink/12 px-3.5 py-2 ${m.tone}`}>
              <span className="block text-[10px] font-black text-ink/60">{m.who}</span>
              <span className="block text-xs font-bold text-ink leading-5">{m.text}</span>
            </div>
          </div>
        ))}
        {!reduced && shown < CHAT.length && (
          <div className="msg-in inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-paper-deep px-3 py-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: `${i * 130}ms` }} />
            ))}
          </div>
        )}
      </div>
    </VisualCard>
  );
}

/* ================= living: alerts ================= */
function AlertsDemo() {
  return (
    <VisualCard className="overflow-hidden relative min-h-[210px]">
      <div className="text-[11px] font-black text-ink-soft mb-3">هشدارهای بلادرنگ — پخش زنده</div>
      <div className="relative h-40">
        {[
          { cls: "toast-a", icon: <IconCheck className="w-3.5 h-3.5" />, tone: "bg-pine", text: "نیما «اتصال تقویم شمسی» را تمام کرد" },
          { cls: "toast-b", icon: <IconBolt className="w-3.5 h-3.5" />, tone: "bg-verm", text: "ددلاین «تست پرداخت» فرداست!" },
          { cls: "toast-c", icon: <IconCheck className="w-3.5 h-3.5" />, tone: "bg-amber text-ink", text: "لیلا به پروژهٔ «فینولو ۳٫۰» پیوست" },
        ].map((t) => (
          <div key={t.cls} className={`${t.cls} absolute inset-x-0 top-0 flex items-center gap-3 rounded-xl border-[1.5px] border-ink bg-paper px-4 py-3 shadow-[4px_4px_0_0_rgba(25,23,18,0.85)]`}>
            <span className={`w-8 h-8 shrink-0 grid place-items-center rounded-full text-paper ${t.tone}`}>{t.icon}</span>
            <span className="text-xs font-bold text-ink">{t.text}</span>
            <span className="ms-auto text-[10px] font-bold text-ink-soft whitespace-nowrap">همین حالا</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] font-bold text-ink-soft">وب و موبایل، هم‌زمان — با تنظیمات هوشمند که اسپم نمی‌کند.</p>
    </VisualCard>
  );
}

/* ================= living: CI/CD ================= */
function CicdDemo() {
  const stages = ["کد", "بیلد", "تست", "دیپلوی"];
  return (
    <VisualCard>
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-black text-ink-soft">خط لولهٔ انتشار — خودکار</span>
        <span className="text-[10px] font-black text-pine bg-sage rounded-full px-2.5 py-1 border border-pine/30">فعال</span>
      </div>
      <div className="relative" dir="ltr">
        <span className="absolute top-1/2 -translate-y-1/2 left-[8%] right-[8%] h-[3px] rounded-full bg-ink/12" />
        <span className="pipe-dot absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-verm border-2 border-paper shadow-[0_0_0_3px_rgba(244,71,31,0.25)]" />
        <div className="relative flex justify-between px-2">
          {stages.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <span
                className="stage-pulse w-10 h-10 grid place-items-center rounded-full border-[1.5px] border-ink bg-paper font-display text-sm"
                style={{ animationDelay: `${i * 0.85}s` }}
              >
                {faNum(i + 1)}
              </span>
              <span className="text-[11px] font-black text-ink-soft">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 rounded-lg bg-pine-deep text-paper/80 px-4 py-2.5 font-mono text-[11px]" dir="ltr">
        <span className="text-amber">✓</span> deploy #142 → <span className="text-verm">production</span> <span className="text-paper/40">(38s)</span>
      </div>
    </VisualCard>
  );
}

/* ================= small visuals ================= */
function WorkspaceDemo() {
  return (
    <VisualCard className="relative">
      <div className="absolute -top-4 right-6 flex gap-2">
        {["محصول", "بازاریابی"].map((w, i) => (
          <span key={w} className={`rounded-t-xl border-[1.5px] border-b-0 border-ink px-4 py-1.5 text-xs font-black ${i === 0 ? "bg-paper" : "bg-paper-deep text-ink-soft"}`}>
            {w}
          </span>
        ))}
      </div>
      <div className="pt-4 grid grid-cols-3 gap-2.5">
        {["فینولو ۳٫۰", "سایت جدید", "اپ موبایل"].map((p, i) => (
          <div key={p} className="rounded-xl border-[1.5px] border-ink/15 bg-paper-deep/60 p-3 hover:-translate-y-1 hover:border-verm/50 transition-all duration-300">
            <span className={`block w-7 h-7 rounded-lg mb-2 ${i === 0 ? "bg-verm" : i === 1 ? "bg-amber" : "bg-pine"}`} />
            <span className="block text-[11px] font-black">{p}</span>
            <span className="block mt-1.5 h-1.5 rounded-full bg-ink/12 overflow-hidden">
              <span className={`block h-full ${i === 0 ? "w-3/4" : i === 1 ? "w-1/2" : "w-1/4"} bg-pine`} />
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] font-bold text-ink-soft">هر ورک‌اسپیس، دنیای خودش: اعضا، تنظیمات و دسترسیِ جدا.</p>
    </VisualCard>
  );
}

function TeamDemo() {
  return (
    <VisualCard>
      <div className="flex items-center -space-x-3" dir="ltr">
        {["bg-verm", "bg-pine", "bg-ink", "bg-pine-soft", "bg-amber text-ink"].map((c, i) => (
          <span key={i} className={`w-11 h-11 grid place-items-center rounded-full border-2 border-paper text-[11px] font-black text-paper shadow-sm ${c}`}>
            {["س‌م", "ا‌ک", "ن‌ر", "غ‌ح", "ک‌ت"][i]}
          </span>
        ))}
        <span className="w-11 h-11 grid place-items-center rounded-full border-2 border-dashed border-ink/40 text-verm bg-paper-deep font-black">+</span>
      </div>
      <div className="mt-5 rounded-xl border-[1.5px] border-dashed border-ink/40 bg-paper-deep/60 px-4 py-3 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-ink-soft truncate" dir="ltr">finolo.ir/join/x7Kq…</span>
        <span className="shrink-0 text-[10px] font-black bg-verm text-paper rounded-full px-3 py-1.5">دعوت با لینک</span>
      </div>
      <div className="mt-3 flex gap-2">
        {["مدیر", "عضو", "مهمان"].map((r, i) => (
          <span key={r} className={`text-[10px] font-black rounded-full border-[1.5px] px-3 py-1 ${i === 0 ? "bg-pine text-paper border-pine" : "border-ink/25 text-ink-soft"}`}>
            {r}
          </span>
        ))}
      </div>
    </VisualCard>
  );
}

function McpDemo() {
  return (
    <VisualCard className="bg-pine-deep text-paper border-ink">
      <div className="flex items-center gap-2 text-[11px] font-black text-amber">
        <IconBolt className="w-4 h-4" />
        MCP Server — پلِ استاندارد به AI
      </div>
      <div className="mt-4 space-y-2 font-mono text-[11.5px]" dir="ltr">
        <div className="text-paper/50">$ npx finolo-mcp serve</div>
        <div className="text-pine-soft bg-paper/6 border border-paper/10 rounded-lg px-3 py-2 text-paper/75">
          <span className="text-amber">tools:</span> create_task, move_task, list_board
        </div>
        <div className="text-pine-soft bg-paper/6 border border-paper/10 rounded-lg px-3 py-2 text-paper/75">
          <span className="text-verm">→</span> Claude / Cursor / GPT می‌توانند مستقیم بنویسند
        </div>
      </div>
      <p className="mt-4 text-[11px] font-bold text-paper/55">هر ابزارِ سازگار با MCP، بدون کدنویسی به بوردت وصل می‌شود.</p>
    </VisualCard>
  );
}

function DocsDemo() {
  return (
    <VisualCard>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-black text-ink-soft">ویکیِ پروژهٔ «فینولو ۳٫۰»</span>
        <span className="text-[10px] font-black bg-sage text-pine rounded-full px-2.5 py-1 border border-pine/25">۲۴ سند</span>
      </div>
      <div className="space-y-2">
        {[
          { t: "تصمیم‌های معماری", d: "۶ سند", c: "bg-amber" },
          { t: "راهنمای استقرار", d: "۴ سند", c: "bg-verm" },
          { t: "استاندارد کد تیم", d: "۳ سند", c: "bg-pine" },
        ].map((g) => (
          <div key={g.t} className="flex items-center gap-3 rounded-xl border border-ink/12 bg-paper-deep/50 px-4 py-3 hover:border-verm/40 hover:translate-x-1 transition-all duration-300">
            <span className={`w-8 h-8 shrink-0 rounded-lg ${g.c} opacity-90`} />
            <div className="min-w-0">
              <span className="block text-xs font-black truncate">{g.t}</span>
              <span className="block text-[10px] font-bold text-ink-soft">{g.d}</span>
            </div>
            <IconArrow className="w-3.5 h-3.5 ms-auto text-ink/30" />
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

/* ================= page ================= */
export default function Features() {
  usePageMeta(
    "ویژگی‌های فینولو | فینولو",
    "همهٔ قابلیت‌های فینولو در یک نگاه: ورک‌اسپیس متعدد، ۵ نمای کانبان/لیست/گراف/تایم‌لاین/درختی، تیم‌سازی، MCP، پرامپت AI، چت‌روم، دانش، هشدار بلادرنگ و CI/CD."
  );

  /* دیپ‌لینک از صفحهٔ اول: #/features?to=ai → اسکرول به همان بخش + هایلایت کوتاه */
  const [searchParams] = useSearchParams();
  const deepLink = searchParams.get("to");
  useEffect(() => {
    if (!deepLink) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(deepLink);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("flash-target");
      window.setTimeout(() => el.classList.remove("flash-target"), 1800);
    }, 280);
    return () => window.clearTimeout(t);
  }, [deepLink]);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <PageShell
      crumb="ویژگی‌ها"
      index="۱۱"
      sticker="ابزار"
      title={
        <>
          جعبه‌ابزارِ کامل،
          <br />
          برای <span className="text-verm">کارِ واقعی</span>
        </>
      }
      lead="اینجا لیستِ خشک و خالی نمی‌بینی؛ هر قابلیت را زنده نشانت می‌دهیم. کلیک کن، نما عوض کن، پرامپت بفرست — تا با چشم خودت ببینی فینولو یعنی چه."
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* jump rail */}
        <Reveal className="mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {RAIL.map((r) => (
              <button
                key={r.id}
                onClick={() => jump(r.id)}
                className="group shrink-0 inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/25 bg-paper px-4 py-2 text-sm font-bold text-ink-soft hover:border-verm hover:text-ink hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(244,71,31,0.4)] transition-all duration-200"
              >
                <span className="font-display text-verm text-xs">{r.n}</span>
                {r.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* opener duo */}
        <div className="mt-16 space-y-24 lg:space-y-28">
          <FeatureRow
            id="workspace" n="۰۱" flip
            title={<>ورک‌اسپیس‌های <span className="text-verm">متعدد</span></>}
            desc="بازاریابی، محصول، یا حتی کارهای شخصی‌ات — هرکدام در یک ورک‌اسپیس جدا با اعضا و تنظیمات خودش. با یک کلیک جابه‌جا شو؛ هیچ‌چیز با هیچ‌چیز قاطی نمی‌شود."
            visual={<WorkspaceDemo />}
          />

          <FeatureRow
            id="projects" n="۰۲"
            title={<>پروژه‌های <span className="text-verm">بی‌شمار</span></>}
            desc="از یک پروژهٔ سه‌تسکیِ شخصی تا مگا‌پروژهٔ دوازده‌تیمی. هر پروژه بورد، تقویم، اسناد و دسترسیِ خودش را دارد و همه زیر یک سقف."
            visual={<ProjectsDemo />}
          />

          {/* views — full-width showpiece */}
          <section id="views" className="scroll-mt-32">
            <div className="grid lg:grid-cols-[1fr_1.4fr] items-center gap-8 lg:gap-14">
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="font-display text-5xl text-verm/90 leading-none">۰۳</span>
                  <span className="h-[3px] w-10 bg-amber rotate-[-4deg] rounded-full" />
                </div>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.2]">
                  یک پروژه، <span className="text-verm">۵ روایت</span>
                </h2>
                <p className="mt-4 text-ink-soft leading-8 font-medium text-[15px] max-w-md">
                  همان داده را هرطور که برایت روشن‌تر است ببین: کانبان برای جریان کار، لیست برای جزئیات، گراف برای وابستگی‌ها، تایم‌لاین برای برنامه و درختی برای ساختار. یک کلیک، بدون کپی‌کردن.
                </p>
                <Sticker tone="bg-amber text-ink" className="mt-6">روی تب‌ها کلیک کن ↓</Sticker>
              </Reveal>
              <Reveal variant="scale" delay={120}>
                <ViewsDemo />
              </Reveal>
            </div>
          </section>

          <FeatureRow
            id="team" n="۰۴" flip
            title={<>تیم‌سازی و <span className="text-verm">دعوت</span></>}
            desc="با یک لینک دعوت کن و همان اول نقش را مشخص کن — مدیر، عضو یا مهمان. دسترسی‌ها خودکار اعمال می‌شوند؛ نه ایمیل‌های گم‌شده، نه توضیح‌های تکراری."
            visual={<TeamDemo />}
          />

          <FeatureRow
            id="mcp" n="۰۵"
            title={<>سرور <span className="text-verm">MCP</span></>}
            desc="فینولو را به ابزارهای هوش مصنوعی وصل کن. دستیار AI تو مستقیماً تسک می‌خواند، می‌سازد و جابه‌جا می‌کند — با پروتکل استاندارد MCP، بدون یک خط کد."
            visual={<McpDemo />}
          />

          {/* AI lab — wide */}
          <section id="ai" className="scroll-mt-32">
            <div className="grid lg:grid-cols-[1fr_1.35fr] items-center gap-8 lg:gap-14">
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="font-display text-5xl text-verm/90 leading-none">۰۶</span>
                  <span className="h-[3px] w-10 bg-amber rotate-[-4deg] rounded-full" />
                </div>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.2]">
                  پرامپت‌های <span className="text-verm">اختصاصی AI</span>
                </h2>
                <p className="mt-4 text-ink-soft leading-8 font-medium text-[15px] max-w-md">
                  پرامپت دلخواهت را بنویس یا یکی از قالب‌ها را انتخاب کن؛ فینولو ستون‌ها و تسک‌های پروژه را برایت می‌چیند. از صفر تا یک بوردِ مرتب، در ده ثانیه.
                </p>
              </Reveal>
              <Reveal variant="scale" delay={120}>
                <AiLab />
              </Reveal>
            </div>
          </section>

          <FeatureRow
            id="chat" n="۰۷" flip
            title={<>چت‌روم <span className="text-verm">داخلی</span></>}
            desc="هر پروژه چتِ خودش را دارد و هر پیام به همان بورد گره می‌خورد. بحث‌ها کنارِ کار می‌مانند — نه لابه‌لای پیام‌رسان‌ها که گم شوند."
            visual={<ChatDemo />}
          />

          <FeatureRow
            id="docs" n="۰۸"
            title={<>مدیریت دانش و <span className="text-verm">اسناد</span></>}
            desc="هر پروژه ویکی و اسناد خودش را دارد. تصمیم‌ها، راهنماها و صورت‌جلسه‌ها را همان‌جا بنویس و با جستجوی سراسری در یک چشم‌به‌هم‌زدن پیدایشان کن."
            visual={<DocsDemo />}
          />

          <FeatureRow
            id="alerts" n="۰۹" flip
            title={<>هشدار <span className="text-verm">بلادرنگ</span></>}
            desc="لحظه‌ای که چیزی تغییر کند، تیم باخبر می‌شود — روی وب و موبایل، هم‌زمان. با تنظیمات هوشمندی که فقط خبرِ لازم را می‌رساند، نه هر حرکتی را."
            visual={<AlertsDemo />}
          />

          <FeatureRow
            id="cicd" n="۱۰"
            title={<>راه‌اندازی <span className="text-verm">CI/CD</span></>}
            desc="مخزن کدت را وصل کن تا با هر ریلیز، بیلد و دیپلوی خودکار شود و وضعیتش همان‌جا روی بورد بنشیند. تیم فنی و تیم محصول، بالاخره هم‌صف."
            visual={<CicdDemo />}
          />
        </div>

        {/* more strip */}
        <section className="mt-28">
          <Reveal>
            <div className="flex items-center gap-4">
              <Sticker>و کلی چیزِ دیگر…</Sticker>
              <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
            </div>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            {MORE.map((m, i) => (
              <Reveal key={m} delay={Math.min(i * 50, 400)}>
                <span className={`inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-ink px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-1 hover:shadow-[3px_3px_0_0_rgba(25,23,18,1)] cursor-default ${i % 3 === 0 ? "bg-paper" : i % 3 === 1 ? "bg-sage" : "bg-amber/40"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-verm" />
                  {m}
                </span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Reveal variant="scale" className="mt-24">
          <Sheet className="bg-ink text-paper relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-dark opacity-60" aria-hidden />
            <div className="relative p-8 sm:p-12 text-center">
              <h2 className="font-display text-3xl sm:text-5xl leading-[1.2]">
                همه‌اش را <span className="text-amber">همین حالا</span> امتحان کن
              </h2>
              <p className="mt-4 text-paper/60 font-medium max-w-lg mx-auto">رایگان شروع کن؛ نه کارت بانکی لازم است، نه تعهد. فقط یک بورد بساز و ببین.</p>
              <a
                href="#/login"
                className="group mt-8 inline-flex items-center gap-3 bg-verm text-paper rounded-full px-9 py-4 font-bold text-lg shadow-[5px_5px_0_0_rgba(255,194,75,1)] hover:shadow-[2px_2px_0_0_rgba(255,194,75,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
              >
                ساخت اولین بورد — رایگان
                <IconArrow className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
            </div>
          </Sheet>
        </Reveal>
      </div>
    </PageShell>
  );
}

/* projects grid (local) */
function ProjectsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { t: "فینولو ۳٫۰", n: "۶ تسک", c: "bg-verm", p: "w-4/5" },
        { t: "سایت شرکتی", n: "۱۲ تسک", c: "bg-amber", p: "w-1/2" },
        { t: "اپ موبایل", n: "۹ تسک", c: "bg-pine", p: "w-2/3" },
        { t: "کمپین یلدا", n: "۴ تسک", c: "bg-ink", p: "w-1/3" },
      ].map((pj, i) => (
        <Reveal key={pj.t} delay={i * 90} variant="scale">
          <div className="card-tilt rounded-2xl border-[1.5px] border-ink bg-paper p-5 shadow-[5px_5px_0_0_rgba(25,23,18,1)]">
            <div className="flex items-center justify-between">
              <span className={`w-9 h-9 rounded-xl ${pj.c}`} />
              <span className="text-[10px] font-black text-ink-soft tabular-nums">{pj.n}</span>
            </div>
            <span className="block mt-3 font-black text-sm">{pj.t}</span>
            <span className="block mt-2 h-2 rounded-full bg-ink/10 overflow-hidden">
              <span className={`block h-full ${pj.p} ${pj.c}`} />
            </span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
