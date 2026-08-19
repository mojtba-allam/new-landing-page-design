import { useState } from "react";
import { Reveal } from "../lib/motion";
import { PageShell, Sheet, Sticker, usePageMeta } from "../components/PageShell";
import { IconArrow, IconCheck } from "../components/Icons";

const CHANNELS = [
  {
    title: "تلگرام پشتیبانی",
    value: "@finolo_support",
    note: "سریع‌ترین راه — میانگین پاسخ ۷ دقیقه",
    href: "https://t.me/finolo_support",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 4.5 3.4 11.2c-.9.35-.85 1.63.07 1.9l4.4 1.3 1.7 5.2c.3.9 1.45 1.05 2 .28l2.3-3.2 4.3 3.1c.7.5 1.7.1 1.85-.75L22.5 5.6c.2-1-.65-1.5-1.5-1.1Z" />
        <path d="m8 14.4 9.5-7.2" />
      </svg>
    ),
  },
  {
    title: "ایمیل",
    value: "hello@finolo.ir",
    note: "برای موضوعات غیرفوری و همکاری‌ها",
    href: "mailto:hello@finolo.ir",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
        <path d="m4 8 8 5.5L20 8" />
      </svg>
    ),
  },
  {
    title: "تماس تلفنی",
    value: "۰۲۱–۹۱۰۹۲۴۰۰",
    note: "شنبه تا چهارشنبه، ۹ تا ۱۸",
    href: "tel:+982191092400",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6.5 3.5h3l1.5 4.5-2 1.5a12.5 12.5 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
      </svg>
    ),
  },
];

const SUBJECTS = ["سوال دربارهٔ پلن‌ها", "مشکل فنی", "درخواست دمو", "مهاجرت از ابزار دیگر", "همکاری و نمایندگی", "سایر"];

