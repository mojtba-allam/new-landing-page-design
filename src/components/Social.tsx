import { useEffect, useState } from "react";
import { Reveal, useCountUp, useInView, useSlider, type SliderApi } from "../lib/motion";
import { useI18n, tr, num, pad2, type Pair } from "../lib/i18n";
import { SectionHead } from "./Chrome";
import { IconArrow, IconBolt, IconCheck, IconPlus, IconQuote, IconSpark } from "./Icons";
import { FAQS, PLANS, STATS, TESTIMONIALS } from "../data";

type TItem = (typeof TESTIMONIALS)[number];

const S = {
  kicker: { fa: "گزارش میدانی —", en: "Field report —" },
  statsH2a: { fa: "اعداد،", en: "The" },
  statsH2b: { fa: "خودشان", en: "numbers" },
  statsH2c: { fa: "حرف می‌زنند", en: "do the talking" },
  liveSince: { fa: "از وقتی این صفحه باز شده:", en: "Since you opened this page:" },
  liveUnit: { fa: "تسک", en: "tasks" },
  statsFoot: { fa: "* آمار هر ۶ ساعت، مستقیم از دیتابیس فینولو تازه می‌شود.", en: "* Stats refresh every 6 hours, straight from Finolo's database." },
  watermark: { fa: "آمار", en: "STATS" },
  tTitleA: { fa: "تیم‌ها", en: "What teams" },
  tTitleB: { fa: "چی می‌گویند؟", en: "say?" },
  tDesc: { fa: "بدون روتوش؛ حرفِ کسانی که جلسه‌های «وضعیت پروژه» را با فینولو بازنشسته کردند.", en: "Unfiltered — words from people who retired the “project status” meeting with Finolo." },
  swipe: { fa: "بکش", en: "swipe" },
  prev: { fa: "قبلی", en: "Previous" },
  next: { fa: "بعدی", en: "Next" },
  tItem: { fa: "نظر", en: "review" },
  sItem: { fa: "بلیت", en: "ticket" },
  pItem: { fa: "پلن", en: "plan" },
  monthly: { fa: "ماهانه", en: "Monthly" },
  yearly: { fa: "سالانه", en: "Yearly" },
  off: { fa: "۲۰٪ تخفیف", en: "20% off" },
  pTitleA: { fa: "قیمت،", en: "Pricing," },
  pTitleB: { fa: "شفاف مثل خودِ تخته", en: "transparent as the board" },
  pDesc: { fa: "بدون هزینهٔ پنهان، بدون قراردادِ گنگ. هر وقت خواستی ارتقا بده، هر وقت خواستی برو.", en: "No hidden fees, no vague contracts. Upgrade when you want, leave when you want." },
  toman: { fa: "تومان", en: "toman" },
  popular: { fa: "محبوب‌ترین ⚡", en: "Most popular ⚡" },
  custom: { fa: "سفارشی", en: "Custom" },
  zero: { fa: "۰", en: "0" },
  pFootA: { fa: "همهٔ پلن‌ها شامل", en: "Every plan includes" },
  pFootStrong: { fa: "SSL، بکاپ روزانه و تقویم شمسی", en: "SSL, daily backups & the native calendar" },
  pFootB: { fa: "هستند · مهاجرت رایگان از ترلو و جیرا", en: "· Free migration from Trello & Jira" },
  faqTitleA: { fa: "سوال؟", en: "Questions?" },
  faqTitleB: { fa: "جواب، همین‌جا", en: "Answers, right here" },
  faqDesc: { fa: "اگر جوابت اینجا نبود، تیم پشتیبانی ما در تلگرام، کمتر از ده دقیقه پاسخ می‌دهد — واقعاً.", en: "If your answer isn't here, our Telegram team replies in under ten minutes — really." },
  supportOn: { fa: "پشتیبانی آنلاین", en: "Support online" },
  supportAvg: { fa: "میانگین پاسخ: ۷ دقیقه", en: "Avg. reply: 7 minutes" },
  ctaBadge: { fa: "۱۴ روز حرفه‌ای، کاملاً رایگان", en: "14 days of Pro, completely free" },
  ctaH2a: { fa: "آماده‌ای پروژه‌ات", en: "Ready to let your" },
  ctaH2b: { fa: "نفس بکشد؟", en: "project breathe?" },
  ctaBtn1: { fa: "ساخت اولین تخته — رایگان", en: "Build your first board — free" },
  ctaBtn2: { fa: "اول دمو را ببینم", en: "Watch the demo first" },
  ctaTrust: { fa: "بدون کارت بانکی · فارسی و شمسی از روز اول · مهاجرت رایگان از ترلو", en: "No credit card · Calendar-native from day one · Free Trello migration" },
};

