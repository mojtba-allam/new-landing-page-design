import { useState } from "react";
import { faNum } from "../lib/motion";
import { PANEL_MENU, PANEL_TASKS, TEAM_MEMBERS, TIME_ROWS } from "../data";
import {
  IconBell,
  IconBolt,
  IconCalendar,
  IconChart,
  IconClock,
  IconDashboard,
  IconGantt,
  IconGrip,
  IconGraph,
  IconKanban,
  IconList,
  IconPlus,
  IconTree,
  IconUsers,
} from "./Icons";

type MenuId = (typeof PANEL_MENU)[number]["id"];
type ViewId = "list" | "time" | "kanban" | "graph" | "tree";

const VIEWS: { id: ViewId; label: string; icon: (p: { className?: string }) => React.ReactNode }[] = [
  { id: "list", label: "لیستی", icon: (p) => <IconList {...p} /> },
  { id: "time", label: "زمانی", icon: (p) => <IconGantt {...p} /> },
  { id: "kanban", label: "کانبان", icon: (p) => <IconKanban {...p} /> },
  { id: "graph", label: "گراف", icon: (p) => <IconGraph {...p} /> },
  { id: "tree", label: "درختی", icon: (p) => <IconTree {...p} /> },
];

const STATUS_META: Record<string, { label: string; dot: string; text: string }> = {
  todo: { label: "برای انجام", dot: "bg-ink/25", text: "text-ink-soft" },
  doing: { label: "در حال انجام", dot: "bg-amber", text: "text-ink" },
  done: { label: "انجام شد", dot: "bg-verm", text: "text-verm" },
};