export default function Contact() {
  usePageMeta(
    "تماس با ما | فینولو",
    "با تیم فینولو حرف بزنید — تلگرام، ایمیل یا تلفن. فرم تماس بفرستید؛ میانگین پاسخ ما ۷ دقیقه است."
  );

  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "اسمت را بنویس — حتی کوتاه.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "ایمیل درست وارد نشده.";
    if (form.message.trim().length < 10) errs.message = "کمی بیشتر توضیح بده (حداقل ۱۰ حرف).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    window.setTimeout(() => setState("sent"), 1100);
  };

  const field =
    "w-full rounded-xl border-[1.5px] border-ink bg-paper px-4 py-3 font-medium placeholder:text-ink-soft/50 focus:border-verm focus:shadow-[3px_3px_0_0_rgba(244,71,31,0.5)] outline-none transition-all duration-200";

  return (
    <PageShell
      crumb="تماس با ما"
      index="۰۲"
      sticker="سلام"
      title={
        <>
          حرف بزنیم؛
          <br />
          <span className="text-verm">واقعاً</span> جواب می‌دهیم.
        </>
      }
      lead="پشت هر پیام، یک انسانِ فینولو هست — نه ربات، نه صف. فرم را پر کن یا مستقیم از کانال‌های پایین بیا؛ قول می‌دهیم معطل نمانی."
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mt-14 grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
          {/* ---------- form ---------- */}
          <Reveal variant="scale">
            <Sheet className="p-7 sm:p-9">
              {state === "sent" ? (
                <div className="text-center py-14">
                  <span className="inline-grid place-items-center w-20 h-20 rounded-full bg-pine text-paper border-[1.5px] border-ink shadow-[4px_4px_0_0_rgba(25,23,18,1)] rotate-6">
                    <IconCheck className="w-9 h-9" />
                  </span>
                  <h3 className="mt-6 font-display text-3xl">پیامت رسید!</h3>
                  <p className="mt-3 text-ink-soft font-medium leading-7 max-w-sm mx-auto">
                    تا چند دقیقهٔ دیگر از <strong className="text-ink">{form.email}</strong> با خبر می‌شوی — معمولاً خیلی زودتر.
                  </p>
                  <Sticker tone="bg-amber text-ink" className="mt-6">میانگین پاسخ: ۷ دقیقه</Sticker>
                  <div>
                    <button
                      onClick={() => {
                        setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
                        setState("idle");
                      }}
                      className="mt-8 link-underline font-bold text-verm"
                    >
                      فرستادن پیام دیگر
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="font-display text-2xl sm:text-3xl">فرم تماس</h2>
                    <Sticker>بدون ربات</Sticker>
                  </div>
                  <div className="mt-7 grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="c-name" className="block text-sm font-black mb-2">نام و نام خانوادگی *</label>
                      <input id="c-name" className={field} placeholder="مثلاً سارا محمدی" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      {errors.name && <p className="mt-1.5 text-xs font-bold text-verm">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="block text-sm font-black mb-2">ایمیل *</label>
                      <input id="c-email" dir="ltr" className={`${field} text-left`} placeholder="you@team.ir" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      {errors.email && <p className="mt-1.5 text-xs font-bold text-verm">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="mt-5">
                    <label htmlFor="c-subject" className="block text-sm font-black mb-2">موضوع</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setForm({ ...form, subject: s })}
                          className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-bold transition-all duration-200 ${
                            form.subject === s
                              ? "bg-ink text-paper border-ink shadow-[3px_3px_0_0_rgba(244,71,31,1)]"
                              : "border-ink/30 hover:border-ink hover:-translate-y-0.5"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="c-msg" className="text-sm font-black">پیام *</label>
                      <span className={`text-[11px] font-bold tabular-nums ${form.message.length > 500 ? "text-verm" : "text-ink-soft"}`}>
                        {form.message.length} / ۵۰۰
                      </span>
                    </div>
                    <textarea
                      id="c-msg"
                      rows={5}
                      maxLength={500}
                      className={`${field} resize-none`}
                      placeholder="چی شده؟ چی لازم داری؟ هر چقدر دقیق‌تر، سریع‌تر حلش می‌کنیم…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    {errors.message && <p className="mt-1.5 text-xs font-bold text-verm">{errors.message}</p>}
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="group inline-flex items-center gap-3 bg-verm text-paper rounded-full px-8 py-3.5 font-bold shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:shadow-[2px_2px_0_0_rgba(25,23,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none"
                    >
                      {state === "sending" ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-paper/40 border-t-paper animate-spin" />
                          در حال ارسال…
                        </>
                      ) : (
                        <>
                          بفرست بره
                          <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        </>
                      )}
                    </button>
                    <span className="text-xs font-semibold text-ink-soft">معمولاً همان روز جواب می‌دهیم.</span>
                  </div>
                </form>
              )}
            </Sheet>
          </Reveal>

          {/* ---------- channels ---------- */}
          <div className="space-y-5">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.title} delay={i * 110}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="card-tilt group flex items-center gap-4 rounded-2xl border-[1.5px] border-ink bg-paper p-5 shadow-[5px_5px_0_0_rgba(25,23,18,1)]"
                >
                  <span className="w-12 h-12 shrink-0 grid place-items-center rounded-full border-[1.5px] border-ink bg-amber/50 group-hover:bg-verm group-hover:text-paper transition-colors duration-300">
                    {c.icon}
                  </span>
                  <span className="min-w-0">
                    <strong className="block font-black">{c.title}</strong>
                    <span className="block font-bold text-verm" dir="ltr">
                      {c.value}
                    </span>
                    <span className="block text-xs text-ink-soft font-medium mt-0.5">{c.note}</span>
                  </span>
                  <IconArrow className="w-4 h-4 ms-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </Reveal>
            ))}

            <Reveal delay={340}>
              <div className="rounded-2xl border-[1.5px] border-dashed border-ink/40 bg-paper-deep/70 p-6">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex w-2.5 h-2.5">
                    <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-pine" />
                    <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-pine" />
                  </span>
                  <strong className="font-black text-sm">دفتر فینولو — تهران</strong>
                </div>
                <p className="mt-3 text-sm text-ink-soft font-medium leading-7">
                  سعادت‌آباد، بلوار دریا، پلاک ۲۴، طبقهٔ سوم.
                  <br />
                  درِ خانهٔ ما همیشه باز است — فقط از قبل خبر بده، قهوه آماده می‌کنیم. ☕
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
