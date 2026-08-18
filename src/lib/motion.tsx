import React, { useEffect, useRef, useState } from "react";

/* ---------- prefers-reduced-motion ---------- */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* ---------- in-view (threshold 0 + scroll fallback, so nothing ever stays hidden) ---------- */
export function useInView<T extends HTMLElement>(
  threshold = 0,
  once = true
): [React.Ref<T>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const r = el.getBoundingClientRect();
      const visible = r.top < window.innerHeight * 0.98 && r.bottom > -40;
      if (visible) {
        setInView(true);
        if (once) cleanup();
      } else if (!once) {
        setInView(false);
      }
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setInView(true);
              if (once) cleanup();
            } else if (!once) {
              setInView(false);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -2% 0px" }
      );
      io.observe(el);
    }

    const onScroll = () => check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();

    function cleanup() {
      if (io) io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
    return cleanup;
  }, [reduced, once]);

  return [ref, inView];
}

/* ---------- reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: "up" | "scale";
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${variant === "scale" ? "reveal-scale" : "reveal"} ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- count-up ---------- */
export function useCountUp(end: number, start: boolean, duration = 1600, decimals = 0): string {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(end);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(end * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, end, duration, reduced]);

  return value.toLocaleString("fa-IR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ---------- scramble text (respect reduced motion) ---------- */
export function useScramble(text: string, start: boolean, speed = 28): string {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!start || reduced) {
      setOut(text);
      return;
    }
    const glyphs = "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹#*+";
    let frame = 0;
    const total = Math.max(14, text.length + 8);
    const id = window.setInterval(() => {
      frame++;
      const solved = Math.floor((frame / total) * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (i < solved || text[i] === " ") s += text[i];
        else s += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setOut(s);
      if (solved >= text.length) {
        setOut(text);
        window.clearInterval(id);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, start, speed, reduced]);
  return out;
}

export const faNum = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/* ---------- shared touch slider (mobile) ---------- */
export interface SliderApi {
  idx: number;
  goTo: (n: number) => void;
  dragging: boolean;
  interacted: boolean;
  markInteracted: () => void;
  dragX: number;
  trackStyle: React.CSSProperties;
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

export function useSlider(count: number, autoEvery = 4200): SliderApi {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const startX = useRef(0);

  const goTo = (n: number) => setIdx(((n % count) + count) % count);

  // auto-advance (paused on reduced motion / while dragging / after first interaction)
  useEffect(() => {
    if (reduced || dragging || interacted) return;
    const id = window.setInterval(() => setIdx((v) => (v + 1) % count), autoEvery);
    return () => window.clearInterval(id);
  }, [reduced, dragging, interacted, count, autoEvery]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    setDragX(e.touches[0].clientX - startX.current);
  };
  const onTouchEnd = () => {
    setDragging(false);
    setInteracted(true);
    if (dragX < -48) goTo(idx + 1);
    else if (dragX > 48) goTo(idx - 1);
    setDragX(0);
  };

  return {
    idx,
    goTo,
    dragging,
    interacted,
    markInteracted: () => setInteracted(true),
    dragX,
    trackStyle: {
      transform: `translateX(calc(${idx * 100}% + ${dragX}px))`,
      transition: dragging || reduced ? "none" : "transform 0.55s cubic-bezier(0.19,0.65,0.22,1)",
    },
    touchHandlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