/* ================= Stats — amber ticket band ================= */
const BARS = [3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 4, 1, 2, 1, 3, 2, 1];

const TICKET_META: { strip: string; stamp: Pair; stampCls: string; rotate: string; note: Pair; icon: React.ReactNode }[] = [
  {
    strip: "bg-verm",
    stamp: { fa: "فعال", en: "ACTIVE" },
    stampCls: "border-verm text-verm",
    rotate: "-rotate-2",
    note: { fa: "این ماه، ۱۲۰ تیم جدید", en: "120 new teams this month" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
        <path d="M15.5 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.8c1.6.7 2.7 2.2 3 4.7" />
      </svg>
    ),
  },
  { strip: "bg-pine", stamp: { fa: "تأیید", en: "VERIFIED" }, stampCls: "border-pine text-pine", rotate: "rotate-1", note: { fa: "از روز اولِ فینولو تا امروز", en: "since Finolo's day one" }, icon: <IconCheck className="w-5 h-5" /> },
  { strip: "bg-ink", stamp: { fa: "آنلاین", en: "ONLINE" }, stampCls: "border-ink text-ink", rotate: "-rotate-1", note: { fa: "میانگینِ ۱۲ ماه گذشته", en: "12-month average" }, icon: <IconBolt className="w-5 h-5" /> },
  {
    strip: "bg-pine-soft",
    stamp: { fa: "سریع", en: "FAST" },
    stampCls: "border-verm-deep text-verm-deep",
    rotate: "rotate-2",
    note: { fa: "نسبت به قبل از فینولو", en: "vs. before Finolo" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2.2" />
        <path d="M4.5 3.5 3 5M19.5 3.5 21 5" />
      </svg>
    ),
  },
];

function Ticket({
  end,
  suffix,
  decimals,
  label,
  delay,
  meta,
  serial,
}: {
  end: number;
  suffix: Pair;
  decimals: number;
  label: Pair;
  delay: number;
  meta: (typeof TICKET_META)[number];
  serial: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const value = useCountUp(end, inView, 1600 + delay, decimals);
  return (
    <div
      ref={ref}
      className={`ticket-card card-tilt relative bg-paper border-[1.5px] border-ink rounded-xl overflow-hidden shadow-[7px_7px_0_0_rgba(25,23,18,1)] ${meta.rotate}`}
    >
      <span className={`block h-2.5 ${meta.strip}`} aria-hidden />
      <span className={`absolute top-5 left-3 rotate-[-9deg] rounded-full border-2 px-2.5 py-1 text-[10px] font-black ${meta.stampCls} select-none`} aria-hidden>
        {tr(meta.stamp)}
      </span>

      <div className="p-6 pt-5">
        <div className="flex items-center justify-between">
          <span className="w-11 h-11 grid place-items-center rounded-full border-[1.5px] border-ink bg-amber/45 text-ink">{meta.icon}</span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-ink-soft" dir="ltr">
            {serial}
          </span>
        </div>

        <div className="mt-5 font-display text-[2.7rem] leading-none tabular-nums text-ink">
          {value}
          <span className="text-verm text-[1.5rem]">{tr(suffix)}</span>
        </div>
        <div className="mt-2.5 font-bold text-ink">{tr(label)}</div>
        <div className="mt-1 text-xs font-medium text-ink-soft">{tr(meta.note)}</div>

        <div className="mt-5 pt-4 border-t-2 border-dashed border-ink/20 flex items-end justify-between gap-3">
          <div className="flex items-end gap-[2.5px] h-6" aria-hidden>
            {BARS.map((w, i) => (
              <span key={i} className="bg-ink/80 rounded-[1px]" style={{ width: `${w * 1.4}px`, height: `${10 + ((i * 7) % 14)}px` }} />
            ))}
          </div>
          <span className="text-[9px] font-bold tracking-widest text-ink-soft/70" dir="ltr">
            SCAN · 1404
          </span>
        </div>
      </div>
    </div>
  );
}

function useLiveTick(start = 7, every = 1500): number {
  const [n, setN] = useState(start);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => v + 1 + Math.floor(Math.random() * 3)), every);
    return () => window.clearInterval(id);
  }, [every]);
  return n;
}

