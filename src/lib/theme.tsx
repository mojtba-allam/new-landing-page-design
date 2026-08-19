import { createContext, useContext, useEffect, useState } from "react";
import { useI18n } from "./i18n";

export type ThemeMode = "paper" | "glass";
export type ColorMode = "light" | "dark";
const THEME_KEY = "finolo-theme-mode";
const COLOR_KEY = "finolo-color-mode";

const Ctx = createContext<{
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  color: ColorMode;
  setColor: (c: ColorMode) => void;
}>({
  mode: "paper",
  setMode: () => {},
  color: "light",
  setColor: () => {},
});

function applyTheme(root: HTMLElement, mode: ThemeMode, color: ColorMode) {
  if (mode === "glass") root.setAttribute("data-theme", "glass");
  else root.removeAttribute("data-theme");
  if (color === "dark") root.setAttribute("data-mode", "dark");
  else root.removeAttribute("data-mode");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    typeof localStorage !== "undefined" && localStorage.getItem(THEME_KEY) === "glass" ? "glass" : "paper"
  );
  const [color, setColorState] = useState<ColorMode>(() =>
    typeof localStorage !== "undefined" && localStorage.getItem(COLOR_KEY) === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    applyTheme(document.documentElement, mode, color);
    localStorage.setItem(THEME_KEY, mode);
    localStorage.setItem(COLOR_KEY, color);
  }, [mode, color]);

  const morph = (fn: () => void) => {
    const root = document.documentElement;
    root.classList.add("theme-morph");
    fn();
    window.setTimeout(() => root.classList.remove("theme-morph"), 700);
  };

  const setMode = (m: ThemeMode) => {
    if (m === mode) return;
    morph(() => setModeState(m));
  };
  const setColor = (c: ColorMode) => {
    if (c === color) return;
    morph(() => setColorState(c));
  };

  return <Ctx.Provider value={{ mode, setMode, color, setColor }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="w-3.5 h-3.5" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
      <path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a.6.6 0 0 0-.8-.7 9 9 0 1 0 12.1 12.1.6.6 0 0 0-.7-.8Z" />
    </svg>
  );
}

/** سوییچر شناور: انتخاب هویت (کاهگی / شیشه‌ای) + حالت روشن/تیره */
export function ThemeSwitch() {
  const { mode, setMode, color, setColor } = useTheme();
  const { isFa } = useI18n();
  const dark = color === "dark";

  const options: { id: ThemeMode; fa: string; en: string; swatch: React.ReactNode }[] = [
    {
      id: "paper",
      fa: "کاهگی",
      en: "Paper",
      swatch: (
        <span className="w-4 h-4 rounded-full border border-ink/30 bg-[#f5f2eb] relative overflow-hidden" aria-hidden>
          <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[#f4471f]" />
        </span>
      ),
    },
    {
      id: "glass",
      fa: "شیشه‌ای",
      en: "Glass",
      swatch: (
        <span
          className="w-4 h-4 rounded-full border border-ink/30"
          aria-hidden
          style={{ background: "linear-gradient(135deg, #ffffff 0%, #dbe7fd 45%, #2d7aff 100%)" }}
        />
      ),
    },
  ];

  return (
    <div className="fixed bottom-5 start-5 z-[45] print:hidden" dir={isFa ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2">
        <div
          role="group"
          aria-label={isFa ? "تغییر تم رنگی" : "Color theme"}
          title={isFa ? "مقایسهٔ تم‌ها: کاهگی و شیشه‌ای" : "Compare themes: Paper vs Glass"}
          className="flex items-center gap-1 rounded-full border-[1.5px] border-ink bg-paper p-1 shadow-[4px_4px_0_0_rgba(25,23,18,1)]"
        >
          {options.map((o) => {
            const active = mode === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setMode(o.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black transition-all duration-300 ${
                  active ? "bg-verm text-paper shadow-[2px_2px_0_0_rgba(25,23,18,0.6)]" : "text-ink-soft hover:text-ink hover:bg-paper-deep"
                }`}
              >
                {o.swatch}
                {isFa ? o.fa : o.en}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setColor(dark ? "light" : "dark")}
          aria-pressed={dark}
          aria-label={dark ? (isFa ? "حالت روشن" : "Light mode") : isFa ? "حالت تیره" : "Dark mode"}
          title={dark ? (isFa ? "روشن کن" : "Switch to light") : isFa ? "تیره کن" : "Switch to dark"}
          className={`group grid place-items-center w-9 h-9 rounded-full border-[1.5px] border-ink shadow-[4px_4px_0_0_rgba(25,23,18,1)] transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(25,23,18,1)] ${
            dark ? "bg-ink text-amber" : "bg-amber text-ink hover:rotate-12"
          }`}
        >
          <span key={color} className="tick-pop grid place-items-center">
            {dark ? <SunIcon /> : <MoonIcon />}
          </span>
        </button>
      </div>
    </div>
  );
}
