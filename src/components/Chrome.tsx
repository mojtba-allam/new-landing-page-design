import { useEffect, useState } from "react";
import { Reveal, faNum } from "../lib/motion";
import { useI18n, tr, type Pair } from "../lib/i18n";
import { FOOTER_COLS, NAV_LINKS } from "../data";
import { IconInstagram, IconLinkedin, IconSpark, IconTelegram, IconX, LogoMark, IconArrow } from "./Icons";

/* ---------------- Ambient background ---------------- */
export function Ambient() {
  return (
    <>
      <div className="noise-overlay" aria-hidden />
      <div id="ambient-bg" className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-grid-faint" />
        <svg className="absolute -top-20 -left-20 w-96 h-96 text-ink/8 spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="48" strokeWidth="0.6" strokeDasharray="4 6" />
        </svg>
        <svg className="drift-slow absolute top-[22%] right-[4%] w-16 h-16 text-verm/25" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5c.7 4.9 2.6 7 7.5 7.7-4.9.7-6.8 2.8-7.5 7.6-.7-4.8-2.6-6.9-7.5-7.6 4.9-.7 6.8-2.8 7.5-7.7Z" />
        </svg>
        <svg className="drift absolute top-[64%] left-[3%] w-12 h-12 text-amber/40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.6l2.3 8.1 8.1 2.3-8.1 2.3-2.3 8.1-2.3-8.1L1.6 12l8.1-2.3L12 1.6Z" />
        </svg>
      </div>
    </>
  );
}

/* ---------------- Section heading ---------------- */
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
        <div className={`inline-flex items-center gap-3 text-sm font-bold ${dark ? "text-amber" : "text-verm"}`}>
          <span className="font-display text-2xl tabular-nums">{index}</span>
          <span className={`h-px w-14 ${dark ? "bg-amber" : "bg-verm"}`} />
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className={`font-display text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.15] mt-4 ${dark ? "text-paper" : "text-ink"}`}>{title}</h2>
      </Reveal>
      <Reveal delay={160}>
        <p className={`mt-5 text-base sm:text-lg leading-8 font-medium ${dark ? "text-paper/70" : "text-ink-soft"}`}>{desc}</p>
      </Reveal>
    </div>
  );
}

