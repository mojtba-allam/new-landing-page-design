import { useRef, useState } from "react";
import { useI18n, tr, num, type Pair } from "../lib/i18n";
import { IconBell, IconGrip, IconPlus } from "./Icons";
import { KANBAN_COLS, KANBAN_TASKS, L, type KanbanCol, type KanbanTask } from "../data";

const TAGS: { label: Pair; cls: string }[] = [
  { label: { fa: "طراحی", en: "Design" }, cls: "bg-sage text-ink" },
  { label: { fa: "توسعه", en: "Dev" }, cls: "bg-amber/70 text-ink" },
  { label: { fa: "تست", en: "QA" }, cls: "bg-sky-soft text-ink" },
  { label: { fa: "مستندات", en: "Docs" }, cls: "bg-paper-deep text-ink-soft" },
];

const S = {
  live: { fa: "زنده", en: "LIVE" },
  placeholder: { fa: "تسک جدید بنویس و اینتر بزن…", en: "Type a task and hit enter…" },
  changeTag: { fa: "تغییر برچسب", en: "Change tag" },
  add: { fa: "افزودن تسک", en: "Add task" },
  empty: { fa: "کارتی اینجا رها کن", en: "Drop a card here" },
  swipe: { fa: "برای دیدن ستون‌ها، بورد را بکش", en: "Swipe the board to see all columns" },
  prev: { fa: "به ستون قبلی", en: "Previous column" },
  next: { fa: "به ستون بعدی", en: "Next column" },
  del: { fa: "حذف تسک", en: "Delete task" },
  you: { fa: "شما", en: "You" },
  sprint: { fa: "اسپرینت ۱۴", en: "Sprint 14" },
  sprintSub: { fa: "«ریلیز نسخهٔ ۲٫۴»", en: "“Release 2.4”" },
  celebrate: { fa: "تسک را به «انجام شد» بکش!", en: "Drag a card to “Done”!" },
};