export function StatsBand() {
  const { isFa } = useI18n();
  const tick = useLiveTick();

  return (
    <section id="stats" className="relative bg-amber border-y-4 border-ink overflow-hidden">
      <div className="absolute inset-0 bg-stripes" aria-hidden />
      <div
        className="outline-ink absolute -left-10 top-1/2 -translate-y-1/2 -rotate-6 font-display text-[17rem] leading-none select-none pointer-events-none hidden lg:block"
        aria-hidden
        dir="ltr"
      >
        {tr(S.watermark)}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div className="inline-flex items-center gap-3 text-xs font-black text-verm-deep">
              <span className="w-8 h-px bg-verm-deep" />
              {tr(S.kicker)}
            </div>
            <h2 className="font-display leading-[1.15] mt-4 text-4xl sm:text-5xl lg:text-6xl text-ink">
              {isFa ? (
                <>
                  اعداد، <span className="text-verm">خودشان</span> حرف می‌زنند
                </>
              ) : (
                <>
                  The <span className="text-verm">numbers</span> do the talking
                </>
              )}
            </h2>
          </Reveal>

          <Reveal delay={150} className="pb-1">
            <div className="inline-flex items-center gap-3.5 bg-ink text-paper rounded-full py-2.5 pe-3 ps-5 shadow-[5px_5px_0_0_rgba(25,23,18,0.35)]">
              <span className="text-xs sm:text-sm font-bold text-paper/75">{tr(S.liveSince)}</span>
              <span className="inline-flex items-center gap-2 bg-verm rounded-full px-3.5 py-1.5">
                <span className="relative flex w-2 h-2">
                  <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-paper" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-paper" />
                </span>
                <span key={tick} className="tick-pop font-display text-lg leading-none tabular-nums">
                  +{num(tick)}
                </span>
              </span>
              <span className="text-xs sm:text-sm font-bold">{tr(S.liveUnit)}</span>
            </div>
          </Reveal>
        </div>

        {/* desktop / tablet: ticket grid */}
        <div className="mt-14 hidden sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-7" dir="rtl">
          {STATS.map((s, i) => (
            <Reveal key={s.label.fa} delay={i * 110} variant="scale">
              <Ticket end={s.end} suffix={s.suffix} decimals={s.decimals} label={s.label} delay={i * 130} meta={TICKET_META[i % TICKET_META.length]} serial={`FN-1404-0${i + 1}`} />
            </Reveal>
          ))}
        </div>

        {/* mobile: swipeable ticket slider */}
        <Reveal className="mt-12 sm:hidden">
          <MobileStatsSlider />
        </Reveal>

        <Reveal delay={200} className="mt-14 pt-6 border-t-2 border-dashed border-ink/25 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-ink/70">
          <span>{tr(S.statsFoot)}</span>
          <span className="tracking-[0.3em]" dir="ltr">
            FINOLO · METRICS · 1404
          </span>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= Testimonials ================= */
function TestimonialCard({ t, i, slider = false }: { t: TItem; i: number; slider?: boolean }) {
  return (
    <figure className={`card-tilt ${t.rotate} ${t.tone} rounded-2xl border-[1.5px] p-6 sm:p-7 shadow-[6px_6px_0_0_rgba(25,23,18,0.9)] ${slider ? "h-full" : ""}`}>
      <IconQuote className={`w-8 h-8 ${t.tone.includes("text-paper") ? "text-amber" : "text-verm"}`} />
      <blockquote className={`mt-4 leading-8 font-medium ${t.tone.includes("text-paper") ? "" : "text-ink"}`}>{tr(t.quote)}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-current/15">
        <span className={`w-11 h-11 grid place-items-center rounded-full font-display text-lg ${i % 3 === 0 ? "bg-ink text-paper" : i % 3 === 1 ? "bg-verm text-paper" : "bg-pine text-paper"}`}>
          {tr(t.name)[0]}
        </span>
        <span>
          <strong className="block font-black">{tr(t.name)}</strong>
          <span className={`text-xs font-medium ${t.tone.includes("text-paper") ? "text-paper/70" : "text-ink-soft"}`}>{tr(t.role)}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/* shared slider controls: arrows, dots, counter, swipe hint */
function SliderControls({ api, count, itemLabel, tone = "paper" }: { api: SliderApi; count: number; itemLabel: Pair; tone?: "paper" | "amber" }) {
  const { isFa } = useI18n();
  const dotActive = "bg-verm";
  const dotIdle = tone === "amber" ? "bg-ink/25 hover:bg-ink/40" : "bg-ink/20 hover:bg-ink/40";
  const arrowLabel = (dir: "prev" | "next") =>
    isFa ? `${tr(itemLabel)} ${dir === "prev" ? tr(S.prev) : tr(S.next)}` : `${dir === "prev" ? tr(S.prev) : tr(S.next)} ${tr(itemLabel)}`;
  return (
    <>
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => {
            api.markInteracted();
            api.goTo(api.idx - 1);
          }}
          aria-label={arrowLabel("prev")}
          className="w-11 h-11 grid place-items-center rounded-full border-[1.5px] border-ink bg-paper text-ink shadow-[3px_3px_0_0_rgba(25,23,18,1)] hover:bg-ink hover:text-paper hover:shadow-[1px_1px_0_0_rgba(25,23,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none transition-all duration-200"
        >
          <IconArrow className={`w-4 h-4 ${isFa ? "rotate-180" : ""}`} />
        </button>

        <div className="flex items-center gap-2.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                api.markInteracted();
                api.goTo(i);
              }}
              aria-label={`${tr(itemLabel)} ${num(i + 1)}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === api.idx ? `w-8 ${dotActive}` : `w-2.5 ${dotIdle}`}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            api.markInteracted();
            api.goTo(api.idx + 1);
          }}
          aria-label={arrowLabel("next")}
          className="w-11 h-11 grid place-items-center rounded-full border-[1.5px] border-ink bg-paper text-ink shadow-[3px_3px_0_0_rgba(25,23,18,1)] hover:bg-ink hover:text-paper hover:shadow-[1px_1px_0_0_rgba(25,23,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none transition-all duration-200"
        >
          <IconArrow className={`w-4 h-4 ${isFa ? "" : "rotate-180"}`} />
        </button>
      </div>

      <div className="mt-3.5 flex items-center justify-center gap-2 text-xs font-bold text-ink-soft">
        <span className="font-display text-sm text-ink tabular-nums">{num(api.idx + 1)}</span>
        <span>/</span>
        <span className="tabular-nums">{num(count)}</span>
        {!api.interacted && (
          <span className="ms-3 inline-flex items-center gap-1.5 text-verm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
            </svg>
            {tr(S.swipe)}
          </span>
        )}
      </div>
    </>
  );
}

function MobileTestimonialSlider() {
  const { isFa } = useI18n();
  const api = useSlider(TESTIMONIALS.length);
  return (
    <div dir={isFa ? "rtl" : "ltr"}>
      <div className="overflow-hidden touch-pan-y" {...api.touchHandlers}>
        <div className="flex w-full" style={api.trackStyle}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name.fa} className="w-full shrink-0 px-1">
              <TestimonialCard t={t} i={i} slider />
            </div>
          ))}
        </div>
      </div>
      <SliderControls api={api} count={TESTIMONIALS.length} itemLabel={S.tItem} />
    </div>
  );
}

function MobileStatsSlider() {
  const { isFa } = useI18n();
  const api = useSlider(STATS.length, 3800);
  return (
    <div dir={isFa ? "rtl" : "ltr"}>
      <div className="overflow-hidden touch-pan-y pt-2 pb-3" {...api.touchHandlers}>
        <div className="flex w-full" style={api.trackStyle}>
          {STATS.map((s, i) => (
            <div key={s.label.fa} className="w-full shrink-0 px-1">
              <Ticket end={s.end} suffix={s.suffix} decimals={s.decimals} label={s.label} delay={i * 100} meta={TICKET_META[i % TICKET_META.length]} serial={`FN-1404-0${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <SliderControls api={api} count={STATS.length} itemLabel={S.sItem} tone="amber" />
    </div>
  );
}

export function Testimonials() {
  const { isFa } = useI18n();
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead
          index={pad2(3)}
          title={
            isFa ? (
              <>
                تیم‌ها <span className="text-verm">چی می‌گویند؟</span>
              </>
            ) : (
              <>
                What teams <span className="text-verm">say?</span>
              </>
            )
          }
          desc={tr(S.tDesc)}
        />

        {/* desktop / tablet: scattered grid */}
        <div className="mt-16 hidden sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 items-start">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name.fa} delay={i * 120}>
              <div className={i % 2 === 1 ? "sm:translate-y-8" : ""}>
                <TestimonialCard t={t} i={i} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* mobile: swipeable slider */}
        <Reveal className="mt-12 sm:hidden">
          <MobileTestimonialSlider />
        </Reveal>
      </div>
    </section>
  );
}

