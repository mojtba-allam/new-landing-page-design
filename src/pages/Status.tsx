import { useEffect, useMemo, useState } from "react";
import { Reveal, faNum } from "../lib/motion";
import { PageShell, Sheet, Sticker, usePageMeta } from "../components/PageShell";

const COMPONENTS = [
  { name: "وب‌اپ (app.finolo.ir)", uptime: 99.98, latency: 128, seed: 3, history: [142, 135, 150, 128, 121, 133, 126, 118, 124, 131, 122, 128] },
  { name: "API و همگام‌سازی", uptime: 99.95, latency: 96, seed: 7, history: [104, 99, 91, 108, 95, 88, 102, 97, 90, 94, 100, 96] },
  { name: "وب‌هوک‌ها و اعلان‌ها", uptime: 99.9, latency: 74, seed: 11, history: [80, 76, 69, 84, 71, 77, 68, 73, 79, 70, 75, 74] },
  { name: "ایمیل و پیامک", uptime: 99.87, latency: 210, seed: 5, history: [225, 218, 205, 232, 214, 208, 221, 216, 203, 212, 219, 210] },
  { name: "بکاپ و بازیابی", uptime: 100, latency: 0, seed: 13, history: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
];

const INCIDENTS = [
  { date: "۸ مهر ۱۴۰۴", title: "کندی موقت در همگام‌سازی", status: "حل شده", text: "بین ساعت ۱۴:۰۲ تا ۱۴:۳۸، تغییرات بعضی بوردها با تاخیر ۲ تا ۴ ثانیه‌ای اعمال می‌شد. علت: به‌روزرسانی موتور صف. از ساعت ۱۴:۳۸ کاملاً پایدار.", tone: "bg-sage" },
  { date: "۲۱ شهریور ۱۴۰۴", title: "تاخیر در ارسال ایمیل‌های دعوت", status: "حل شده", text: "ایمیل‌های دعوت تیم با تاخیر ۱۰ تا ۱۵ دقیقه‌ای ارسال می‌شدند. ارائه‌دهندهٔ سرویس ایمیل مشکل داشت؛ جایگزین اضطراری فعال شد.", tone: "bg-amber/50" },
  { date: "۲ مرداد ۱۴۰۴", title: "تعمیرات برنامه‌ریزی‌شده", status: "تکمیل شده", text: "مهاجرت به دیتاسنتر دوم با موفقیت انجام شد. در بازهٔ ۲ تا ۳ بامداد، سرویس در حالت فقط‌خواندنی بود. حالا بکاپ‌ها در دو منطقهٔ جغرافیایی‌اند.", tone: "bg-sky-soft" },
];

/** ۹۰ مربع آپ‌تایم — deterministically mostly-up با چند روز مشکوک */
function useUptimeDays(seed: number, uptime: number) {
  return useMemo(() => {
    const days: ("up" | "partial" | "down")[] = [];
    for (let i = 0; i < 90; i++) {
      const v = (i * 31 + seed * 17) % 97;
      if (uptime >= 100) days.push("up");
      else if (v > 93) days.push("partial");
      else if (v > 95) days.push("down");
      else days.push("up");
    }
    return days;
  }, [seed, uptime]);
}

function Spark({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);
  const pts = points.map((p, i) => `${(i / (points.length - 1)) * 100},${28 - (p / max) * 24}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-24 h-8" fill="none" aria-hidden>
      <polyline points={pts} stroke="#F4471F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

function ServiceRow({ comp }: { comp: (typeof COMPONENTS)[number] }) {
  const days = useUptimeDays(comp.seed, comp.uptime);
  return (
    <Reveal>
      <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-5 sm:p-6 shadow-[5px_5px_0_0_rgba(25,23,18,1)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-pine pulse-dot" />
            <strong className="font-black">{comp.name}</strong>
            <Sticker tone="bg-pine text-paper" className="rotate-0! shadow-none!">عملیاتی</Sticker>
          </div>
          <div className="flex items-center gap-5 text-xs font-black text-ink-soft tabular-nums">
            {comp.latency > 0 && <span>تأخیر: <span className="text-ink">{faNum(comp.latency)}</span> ms</span>}
            <span>آپ‌تایم ۹۰ روز: <span className="text-pine">{comp.uptime.toLocaleString("fa-IR", { maximumFractionDigits: 2 })}٪</span></span>
          </div>
        </div>
        <div className="mt-5 flex items-end gap-4 flex-wrap">
          {/* 90-day squares */}
          <div className="flex-1 min-w-[240px] flex gap-[3px] items-stretch" dir="ltr" aria-label="نمودار ۹۰ روزهٔ پایداری">
            {days.map((d, i) => (
              <span
                key={i}
                title={`روز ${i + 1}: ${d === "up" ? "پایدار" : "اختلال جزئی"}`}
                className={`flex-1 rounded-[2px] h-8 transition-transform duration-200 hover:scale-y-125 ${
                  d === "up" ? "bg-pine/80" : d === "partial" ? "bg-amber" : "bg-verm"
                }`}
              />
            ))}
          </div>
          {comp.history.some((h) => h > 0) && <Spark points={comp.history} />}
        </div>
      </div>
    </Reveal>
  );
}

export default function Status() {
  usePageMeta(
    "وضعیت سرورها | فینولو",
    "وضعیت لحظه‌ای سرورهای فینولو — آپ‌تایم ۹۰ روزهٔ هر سرویس، تأخیر پاسخ و گزارش رویدادها. شفاف، مثل خود محصول."
  );

  const [now, setNow] = useState(() => new Date());
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    const a = window.setInterval(() => setNow(new Date()), 1000);
    const b = window.setInterval(() => setChecked((c) => c + 1), 1000);
    return () => {
      window.clearInterval(a);
      window.clearInterval(b);
    };
  }, []);

  const fa2 = (n: number) => faNum(n).padStart(2, "۰");
  const timeStr = `${fa2(now.getHours())}:${fa2(now.getMinutes())}:${fa2(now.getSeconds())}`;

  return (
    <PageShell
      crumb="وضعیت سرورها"
      index="۰۸"
      sticker="آنلاین"
      title={
        <>
          همه‌چیز <span className="text-pine">سبز</span> است
        </>
      }
      lead="این صفحه از همان دیتایی تغذیه می‌کند که تیم مانیتورینگ می‌بیند. اگر چیزی قرمز شود، اول همین‌جا قرمز می‌شود — بعد توییتر."
    >
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        {/* live status header */}
        <Reveal className="mt-10">
          <Sheet className="bg-pine text-paper overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-dark opacity-50" aria-hidden />
            <div className="relative p-6 sm:p-8 flex flex-wrap items-center gap-5">
              <span className="relative flex w-4 h-4">
                <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-amber" />
                <span className="relative inline-flex w-4 h-4 rounded-full bg-amber" />
              </span>
              <div className="flex-1 min-w-[200px]">
                <strong className="font-display text-2xl">همهٔ سیستم‌ها عملیاتی‌اند</strong>
                <p className="text-paper/60 text-sm font-bold mt-1">آخرین بررسی: {faNum(checked)} ثانیه پیش · به‌روزرسانی خودکار هر ۳۰ ثانیه</p>
              </div>
              <div className="text-end">
                <div className="font-display text-3xl tabular-nums" dir="ltr">{timeStr}</div>
                <div className="text-paper/55 text-xs font-bold">به وقت تهران</div>
              </div>
            </div>
          </Sheet>
        </Reveal>

        {/* components */}
        <div className="mt-10 space-y-6">
          {COMPONENTS.map((c) => (
            <ServiceRow key={c.name} comp={c} />
          ))}
        </div>

        {/* legend */}
        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-ink-soft">
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-[2px] bg-pine/80" /> پایدار</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-[2px] bg-amber" /> اختلال جزئی</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-[2px] bg-verm" /> قطعی</span>
            <span className="ms-auto tracking-[0.25em] text-[10px]" dir="ltr">STATUS.FINOLO.IR</span>
          </div>
        </Reveal>

        {/* incidents */}
        <section className="mt-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <Sticker>گزارش رویدادها</Sticker>
              <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
              <span className="text-xs font-bold text-ink-soft">۹۰ روز گذشته</span>
            </div>
          </Reveal>
          <div className="mt-8 space-y-5">
            {INCIDENTS.map((inc, i) => (
              <Reveal key={inc.title} delay={i * 100}>
                <div className="rounded-2xl border-[1.5px] border-ink bg-paper p-6 sm:p-7 shadow-[5px_5px_0_0_rgba(25,23,18,1)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[11px] font-black rounded-full px-3 py-1.5 border-[1.5px] border-ink ${inc.tone}`}>{inc.status}</span>
                    <strong className="font-display text-xl">{inc.title}</strong>
                    <span className="ms-auto text-xs font-bold text-ink-soft tabular-nums">{inc.date}</span>
                  </div>
                  <p className="mt-3 text-ink-soft leading-8 font-medium text-[15px]">{inc.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* subscribe note */}
        <Reveal variant="scale" className="mt-14">
          <div className="rounded-2xl border-[1.5px] border-dashed border-ink/40 bg-paper-deep/70 p-7 text-center">
            <strong className="font-display text-xl">می‌خواهی خبرت کنیم؟</strong>
            <p className="mt-2 text-ink-soft font-medium text-sm">اعلان وضعیت سرورها را به تلگرام تیمت وصل کن — فقط وقتی چیزی قرمز شود، نه هر روز.</p>
            <a href="#/contact" className="mt-4 inline-block font-bold text-verm link-underline">درخواست اتصال اعلان وضعیت</a>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
