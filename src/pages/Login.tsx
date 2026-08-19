import { useState } from "react";
import { Reveal } from "../lib/motion";
import { LogoMark } from "../components/Icons";
import { IconArrow, IconCheck } from "../components/Icons";

export default function Login() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", pass: "", name: "" });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [err, setErr] = useState("");

  document.title = tab === "login" ? "ورود | فینولو" : "ثبت‌نام | فینولو";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setErr("ایمیل درست وارد نشده.");
    if (form.pass.length < 6) return setErr("رمز باید حداقل ۶ کاراکتر باشد.");
    setErr("");
    setState("loading");
    window.setTimeout(() => setState("done"), 1200);
  };

  const field =
    "w-full rounded-xl border-[1.5px] border-ink bg-paper px-4 py-3 font-medium placeholder:text-ink-soft/50 focus:border-verm focus:shadow-[3px_3px_0_0_rgba(244,71,31,0.5)] outline-none transition-all duration-200";

  return (
    <div className="relative min-h-screen grid lg:grid-cols-[1fr_1.1fr]">
      {/* ---------- brand side ---------- */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-ink text-paper p-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
        <div className="outline-ink absolute -bottom-10 -right-6 font-display text-[11rem] leading-none opacity-50 rotate-[-8deg] select-none pointer-events-none" aria-hidden>
          بورد
        </div>
        <a href="#/" className="relative inline-flex items-center gap-3 w-fit">
          <LogoMark className="w-10 h-10" />
          <span className="font-display text-3xl">فینولو</span>
        </a>

        <div className="relative">
          {/* mini board doodle */}
          <div className="grid grid-cols-3 gap-3 max-w-sm -rotate-2">
            {[
              ["برای انجام", 3, "bg-paper/10"],
              ["در حال انجام", 2, "bg-amber/25"],
              ["انجام شد", 1, "bg-verm/30"],
            ].map(([t, n, bg]) => (
              <div key={t as string} className={`rounded-xl border border-paper/20 ${bg} p-2.5`}>
                <div className="text-[10px] font-black text-paper/60 mb-2">{t as string}</div>
                <div className="space-y-2">
                  {Array.from({ length: n as number }).map((_, i) => (
                    <div key={i} className={`h-6 rounded-md border border-paper/25 ${i === 0 ? "bg-paper/15 drift" : "bg-paper/8"}`} style={{ animationDelay: `${i * 0.7}s` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 font-display text-3xl leading-[1.5] max-w-md">
            «از وقتی وارد فینولو شدم،
            <br />
            جلسهٔ «چی کار می‌کنیم؟»
            <br />
            <span className="text-amber">کلاً حذف شد.»</span>
          </p>
          <p className="mt-3 text-paper/55 font-bold text-sm">— سارا محمدی، مدیر محصول آبان‌تک</p>
        </div>

        <div className="relative flex items-center gap-6 text-xs font-bold text-paper/50">
          <span>۲٬۴۰۰+ تیم</span>
          <span className="w-1 h-1 rounded-full bg-verm" />
          <span>آپ‌تایم ۹۹٫۹٪</span>
          <span className="w-1 h-1 rounded-full bg-amber" />
          <span>تقویم شمسی</span>
        </div>
      </aside>

      {/* ---------- form side ---------- */}
      <main className="relative flex flex-col justify-center px-6 sm:px-14 py-12">
        <div className="absolute inset-0 bg-grid-faint opacity-50" aria-hidden />
        <div className="relative w-full max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <a href="#/" className="inline-flex items-center gap-2.5 lg:hidden">
              <LogoMark className="w-9 h-9" />
              <span className="font-display text-2xl">فینولو</span>
            </a>
            <a href="#/" className="group inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-verm transition-colors">
              بازگشت به سایت
              <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {state === "done" ? (
            <Reveal variant="scale">
              <div className="mt-14 rounded-2xl border-[1.5px] border-ink bg-paper p-10 text-center shadow-[8px_8px_0_0_rgba(25,23,18,1)]">
                <span className="inline-grid place-items-center w-20 h-20 rounded-full bg-pine text-paper border-[1.5px] border-ink shadow-[4px_4px_0_0_rgba(25,23,18,1)] -rotate-6">
                  <IconCheck className="w-9 h-9" />
                </span>
                <h2 className="mt-6 font-display text-3xl">{tab === "login" ? "خوش برگشتی!" : "خوش آمدی!"}</h2>
                <p className="mt-3 text-ink-soft font-medium leading-7">
                  این یک نسخهٔ نمایشی است — در محصول واقعی، الان داشتی وارد بوردت می‌شدی.
                </p>
                <a href="#/" className="mt-7 inline-flex items-center gap-2 bg-verm text-paper rounded-full px-7 py-3 font-bold hover:bg-ink transition-colors duration-300">
                  برگرد به صفحهٔ اصلی
                </a>
              </div>
            </Reveal>
          ) : (
            <div className="mt-14">
              <h1 className="font-display text-4xl sm:text-5xl leading-[1.15]">
                {tab === "login" ? (
                  <>دوباره بیا <span className="text-verm">تو</span> بورد</>
                ) : (
                  <>اولین <span className="text-verm">تخته</span>‌ات، ۱ دقیقه دیگر</>
                )}
              </h1>

              {/* tabs */}
              <div className="mt-8 inline-flex rounded-full border-[1.5px] border-ink bg-paper-deep p-1.5 shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
                {([
                  ["login", "ورود"],
                  ["signup", "ثبت‌نام رایگان"],
                ] as const).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => {
                      setTab(id);
                      setErr("");
                    }}
                    className={`rounded-full px-6 py-2.5 text-sm font-black transition-all duration-300 ${
                      tab === id ? "bg-ink text-paper shadow-[2px_2px_0_0_rgba(244,71,31,1)]" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
                {tab === "signup" && (
                  <div>
                    <label className="block text-sm font-black mb-2">نام و نام خانوادگی</label>
                    <input className={field} placeholder="مثلاً سارا محمدی" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-black mb-2">ایمیل کاری</label>
                  <input dir="ltr" className={`${field} text-left`} placeholder="you@team.ir" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-black mb-2">رمز عبور</label>
                  <div className="relative">
                    <input
                      dir="ltr"
                      type={showPass ? "text" : "password"}
                      className={`${field} text-left pe-12`}
                      placeholder="••••••••"
                      value={form.pass}
                      onChange={(e) => setForm({ ...form, pass: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full hover:bg-paper-deep transition-colors text-ink-soft"
                      aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
                    >
                      {showPass ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
                          <path d="M4 4l16 16M9.9 5.2A9.4 9.4 0 0 1 12 5c5 0 8.6 3.6 10 7-.5 1.2-1.3 2.5-2.4 3.6M6.2 6.9C4.5 8.1 3.1 9.7 2 12c1.4 3.4 5 7 10 7 1.5 0 2.9-.3 4.1-.9" />
                          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M2 12c1.4-3.4 5-7 10-7s8.6 3.6 10 7c-1.4 3.4-5 7-10 7S3.4 15.4 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {err && <p className="text-sm font-bold text-verm bg-verm/10 border border-verm/30 rounded-xl px-4 py-2.5">{err}</p>}

                {tab === "login" && (
                  <div className="flex items-center justify-between text-sm font-bold">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" className="w-4 h-4 accent-[#F4471F]" defaultChecked />
                      مرا به خاطر بسپار
                    </label>
                    <a href="#/contact" className="text-verm link-underline">رمز یادم رفت</a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="group w-full inline-flex items-center justify-center gap-3 bg-verm text-paper rounded-full py-4 font-bold text-lg shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:shadow-[2px_2px_0_0_rgba(25,23,18,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 disabled:opacity-70"
                >
                  {state === "loading" ? (
                    <>
                      <span className="w-5 h-5 rounded-full border-2 border-paper/40 border-t-paper animate-spin" />
                      چند ثانیه…
                    </>
                  ) : (
                    <>
                      {tab === "login" ? "ورود به بورد" : "ساخت حساب رایگان"}
                      <IconArrow className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-4">
                <span className="h-px flex-1 border-t border-dashed border-ink/30" />
                <span className="text-xs font-bold text-ink-soft">یا</span>
                <span className="h-px flex-1 border-t border-dashed border-ink/30" />
              </div>
              <button className="mt-6 w-full inline-flex items-center justify-center gap-3 border-[1.5px] border-ink rounded-full py-3.5 font-bold hover:bg-paper-deep hover:-translate-y-0.5 transition-all duration-200">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#F4471F" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.5 10.6-6 4.2a.7.7 0 0 1-1.1-.6V7.8a.7.7 0 0 1 1.1-.6l6 4.2a.7.7 0 0 1 0 1.2Z" />
                </svg>
                ورود با گوگل
              </button>

              <p className="mt-7 text-center text-xs font-semibold text-ink-soft leading-6">
                {tab === "signup" ? "با ثبت‌نام، " : "با ورود، "}
                <a href="#/terms" className="text-verm font-bold">قوانین استفاده</a> و <a href="#/privacy" className="text-verm font-bold">حریم خصوصی</a> را می‌پذیری.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