/* ================= Pricing ================= */
export function PlanCard({ plan, yearly }: { plan: (typeof PLANS)[number]; yearly: boolean }) {
  const { isFa } = useI18n();
  const price = plan.monthly < 0 ? tr(S.custom) : plan.monthly === 0 ? tr(S.zero) : num(yearly ? plan.yearly : plan.monthly);
  return (
    <div
      className={`relative h-full rounded-2xl border-[1.5px] border-ink p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
        plan.featured ? "bg-verm text-paper shadow-[10px_10px_0_0_rgba(25,23,18,1)]" : "bg-paper shadow-[6px_6px_0_0_rgba(25,23,18,1)] hover:shadow-[8px_8px_0_0_rgba(25,23,18,1)]"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-4 right-8 bg-amber text-ink border-[1.5px] border-ink rounded-full px-4 py-1 text-xs font-black shadow-[3px_3px_0_0_rgba(25,23,18,1)] -rotate-2">
          {tr(S.popular)}
        </span>
      )}
      <h3 className={`font-display text-3xl ${plan.featured ? "text-paper" : "text-ink"}`}>{tr(plan.name)}</h3>
      <div className="mt-5 flex items-end gap-2" dir={isFa ? "rtl" : "ltr"}>
        <span key={String(yearly)} className={`font-display leading-none text-5xl tabular-nums ${plan.featured ? "text-paper" : "text-ink"}`}>
          {price}
        </span>
        {plan.monthly > 0 && <span className={`text-sm font-bold pb-1 ${plan.featured ? "text-paper/80" : "text-ink-soft"}`}>{tr(S.toman)}</span>}
      </div>
      <p className={`mt-2 text-sm font-semibold ${plan.featured ? "text-paper/80" : "text-ink-soft"}`}>{tr(plan.unit)}</p>

      <ul className={`mt-7 space-y-3.5 text-[15px] font-medium flex-1 ${plan.featured ? "text-paper/95" : "text-ink"}`}>
        {plan.features.map((f) => (
          <li key={f.fa} className="flex items-start gap-2.5">
            <span className={`mt-0.5 w-5 h-5 shrink-0 grid place-items-center rounded-full ${plan.featured ? "bg-paper text-verm" : "bg-pine text-paper"}`}>
              <IconCheck className="w-3 h-3" />
            </span>
            {tr(f)}
          </li>
        ))}
      </ul>

      <a
        href="#cta"
        className={`group mt-8 inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 font-bold transition-all duration-300 active:translate-y-px ${
          plan.featured ? "bg-ink text-paper hover:bg-paper hover:text-ink" : "border-[1.5px] border-ink hover:bg-ink hover:text-paper"
        }`}
      >
        {tr(plan.cta)}
        <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
      </a>
    </div>
  );
}

function MobilePricingSlider({ yearly }: { yearly: boolean }) {
  const { isFa } = useI18n();
  const api = useSlider(PLANS.length, 4600);
  return (
    <div dir={isFa ? "rtl" : "ltr"}>
      <div className="overflow-hidden touch-pan-y pt-6 pb-4" {...api.touchHandlers}>
        <div className="flex w-full" style={api.trackStyle}>
          {PLANS.map((plan) => (
            <div key={plan.name.fa} className="w-full shrink-0 px-1">
              <PlanCard plan={plan} yearly={yearly} />
            </div>
          ))}
        </div>
      </div>
      <SliderControls api={api} count={PLANS.length} itemLabel={S.pItem} />
    </div>
  );
}

export function Pricing() {
  const { isFa } = useI18n();
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="relative py-24 sm:py-32 scroll-mt-24 bg-paper-deep border-y-[1.5px] border-ink/10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <SectionHead
            index={pad2(4)}
            title={
              isFa ? (
                <>
                  قیمت، <span className="text-verm">شفاف مثل خودِ تخته</span>
                </>
              ) : (
                <>
                  Pricing, <span className="text-verm">transparent as the board</span>
                </>
              )
            }
            desc={tr(S.pDesc)}
          />

          <Reveal delay={150} className="pb-2">
            <div className="inline-flex items-center gap-3 border-[1.5px] border-ink bg-paper rounded-full p-1.5 shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
              <button onClick={() => setYearly(false)} className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${!yearly ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`}>
                {tr(S.monthly)}
              </button>
              <button onClick={() => setYearly(true)} className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 flex items-center gap-2 ${yearly ? "bg-verm text-paper" : "text-ink-soft hover:text-ink"}`}>
                {tr(S.yearly)}
                <span className={`text-[10px] rounded-full px-2 py-0.5 font-black ${yearly ? "bg-paper text-verm" : "bg-verm/15 text-verm"}`}>{tr(S.off)}</span>
              </button>
            </div>
          </Reveal>
        </div>

        {/* desktop / tablet grid */}
        <div className="mt-16 hidden sm:grid lg:grid-cols-3 gap-7 items-stretch">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name.fa} delay={i * 130} variant="scale">
              <div className={plan.featured ? "lg:-translate-y-4" : ""}>
                <PlanCard plan={plan} yearly={yearly} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* mobile: swipeable slider */}
        <Reveal className="mt-12 sm:hidden">
          <MobilePricingSlider yearly={yearly} />
        </Reveal>

        <Reveal delay={200} className="mt-10 text-center text-sm text-ink-soft">
          {tr(S.pFootA)} <strong className="text-ink">{tr(S.pFootStrong)}</strong> {tr(S.pFootB)}
        </Reveal>
      </div>
    </section>
  );
}

/* ================= FAQ (+ FAQPage schema for rich results) ================= */
export function Faq() {
  const { isFa } = useI18n();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32 scroll-mt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: tr(f.q),
              acceptedAnswer: { "@type": "Answer", text: tr(f.a) },
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-14">
        <div>
          <SectionHead
            index={pad2(5)}
            title={
              isFa ? (
                <>
                  سوال؟ <span className="text-verm">جواب، همین‌جا</span>
                </>
              ) : (
                <>
                  Questions? <span className="text-verm">Answers, right here</span>
                </>
              )
            }
            desc={tr(S.faqDesc)}
          />
          <Reveal delay={200} className="mt-9">
            <div className="inline-flex items-center gap-4 bg-sage border-[1.5px] border-ink rounded-2xl px-6 py-5 shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:-translate-y-1 transition-transform duration-300">
              <span className="relative flex w-3 h-3">
                <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-pine" />
                <span className="relative inline-flex w-3 h-3 rounded-full bg-pine" />
              </span>
              <div>
                <strong className="block font-black">{tr(S.supportOn)}</strong>
                <span className="text-sm text-ink-soft font-medium">{tr(S.supportAvg)}</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="border-[1.5px] border-ink rounded-2xl bg-paper shadow-[8px_8px_0_0_rgba(25,23,18,1)] overflow-hidden divide-y-[1.5px] divide-ink/12">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q.fa}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 text-start px-6 sm:px-8 py-5 hover:bg-paper-deep/60 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-base sm:text-lg flex items-center gap-3">
                      <span className={`font-display text-xl ${isOpen ? "text-verm" : "text-ink/40"}`}>{pad2(i + 1)}</span>
                      {tr(f.q)}
                    </span>
                    <span className={`shrink-0 w-9 h-9 grid place-items-center rounded-full border-[1.5px] border-ink transition-all duration-500 ${isOpen ? "bg-verm text-paper border-verm rotate-45" : "bg-paper"}`}>
                      <IconPlus className="w-4 h-4" />
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.19,0.65,0.22,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 sm:px-8 pb-6 pt-1 text-ink-soft leading-8 sm:pe-16">{tr(f.a)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= CTA band ================= */
export function CtaBand() {
  const { isFa } = useI18n();
  return (
    <section id="cta" className="relative bg-verm border-y-4 border-ink overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 opacity-[0.12] bg-grid-dark" aria-hidden />
      <svg className="drift absolute -top-8 right-[8%] w-14 h-14 text-paper/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
      </svg>
      <svg className="drift-slow absolute bottom-10 left-[6%] w-12 h-12 text-amber" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.5c.7 4.9 2.6 7 7.5 7.7-4.9.7-6.8 2.8-7.5 7.6-.7-4.8-2.6-6.9-7.5-7.6 4.9-.7 6.8-2.8 7.5-7.7Z" />
      </svg>

      <div className="relative mx-auto max-w-5xl px-5 lg:px-8 py-24 sm:py-28 text-center">
        <Reveal>
          <span className="inline-block rotate-[-3deg] bg-paper text-ink border-[1.5px] border-ink rounded-full px-5 py-2 text-sm font-black shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
            <IconSpark className="w-4 h-4 inline-block text-verm me-1.5 -mt-1" />
            {tr(S.ctaBadge)}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-display text-paper text-[clamp(2.6rem,7vw,5.2rem)] leading-[1.08] mt-7">
            {isFa ? (
              <>
                آماده‌ای پروژه‌ات
                <br />
                نفس بکشد؟
              </>
            ) : (
              <>
                Ready to let your
                <br />
                project breathe?
              </>
            )}
          </h2>
        </Reveal>
        <Reveal delay={240} className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#top"
            className="group inline-flex items-center gap-3 bg-ink text-paper rounded-full px-9 py-4 font-bold text-lg shadow-[6px_6px_0_0_rgba(255,194,75,1)] hover:shadow-[2px_2px_0_0_rgba(255,194,75,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200"
          >
            {tr(S.ctaBtn1)}
            <IconArrow className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
          </a>
          <a href="#timeline" className="inline-flex items-center gap-2 border-2 border-paper text-paper rounded-full px-8 py-4 font-bold hover:bg-paper hover:text-verm transition-colors duration-300">
            {tr(S.ctaBtn2)}
          </a>
        </Reveal>
        <Reveal delay={340} className="mt-6 text-paper/80 text-sm font-medium">
          {tr(S.ctaTrust)}
        </Reveal>
      </div>
    </section>
  );
}
