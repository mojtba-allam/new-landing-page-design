import { useEffect, useRef, useState } from "react";

const THEMES = [
  { id: "kaghazi", attr: "", label: "کاهگی و ورمیلیون", note: "تم اصلی و پیشنهادی", dark: false, chips: ["#F5F2EB", "#191712", "#F4471F", "#FFC24B"] },
  { id: "oqyanus", attr: "ocean", label: "اقیانوس", note: "تک‌رنگ فیروزه‌ای · سرد و مدرن", dark: false, chips: ["#EDF4F4", "#0C1F22", "#0C93A6", "#A9DFD3"] },
  { id: "shab", attr: "midnight", label: "شب", note: "دارک · سرمه‌ای و نیلی الکتریک", dark: true, chips: ["#0E1218", "#E8EDF5", "#5B7CFA", "#F0B64A"] },
  { id: "jangalshab", attr: "nightforest", label: "جنگلِ شب", note: "دارک · سبز و زمردی", dark: true, chips: ["#0D1712", "#E7F1EA", "#3ECF77", "#D8E76E"] },
  { id: "mes", attr: "copper", label: "مس", note: "دارک · اسپرسو و نارنجی مسی", dark: true, chips: ["#17110C", "#F6ECDF", "#FF8046", "#F5B73F"] },
  { id: "sharab", attr: "wine", label: "شراب", note: "دارک · آلبالویی و گلبهی", dark: true, chips: ["#170F14", "#F7E9F0", "#FF5D84", "#F6BCD0"] },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];
const LS_KEY = "finolo-theme";

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(LS_KEY);
    return (THEMES.some((t) => t.id === saved) ? saved : "kaghazi") as ThemeId;
  });
  const boxRef = useRef<HTMLDivElement>(null);

  /* apply the theme to <html> + persist */
  useEffect(() => {
    const t = THEMES.find((x) => x.id === theme) ?? THEMES[0];
    const root = document.documentElement;
    if (t.attr) root.setAttribute("data-theme", t.attr);
    else root.removeAttribute("data-theme");
    if (t.dark) root.setAttribute("data-dark", "1");
    else root.removeAttribute("data-dark");
    localStorage.setItem(LS_KEY, t.id);
  }, [theme]);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const pick = (id: ThemeId) => {
    setOpen(false);
    if (id === theme) return;
    document.documentElement.classList.add("theme-morph");
    setTheme(id);
    window.setTimeout(() => document.documentElement.classList.remove("theme-morph"), 650);
  };

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div ref={boxRef} className="fixed bottom-5 end-5 z-[45] print:hidden" dir="rtl">
      {/* popover */}
      {open && (
        <div className="panel-in absolute bottom-16 end-0 w-[272px] rounded-2xl border-[1.5px] border-ink bg-paper shadow-[7px_7px_0_0_rgba(25,23,18,0.9)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-paper-deep border-b-[1.5px] border-ink">
            <strong className="font-display text-lg leading-none">تم‌های رنگی</strong>
            <span className="text-[10px] font-bold text-ink-soft">انتخاب شما ذخیره می‌شود</span>
          </div>
          <div className="p-2.5 space-y-1.5">
            {THEMES.map((t) => {
              const isActive = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => pick(t.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border-[1.5px] px-3 py-2.5 text-start transition-all duration-200 ${
                    isActive
                      ? "border-ink bg-ink text-paper shadow-[3px_3px_0_0_rgba(244,71,31,0.9)]"
                      : "border-transparent hover:border-ink/25 hover:bg-paper-deep hover:-translate-y-0.5"
                  }`}
                >
                  <span className="flex -space-x-1.5 shrink-0" dir="ltr">
                    {t.chips.map((c) => (
                      <span key={c} className={`w-5 h-5 rounded-full border-[1.5px] ${isActive ? "border-paper/40" : "border-ink/25"}`} style={{ background: c }} />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className={`block text-sm font-black leading-5 ${isActive ? "text-paper" : "text-ink"}`}>
                      {t.label}
                      {t.id === "kaghazi" && (
                        <span className="ms-2 text-[9px] font-black rounded-full bg-verm text-paper px-2 py-0.5 align-middle">پیشنهاد ما</span>
                      )}
                      {t.dark && (
                        <span className={`ms-2 text-[9px] font-black rounded-full px-2 py-0.5 align-middle ${isActive ? "bg-amber text-ink" : "bg-ink/10 text-ink-soft"}`}>
                          دارک
                        </span>
                      )}
                    </strong>
                    <span className={`block text-[10.5px] font-medium ${isActive ? "text-paper/60" : "text-ink-soft"}`}>{t.note}</span>
                  </span>
                  {isActive && (
                    <span className="w-5 h-5 grid place-items-center rounded-full bg-verm text-paper shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="px-4 py-2.5 border-t border-dashed border-ink/20 text-[10px] font-bold text-ink-soft leading-4">
            الان: {active.label} · برای برگشت، دوباره «{THEMES[0].label}» را بزن
          </p>
        </div>
      )}

      {/* toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="تغییر تم رنگی"
        aria-expanded={open}
        title="تست تم‌های رنگی"
        className={`group relative w-13 h-13 sm:w-14 sm:h-14 grid place-items-center rounded-full border-[1.5px] border-ink bg-paper shadow-[4px_4px_0_0_rgba(25,23,18,1)] transition-all duration-300 hover:rotate-12 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(25,23,18,1)] ${
          open ? "rotate-90 bg-amber" : ""
        }`}
      >
        {/* three live dots — colored by the active theme itself */}
        <span className="flex -space-x-1.5" dir="ltr">
          <span className="w-4 h-4 rounded-full bg-verm border-[1.5px] border-paper" />
          <span className="w-4 h-4 rounded-full bg-amber border-[1.5px] border-paper" />
          <span className="w-4 h-4 rounded-full bg-pine border-[1.5px] border-paper" />
        </span>
      </button>
    </div>
  );
}
