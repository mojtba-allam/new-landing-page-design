import { Reveal, useInView, useScramble, faNum } from "../lib/motion";
import { IconArrow, IconCalendar, IconBell, IconSpark } from "./Icons";
import Kanban from "./Kanban";
import { TRUSTED } from "../data";

function trustedRow(key: string) {
  return (
    <div key={key} className="flex items-center shrink-0">
      {TRUSTED.map((name, i) => (
        <span key={key + name} className="flex items-center gap-8 px-8 whitespace-nowrap">
          <span className={`font-display text-3xl sm:text-4xl cursor-default transition-transform duration-300 hover:-translate-y-1 ${i % 2 ? "text-ink/30" : "text-ink/50"}`}>
            {name}
          </span>
          <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${i % 2 ? "text-verm/60" : "text-pine/40"}`} aria-hidden>
            <path d="M12 1.6l2.3 8.1 8.1 2.3-8.1 2.3-2.3 8.1-2.3-8.1L1.6 12l8.1-2.3L12 1.6Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const [badgeRef, badgeInView] = useInView<HTMLSpanElement>(0.3);
  const scramble = useScramble("همگام‌سازی زنده", badgeInView);

  return (
    <section id="top" className="relative pt-24 sm:pt-32 lg:pt-36 overflow-x-clip">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid md:grid-cols-[1fr_1.25fr] gap-12 md:gap-8 lg:gap-10 items-start">
          {/* ---------- text ---------- */}
          <div className="relative z-10 min-w-0">
            <Reveal>
              <span
                ref={badgeRef}
                className="inline-flex items-center gap-2.5 bg-paper border-[1.5px] border-ink rounded-full px-4 py-2 text-xs font-bold shadow-[3px_3px_0_0_rgba(25,23,18,1)] rotate-[-1.5deg]"
              >
                <span className="relative flex w-2 h-2">
                  <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-verm" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-verm" />
                </span>
                <span className="tabular-nums tracking-wide">{scramble}</span>
                <span className="text-verm">•</span>
                <span>۲٬۴۳۱ نفر آنلاین</span>
              </span>
            </Reveal>

            <h1 className="font-display text-[clamp(2.7rem,8.5vw,6.2rem)] leading-[1.02] mt-6">
              <span className="mask-line in">
                <span style={{ transitionDelay: "100ms" }}>هر تسک،</span>
              </span>
              <span className="mask-line in">
                <span style={{ transitionDelay: "220ms" }}>
                  جایِ <span className="relative inline-block text-verm">
                    خودش.
                    <svg viewBox="0 0 120 14" className="absolute -bottom-1 right-0 w-full h-3 text-amber" fill="none" aria-hidden>
                      <path d="M3 10c20-6 40-6 57-3 15 2.5 35 2 57-4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="mask-line in">
                <span style={{ transitionDelay: "340ms" }}>
                  هر پروژه، <span className="text-pine">سرِ وقت.</span>
                </span>
              </span>
            </h1>

            <Reveal delay={420}>
              <p className="mt-6 text-lg sm:text-xl leading-9 text-ink-soft max-w-lg">
                فینولو، فضای کارِ تیم‌های ایرانی است؛ <strong className="text-ink">تخته کانبان، گانت، اتوماسیون و گزارش زنده</strong> — همه در یک
                صفحهٔ مینیمال با تقویم شمسی. بدون جلسه‌های بی‌پایانِ «وضعیت پروژه».
              </p>
            </Reveal>

            <Reveal delay={520} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#cta"
                className="group inline-flex items-center gap-3 bg-verm text-paper rounded-full px-8 py-4 font-bold text-lg shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:shadow-[2px_2px_0_0_rgba(25,23,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 active:shadow-none"
              >
                ساخت اولین تخته — رایگان
                <IconArrow className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
              </a>
              <a
                href="#timeline"
                className="group inline-flex items-center gap-3 border-[1.5px] border-ink rounded-full px-6 py-3.5 font-bold hover:bg-ink hover:text-paper transition-colors duration-300"
              >
                <span className="w-8 h-8 grid place-items-center rounded-full bg-amber text-ink border border-ink group-hover:border-paper transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path d="M8 5.5v13l11-6.5L8 5.5Z" />
                  </svg>
                </span>
                پنل زنده را ببین
              </a>
            </Reveal>

            <Reveal delay={620} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft font-medium">
              {["بدون کارت بانکی", "تقویم کاملاً شمسی", "مهاجرت یک‌کلیکه از ترلو"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <IconSpark className="w-3.5 h-3.5 text-verm" />
                  {t}
                </span>
              ))}
            </Reveal>
          </div>

          {/* ---------- live kanban board ---------- */}
          <Reveal variant="scale" delay={250} className="relative md:pt-2 min-w-0 max-w-full">
            {/* offset backdrop block — only where there is room (lg+) */}
            <div className="absolute -inset-2 lg:-inset-3 translate-x-3 lg:translate-x-5 translate-y-5 lg:translate-y-6 rounded-2xl bg-pine -rotate-1 hidden lg:block" aria-hidden />
            <div className="relative min-w-0">
              <Kanban />

              {/* floating badges — safely inside on small screens, poking out on lg+ */}
              <div className="drift absolute -top-7 left-2 lg:-left-8 rotate-[-4deg] bg-amber border-[1.5px] border-ink rounded-xl px-4 py-2.5 shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
                <div className="flex items-center gap-2 text-xs font-black">
                  <IconCalendar className="w-4 h-4" />
                  ددلاین بعدی: پنجشنبه
                </div>
              </div>
              <div className="drift-slow absolute -bottom-6 right-2 lg:-right-7 rotate-[3deg] bg-paper border-[1.5px] border-ink rounded-xl px-4 py-3 shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 grid place-items-center rounded-full bg-verm text-paper">
                    <IconBell className="w-4 h-4" />
                  </span>
                  <div className="text-[11px] leading-4 font-bold">
                    نیما تسک «اعلان‌ها» را تمام کرد
                    <span className="block text-ink-soft font-medium">همین حالا · بدون جلسه</span>
                  </div>
                </div>
              </div>
              <div className="wiggle absolute top-1/2 -left-4 lg:-left-9 hidden lg:grid w-14 h-14 place-items-center rounded-full bg-verm text-paper border-[1.5px] border-ink shadow-[3px_3px_0_0_rgba(25,23,18,1)] rotate-12">
                <span className="font-display text-[13px] leading-none text-center">
                  ۳۵٪<br />
                  سریع‌تر
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* trusted-by marquee */}
        <Reveal delay={200} className="mt-16 sm:mt-24">
          <div className="grid lg:grid-cols-[250px_1fr] gap-8 lg:gap-10 items-center">
            <div className="flex lg:flex-col items-center lg:items-start gap-x-6 gap-y-2 lg:gap-y-3">
              <div className="inline-flex items-center gap-2.5 text-xs font-black text-verm whitespace-nowrap">
                <span className="relative flex w-2 h-2">
                  <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-verm" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-verm" />
                </span>
                مورد اعتمادِ تیم‌های
              </div>
              <div className="font-display text-5xl sm:text-6xl leading-none whitespace-nowrap">
                {faNum(2400).replace(/٬/g, "٬")}
                <span className="text-verm">+</span>
              </div>
              <p className="hidden lg:block text-sm font-semibold text-ink-soft leading-7">
                از استارتاپ دونفره تا هلدینگ؛
                <br />
                هر روز با فینولو تحویل می‌دهند.
              </p>
            </div>

            <div
              className="marquee marquee-reverse relative overflow-hidden border-y-[1.5px] border-ink/10 py-5 sm:py-6 [mask-image:linear-gradient(to_left,transparent,black_10%,black_90%,transparent)]"
              dir="ltr"
            >
              <div className="marquee-track flex w-max items-center" dir="rtl">
                {trustedRow("a")}
                {trustedRow("b")}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
