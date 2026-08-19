import { useEffect, useState } from "react";
import { Reveal, faNum } from "../lib/motion";
import { IconInstagram, IconLinkedin, IconSpark, IconTelegram, IconX, LogoMark, IconArrow } from "./Icons";
import { FOOTER_COLS, NAV_LINKS } from "../data";

/* ---------------- Ambient background ---------------- */
export function Ambient() {
  return (
    <>
      <div className="noise-overlay" aria-hidden />
      <div className="fixed inset-0 -z-10 bg-paper bg-grid-faint [mask-image:radial-gradient(120%_90%_at_50%_0%,black_55%,transparent_100%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden>
        <svg className="drift absolute top-28 left-[6%] w-8 h-8 text-verm/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 4v16M4 12h16" />
        </svg>
        <svg className="drift-slow absolute top-[22%] right-[4%] w-10 h-10 text-pine/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
        </svg>
        <svg className="drift absolute top-[58%] left-[3%] w-7 h-7 text-amber" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5c.7 4.9 2.6 7 7.5 7.7-4.9.7-6.8 2.8-7.5 7.6-.7-4.8-2.6-6.9-7.5-7.6 4.9-.7 6.8-2.8 7.5-7.7Z" />
        </svg>
        <svg className="drift-slow absolute top-[75%] right-[8%] w-9 h-9 text-verm/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 18 18 4M18 4h-8M18 4v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="spin-slow absolute top-[40%] left-[45%] w-16 h-16 text-ink/10" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="8" y="8" width="32" height="32" rx="4" />
        </svg>
      </div>
    </>
  );
}

