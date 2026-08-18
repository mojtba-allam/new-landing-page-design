import { Reveal } from "../lib/motion";
import { SectionHead } from "./Chrome";
import SimPanel from "./Panel";

/* ================= Simulated app panel (dark section) ================= */
export function GanttSection() {
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
            index="۰۱"
            title={
              <>
                یک نگاه، <span className="text-amber">کلِ اسپرینت</span>
              </>
            }
            desc="این یک شبیه‌سازی زنده از پنل فینولو است؛ از منوی کنار بین داشبورد، بورد، تحلیل‌ها، تیم‌ها و زمان بگرد — و نماهای بورد را هم عوض کن: لیستی، زمانی، کانبان، گراف و درختی."
          />
          <Reveal delay={150}>
            <div className="flex flex-wrap gap-2.5 pb-2">
              {[
                ["bg-ink/40 border border-paper/30", "برای انجام"],
                ["bg-amber", "در حال انجام"],
                ["bg-verm", "انجام شد"],
              ].map(([c, l]) => (
                <span key={l} className="inline-flex items-center gap-2 text-xs font-bold text-paper/80 border border-paper/20 rounded-full px-3 py-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                  {l}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={100} className="mt-16">
          <SimPanel />
        </Reveal>

        <Reveal delay={200} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-paper/60">
          {["بدون نصب — همین‌جا دست بکش", "همهٔ نماها روی یک دادهٔ واحد", "تقویم و اعداد کاملاً شمسی"].map((t) => (
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