export default function SimPanel() {
  const [menu, setMenu] = useState<MenuId>("board");
  const [view, setView] = useState<ViewId>("list");

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* sticker */}
      <div className="absolute -top-6 right-4 sm:right-10 z-20 rotate-[-4deg] bg-amber border-[1.5px] border-ink rounded-full px-4 py-2 text-[11px] font-black shadow-[4px_4px_0_0_rgba(25,23,18,1)]">
        شبیه‌سازی زنده — کلیک کن!
      </div>

      {/* window frame */}
      <div className="rounded-2xl border-2 border-paper/20 bg-paper text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* title bar */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-ink text-paper border-b-2 border-ink">
          <div className="flex items-center gap-1.5" dir="ltr">
            <span className="w-3 h-3 rounded-full bg-verm" />
            <span className="w-3 h-3 rounded-full bg-amber" />
            <span className="w-3 h-3 rounded-full bg-pine-soft" />
          </div>
          <div className="text-xs font-bold text-paper/60 truncate" dir="ltr">
            app.finolo.ir/sprint-14
          </div>
          <div className="flex items-center gap-3">
            <span className="relative hidden sm:grid place-items-center w-8 h-8 rounded-full bg-paper/10">
              <IconBell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-verm border border-ink" />
            </span>
            <span className="w-8 h-8 grid place-items-center rounded-full bg-pine text-paper text-[11px] font-bold">س‌م</span>
          </div>
        </div>

        {/* body */}
        <div className="grid md:grid-cols-[200px_1fr] min-h-[480px]">
          {/* ---------- sidebar ---------- */}
          <aside className="bg-ink text-paper flex md:flex-col gap-1 p-3 overflow-x-auto md:overflow-visible min-w-0">
            {PANEL_MENU.map((m) => {
              const active = menu === m.id;
              const Icon =
                m.id === "dashboard" ? IconDashboard : m.id === "board" ? IconKanban : m.id === "analytics" ? IconChart : m.id === "team" ? IconUsers : IconClock;
              return (
                <button
                  key={m.id}
                  onClick={() => setMenu(m.id)}
                  className={`shrink-0 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    active ? "bg-verm text-paper shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]" : "text-paper/55 hover:text-paper hover:bg-paper/10 hover:-translate-x-0.5"
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "" : "text-paper/40 group-hover:text-amber transition-colors"}`} />
                  {m.label}
                  {m.count !== null && (
                    <span className={`ms-auto text-[10px] font-black rounded-full px-2 py-0.5 ${active ? "bg-paper text-verm" : "bg-paper/10 text-paper/70"}`}>
                      {faNum(m.count)}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="hidden md:flex mt-auto items-center gap-2.5 border-t border-paper/10 pt-4 px-1.5">
              <span className="relative w-9 h-9 grid place-items-center rounded-full bg-verm text-paper text-xs font-bold shrink-0">
                س‌م
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full bg-amber border-2 border-ink" />
              </span>
              <div className="text-[11px] leading-4 min-w-0">
                <strong className="block truncate">سارا محمدی</strong>
                <span className="text-paper/50">مدیر محصول</span>
              </div>
            </div>
          </aside>

          {/* ---------- content ---------- */}
          <div key={`${menu}-${view}`} className="panel-in p-5 sm:p-7 min-h-[460px] md:min-h-[500px] min-w-0">
            {menu === "dashboard" && <DashboardPanel />}
            {menu === "board" && <BoardPanel view={view} setView={setView} />}
            {menu === "analytics" && <AnalyticsPanel />}
            {menu === "team" && <TeamPanel />}
            {menu === "time" && <TimePanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Dashboard ================= */
function DashboardPanel() {
  const done = PANEL_TASKS.filter((t) => t.status === "done").length;
  const pct = Math.round((done / PANEL_TASKS.length) * 100);
  const R = 40;
  const C = 2 * Math.PI * R;

  return (
    <div>
      <PanelHead title="سلام سارا 👋" sub={`اسپرینت ۱۴ · هفتهٔ سوم از ۴ · ${faNum(6)} تسک فعال`} />

      <div className="mt-6 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
        <div className="relative w-28 h-28 mx-auto sm:mx-0" dir="ltr">
          <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90 progress-ring">
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(25,23,18,0.1)" strokeWidth="9" />
            <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-verm)" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C} />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-display text-xl tabular-nums">{faNum(pct)}٪</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { v: faNum(24), l: "تسکِ اسپرینت", cls: "bg-sage" },
            { v: faNum(38.5), l: "ساعتِ این هفته", cls: "bg-amber/60" },
            { v: faNum(2), l: "ددلاین نزدیک", cls: "bg-sky-soft" },
          ].map((k) => (
            <div key={k.l} className={`${k.cls} rounded-xl border-[1.5px] border-ink/15 p-3 text-center hover:-translate-y-1 transition-transform duration-300`}>
              <div className="font-display text-2xl leading-none tabular-nums">{k.v}</div>
              <div className="mt-1.5 text-[10.5px] font-bold text-ink-soft">{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <div>
          <h4 className="text-sm font-black flex items-center gap-2">
            <IconBolt className="w-4 h-4 text-verm" />
            فعالیت اخیر
          </h4>
          <ul className="mt-3 space-y-2.5">
            {[
              { who: "نیما", what: "«اتصال تقویم شمسی» را به در حال انجام برد", when: "۵ دقیقه پیش" },
              { who: "کاوه", what: "مستندات API را تکمیل کرد", when: "۱ ساعت پیش" },
              { who: "غزل", what: "۳ کامنت روی «طراحی صفحهٔ ورود» گذاشت", when: "۲ ساعت پیش" },
            ].map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[12.5px] leading-5 bg-paper-deep/60 border border-ink/10 rounded-lg p-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-verm mt-2 shrink-0" />
                <span>
                  <strong>{a.who}</strong> {a.what}
                  <span className="block text-[10.5px] text-ink-soft font-medium">{a.when}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black flex items-center gap-2">
            <IconChart className="w-4 h-4 text-pine" />
            بار کاری تیم
          </h4>
          <div className="mt-3 space-y-3">
            {TEAM_MEMBERS.slice(0, 4).map((m) => (
              <div key={m.name}>
                <div className="flex justify-between text-[11px] font-bold mb-1">
                  <span>{m.name}</span>
                  <span className="tabular-nums text-ink-soft">{faNum(m.load)}٪</span>
                </div>
                <div className="h-2.5 rounded-full bg-ink/10 overflow-hidden">
                  <div className={`h-full rounded-full ${m.load > 75 ? "bg-verm" : "bg-pine"}`} style={{ width: `${m.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Board (5 views) ================= */
function PanelHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="font-display text-2xl leading-none">{title}</h3>
        <p className="mt-1.5 text-xs font-semibold text-ink-soft">{sub}</p>
      </div>
      <button className="inline-flex items-center gap-1.5 bg-ink text-paper rounded-full px-4 py-2 text-xs font-bold hover:bg-verm transition-colors">
        <IconPlus className="w-3.5 h-3.5" />
        تسک جدید
      </button>
    </div>
  );
}

function BoardPanel({ view, setView }: { view: ViewId; setView: (v: ViewId) => void }) {
  return (
    <div className="min-w-0">
      <PanelHead title="بورد: ریلیز ۳٫۰" sub="همهٔ نماها روی یک دادهٔ واحد — فقط نگاه عوض می‌شود" />

      {/* view switcher */}
      <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-ink/10">
        {VIEWS.map((v) => {
          const active = view === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-t-lg px-3.5 py-2.5 text-xs font-bold border-b-[3px] transition-all duration-300 ${
                active ? "border-verm bg-ink text-paper shadow-[2px_2px_0_0_rgba(244,71,31,1)]" : "border-transparent text-ink-soft hover:text-ink hover:bg-paper-deep"
              }`}
            >
              {v.icon({ className: "w-4 h-4" })}
              {v.label}
            </button>
          );
        })}
      </div>

      <div key={view} className="panel-in mt-5">
        {view === "list" && <ListView />}
        {view === "time" && <TimeLineView />}
        {view === "kanban" && <MiniKanban />}
        {view === "graph" && <GraphView />}
        {view === "tree" && <TreeView />}
      </div>
    </div>
  );
}

function ListView() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-[12.5px]">
        <thead>
          <tr className="text-ink-soft text-[10.5px] font-black border-b-2 border-ink/15">
            <th className="text-start py-2 pe-3">تسک</th>
            <th className="text-start py-2 pe-3">وضعیت</th>
            <th className="text-start py-2 pe-3 hidden sm:table-cell">برچسب</th>
            <th className="text-start py-2 pe-3">ددلاین</th>
            <th className="text-start py-2 hidden sm:table-cell">مسئول</th>
          </tr>
        </thead>
        <tbody>
          {PANEL_TASKS.map((t) => {
            const st = STATUS_META[t.status];
            return (
              <tr key={t.id} className="border-b border-ink/8 hover:bg-paper-deep/70 transition-colors cursor-default">
                <td className="py-2.5 pe-3 font-bold">
                  <span className="inline-flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                    {t.title}
                  </span>
                </td>
                <td className={`py-2.5 pe-3 font-bold ${st.text}`}>{st.label}</td>
                <td className="py-2.5 pe-3 hidden sm:table-cell">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${t.tagCls}`}>{t.tag}</span>
                </td>
                <td className="py-2.5 pe-3 tabular-nums font-semibold text-ink-soft">{t.due}</td>
                <td className="py-2.5 hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-ink-soft">
                    <span className="w-5 h-5 grid place-items-center rounded-full bg-ink text-paper text-[9px] font-bold">{t.init}</span>
                    {t.who}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TimeLineView() {
  const weeks = Array.from({ length: 8 }, (_, i) => `ه${faNum(i + 1)}`);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="grid grid-cols-8 text-center text-[10px] font-black text-ink-soft border-b-2 border-ink/15 pb-2">
          {weeks.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="relative mt-2 space-y-2.5">
          <div className="absolute top-0 bottom-0 border-s-2 border-dashed border-verm/70" style={{ insetInlineStart: "55%" }} aria-hidden>
            <span className="absolute -top-1 right-0 translate-x-1/2 w-2 h-2 rounded-full bg-verm pulse-dot" />
          </div>
          {PANEL_TASKS.map((t, i) => {
            const st = STATUS_META[t.status];
            return (
              <div key={t.id} className="relative h-8 rounded-lg bg-paper-deep/60 border border-ink/8">
                <div
                  className={`gantt-bar in absolute top-1 bottom-1 rounded-md flex items-center px-2 text-[10px] font-black ${
                    t.status === "done" ? "bg-verm text-paper" : t.status === "doing" ? "bg-amber text-ink" : "bg-ink/15 text-ink"
                  }`}
                  style={{ insetInlineStart: `${(t.start / 8) * 100}%`, width: `${(t.len / 8) * 100}%`, animationDelay: `${i * 90}ms` }}
                >
                  <span className="truncate">{t.title}</span>
                </div>
                <span className="sr-only">{st.label}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10.5px] font-bold text-ink-soft flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-verm pulse-dot" />
          خط امروز · مهر ۱۴۰۴ — با درگ، کل برنامه جابه‌جا می‌شود
        </p>
      </div>
    </div>
  );
}

function MiniKanban() {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {(["todo", "doing", "done"] as const).map((col) => {
        const st = STATUS_META[col];
        const items = PANEL_TASKS.filter((t) => t.status === col);
        return (
          <div key={col} className="rounded-xl border-[1.5px] border-ink/15 bg-paper-deep/50 p-2.5">
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="inline-flex items-center gap-2 text-[12px] font-black">
                <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                {st.label}
              </span>
              <span className="text-[10px] font-bold text-ink-soft tabular-nums">{faNum(items.length)}</span>
            </div>
            <div className="space-y-2">
              {items.map((t) => (
                <div key={t.id} className="bg-paper border-[1.5px] border-ink/70 rounded-lg p-2.5 hover:border-ink hover:-translate-y-0.5 transition-all cursor-grab">
                  <div className="flex items-start justify-between gap-1">
                    <p className={`text-[11.5px] font-bold leading-4 ${col === "done" ? "line-through text-ink-soft" : ""}`}>{t.title}</p>
                    <IconGrip className="w-3 h-3 text-ink/25 shrink-0" />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${t.tagCls}`}>{t.tag}</span>
                    <span className="text-[9px] font-bold text-ink-soft tabular-nums">{t.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GraphView() {
  const nodes = [
    { id: "a", label: "طراحی", x: 86, y: 60, r: 26, cls: "fill-sage", active: false },
    { id: "b", label: "توسعه", x: 240, y: 42, r: 30, cls: "fill-amber", active: true },
    { id: "c", label: "تست", x: 240, y: 140, r: 24, cls: "fill-sky-soft", active: false },
    { id: "d", label: "رلیز", x: 396, y: 92, r: 26, cls: "fill-verm", active: false },
  ];
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 480 190" className="w-full min-w-[480px]" fontFamily="'Yekan Bakh','Vazirmatn',sans-serif">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="rgba(25,23,18,0.45)" />
          </marker>
        </defs>
        {/* edges — RTL flows right to left */}
        <line x1="112" y1="56" x2="208" y2="45" stroke="rgba(25,23,18,0.45)" strokeWidth="2" markerEnd="url(#arr)" />
        <line x1="104" y1="82" x2="218" y2="128" stroke="rgba(25,23,18,0.45)" strokeWidth="2" markerEnd="url(#arr)" />
        <line x1="270" y1="48" x2="372" y2="86" stroke="rgba(25,23,18,0.45)" strokeWidth="2" markerEnd="url(#arr)" />
        <line x1="264" y1="136" x2="372" y2="100" stroke="rgba(25,23,18,0.45)" strokeWidth="2" markerEnd="url(#arr)" />
        {/* critical path */}
        <path d="M112 56 C 160 40, 180 42, 208 45 S 320 70, 372 86" fill="none" stroke="var(--color-verm)" strokeWidth="2.5" className="dash-live" />

        {nodes.map((n) => (
          <g key={n.id} className="cursor-pointer">
            <circle cx={n.x} cy={n.y} r={n.r + 5} fill="none" stroke={n.active ? "var(--color-verm)" : "rgba(25,23,18,0.15)"} strokeWidth="1.5" strokeDasharray={n.active ? "4 4" : "none"} />
            <circle cx={n.x} cy={n.y} r={n.r} className={n.cls} stroke="rgba(25,23,18,0.8)" strokeWidth="1.5" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--color-ink)">
              {n.label}
            </text>
          </g>
        ))}
        <text x="128" y="178" fontSize="10" fontWeight="700" fill="var(--color-verm)">
          — — مسیر بحرانی: طراحی ← توسعه ← رلیز
        </text>
      </svg>
      <p className="mt-2 text-[10.5px] font-bold text-ink-soft">روی نودها کلیک کن تا زیرمجموعه‌ها جمع شوند · فلش‌ها وابستگی را نشان می‌دهند</p>
    </div>
  );
}

function TreeView() {
  const [open, setOpen] = useState<Record<string, boolean>>({ design: true, dev: true, qa: false });
  const groups = [
    { id: "design", label: "طراحی", cls: "bg-sage", tasks: PANEL_TASKS.filter((t) => t.tag === "طراحی" || t.id === 1) },
    { id: "dev", label: "توسعه", cls: "bg-amber/70", tasks: PANEL_TASKS.filter((t) => t.tag === "توسعه" || t.tag === "عملکرد" || t.id === 6) },
    { id: "qa", label: "تست و مستندات", cls: "bg-sky-soft", tasks: PANEL_TASKS.filter((t) => t.tag === "تست" || t.tag === "مستندات") },
  ];
  return (
    <div className="space-y-3 max-h-[340px] overflow-y-auto pe-1">
      {groups.map((g) => {
        const isOpen = open[g.id];
        const doneCount = g.tasks.filter((t) => t.status === "done").length;
        return (
          <div key={g.id} className="rounded-xl border-[1.5px] border-ink/15 overflow-hidden">
            <button onClick={() => setOpen((o) => ({ ...o, [g.id]: !o[g.id] }))} className="w-full flex items-center justify-between gap-3 bg-paper-deep/70 px-4 py-3 hover:bg-paper-deep transition-colors">
              <span className="inline-flex items-center gap-2.5 text-[13px] font-black">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
                  <path d="m9 6 6 6-6 6" />
                </svg>
                <span className={`w-2.5 h-2.5 rounded-sm ${g.cls}`} />
                {g.label}
              </span>
              <span className="text-[10.5px] font-bold text-ink-soft tabular-nums">
                {faNum(doneCount)}/{faNum(g.tasks.length)} تکمیل
              </span>
            </button>
            {isOpen && (
              <div className="divide-y divide-ink/6" dir="rtl">
                {g.tasks.map((t) => {
                  const st = STATUS_META[t.status];
                  return (
                    <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 ms-6 border-s-2 border-ink/10 hover:bg-paper-deep/50 transition-colors">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                      <span className={`text-[12px] font-bold flex-1 ${t.status === "done" ? "line-through text-ink-soft" : ""}`}>{t.title}</span>
                      <span className="w-6 h-6 grid place-items-center rounded-full bg-ink text-paper text-[9px] font-bold">{t.init}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================= Analytics ================= */
function AnalyticsPanel() {
  const bars = [34, 52, 41, 66, 58, 74, 69, 88];
  const max = Math.max(...bars);
  return (
    <div>
      <PanelHead title="تحلیل‌های زنده" sub="سرعت تیم، نرخ تکمیل و گلوگاه‌ها — بدون اکسل" />

      <div className="mt-6 grid sm:grid-cols-[1.4fr_1fr] gap-6">
        <div className="rounded-xl border-[1.5px] border-ink/15 bg-paper-deep/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-black">تسک‌های تکمیل‌شدهٔ هفتگی</span>
            <span className="text-[10px] font-bold text-pine bg-sage rounded-full px-2 py-0.5">▲ ۲۴٪</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default">
                <span className="text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">{faNum(b)}</span>
                <div
                  className={`w-full rounded-t-md transition-all duration-300 group-hover:brightness-110 ${i === bars.length - 1 ? "bg-verm" : "bg-pine"}`}
                  style={{ height: `${(b / max) * 100}%` }}
                />
                <span className="text-[8.5px] font-bold text-ink-soft">ه{faNum(i + 1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border-[1.5px] border-ink/15 bg-paper-deep/50 p-4">
            <span className="text-[12px] font-black">توزیع وضعیت تسک‌ها</span>
            <div className="mt-3 flex items-center gap-4">
              <svg viewBox="0 0 42 42" className="w-20 h-20 -rotate-90">
                <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(25,23,18,0.1)" strokeWidth="6" />
                <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-verm)" strokeWidth="6" strokeDasharray="33 67" strokeDashoffset="0" />
                <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-amber)" strokeWidth="6" strokeDasharray="34 66" strokeDashoffset="-33" />
                <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--color-pine)" strokeWidth="6" strokeDasharray="33 67" strokeDashoffset="-67" />
              </svg>
              <div className="space-y-1.5 text-[10.5px] font-bold">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-verm" /> انجام شد ۳۳٪</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-amber" /> در حال انجام ۳۴٪</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-pine" /> برای انجام ۳۳٪</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { v: "۹۲٪", l: "تحویل سرِ وقت" },
              { v: "۴٫۲", l: "روز، میانگین چرخه" },
              { v: "۰", l: "گلوگاه باز" },
            ].map((k) => (
              <div key={k.l} className="rounded-xl border-[1.5px] border-ink/15 bg-paper p-3 text-center hover:-translate-y-1 hover:border-ink transition-all duration-300">
                <div className="font-display text-xl tabular-nums">{k.v}</div>
                <div className="mt-1 text-[9.5px] font-bold text-ink-soft leading-4">{k.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Team ================= */
function TeamPanel() {
  return (
    <div>
      <PanelHead title="تیم محصول" sub={`${faNum(5)} عضو · ۳ آنلاین — ظرفیت این هفته: ۷۸٪`} />
      <div className="mt-6 grid sm:grid-cols-2 gap-3.5">
        {TEAM_MEMBERS.map((m) => (
          <div key={m.name} className="flex items-center gap-3.5 rounded-xl border-[1.5px] border-ink/15 bg-paper-deep/50 p-3.5 hover:border-ink hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            <span className={`relative w-11 h-11 shrink-0 grid place-items-center rounded-full text-xs font-bold text-paper ${m.cls}`}>
              {m.init}
              <span className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-paper ${m.online ? "bg-verm" : "bg-ink/25"}`} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-[13px] truncate">{m.name}</strong>
                <span className="text-[10px] font-bold text-ink-soft tabular-nums shrink-0">{faNum(m.load)}٪</span>
              </div>
              <span className="block text-[10.5px] font-semibold text-ink-soft">{m.role}</span>
              <div className="mt-1.5 h-1.5 rounded-full bg-ink/10 overflow-hidden">
                <div className={`h-full rounded-full ${m.load > 75 ? "bg-verm" : "bg-pine"}`} style={{ width: `${m.load}%` }} />
              </div>
            </div>
          </div>
        ))}
        <button className="flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-ink/30 text-[12.5px] font-bold text-ink-soft hover:text-ink hover:border-ink hover:bg-paper-deep/50 transition-all duration-300 min-h-[84px]">
          <IconPlus className="w-4 h-4" />
          دعوت عضو جدید
        </button>
      </div>
    </div>
  );
}

/* ================= Time ================= */
function TimePanel() {
  const total = TIME_ROWS.reduce((s, r) => s + r.hours, 0);
  const billable = TIME_ROWS.filter((r) => r.billable).reduce((s, r) => s + r.hours, 0);
  return (
    <div>
      <PanelHead title="ثبت زمان" sub={`این هفته: ${faNum(total)} ساعت · قابل‌صورتحساب: ${faNum(billable)} ساعت`} />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[540px] text-[12.5px]">
          <thead>
            <tr className="text-ink-soft text-[10.5px] font-black border-b-2 border-ink/15">
              <th className="text-start py-2 pe-3">روز</th>
              <th className="text-start py-2 pe-3">عضو</th>
              <th className="text-start py-2 pe-3 hidden sm:table-cell">تسک</th>
              <th className="text-start py-2 pe-3">ساعت</th>
              <th className="text-start py-2">صورتحساب</th>
            </tr>
          </thead>
          <tbody>
            {TIME_ROWS.map((r) => (
              <tr key={r.day} className={`border-b border-ink/8 hover:bg-paper-deep/70 transition-colors ${r.hours >= 8 ? "bg-amber/10" : ""}`}>
                <td className="py-2.5 pe-3 font-black">{r.day}</td>
                <td className="py-2.5 pe-3 font-semibold">{r.person}</td>
                <td className="py-2.5 pe-3 text-ink-soft hidden sm:table-cell">{r.task}</td>
                <td className="py-2.5 pe-3 font-black tabular-nums">
                  {r.hours.toLocaleString("fa-IR")}
                  {r.hours >= 8 && <span className="ms-1.5 text-[9px] font-black text-verm-deep bg-verm/10 rounded-full px-1.5 py-0.5">فول‌تایم</span>}
                </td>
                <td className="py-2.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black rounded-full px-2 py-0.5 ${r.billable ? "bg-sage text-pine" : "bg-paper-deep text-ink-soft"}`}>
                    {r.billable ? "بله" : "داخلی"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[11px] font-bold text-ink-soft">
        <IconClock className="w-4 h-4 text-verm" />
        تایمرِ داخلی با یک کلیک شروع می‌شود و گزارش ریالیِ قابل‌صورتحساب می‌سازد.
      </div>
    </div>
  );
}
