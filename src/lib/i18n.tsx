import React, { createContext, useContext, useEffect, useState } from "react";

/* ================= Finolo i18n — فارسی (RTL) ⇄ English (LTR) ================= */

export type Lang = "fa" | "en";
export interface Pair {
  fa: string;
  en: string;
}

const LS_KEY = "finolo-lang";

function readInitial(): Lang {
  try {
    const saved = localStorage.getItem(LS_KEY);
    return saved === "en" || saved === "fa" ? saved : "fa";
  } catch {
    return "fa";
  }
}

/* module-level current lang — read by t/tr/num without a hook */
let current: Lang = readInitial();
export const getLang = (): Lang => current;

/** pick the active-language string from a pair */
export const tr = (p: Pair): string => p[current];

/** number formatting: ۲٬۴۰۰ in fa — 2,400 in en */
export const num = (n: number, decimals = 0): string =>
  n.toLocaleString(current === "fa" ? "fa-IR" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** zero-padded section indexes: ۰۲ / 02 */
export const pad2 = (n: number): string =>
  current === "fa" ? String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]).padStart(2, "۰") : String(n).padStart(2, "0");

/** convert latin digits inside a string to persian ones (fa only) */
export const digits = (s: string | number): string =>
  current === "fa" ? String(s).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]) : String(s);

interface I18nCtx {
  lang: Lang;
  isFa: boolean;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<I18nCtx>({ lang: "fa", isFa: true, setLang: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(current);

  const apply = (l: Lang) => {
    current = l;
    const root = document.documentElement;
    root.lang = l;
    root.dir = l === "fa" ? "rtl" : "ltr";
    try {
      localStorage.setItem(LS_KEY, l);
    } catch {
      /* private mode */
    }
  };

  /* apply on mount (dir/lang may have been reset) */
  useEffect(() => {
    apply(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (l: Lang) => {
    if (l === lang) return;
    apply(l);
    setLangState(l);
  };

  return <Ctx.Provider value={{ lang, isFa: lang === "fa", setLang }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