/* ---------------- Sticky nav ---------------- */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* lock scroll + close on Escape while the mobile menu is open */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* ---------- fullscreen mobile menu (rendered outside <header> on purpose) ---------- */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink text-paper overflow-hidden menu-fade" dir="rtl" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-grid-dark opacity-70" aria-hidden />
          <div className="outline-word absolute -bottom-7 -left-4 font-display text-[6.5rem] leading-none select-none opacity-60" dir="ltr" aria-hidden>
            FINOLO
          </div>
          <svg className="spin-slow absolute top-24 left-7 w-10 h-10 text-amber/80" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 1.6l2.3 8.1 8.1 2.3-8.1 2.3-2.3 8.1-2.3-8.1L1.6 12l8.1-2.3L12 1.6Z" />
          </svg>
          <span className="absolute top-[38%] right-6 w-3 h-3 rotate-12 bg-verm border border-paper/40" aria-hidden />
          <span className="absolute bottom-40 left-10 w-2 h-2 rounded-full bg-amber pulse-dot" aria-hidden />

          <div className="relative h-full flex flex-col justify-between pt-24 pb-7 px-6" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="menu-link flex items-center gap-3 mb-4" style={{ animationDelay: "60ms" }}>
                <span className="inline-flex items-center gap-2 text-[11px] font-black text-amber border border-amber/40 rounded-full px-3 py-1.5">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-amber" />
                    <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-amber" />
                  </span>
                  منوی اصلی
                </span>
                <span className="h-px flex-1 border-t border-dashed border-paper/20" />
                <span className="text-[11px] font-bold text-paper/40 tabular-nums">{faNum(NAV_LINKS.length)} مسیر</span>
              </div>

              <nav className="grid" aria-label="ناوبری موبایل">
                {NAV_LINKS.map((l, i) => (
                  <div key={l.href} className="overflow-hidden border-b border-paper/10">
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="menu-link group flex items-center justify-between gap-4 py-3.5"
                      style={{ animationDelay: `${120 + i * 70}ms` }}
                    >
                      <span className="flex items-baseline gap-4 min-w-0">
                        <span className="font-display text-lg text-verm tabular-nums">{faNum(i + 1).padStart(2, "۰")}</span>
                        <span className="font-display text-[1.9rem] leading-tight transition-colors duration-200 group-active:text-amber">{l.label}</span>
                      </span>
                      <span className="w-10 h-10 shrink-0 grid place-items-center rounded-full border border-paper/20 transition-all duration-200 group-active:bg-amber group-active:text-ink group-active:border-amber group-active:rotate-[-45deg]">
                        <IconArrow className="w-4 h-4" />
                      </span>
                    </a>
                  </div>
                ))}
              </nav>
            </div>

            <div className="menu-link space-y-4" style={{ animationDelay: "580ms" }}>
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-3 bg-amber text-ink rounded-full px-7 py-4 font-display text-2xl shadow-[5px_5px_0_0_rgba(244,71,31,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_0_rgba(244,71,31,1)] transition-all duration-150"
              >
                شروع رایگان
                <IconArrow className="w-5 h-5" />
              </a>
              <p className="text-center text-[11px] font-bold text-paper/45">۲٬۴۰۰+ تیم ایرانی · بدون کارت بانکی · تقویم شمسی</p>
            </div>
          </div>
        </div>
      )}

      {/* ---------- scroll progress ---------- */}
      <div
        className="fixed top-0 inset-x-0 z-[60] h-[3px] bg-verm origin-right transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-paper/85 backdrop-blur-md border-b border-ink/10 py-2.5" : "py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <LogoMark className="w-9 h-9 transition-transform duration-500 group-hover:rotate-6" />
            <span className="font-display text-2xl leading-none pt-1">فینولو</span>
            <span className="hidden sm:inline-block text-[10px] tracking-[0.3em] font-semibold text-ink-soft border border-ink/15 rounded-full px-2 py-0.5 -translate-y-0.5">
              FINOLO
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-ink-soft">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="link-underline hover:text-ink transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#/login" className="hidden sm:block text-[15px] font-medium text-ink-soft hover:text-verm transition-colors">
              ورود
            </a>
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 bg-ink text-paper rounded-full px-5 py-2.5 text-[15px] font-bold hover:bg-verm transition-colors duration-300 active:translate-y-px"
            >
              شروع رایگان
              <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </a>

            {/* hamburger → morph button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className={`lg:hidden relative w-11 h-11 grid place-items-center rounded-full border-[1.5px] border-ink shadow-[3px_3px_0_0_rgba(25,23,18,1)] transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_rgba(25,23,18,1)] ${
                open ? "bg-verm rotate-90" : "bg-amber hover:rotate-6"
              }`}
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              aria-expanded={open}
            >
              <span className="relative block w-4 h-3">
                <span
                  className={`absolute inset-x-0 top-0 h-[2.5px] rounded-full transition-all duration-300 ${
                    open ? "bg-paper top-1/2 -translate-y-1/2 rotate-45" : "bg-ink"
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2.5px] rounded-full transition-all duration-300 ${
                    open ? "bg-paper bottom-auto top-1/2 -translate-y-1/2 -rotate-45" : "bg-ink"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

/* ---------------- Section head ---------------- */
export function SectionHead({
  index,
  title,
  desc,
  dark = false,
}: {
  index: string;
  title: React.ReactNode;
  desc: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <div className={`inline-flex items-center gap-3 text-xs font-black ${dark ? "text-amber" : "text-verm"}`}>
          <span className={`w-8 h-px ${dark ? "bg-amber" : "bg-verm"}`} />
          <span className="tabular-nums">{index}</span>
          <span className={dark ? "text-paper/60" : "text-ink-soft"}>فینولو</span>
        </div>
      </Reveal>
      <h2 className={`font-display leading-[1.1] mt-4 text-4xl sm:text-5xl lg:text-6xl ${dark ? "text-paper" : "text-ink"}`}>{title}</h2>
      <Reveal delay={120}>
        <p className={`mt-5 text-base sm:text-lg leading-8 ${dark ? "text-paper/65" : "text-ink-soft"}`}>{desc}</p>
      </Reveal>
    </div>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  return (
    <footer className="bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-[1.3fr_2fr] gap-12">
          <div>
            <a href="#top" className="flex items-center gap-3 w-fit group">
              <LogoMark className="w-10 h-10 transition-transform duration-500 group-hover:-rotate-6" />
              <span className="font-display text-3xl">فینولو</span>
            </a>
            <p className="mt-5 text-paper/60 leading-8 max-w-sm text-[15px]">
              ابزار مدیریت پروژه برای تیم‌هایی که می‌خواهند کمتر جلسه بگذارند و بیشتر تحویل بدهند. فارسی، شمسی، سریع.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: <IconTelegram className="w-4.5 h-4.5" />, label: "تلگرام" },
                { icon: <IconInstagram className="w-4.5 h-4.5" />, label: "اینستاگرام" },
                { icon: <IconLinkedin className="w-4.5 h-4.5" />, label: "لینکدین" },
                { icon: <IconX className="w-4 h-4" />, label: "ایکس" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={s.label}
                  className="w-10 h-10 grid place-items-center rounded-full border border-paper/20 hover:bg-amber hover:text-ink hover:border-amber hover:-translate-y-1 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="font-display text-lg text-amber">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-[15px] text-paper/65">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="hover:text-paper transition-colors link-underline">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* giant wordmark */}
        <div className="mt-14 -mb-3 select-none pointer-events-none" aria-hidden>
          <div className="font-display text-[clamp(4rem,17vw,13rem)] leading-[0.85] text-center outline-word whitespace-nowrap" dir="ltr">
            FINOLO
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-paper/12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-paper/45">
          <span className="inline-flex items-center gap-2">
            <IconSpark className="w-3.5 h-3.5 text-amber" />
            © ۱۴۰۴ فینولو — ساخته‌شده در تهران
          </span>
          <span dir="ltr" className="tracking-[0.25em]">
            v2.4.0 · STATUS: ALL SYSTEMS GO
          </span>
        </div>
      </div>
    </footer>
  );
}