/* ---------------- Language switcher ---------------- */
function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      dir="ltr"
      className={`inline-flex items-center rounded-full border-[1.5px] border-ink bg-paper p-0.5 ${compact ? "" : "shadow-[3px_3px_0_0_rgba(25,23,18,1)]"}`}
      role="group"
      aria-label="Language"
    >
      {(["fa", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-black transition-all duration-300 ${
            lang === l ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
          }`}
          aria-pressed={lang === l}
        >
          {l === "fa" ? "فا" : "EN"}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Nav ---------------- */
const C: Record<string, Pair> = {
  login: { fa: "ورود", en: "Log in" },
  start: { fa: "شروع رایگان", en: "Start free" },
  menuOpen: { fa: "باز کردن منو", en: "Open menu" },
  menuClose: { fa: "بستن منو", en: "Close menu" },
  menuLabel: { fa: "منوی اصلی", en: "Main menu" },
  routes: { fa: "مسیر", en: "routes" },
  brandDesc: {
    fa: "ابزار مدیریت پروژه برای تیم‌هایی که می‌خواهند کمتر جلسه بگذارند و بیشتر تحویل بدهند. فارسی، شمسی، سریع.",
    en: "Project management for teams who'd rather ship than meet. Calendar-native, fast, on your language.",
  },
  madeIn: { fa: "© ۱۴۰۴ فینولو — ساخته‌شده در تهران", en: "© 2026 Finolo — made in Tehran" },
};

export function Nav() {
  const { isFa } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      {/* ---------- fullscreen mobile menu ---------- */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-ink text-paper overflow-hidden menu-fade" dir={isFa ? "rtl" : "ltr"} onClick={() => setOpen(false)}>
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
                  {tr(C.menuLabel)}
                </span>
                <span className="h-px flex-1 border-t border-dashed border-paper/20" />
                <span className="text-[11px] font-bold text-paper/40 tabular-nums">
                  {isFa ? `${faNum(NAV_LINKS.length)} مسیر` : `${NAV_LINKS.length} routes`}
                </span>
              </div>

              <nav className="grid" aria-label="Mobile navigation">
                {NAV_LINKS.map((l, i) => (
                  <div key={l.href} className="overflow-hidden border-b border-paper/10">
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="menu-link group flex items-center justify-between gap-4 py-3.5"
                      style={{ animationDelay: `${120 + i * 70}ms` }}
                    >
                      <span className="flex items-baseline gap-4 min-w-0">
                        <span className="font-display text-lg text-verm tabular-nums">
                          {isFa ? faNum(i + 1).padStart(2, "۰") : String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-[1.9rem] leading-tight transition-colors duration-200 group-active:text-amber">
                          {tr(l.label)}
                        </span>
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
                {tr(C.start)}
                <IconArrow className="w-5 h-5" />
              </a>
              <div className="flex items-center justify-center gap-3">
                <LangSwitch compact />
                <p className="text-[11px] font-bold text-paper/45">
                  {isFa ? "۲٬۴۰۰+ تیم ایرانی · بدون کارت بانکی" : "2,400+ teams · no credit card"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- header ---------- */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-paper/85 backdrop-blur-md border-b border-ink/10 shadow-[0_8px_30px_-18px_rgba(25,23,18,0.4)]" : "bg-transparent"
        }`}
      >
        {/* scroll progress */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-transparent" dir="ltr">
          <div className="h-full bg-verm transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
            <a href="#top" className="group flex items-center gap-2.5">
              <LogoMark className="w-9 h-9 transition-transform duration-500 group-hover:-rotate-6" />
              <span className="font-display text-2xl tracking-tight">
                {isFa ? "فینولو" : "Finolo"}
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="link-underline text-ink-soft hover:text-ink transition-colors">
                  {tr(l.label)}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <LangSwitch />
              <a href="#/login" className="hidden sm:block text-[15px] font-medium text-ink-soft hover:text-verm transition-colors">
                {tr(C.login)}
              </a>
              <a
                href="#cta"
                className="group inline-flex items-center gap-2 bg-ink text-paper rounded-full px-5 py-2.5 text-[15px] font-bold hover:bg-verm transition-colors duration-300 active:translate-y-px"
              >
                {tr(C.start)}
                <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </a>

              <button
                onClick={() => setOpen((v) => !v)}
                className={`lg:hidden relative w-11 h-11 grid place-items-center rounded-full border-[1.5px] border-ink shadow-[3px_3px_0_0_rgba(25,23,18,1)] transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_rgba(25,23,18,1)] ${
                  open ? "bg-verm rotate-90" : "bg-amber hover:rotate-6"
                }`}
                aria-label={open ? tr(C.menuClose) : tr(C.menuOpen)}
                aria-expanded={open}
              >
                <span className="relative block w-4.5 h-3">
                  <span className={`absolute inset-x-0 top-0 h-[2.5px] rounded-full transition-all duration-300 ${open ? "bg-paper top-1/2 -translate-y-1/2 rotate-45" : "bg-ink"}`} />
                  <span className={`absolute inset-x-0 bottom-0 h-[2.5px] rounded-full transition-all duration-300 ${open ? "bg-paper bottom-auto top-1/2 -translate-y-1/2 -rotate-45" : "bg-ink"}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const { isFa } = useI18n();
  return (
    <footer className="relative bg-ink text-paper pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-[1.3fr_2fr] gap-12">
          <div>
            <a href="#top" className="group inline-flex items-center gap-2.5">
              <LogoMark className="w-10 h-10 transition-transform duration-500 group-hover:-rotate-6" />
              <span className="font-display text-3xl">{isFa ? "فینولو" : "Finolo"}</span>
            </a>
            <p className="mt-5 text-paper/60 leading-8 max-w-sm text-[15px]">{tr(C.brandDesc)}</p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: <IconTelegram className="w-4.5 h-4.5" />, label: "Telegram" },
                { icon: <IconInstagram className="w-4.5 h-4.5" />, label: "Instagram" },
                { icon: <IconLinkedin className="w-4.5 h-4.5" />, label: "LinkedIn" },
                { icon: <IconX className="w-4 h-4" />, label: "X" },
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

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {FOOTER_COLS.map((col) => (
              <div key={tr(col.title)}>
                <h3 className="font-display text-lg text-amber">{tr(col.title)}</h3>
                <ul className="mt-4 space-y-2.5 text-[15px] text-paper/65">
                  {col.links.map((l) => (
                    <li key={tr(l.label)}>
                      <a href={l.href} className="hover:text-paper transition-colors link-underline">
                        {tr(l.label)}
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
            {tr(C.madeIn)}
          </span>
          <span dir="ltr" className="tracking-[0.25em]">
            v2.4.0 · STATUS: ALL SYSTEMS GO
          </span>
        </div>
      </div>
    </footer>
  );
}
