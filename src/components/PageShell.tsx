import { useEffect, type ReactNode } from "react";
import { Reveal } from "../lib/motion";
import { Footer, Nav } from "./Chrome";

const DEFAULT_TITLE = "فینولو | نرم‌افزار مدیریت پروژه فارسی — کانبان، گانت و گزارش زنده";

export function usePageMeta(title: string, desc: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", desc);
    return () => {
      document.title = DEFAULT_TITLE;
      meta?.setAttribute("content", prev);
    };
  }, [title, desc]);
}

/**
 * قاب مشترک صفحات داخلی: ناوبری، سربرگ نمایشی با برچسب مسیر و عدد صفحه، و فوتر.
 */
export function PageShell({
  crumb,
  index,
  title,
  lead,
  sticker,
  children,
}: {
  crumb: string;
  index: string;
  title: ReactNode;
  lead?: string;
  sticker?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Nav />
      <header className="relative pt-28 sm:pt-36 pb-4 overflow-x-clip">
        <div className="absolute inset-0 bg-grid-faint opacity-60" aria-hidden />
        {sticker && (
          <div
            className="outline-ink absolute -top-4 left-0 -rotate-6 font-display text-[9rem] sm:text-[13rem] leading-none select-none pointer-events-none opacity-70 hidden sm:block"
            aria-hidden
          >
            {sticker}
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#/"
                className="inline-flex items-center gap-2 text-xs font-black border-[1.5px] border-ink bg-amber rounded-full px-4 py-2 shadow-[3px_3px_0_0_rgba(25,23,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_rgba(25,23,18,1)] transition-all duration-200 -rotate-1"
              >
                فینولو
                <IconBack className="w-3.5 h-3.5" />
                {crumb}
              </a>
              <span className="inline-flex items-center gap-2 text-[11px] font-black text-ink-soft border border-dashed border-ink/40 rounded-full px-3 py-1.5">
                صفحه <span className="font-display text-sm text-verm">{index}</span>
              </span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.8rem)] leading-[1.1] mt-6 max-w-3xl">{title}</h1>
          </Reveal>
          {lead && (
            <Reveal delay={200}>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-8 text-ink-soft font-medium">{lead}</p>
            </Reveal>
          )}
        </div>
      </header>
      <main className="relative pb-28">{children}</main>
      <Footer />
    </div>
  );
}

export function IconBack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

/** جعبهٔ محتوای استاندارد صفحات — کارت مرکابی با سایهٔ آفست */
export function Sheet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border-[1.5px] border-ink bg-paper shadow-[7px_7px_0_0_rgba(25,23,18,1)] ${className}`}>{children}</div>
  );
}

/** برچسب کوچک کج — امضای بصری فینولو */
export function Sticker({ children, tone = "bg-verm text-paper", className = "" }: { children: ReactNode; tone?: string; className?: string }) {
  return (
    <span className={`inline-block ${tone} border-[1.5px] border-ink rounded-full px-3.5 py-1.5 text-[11px] font-black shadow-[3px_3px_0_0_rgba(25,23,18,1)] -rotate-2 ${className}`}>
      {children}
    </span>
  );
}
