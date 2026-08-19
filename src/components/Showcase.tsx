import { Reveal } from "../lib/motion";
import { useI18n, tr, pad2, type Pair } from "../lib/i18n";
import { SectionHead } from "./Chrome";
import { IconArrow } from "./Icons";
import SimPanel from "./Panel";

/* ================= Simulated app panel (dark section) ================= */
export function GanttSection() {
  const { isFa } = useI18n();
  return (
    <section id="timeline" className="relative bg-pine text-paper py-24 sm:py-32 scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark" aria-hidden />
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full border-[1.5px] border-paper/10 spin-slow" aria-hidden>
        <span className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            dark
            index={pad2(1)}
            title={
              isFa ? (
                <>
                  یک نگاه، <span className="text-amber">کلِ اسپرینت</span>
                </>
              ) : (
                <>
                  One glance, <span className="text-amber">the whole sprint</span>
                </>
              )
            }
            desc={
              isFa
                ? "این یک شبیه‌سازی زنده از پنل فینولو است؛ از منوی کنار بین داشبورد، بورد، تحلیل‌ها، تیم‌ها و زمان بگرد — و نماهای بورد را هم عوض کن: لیستی، زمانی، کانبان، گراف و درختی."
                : "This is a live simulation of the Finolo panel — switch between Dashboard, Board, Analytics, Teams and Time on the side menu, and change board views: list, timeline, kanban, graph and tree."
            }
          />
          <Reveal delay={150}>
            <div className="flex flex-wrap gap-2.5 pb-2">
              {[
                { c: "bg-ink/40 border border-paper/30", l: { fa: "برای انجام", en: "To do" } },
                { c: "bg-amber", l: { fa: "در حال انجام", en: "In progress" } },
                { c: "bg-verm", l: { fa: "انجام شد", en: "Done" } },
              ].map(({ c, l }) => (
                <span key={l.fa} className="inline-flex items-center gap-2 text-xs font-bold text-paper/80 border border-paper/20 rounded-full px-3 py-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                  {tr(l)}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={100} className="mt-16">
          <SimPanel />
        </Reveal>

        <Reveal delay={200} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-paper/60">
          {(isFa
            ? ["بدون نصب — همین‌جا دست بکش", "همهٔ نماها روی یک دادهٔ واحد", "تقویم و اعداد کاملاً شمسی"]
            : ["No install — poke around right here", "Every view shares one dataset", "Calendar & numbers fully native"]
          ).map((t) => (
            <span key={t} className="inline-flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber" />
              {t}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ================= Features index (interactive rows) ================= */
const FEATURE_ROWS: { id: string; title: Pair; desc: Pair }[] = [
  {
    id: "workspaces",
    title: { fa: "ورک‌اسپیس و پروژهٔ نامحدود", en: "Unlimited workspaces & projects" },
    desc: { fa: "چند فضای کاری، هرکدام با تیم و پروژه‌های خودش — بدون سقف و بدون نگرانی.", en: "Multiple workspaces, each with its own teams and projects — no caps, no worries." },
  },
  {
    id: "views",
    title: { fa: "پنج نمای بورد", en: "Five board views" },
    desc: { fa: "کانبان، لیست، گراف، تایم‌لاین و درختی — یک داده، پنج نگاه متفاوت.", en: "Kanban, list, graph, timeline and tree — one dataset, five lenses." },
  },
  {
    id: "ai",
    title: { fa: "پرامپت AI برای ساخت پروژه", en: "AI prompts that build projects" },
    desc: { fa: "ستون‌ها و تسک‌ها را با یک جمله بساز؛ بقیه‌اش را به خودت بسپار.", en: "Create columns and tasks with a single sentence — leave the rest to it." },
  },
  {
    id: "chat",
    title: { fa: "چت‌روم و هشدار بلادرنگ", en: "Chat rooms & real-time alerts" },
    desc: { fa: "گفتگوی تیم و اعلان‌های زنده، درست کنار تسک‌ها — بدون تعویض اپ.", en: "Team chat and live alerts right next to the tasks — no app-switching." },
  },
  {
    id: "dev",
    title: { fa: "MCP Server و CI/CD", en: "MCP Server & CI/CD" },
    desc: { fa: "اتصال به ابزارهای توسعه و خط لولهٔ خودکارِ ساخت، تست و انتشار.", en: "Plug into dev tools with an automated build, test and ship pipeline." },
  },
  {
    id: "knowledge",
    title: { fa: "مدیریت دانش و داکیومنت", en: "Knowledge & docs management" },
    desc: { fa: "ویکی هر پروژه کنار تسک‌هایش — دانش تیم هیچ‌وقت گم نمی‌شود.", en: "Every project's wiki lives beside its tasks — team knowledge never gets lost." },
  },
];

/* نگاشت ردیف‌های صفحهٔ اول به لنگرهای صفحهٔ ویژگی‌ها */
const ROW_TO_ANCHOR: Record<string, string> = {
  workspaces: "workspace",
  views: "views",
  ai: "ai",
  chat: "chat",
  dev: "mcp",
  knowledge: "docs",
};

function FeatureDoodle({ id }: { id: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "workspaces":
      return (
        <svg viewBox="0 0 64 48" className="w-12 h-9" {...common}>
          <rect x="5" y="6" width="30" height="20" rx="4" opacity="0.4" />
          <rect x="13" y="12" width="30" height="20" rx="4" opacity="0.7" />
          <rect x="21" y="18" width="30" height="20" rx="4" className="fill-amber/70" />
        </svg>
      );
    case "views":
      return (
        <svg viewBox="0 0 64 48" className="w-12 h-9" {...common}>
          <rect x="5" y="6" width="15" height="36" rx="3" />
          <rect x="24" y="6" width="15" height="26" rx="3" className="fill-verm/60" />
          <rect x="43" y="6" width="15" height="16" rx="3" />
          <path d="M9 13h7M9 19h7M28 13h7M47 13h7" opacity="0.5" />
        </svg>
      );
    case "ai":
      return (
        <svg viewBox="0 0 64 48" className="w-12 h-9" {...common}>
          <path d="M26 6l2.6 7.4L36 16l-7.4 2.6L26 26l-2.6-7.4L16 16l7.4-2.6L26 6Z" className="fill-amber/70" />
          <path d="M44 26l1.8 5.2L51 33l-5.2 1.8L44 40l-1.8-5.2L37 33l5.2-1.8L44 26Z" />
          <path d="M12 34l2 2M54 10l2 2" opacity="0.5" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 64 48" className="w-12 h-9" {...common}>
          <rect x="6" y="7" width="38" height="22" rx="10" className="fill-sage" />
          <path d="M16 29l-3 8 9-6" />
          <circle cx="17" cy="18" r="1.6" fill="currentColor" />
          <circle cx="25" cy="18" r="1.6" fill="currentColor" />
          <circle cx="33" cy="18" r="1.6" fill="currentColor" />
          <rect x="30" y="22" width="26" height="16" rx="8" className="fill-amber/70" />
        </svg>
      );
    case "dev":
      return (
        <svg viewBox="0 0 64 48" className="w-12 h-9" {...common}>
          <rect x="6" y="7" width="52" height="32" rx="5" className="fill-pine/10" />
          <path d="M15 17l7 7-7 7" className="stroke-verm" />
          <path d="M28 31h16" />
          <circle cx="50" cy="13" r="1.6" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case "knowledge":
      return (
        <svg viewBox="0 0 64 48" className="w-12 h-9" {...common}>
          <path d="M32 12c-7-4-17-4-22-2v26c5-2 15-2 22 2 7-4 17-4 22-2V10c-5-2-15-2-22 2Z" className="fill-amber/50" />
          <path d="M32 12v26" />
          <path d="M16 18h10M16 24h10M38 18h10M38 24h10" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function FeaturesIndex() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden bg-paper scroll-mt-24">
      <div className="absolute inset-0 bg-grid-faint opacity-60" aria-hidden />
      <svg className="drift absolute top-24 left-[6%] w-10 h-10 text-verm/50 hidden lg:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.5c.7 4.9 2.6 7 7.5 7.7-4.9.7-6.8 2.8-7.5 7.6-.7-4.8-2.6-6.9-7.5-7.6 4.9-.7 6.8-2.8 7.5-7.7Z" />
      </svg>
      <div className="outline-ink absolute -right-8 top-10 font-display text-[9rem] leading-none rotate-6 select-none pointer-events-none hidden xl:block opacity-70" aria-hidden>
        {isFa ? "۶" : "6"}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.3fr] gap-12 lg:gap-16 items-start">
          {/* ---------- heading (right) ---------- */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 text-[11px] font-black text-verm bg-verm/10 border border-verm/40 rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-verm pulse-dot" />
                  قابلیت‌ها
                </span>
                <span className="font-display text-verm/60 text-lg tabular-nums">۰۲</span>
                <span className="h-px flex-1 border-t border-dashed border-ink/25" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.12] mt-5">
                ویژگی‌های <span className="text-verm">فینولو</span>
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-5 text-ink-soft leading-8 font-medium max-w-md">
                از یک ورک‌اسپیس ساده تا خط لولهٔ CI/CD و هوش مصنوعی — همه‌چیز داخل همان بوردی است که هر روز باز می‌کنی. نه ده ابزار جدا، نه ده اشتراک جدا.
              </p>
            </Reveal>

            <Reveal delay={300} className="mt-7 flex flex-wrap gap-2.5">
              {["۱۰+ قابلیت", "۵ نمای بورد", "AI داخل محصول"].map((c) => (
                <span key={c} className="text-xs font-black rounded-full border-[1.5px] border-ink/20 bg-paper-deep/70 px-3.5 py-1.5 hover:border-verm hover:text-verm hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                  {c}
                </span>
              ))}
            </Reveal>

            <Reveal delay={380} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#/features"
                className="group inline-flex items-center gap-3 bg-verm text-paper rounded-full px-7 py-3.5 font-bold shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:shadow-[2px_2px_0_0_rgba(25,23,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
              >
                همهٔ ویژگی‌ها را ببین
                <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
              <a href="#timeline" className="group inline-flex items-center gap-2 font-bold text-ink-soft hover:text-verm transition-colors link-underline">
                یا دمو را تماشا کن
                <span className="w-7 h-7 grid place-items-center rounded-full border-[1.5px] border-ink bg-amber group-hover:bg-verm group-hover:text-paper transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                    <path d="M8 5.5v13l11-6.5L8 5.5Z" />
                  </svg>
                </span>
              </a>
            </Reveal>
          </div>

          {/* ---------- interactive feature rows (left) ---------- */}
          <div className="space-y-4">
            {FEATURE_ROWS.map((f, i) => (
              <Reveal key={f.id} delay={i * 90}>
                <a
                  href={`#/features?to=${ROW_TO_ANCHOR[f.id] ?? ""}`}
                  className="group relative block overflow-hidden rounded-2xl border-[1.5px] border-ink bg-paper shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:shadow-[8px_8px_0_0_rgba(244,71,31,1)] hover:-translate-y-1 transition-all duration-300"
                >
                  <span aria-hidden className="absolute inset-0 bg-amber translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.19,0.65,0.22,1)]" />
                  <div className="relative flex items-center gap-4 sm:gap-6 px-5 sm:px-6 py-4 sm:py-5">
                    <span className="font-display text-2xl sm:text-3xl text-ink/25 group-hover:text-verm transition-colors duration-300 w-9 shrink-0 tabular-nums">
                      {String(i + 1).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]).padStart(2, "۰")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg sm:text-xl leading-snug text-ink">{tr(f.title)}</h3>
                      <p className="mt-0.5 text-[13px] sm:text-sm text-ink-soft group-hover:text-ink/70 transition-colors duration-300 font-medium line-clamp-1">
                        {tr(f.desc)}
                      </p>
                    </div>
                    <span className="hidden md:grid w-16 h-12 place-items-center rounded-xl border border-ink/15 bg-paper-deep/60 text-ink-soft group-hover:border-ink/40 group-hover:bg-paper group-hover:text-ink group-hover:-rotate-6 group-hover:scale-110 transition-all duration-300 shrink-0">
                      <FeatureDoodle id={f.id} />
                    </span>
                    <span className="w-9 h-9 grid place-items-center rounded-full border-[1.5px] border-ink bg-paper text-ink group-hover:bg-ink group-hover:text-paper group-hover:rotate-[-45deg] transition-all duration-300 shrink-0">
                      <IconArrow className="w-4 h-4" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
