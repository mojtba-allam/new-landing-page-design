import { createContext, useContext, useEffect, useState } from "react";
import { useI18n } from "./i18n";

export type ThemeMode = "paper" | "glass";
const KEY = "finolo-theme-mode";

const Ctx = createContext<{ mode: ThemeMode; setMode: (m: ThemeMode) => void }>({
  mode: "paper",
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "glass" ? "glass" : "paper"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "glass") root.setAttribute("data-theme", "glass");
    else root.removeAttribute("data-theme");
    localStorage.setItem(KEY, mode);
  }, [mode]);

  const setMode = (m: ThemeMode) => {
    if (m === mode) return;
    const root = document.documentElement;
    root.classList.add("theme-morph");
    setModeState(m);
    window.setTimeout(() => root.classList.remove("theme-morph"), 700);
  };

  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);

/** سوییچر شناور برای مقایسهٔ دو تم — کاهگی (پیش‌فرض) و شیشه‌ای (Apple HIG) */
export function ThemeSwitch() {
  const { mode, setMode } = useTheme();
  const { isFa } = useI18n();

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
    </div>
  );
}