export default function Kanban() {
  const { isFa } = useI18n();
  const [tasks, setTasks] = useState<KanbanTask[]>(KANBAN_TASKS);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<KanbanCol | null>(null);
  const [title, setTitle] = useState("");
  const [tagIdx, setTagIdx] = useState(0);
  const [celebrate, setCelebrate] = useState(0);
  const idRef = useRef(100);

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.col === "done").length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const move = (id: number, col: KanbanCol) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, col } : t)));
  };

  const onDrop = (col: KanbanCol) => {
    if (dragId !== null) {
      const task = tasks.find((t) => t.id === dragId);
      if (task && task.col !== col && col === "done") setCelebrate((c) => c + 1);
      move(dragId, col);
    }
    setDragId(null);
    setOverCol(null);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks((prev) => [
      {
        id: ++idRef.current,
        title: { fa: title.trim(), en: title.trim() },
        col: "todo",
        tag: TAGS[tagIdx].label,
        tagCls: TAGS[tagIdx].cls,
        who: { fa: "شما", en: "You" },
      },
      ...prev,
    ]);
    setTitle("");
  };

  const removeTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <div className="rounded-2xl border-2 border-ink bg-paper shadow-[10px_10px_0_0_rgba(25,23,18,1)] overflow-hidden max-w-full">
      {/* window chrome */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b-2 border-ink bg-paper-deep">
        <div className="flex items-center gap-1.5" dir="ltr">
          <span className="w-3 h-3 rounded-full bg-verm border border-ink" />
          <span className="w-3 h-3 rounded-full bg-amber border border-ink" />
          <span className="w-3 h-3 rounded-full bg-pine border border-ink" />
        </div>
        <div className="text-xs font-bold text-ink-soft truncate" dir="ltr">
          app.finolo.ir/b/sprint-14
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black text-pine bg-sage border border-ink rounded-full px-2.5 py-1">
          <span className="relative flex w-1.5 h-1.5">
            <span className="pulse-dot absolute inline-flex w-full h-full rounded-full bg-pine" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-pine" />
          </span>
          {tr(S.live)}
        </div>
      </div>

      {/* add task */}
      <form onSubmit={addTask} className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-ink/10">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={tr(S.placeholder)}
          className="flex-1 min-w-0 bg-paper-deep/70 border-[1.5px] border-ink/20 focus:border-ink rounded-xl px-3.5 py-2 text-sm outline-none placeholder:text-ink-soft/60 transition-colors"
        />
        <button
          type="button"
          onClick={() => setTagIdx((i) => (i + 1) % TAGS.length)}
          title={tr(S.changeTag)}
          className={`h-9 px-3 rounded-xl border-[1.5px] border-ink text-xs font-bold transition-all active:scale-90 ${TAGS[tagIdx].cls}`}
        >
          {tr(TAGS[tagIdx].label)}
        </button>
        <button
          type="submit"
          aria-label={tr(S.add)}
          className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-verm text-paper hover:bg-ink transition-colors active:scale-90 duration-200"
        >
          <IconPlus className="w-4 h-4" />
        </button>
      </form>

      {/* board — horizontal scroll on small screens */}
      <div className="overflow-x-auto overscroll-x-contain lg:overflow-visible">
        <div className="grid grid-cols-3 gap-3 p-4 sm:p-5 min-w-[620px] lg:min-w-0" dir={isFa ? "rtl" : "ltr"}>
          {KANBAN_COLS.map((col) => {
            const colTasks = tasks.filter((t) => t.col === col.id);
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverCol(col.id);
                }}
                onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
                onDrop={() => onDrop(col.id)}
                className={`drop-col rounded-xl border-[1.5px] border-ink/15 bg-paper-deep/50 p-2.5 min-h-[190px] ${overCol === col.id ? "over" : ""}`}
              >
                <div className="flex items-center justify-between px-1.5 pb-2">
                  <div className="flex items-center gap-2 text-[13px] font-black">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    {tr(col.title)}
                  </div>
                  <span className="text-[11px] font-bold text-ink-soft bg-paper border border-ink/15 rounded-full px-2 tabular-nums">
                    {num(colTasks.length)}
                  </span>
                </div>
                <div className="space-y-2">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverCol(null);
                      }}
                      className={`kanban-card group bg-paper border-[1.5px] border-ink/80 rounded-lg p-2.5 shadow-[2px_2px_0_0_rgba(25,23,18,0.12)] hover:border-ink hover:shadow-[3px_3px_0_0_rgba(25,23,18,0.2)] transition-all ${
                        dragId === t.id ? "dragging" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <p className={`text-[12.5px] font-bold leading-5 ${t.col === "done" ? "line-through text-ink-soft" : ""}`}>{tr(t.title)}</p>
                        <IconGrip className="w-3.5 h-3.5 text-ink/30 shrink-0 mt-0.5" />
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 bg-pine text-paper`}>{tr(t.tag)}</span>
                        <span className="w-6 h-6 grid place-items-center rounded-full bg-ink text-paper text-[9px] font-bold">{tr(t.who)[0]}</span>
                      </div>
                      {/* touch-friendly actions */}
                      <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 max-lg:opacity-100 transition-opacity">
                        {col.id !== "todo" && (
                          <button
                            onClick={() => move(t.id, col.id === "done" ? "doing" : "todo")}
                            title={tr(S.prev)}
                            className="flex-1 h-6 grid place-items-center rounded-md border border-ink/15 hover:bg-amber text-[10px] font-bold transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`w-3 h-3 ${isFa ? "" : "rotate-180"}`}>
                              <path d="m9 6 6 6-6 6" />
                            </svg>
                          </button>
                        )}
                        {col.id !== "done" && (
                          <button
                            onClick={() => {
                              if (col.id !== "done") setCelebrate((c) => c + 1);
                              move(t.id, col.id === "todo" ? "doing" : "done");
                            }}
                            title={tr(S.next)}
                            className="flex-1 h-6 grid place-items-center rounded-md border border-ink/15 hover:bg-verm hover:text-paper text-[10px] font-bold transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`w-3 h-3 ${isFa ? "" : "rotate-180"}`}>
                              <path d="m15 6-6 6 6 6" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => removeTask(t.id)}
                          title={tr(S.del)}
                          className="w-6 h-6 grid place-items-center rounded-md border border-ink/15 hover:bg-ink hover:text-paper transition-colors text-[11px] font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-center text-[11px] text-ink-soft/70 font-medium py-6 border-[1.5px] border-dashed border-ink/20 rounded-lg">
                      {tr(S.empty)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* mobile swipe hint */}
      <div className="lg:hidden flex items-center justify-center gap-2 pb-3 text-[11px] font-bold text-ink-soft">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
        </svg>
        {tr(S.swipe)}
      </div>

      {/* footer: progress */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5 border-t-2 border-ink bg-paper-deep">
        <div className="relative w-16 h-16 shrink-0" dir="ltr">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90 progress-ring">
            <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(25,23,18,0.12)" strokeWidth="7" />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="var(--color-verm)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - (pct / 100) * C}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[11px] font-black tabular-nums">
            {num(pct)}
            {isFa ? "٪" : "%"}
          </span>
        </div>
        <div className="flex-1 text-[12px] font-bold text-ink-soft leading-5">
          <strong className="text-ink">{tr(S.sprint)}</strong> — {tr(S.sprintSub)}
          <span className="block font-medium">
            {isFa ? `${num(doneCount)} از ${num(total)} تسک انجام شده` : `${num(doneCount)} of ${num(total)} tasks done`}
          </span>
        </div>
        <span key={celebrate} className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-black bg-amber border border-ink rounded-full px-3 py-1.5 rotate-2">
          <IconBell className="w-3.5 h-3.5" />
          {tr(S.celebrate)}
        </span>
      </div>
    </div>
  );
}
