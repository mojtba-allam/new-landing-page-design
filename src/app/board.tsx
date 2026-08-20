import { useMemo, useState } from "react";
import {
  useApp, Ic, Btn, Menu, Modal, Drawer, Tabs, Seg, Toggle, Field, inputCls, Badge, StatusPill,
  PriorityDot, Avatar, Bar, Empty, Loading, ErrorBox, Denied403, USERS, STATUS_META, PRIORITY_META,
  PROJECTS, SECTIONS, type Task, type StatusId, L,
} from "./core";
import { tr } from "../lib/i18n";

/* ================= BOARD SCREEN ================= */
export function BoardScreen() {
  const app = useApp();
  const project = PROJECTS.find((p) => p.id === (app.params.project ?? "p1")) ?? PROJECTS[0];
  const [view, setView] = useState<"kanban" | "list" | "tree" | "graph" | "calendar" | "timeline">("kanban");
  const [q, setQ] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [modal, setModal] = useState<null | { kind: string; col?: string; section?: string; task?: string; rename?: { id: string; kind: "column" | "section"; name: string } }>(null);
  const [settingsTab, setSettingsTab] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [activityFor, setActivityFor] = useState<Task | null>(null);
  const [cicdOpen, setCicdOpen] = useState(true);

  const { t, can, upgrade, role, vstate } = app;
  const isOwner = role === "owner";
  const deleted = project.deleted || vstate === "error";

  const tasks = app.tasks.filter((tk) => (q.trim() === "" ? true : tr(tk.title).toLowerCase().includes(q.trim().toLowerCase())));

  const headerMenu = [
    can("create_section") && !deleted ? { label: t("addSection"), icon: "plus", onClick: () => setModal({ kind: "section" }) } : null,
    can("create_section") && !deleted ? { label: t("importSection"), icon: "download", onClick: () => (upgrade("import_export") || setModal({ kind: "import", section: "s1" })) } : null,
    isOwner && !deleted ? { label: t("exportProject"), icon: "download", onClick: () => (upgrade("import_export") || app.toast("project.json ↓")) } : null,
    !deleted ? { label: t("shareLink"), icon: "link", onClick: () => (upgrade("public_share_links") || setShareOpen(true)) } : null,
    { label: t("info"), icon: "eye", onClick: () => setInfoOpen((v) => !v) },
    (isOwner || app.role === "member" && false) && !deleted ? { label: t("projectSettings"), icon: "gear", onClick: () => setSettingsTab("details") } : null,
  ].filter(Boolean) as { label: string; icon: string; onClick: () => void }[];

  if (vstate === "denied") return <div className="p-6"><Denied403 /></div>;

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* board header */}
      <div className="px-4 sm:px-6 pt-4 pb-3 flex flex-wrap items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-[4px]" style={{ background: project.color }} />
            <h1 className="font-semibold text-[19px] truncate">{tr(project.name)}</h1>
            <Badge tone={project.status === "Active" ? "green" : project.status === "Archived" ? "neutral" : "amber"}>{project.status}</Badge>
            {role === "observer" && <Badge tone="purple">{tr(L("ناظر — فقط خواندنی", "Observer — read only"))}</Badge>}
          </div>
          <p className="text-[12px] text-ink-soft mt-0.5">{tr(L("بورد با ۶ نما — داده یکی است، نگاه متفاوت", "One board, six lenses"))}</p>
        </div>
        <div className="ms-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Ic n="search" className="w-4 h-4 absolute start-2.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchTasks")}
              className="h-9 w-44 lg:w-56 ps-8 pe-3 rounded-lg bg-ink/5 text-[13px] outline-none border border-transparent focus:border-verm focus:bg-paper transition-all" />
          </div>
          <Menu align="end" label={t("projectSettings")} items={headerMenu} />
        </div>
      </div>

      {deleted && (
        <div className="mx-4 sm:mx-6 mb-3 rounded-xl border border-[#E2811A]/40 bg-[#E2811A]/10 px-4 py-3 flex items-center gap-3 text-[13px] font-medium text-[#974F0C]" role="alert">
          <Ic n="warn" className="w-4 h-4 shrink-0" />
          {t("readNote")}
        </div>
      )}

      {/* view switcher + cicd */}
      <div className="px-4 sm:px-6 flex flex-wrap items-center gap-3 pb-3">
        <Seg
          value={view}
          onChange={setView}
          options={[
            { v: "kanban", label: t("kanban") }, { v: "list", label: t("list") }, { v: "tree", label: t("tree") },
            { v: "graph", label: t("graph") }, { v: "calendar", label: t("calendar") }, { v: "timeline", label: t("timeline") },
          ]}
        />
        <button onClick={() => setCicdOpen((v) => !v)}
          className="ms-auto inline-flex items-center gap-2 text-[12.5px] font-medium text-ink-soft hover:text-ink transition-colors">
          <Ic n="bolt" className="w-4 h-4 text-[#1F845A]" />
          CI/CD
          <Ic n="chevD" className={`w-3.5 h-3.5 transition-transform ${cicdOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {cicdOpen && <CicdPanel openSettings={() => setSettingsTab("integrations")} />}

      {/* content */}
      <div className="flex-1 min-h-0 px-4 sm:px-6 pb-6">
        {vstate === "loading" ? (
          <Loading label={t("loading")} />
        ) : view === "kanban" ? (
          <KanbanView tasks={tasks} openModal={setModal} deleted={deleted} openTask={app.openTask} activityFor={setActivityFor} />
        ) : view === "list" ? (
          <ListView tasks={tasks} />
        ) : view === "tree" ? (
          <TreeView tasks={tasks} />
        ) : view === "graph" ? (
          <GraphView tasks={tasks} />
        ) : view === "calendar" ? (
          <CalendarView tasks={tasks} />
        ) : (
          <TimelineView tasks={tasks} />
        )}
      </div>

      {/* overlays */}
      {modal?.kind === "section" && <NameModal title={t("addSection")} placeholder={tr(L("نام بخش", "Section name"))} cta={t("addSection")} onClose={() => setModal(null)} onSubmit={(name) => { app.setSections((s) => [...s, { id: `s${Date.now()}`, name: L(name, name), columns: [] }]); app.toast(`«${name}» ✓`); }} />}
      {modal?.kind === "column" && <NameModal title={`${t("addColumn")} — ${modal.section}`} placeholder={tr(L("نام ستون", "Column name"))} cta={t("addColumn")} onClose={() => setModal(null)} onSubmit={(name) => { app.setSections((s) => s.map((sec) => (sec.id === modal.section ? { ...sec, columns: [...sec.columns, { id: `c${Date.now()}`, name: L(name, name), tasks: [] }] } : sec))); }} />}
      {modal?.kind === "task" && <AddTaskModal col={modal.col!} onClose={() => setModal(null)} />}
      {modal?.kind === "rename" && <NameModal title={t("rename")} placeholder="" initial={modal.rename?.name} cta={t("save")} onClose={() => setModal(null)} onSubmit={(name) => { app.setSections((s) => s.map((sec) => modal.rename!.kind === "section" ? { ...sec, name: L(name, name) } : { ...sec, columns: sec.columns.map((c) => (c.id === modal.rename!.id ? { ...c, name: L(name, name) } : c)) })); }} />}
      {modal?.kind === "confirmDelete" && (
        <Modal title={t("delete")} onClose={() => setModal(null)} footer={
          <>
            <Btn variant="subtle" onClick={() => setModal(null)}>{t("cancel")}</Btn>
            <Btn variant="danger" onClick={() => { app.setSections((s) => s.filter((sec) => sec.columns.every((c) => !modal.task || true) && sec.id !== modal.section).map((sec) => ({ ...sec, columns: sec.columns.filter((c) => c.id !== modal.section) }))); setModal(null); }}>{t("delete")}</Btn>
          </>
        }>
          <p className="text-sm text-ink-soft leading-7">{tr(L("این عمل قابل بازگشت نیست. ادامه می‌دهید؟", "This action cannot be undone. Continue?"))}</p>
        </Modal>
      )}
      {modal?.kind === "import" && <ImportModal onClose={() => setModal(null)} />}

      {paramsTask(app) && <TaskDrawer taskId={paramsTask(app)!} onClose={() => app.go("board", { project: project.id })} activityFor={setActivityFor} />}

      {settingsTab && <ProjectSettingsModal tab={settingsTab} setTab={setSettingsTab} onClose={() => setSettingsTab(null)} />}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      {activityFor && <ActivityModal task={activityFor} onClose={() => setActivityFor(null)} />}
      {infoOpen && <InfoSidebar onClose={() => setInfoOpen(false)} project={project} />}
    </div>
  );
}

const paramsTask = (app: ReturnType<typeof useApp>) => app.params.task ?? null;

/* ================= KANBAN ================= */
function KanbanView({ tasks, openModal, deleted, openTask, activityFor }: any) {
  const app = useApp();
  const { can, role, upgrade } = app;
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  if (app.sections.length === 0)
    return <Empty icon="grid" title={app.t("emptyBoard")} action={can("create_section") ? <Btn variant="primary" onClick={() => openModal({ kind: "section" })}><Ic n="plus" className="w-4 h-4" />{app.t("addSection")}</Btn> : undefined} />;

  const drop = (colId: string) => {
    if (!dragId || role === "observer") return;
    app.setSections((secs) => secs.map((s) => ({ ...s, columns: s.columns.map((c) => ({ ...c, tasks: c.tasks.filter((id) => id !== dragId) })) })));
    app.setSections((secs) => secs.map((s) => ({ ...s, columns: s.columns.map((c) => (c.id === colId ? { ...c, tasks: [...c.tasks, dragId] } : c)) })));
    setDragId(null); setOverCol(null);
  };

  return (
    <div className="h-full overflow-x-auto overscroll-x-contain">
      <div className="flex gap-4 items-start min-h-full min-w-max lg:min-w-0 pb-2">
        {app.sections.map((sec) => (
          <div key={sec.id} className="w-[300px] lg:w-auto lg:flex-1 min-w-[250px] shrink-0">
            <div className="flex items-center justify-between px-1 mb-2">
              <h3 className="font-semibold text-[14px]">{tr(sec.name)}</h3>
              <Menu items={[
                can("create_column") && !deleted ? { label: app.t("addColumn"), icon: "plus", onClick: () => openModal({ kind: "column", section: sec.id }) } : null,
                can("create_column") && !deleted ? { label: app.t("importColumn"), icon: "download", onClick: () => (upgrade("import_export") || openModal({ kind: "import" })) } : null,
                can("edit_section") && !deleted ? { label: app.t("rename"), icon: "pen", onClick: () => openModal({ kind: "rename", section: sec.id, rename: { id: sec.id, kind: "section", name: tr(sec.name) } }) } : null,
                !deleted ? { label: app.t("exportSection"), icon: "download", onClick: () => (upgrade("import_export") || app.toast("section.json ↓")) } : null,
                can("delete_section") && !deleted ? { label: tr(L("حذف بخش", "Delete section")), icon: "trash", danger: true, onClick: () => openModal({ kind: "confirmDelete", section: sec.id }) } : null,
              ].filter(Boolean) as any} />
            </div>
            <div className="space-y-4">
              {sec.columns.map((col) => {
                const colTasks = col.tasks.map((id) => tasks.find((t: Task) => t.id === id)).filter(Boolean) as Task[];
                return (
                  <div key={col.id}
                    onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
                    onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
                    onDrop={() => drop(col.id)}
                    className={`app-card p-3 transition-all duration-200 ${overCol === col.id ? "border-verm! bg-verm/[0.05] app-shadow-med" : ""}`}>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="inline-flex items-center gap-2 text-[13px] font-semibold">
                        {tr(col.name)}
                        <span className="text-[11px] font-medium text-ink-soft bg-ink/6 rounded-full px-1.5 tabular-nums">{colTasks.length}</span>
                      </span>
                      <Menu items={[
                        can("create_task") && !deleted ? { label: tr(L("افزودن تسک", "Add task")), icon: "plus", onClick: () => openModal({ kind: "task", col: col.id }) } : null,
                        can("edit_column") && !deleted ? { label: app.t("rename"), icon: "pen", onClick: () => openModal({ kind: "rename", section: sec.id, rename: { id: col.id, kind: "column", name: tr(col.name) } }) } : null,
                        !deleted ? { label: app.t("exportJson"), icon: "download", onClick: () => (upgrade("import_export") || app.toast("column.json ↓")) } : null,
                        can("delete_column") && !deleted ? { label: tr(L("حذف ستون", "Delete column")), icon: "trash", danger: true, onClick: () => openModal({ kind: "confirmDelete", section: col.id }) } : null,
                      ].filter(Boolean) as any} />
                    </div>
                    <div className="space-y-2 min-h-[40px]">
                      {colTasks.map((tk) => (
                        <TaskCard key={tk.id} tk={tk} draggable={can("move_task") && !deleted} onDrag={() => setDragId(tk.id)} onOpen={() => openTask(tk.id)} onActivity={() => activityFor(tk)} canEdit={can("edit_task") && !deleted} canDelete={can("delete_task") && !deleted} />
                      ))}
                      {colTasks.length === 0 && <div className="text-center text-[12px] text-ink-soft border border-dashed border-ink/15 rounded-lg py-4">{tr(L("کارتی اینجا رها کنید", "Drop a card here"))}</div>}
                      {can("create_task") && !deleted && col.id === "c1" && null}
                    </div>
                    {can("create_task") && !deleted && (
                      <button onClick={() => openModal({ kind: "task", col: col.id })}
                        className="mt-2.5 w-full h-8 rounded-lg border border-dashed border-ink/20 text-[12.5px] font-medium text-ink-soft hover:text-verm hover:border-verm hover:bg-verm/[0.04] transition-all duration-150 inline-flex items-center justify-center gap-1.5">
                        <Ic n="plus" className="w-3.5 h-3.5" /> {app.t("addTask").replace("+ ", "")}
                      </button>
                    )}
                  </div>
                );
              })}
              {sec.columns.length === 0 && <div className="app-card border-dashed! p-4 text-center text-[12.5px] text-ink-soft">{app.t("emptyCols")}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ tk, draggable, onDrag, onOpen, onActivity, canEdit, canDelete }: any) {
  const app = useApp();
  const assignees = tk.assignees.map((id: string) => USERS.find((u) => u.id === id)!).filter(Boolean);
  return (
    <div draggable={draggable} onDragStart={onDrag} onClick={onOpen}
      className={`group app-card p-3 cursor-pointer transition-all duration-150 hover:app-shadow-med hover:-translate-y-0.5 ${draggable ? "active:cursor-grabbing" : ""} ${tk.blocked ? "border-[#C9372C]/40!" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className={`text-[13.5px] font-medium leading-5 ${tk.status === "completed" ? "line-through text-ink-soft" : ""}`}>{tr(tk.title)}</p>
        <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <Menu items={[
            { label: app.t("open"), icon: "eye", onClick: onOpen },
            { label: app.t("viewAllActivity"), icon: "timer", onClick: onActivity },
            canEdit ? { label: app.t("edit"), icon: "pen", onClick: onOpen } : null,
            canDelete ? { label: app.t("delete"), icon: "trash", danger: true, onClick: () => app.toast("🗑 " + tr(tk.title)) } : null,
          ].filter(Boolean) as any} />
        </div>
      </div>
      <div className="mt-2.5 flex items-center flex-wrap gap-1.5">
        <StatusPill s={tk.status} />
        <PriorityDot p={tk.priority} withLabel={false} />
        {tk.recurring && <Ic n="refresh" className="w-3.5 h-3.5 text-[#8270DB]" />}
        {tk.blocked && <Badge tone="red">{tr(L("مسدود", "Blocked"))}</Badge>}
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex -space-x-1.5" dir="ltr">
          {assignees.map((u: any) => <Avatar key={u.id} u={u} size="xs" ring />)}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-ink-soft font-medium tabular-nums">
          {tk.checklist.length > 0 && <span className="inline-flex items-center gap-1"><Ic n="checkAll" className="w-3.5 h-3.5" />{tk.checklist.filter((c: any) => c.done).length}/{tk.checklist.length}</span>}
          {tk.comments.length > 0 && <span className="inline-flex items-center gap-1"><Ic n="reply" className="w-3.5 h-3.5" />{tk.comments.length}</span>}
          {tk.attachments > 0 && <span className="inline-flex items-center gap-1"><Ic n="clip" className="w-3.5 h-3.5" />{tk.attachments}</span>}
          <span className="inline-flex items-center gap-1 text-[#974F0C]"><Ic n="timer" className="w-3.5 h-3.5" />{tk.due}</span>
        </div>
      </div>
    </div>
  );
}

/* ================= other views ================= */
function ListView({ tasks }: { tasks: Task[] }) {
  const app = useApp();
  if (tasks.length === 0) return <Empty icon="doc" title={app.t("startSearching")} />;
  return (
    <div className="app-card overflow-x-auto">
      <table className="w-full min-w-[640px] text-[13px]">
        <thead>
          <tr className="text-[11.5px] text-ink-soft font-medium border-b border-ink/10">
            <th className="text-start px-4 py-3 font-medium">{tr(L("تسک", "Task"))}</th>
            <th className="text-start px-4 py-3 font-medium">{tr(L("وضعیت", "Status"))}</th>
            <th className="text-start px-4 py-3 font-medium">{tr(L("اولویت", "Priority"))}</th>
            <th className="text-start px-4 py-3 font-medium">{tr(L("موعد", "Due Date"))}</th>
            <th className="text-start px-4 py-3 font-medium">{tr(L("مسئول", "Assignees"))}</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((tk) => (
            <tr key={tk.id} onClick={() => app.openTask(tk.id)} className="border-b border-ink/6 last:border-0 hover:bg-ink/[0.03] cursor-pointer transition-colors">
              <td className="px-4 py-3 font-medium">{tr(tk.title)}</td>
              <td className="px-4 py-3"><StatusPill s={tk.status} /></td>
              <td className="px-4 py-3"><PriorityDot p={tk.priority} /></td>
              <td className="px-4 py-3 text-ink-soft tabular-nums">{tk.due}</td>
              <td className="px-4 py-3"><div className="flex -space-x-1.5" dir="ltr">{tk.assignees.map((id) => { const u = USERS.find((x) => x.id === id)!; return u ? <Avatar key={id} u={u} size="xs" ring /> : null; })}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TreeView({ tasks }: { tasks: Task[] }) {
  const app = useApp();
  const groups = [
    { name: L("طراحی", "Design"), ids: ["t1"], pct: 40 },
    { name: L("توسعه", "Engineering"), ids: ["t4", "t5", "t2"], pct: 65 },
    { name: L("کیفیت و انتشار", "QA & Release"), ids: ["t6", "t7", "t3"], pct: 85 },
  ];
  return (
    <div className="app-card p-5 max-w-2xl">
      <div className="text-[13px] font-semibold mb-4">{tr(L("سلسله‌مراتب پروژه", "Project hierarchy"))} · <span className="text-ink-soft font-medium">{tr(L("درصد تکمیل هر شاخه", "% complete per branch"))}</span></div>
      <div className="space-y-1.5">
        {groups.map((g) => (
          <div key={g.ids[0]}>
            <div className="flex items-center gap-3 py-1.5">
              <span className="w-4 h-4 grid place-items-center rounded bg-ink/6"><Ic n="chevD" className="w-3 h-3" /></span>
              <span className="font-semibold text-[13.5px]">{tr(g.name)}</span>
              <span className="flex-1 max-w-[140px]"><Bar pct={g.pct} h={5} color={g.pct > 75 ? "#1F845A" : "#2D7AFF"} /></span>
              <span className="text-[11.5px] text-ink-soft tabular-nums">{g.pct}٪</span>
            </div>
            <div className="ms-7 border-s border-ink/12 ps-4 space-y-1">
              {g.ids.map((id) => {
                const tk = tasks.find((t) => t.id === id);
                if (!tk) return null;
                return (
                  <button key={id} onClick={() => app.openTask(id)} className="w-full flex items-center gap-3 py-1.5 rounded-lg px-2 -mx-2 hover:bg-ink/[0.04] transition-colors text-start">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_META[tk.status].color }} />
                    <span className="text-[13px] font-medium truncate">{tr(tk.title)}</span>
                    <span className="ms-auto"><StatusPill s={tk.status} /></span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GraphView({ tasks }: { tasks: Task[] }) {
  const app = useApp();
  const nodes = [
    { id: "t1", x: 90, y: 60 }, { id: "t4", x: 260, y: 40 }, { id: "t5", x: 260, y: 130 },
    { id: "t2", x: 430, y: 60 }, { id: "t7", x: 430, y: 150 }, { id: "t6", x: 590, y: 100 },
  ];
  const edges = [["t1", "t4"], ["t1", "t5"], ["t4", "t2"], ["t5", "t2"], ["t4", "t7"], ["t2", "t6"], ["t7", "t6"]];
  return (
    <div className="app-card p-4 overflow-x-auto">
      <svg viewBox="0 0 680 200" className="min-w-[620px] w-full">
        <defs>
          <marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="rgba(29,29,31,0.35)" />
          </marker>
        </defs>
        {edges.map(([a, b]) => {
          const na = nodes.find((n) => n.id === a)!; const nb = nodes.find((n) => n.id === b)!;
          return <line key={a + b} x1={na.x + 34} y1={na.y} x2={nb.x - 34} y2={nb.y} stroke="rgba(29,29,31,0.28)" strokeWidth="1.5" markerEnd="url(#arw)" />;
        })}
        {nodes.map((n) => {
          const tk = tasks.find((t) => t.id === n.id); if (!tk) return null;
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => app.openTask(n.id)}>
              <circle cx={n.x} cy={n.y} r={34} fill="var(--color-paper)" stroke={STATUS_META[tk.status].color} strokeWidth="2" className="transition-all hover:brightness-95" />
              <circle cx={n.x} cy={n.y} r={34} fill={STATUS_META[tk.status].color} opacity="0.12" />
              <text x={n.x} y={n.y - 4} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--color-ink)">{tr(tk.title).slice(0, 16)}…</text>
              <text x={n.x} y={n.y + 12} textAnchor="middle" fontSize="9.5" fontWeight="500" fill={STATUS_META[tk.status].color}>{tr(STATUS_META[tk.status].label)}</text>
            </g>
          );
        })}
      </svg>
      <p className="text-[11.5px] text-ink-soft mt-2">{tr(L("پیمایش و بزرگ‌نمایی؛ کلیک روی گره، کشوی تسک را باز می‌کند.", "Pan & zoom; clicking a node opens the task drawer."))}</p>
    </div>
  );
}

function CalendarView({ tasks }: { tasks: Task[] }) {
  const app = useApp();
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const dueOn = (d: number) => tasks.filter((t) => parseInt(t.due.replace(/[^\d۰-۹]/g, "").replace(/[۰-۹]/g, (x) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(x))) || "0") === d);
  const unscheduled = tasks.filter((t) => !t.due);
  return (
    <div className="grid lg:grid-cols-[1fr_240px] gap-4 items-start">
      <div className="app-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-[14px]">{tr(L("مهر ۱۴۰۴", "October 2025"))}</span>
          <div className="flex gap-1"><Btn size="sm" variant="subtle">‹</Btn><Btn size="sm" variant="subtle">›</Btn></div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const ev = dueOn(d);
            return (
              <div key={d} className={`min-h-[64px] rounded-lg border p-1.5 ${d === 16 ? "border-verm bg-verm/[0.05]" : "border-ink/8"}`}>
                <div className={`text-[11px] font-medium tabular-nums ${d === 16 ? "text-verm font-semibold" : "text-ink-soft"}`}>{d}</div>
                {ev.slice(0, 2).map((t) => (
                  <button key={t.id} onClick={() => app.openTask(t.id)} className="mt-1 w-full text-start text-[9.5px] font-medium truncate rounded px-1 py-0.5" style={{ background: `${STATUS_META[t.status].color}1f`, color: STATUS_META[t.status].color }}>
                    {tr(t.title)}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div className="app-card p-4">
        <h4 className="text-[13px] font-semibold mb-2">{tr(L("بدون برنامه", "Unscheduled"))}</h4>
        {unscheduled.length === 0 && <p className="text-[12px] text-ink-soft">{tr(L("همهٔ تسک‌ها موعد دارند.", "All tasks are scheduled."))}</p>}
        {unscheduled.map((t) => (
          <button key={t.id} onClick={() => app.openTask(t.id)} className="w-full text-start text-[12.5px] font-medium py-2 border-b border-ink/6 last:border-0 hover:text-verm transition-colors">{tr(t.title)}</button>
        ))}
      </div>
    </div>
  );
}

function TimelineView({ tasks }: { tasks: Task[] }) {
  const app = useApp();
  const rows = tasks.filter((t) => t.start).concat(tasks.slice(0, 3));
  return (
    <div className="app-card p-4 overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-8 text-[11px] text-ink-soft font-medium border-b border-ink/10 pb-2 mb-3">
          {Array.from({ length: 8 }, (_, i) => <span key={i} className="text-center tabular-nums">{tr(L("هفته", "W"))} {i + 1}</span>)}
        </div>
        <div className="space-y-2.5 relative">
          <div className="absolute top-0 bottom-0 border-s-2 border-dashed border-[#E2811A]/60" style={{ insetInlineStart: "55%" }} />
          {rows.slice(0, 6).map((tk, i) => (
            <button key={tk.id + i} onClick={() => app.openTask(tk.id)} className="w-full grid grid-cols-[140px_1fr] gap-3 items-center group">
              <span className="text-[12.5px] font-medium truncate text-start group-hover:text-verm transition-colors">{tr(tk.title)}</span>
              <span className="relative h-7 rounded-lg bg-ink/[0.04]">
                <span className="absolute top-1 bottom-1 rounded-md transition-transform group-hover:scale-y-110" style={{ insetInlineStart: `${(i * 9) % 40}%`, width: `${25 + ((i * 13) % 30)}%`, background: STATUS_META[tk.status].color, opacity: 0.85 }} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= CI/CD panel ================= */
const RUNS = [
  { id: "#482", branch: "main", status: "success", dur: "۲د ۱۴ث", when: "۱۰ دقیقه پیش", commit: "fix: leap-year conversion" },
  { id: "#481", branch: "main", status: "failed", dur: "۴۸ث", when: "۱ ساعت پیش", commit: "feat: jalali picker" },
  { id: "#480", branch: "dev", status: "running", dur: "—", when: "الان", commit: "chore: bump deps" },
];

function CicdPanel({ openSettings }: { openSettings: () => void }) {
  const app = useApp();
  const gated = app.plan === "free";
  const statusMeta: Record<string, { c: string; label: Pair }> = {
    success: { c: "#1F845A", label: L("موفق", "Passed") },
    failed: { c: "#C9372C", label: L("ناموفق", "Failed") },
    running: { c: "#2D7AFF", label: L("در حال اجرا", "Running") },
  };
  return (
    <div className="mx-4 sm:mx-6 mb-4 app-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Ic n="bolt" className="w-4 h-4 text-[#1F845A]" />
        <span className="text-[13px] font-semibold">{app.t("ciRuns")}</span>
        <Badge tone={gated ? "amber" : "green"}>{gated ? tr(L("محدود به پلن حرفه‌ای", "Pro plan required")) : "main · connected"}</Badge>
        <div className="ms-auto flex items-center gap-1.5">
          <Btn size="sm" variant="subtle" onClick={() => app.toast("↻")}>{tr(L("تازه‌سازی", "Refresh"))}</Btn>
          <Btn size="sm" variant="default" onClick={openSettings}><Ic n="plus" className="w-3.5 h-3.5" />{app.t("addIntegration")}</Btn>
        </div>
      </div>
      <div className={`space-y-1.5 ${gated ? "opacity-60" : ""}`}>
        {RUNS.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-ink/[0.03] px-3 py-2 text-[12.5px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusMeta[r.status].c }} />
            <span className="font-mono font-semibold">{r.id}</span>
            <span className="text-ink-soft truncate flex-1 min-w-[120px]">{r.commit}</span>
            <Badge tone={r.status === "success" ? "green" : r.status === "failed" ? "red" : "blue"}>{tr(statusMeta[r.status].label)}</Badge>
            <span className="text-ink-soft tabular-nums">{r.dur}</span>
            <span className="ms-auto flex gap-1">
              <Btn size="sm" variant="subtle" onClick={() => (gated ? app.upgrade("cicd_integrations") : app.toast("↗ view"))}>{tr(L("مشاهده", "View"))} ↗</Btn>
              <Btn size="sm" variant="subtle" onClick={() => (gated ? app.upgrade("cicd_integrations") : app.toast("logs"))}>{app.t("openFullLogs")}</Btn>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= modals ================= */
function NameModal({ title, placeholder, initial = "", cta, onClose, onSubmit }: any) {
  const [v, setV] = useState(initial);
  const app = useApp();
  return (
    <Modal title={title} onClose={onClose} footer={
      <>
        <Btn variant="subtle" onClick={onClose}>{app.t("cancel")}</Btn>
        <Btn variant="primary" disabled={!v.trim()} onClick={() => { onSubmit(v.trim()); onClose(); }}>{cta}</Btn>
      </>
    }>
      <Field label={title}>
        <input autoFocus className={inputCls} value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} />
      </Field>
    </Modal>
  );
}

function ImportModal({ onClose }: { onClose: () => void }) {
  const app = useApp();
  const [text, setText] = useState("");
  const tpl = `{ "name": "Section", "columns": [{ "name": "To Do", "tasks": [] }] }`;
  return (
    <Modal title={tr(L("ورود از JSON", "Import JSON"))} onClose={onClose} footer={
      <>
        <Btn variant="subtle" onClick={onClose}>{app.t("cancel")}</Btn>
        <Btn variant="primary" disabled={!text.trim()} onClick={() => { app.toast("✓ imported"); onClose(); }}>{tr(L("ورود", "Import"))}</Btn>
      </>
    }>
      <div className="flex gap-2 mb-3">
        <Btn size="sm" variant="default" onClick={() => { navigator.clipboard?.writeText(tpl); app.toast("template ⧉"); }}><Ic n="copy" className="w-3.5 h-3.5" />{tr(L("کپی قالب JSON", "Copy JSON template"))}</Btn>
        <Btn size="sm" variant="default" onClick={() => { navigator.clipboard?.writeText("Create a Finolo project section with columns To Do / In Progress / Done…"); app.toast("prompt ⧉"); }}><Ic n="bolt" className="w-3.5 h-3.5" />{tr(L("کپی پرامپت AI", "Copy AI prompt"))}</Btn>
      </div>
      <textarea rows={6} className={`${inputCls} h-auto py-2.5 font-mono text-[12px]`} value={text} onChange={(e) => setText(e.target.value)} placeholder={tpl} />
    </Modal>
  );
}

function AddTaskModal({ col, onClose }: { col: string; onClose: () => void }) {
  const app = useApp();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<StatusId>("open");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [recurring, setRecurring] = useState(false);
  const gated = app.plan === "free";

  const submit = () => {
    if (!title.trim()) return;
    const id = `t${Date.now()}`;
    app.setTasks((ts) => [...ts, { id, title: L(title, title), status, priority, urgency: 3, est: 4, due: "۲۵ مهر", assignees: ["u1"], tags: [], col, comments: [], attachments: 0, checklist: [], desc: L("", ""), recurring }]);
    app.setSections((secs) => secs.map((s) => ({ ...s, columns: s.columns.map((c) => (c.id === col ? { ...c, tasks: [...c.tasks, id] } : c)) })));
    app.toast("✓ " + title);
    onClose();
  };

  return (
    <Modal title={app.t("addTask").replace("+ ", "")} onClose={onClose} wide footer={
      <>
        <Btn variant="subtle" onClick={onClose}>{app.t("cancel")}</Btn>
        <Btn variant="primary" disabled={!title.trim()} onClick={submit}>{tr(L("ایجاد تسک", "Create Task"))}</Btn>
      </>
    }>
      <div className="space-y-4">
        <Field label={tr(L("عنوان تسک", "Task Title"))}>
          <input autoFocus className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={tr(L("مثلاً: اتصال درگاه پرداخت", "e.g. Wire up payment gateway"))} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={tr(L("وضعیت", "Status"))}>
            <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as StatusId)}>
              {(Object.keys(STATUS_META) as StatusId[]).map((s) => <option key={s} value={s}>{tr(STATUS_META[s].label)}</option>)}
            </select>
          </Field>
          <Field label={tr(L("اولویت", "Priority"))}>
            <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value as any)}>
              {(["low", "medium", "high", "urgent"] as const).map((p) => <option key={p} value={p}>{tr(PRIORITY_META[p].label)}</option>)}
            </select>
          </Field>
          <Field label={tr(L("فوریت (۱ تا ۵)", "Urgency 1–5"))}>
            <select className={inputCls}>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select>
          </Field>
          <Field label={tr(L("تخمین ساعت", "Estimated Hours"))}>
            <input type="number" defaultValue={4} className={inputCls} />
          </Field>
          <Field label={tr(L("شروع", "Start date"))}><input className={inputCls} defaultValue="۱۵ مهر" /></Field>
          <Field label={tr(L("موعد", "Due date"))}><input className={inputCls} defaultValue="۲۵ مهر" /></Field>
        </div>
        <Field label={tr(L("مسئولین و تیم‌ها", "Assignees & Teams"))}>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5" dir="ltr">
              {USERS.slice(0, 3).map((u) => <Avatar key={u.id} u={u} size="sm" ring />)}
            </div>
            <Btn size="sm" variant="subtle"><Ic n="plus" className="w-3.5 h-3.5" />{tr(L("افزودن", "Add"))}</Btn>
          </div>
        </Field>
        <Field label={tr(L("برچسب‌ها", "Tags"))} hint={tr(L("انتخاب یا ساخت برچسب هنگام اختصاص…", "Select or create tags…"))}>
          <input className={inputCls} placeholder="design, qa…" />
        </Field>
        <div className={`rounded-xl border p-3.5 flex items-center justify-between ${recurring ? "border-verm bg-verm/[0.05]" : "border-ink/12"}`}>
          <div>
            <div className="text-[13.5px] font-medium flex items-center gap-2">
              {app.t("recurring")}
              {gated && <Badge tone="amber"><Ic n="crown" className="w-3 h-3" /> Pro</Badge>}
            </div>
            <div className="text-[12px] text-ink-soft mt-0.5">{tr(L("تکرار: روزانه / هفتگی / ماهانه", "Repeats: daily / weekly / monthly"))}</div>
          </div>
          <Toggle on={recurring} label={app.t("recurring")} onChange={(v) => { if (v && gated) { app.upgrade("recurring_tasks"); return; } setRecurring(v); }} />
        </div>
      </div>
    </Modal>
  );
}

/* ================= task drawer ================= */
export function TaskDrawer({ taskId, onClose, activityFor }: { taskId: string; onClose: () => void; activityFor: (t: Task) => void }) {
  const app = useApp();
  const tk = app.tasks.find((t) => t.id === taskId);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState("");
  const [actOpen, setActOpen] = useState(false);
  if (!tk) return null;
  const { can, role, vis, t } = app;
  const readOnly = role === "observer" || !can("edit_task");
  const showComments = role !== "observer" || vis.activity;
  const showAttach = role !== "observer" || vis.attachments;

  return (
    <Drawer title={<span className="inline-flex items-center gap-2"><StatusPill s={tk.status} />{tk.recurring && <Ic n="refresh" className="w-4 h-4 text-[#8270DB]" />}</span>} onClose={onClose}
      footer={!readOnly ? (
        <>
          {editing ? (
            <>
              <Btn variant="subtle" onClick={() => setEditing(false)}>{t("cancel")}</Btn>
              <Btn variant="primary" onClick={() => { setEditing(false); app.toast("✓ saved"); }}>{t("save")}</Btn>
            </>
          ) : (
            <Btn variant="primary" onClick={() => setEditing(true)}><Ic n="pen" className="w-4 h-4" />{t("edit")}</Btn>
          )}
        </>
      ) : <Badge tone="purple">{tr(L("فقط خواندنی", "Read only"))}</Badge>}>
      <h2 className="font-semibold text-[18px] leading-7">{tr(tk.title)}</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-soft leading-6">{tr(tk.desc)}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetaBox label={tr(L("وضعیت", "Status"))}><StatusPill s={tk.status} /></MetaBox>
        <MetaBox label={tr(L("اولویت", "Priority"))}><PriorityDot p={tk.priority} /></MetaBox>
        <MetaBox label={tr(L("موعد", "Due"))}><span className="text-[13px] font-medium tabular-nums">{tk.due}</span></MetaBox>
        <MetaBox label={tr(L("تخمین", "Estimate"))}><span className="text-[13px] font-medium tabular-nums">{tk.est}h</span></MetaBox>
      </div>

      <Section title={tr(L("مسئولین", "Assignees"))}>
        <div className="flex items-center gap-2">
          {tk.assignees.map((id) => { const u = USERS.find((x) => x.id === id)!; return u ? (
            <span key={id} className="inline-flex items-center gap-2 rounded-full bg-ink/5 pe-3 ps-1 py-1"><Avatar u={u} size="sm" /><span className="text-[12.5px] font-medium">{tr(u.name)}</span></span>
          ) : null; })}
        </div>
      </Section>

      <Section title={tr(L("تیم‌ها", "Teams"))} hint={tr(L("دعوت تیم از تنظیمات پروژه", "Invite a team in Project settings"))}>
        <Badge tone="blue">{tr(L("تیم هسته", "Core Team"))}</Badge>
      </Section>

      <Section title={tr(L("برچسب‌ها", "Tags"))}>
        <div className="flex flex-wrap gap-1.5">
          {(tk.tags.length ? tk.tags : ["—"]).map((tg) => <Badge key={tg}>{tg}</Badge>)}
        </div>
      </Section>

      {showComments && (
        <Section title={t("commentsW")}>
          <div className="space-y-3">
            {tk.comments.map((c, i) => {
              const u = USERS.find((x) => x.id === c.who)!;
              return (
                <div key={i} className="flex gap-2.5">
                  <Avatar u={u} size="sm" />
                  <div className="app-card p-3 flex-1">
                    <div className="flex items-center gap-2 text-[12px]"><strong>{tr(u.name)}</strong><span className="text-ink-soft">{c.when}</span></div>
                    <p className="mt-1 text-[13px] leading-6">{tr(c.text)}</p>
                  </div>
                </div>
              );
            })}
            {!readOnly && (
              <div className="flex gap-2">
                <input className={inputCls} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t("addComment")} />
                <Btn variant="primary" disabled={!comment.trim()} onClick={() => { app.toast("✓ posted"); setComment(""); }}>{t("post")}</Btn>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section title={t("checklists")}>
        <div className="space-y-1.5">
          {tk.checklist.length === 0 && <p className="text-[12.5px] text-ink-soft">{tr(L("موردی نیست.", "Nothing yet."))}</p>}
          {tk.checklist.map((c, i) => (
            <label key={i} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-ink/[0.04] cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked={c.done} disabled={readOnly} className="w-4 h-4 accent-[#2D7AFF]" />
              <span className={`text-[13px] ${c.done ? "line-through text-ink-soft" : ""}`}>{tr(c.t)}</span>
            </label>
          ))}
        </div>
      </Section>

      {showAttach && (
        <Section title={t("attachmentsW")}>
          <div className="grid grid-cols-3 gap-2">
            {["mockup-v2.png", "api-spec.pdf", "flow.md"].slice(0, tk.attachments || 0).map((f) => (
              <div key={f} className="app-card p-2.5 text-center">
                <Ic n="doc" className="w-5 h-5 mx-auto text-ink-soft" />
                <div className="mt-1 text-[10.5px] font-medium truncate">{f}</div>
              </div>
            ))}
            {!readOnly && can("upload_attachment") && (
              <button onClick={() => app.toast("⇪ upload")} className="rounded-xl border border-dashed border-ink/25 grid place-items-center py-4 text-ink-soft hover:text-verm hover:border-verm transition-colors">
                <Ic n="plus" className="w-5 h-5" />
              </button>
            )}
          </div>
        </Section>
      )}

      <Section title={t("activity")}>
        <button onClick={() => setActOpen((v) => !v)} className="w-full flex items-center justify-between rounded-lg bg-ink/[0.04] px-3 py-2.5 text-[13px] font-medium hover:bg-ink/[0.07] transition-colors">
          {tr(L("۳ رویداد اخیر", "3 recent events"))}
          <Ic n="chevD" className={`w-4 h-4 transition-transform ${actOpen ? "rotate-180" : ""}`} />
        </button>
        {actOpen && (
          <div className="mt-2 space-y-2 text-[12.5px]">
            <p><strong>{tr(USERS[1].name)}</strong> {tr(L("وضعیت را از «باز» به «در حال انجام» تغییر داد", "changed status from Open → In Progress"))} · ۲س</p>
            <button onClick={() => activityFor(tk)} className="text-[#2D7AFF] font-medium link-u">{t("viewAllActivity")}</button>
          </div>
        )}
      </Section>
    </Drawer>
  );
}

function MetaBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="app-card p-3">
      <div className="text-[11px] font-medium text-ink-soft mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2.5">
        <h4 className="text-[13px] font-semibold">{title}</h4>
        {hint && <span className="text-[11px] text-ink-soft">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function ActivityModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const app = useApp();
  const entries = [
    { who: "u2", what: L("وضعیت را تغییر داد", "changed status"), from: L("باز", "Open"), to: L("در حال انجام", "In Progress"), when: "۲ ساعت پیش" },
    { who: "u1", what: L("موعد را تغییر داد", "changed due date"), from: L("۱۸ مهر", "Oct 10"), to: L("۲۱ مهر", "Oct 13"), when: "۵ ساعت پیش" },
    { who: "u4", what: L("کامنت گذاشت", "commented"), from: null, to: null, when: "دیروز" },
    { who: "u1", what: L("تسک را ساخت", "created the task"), from: null, to: null, when: "۳ روز پیش" },
  ];
  return (
    <Modal title={`${app.t("viewAllActivity")} — ${tr(task.title)}`} onClose={onClose} wide>
      <div className="space-y-1">
        {entries.map((e, i) => {
          const u = USERS.find((x) => x.id === e.who)!;
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-ink/[0.04] transition-colors">
              <Avatar u={u} size="sm" />
              <div className="flex-1 min-w-0 text-[13px]">
                <strong>{tr(u.name)}</strong> <span className="text-ink-soft">{tr(e.what)}</span>
                {e.from && e.to && (
                  <span className="inline-flex items-center gap-1.5 mx-1.5 align-middle">
                    <Badge>{tr(e.from)}</Badge>
                    <Ic n="forward" className="w-3.5 h-3.5 text-ink-soft" />
                    <Badge tone="blue">{tr(e.to)}</Badge>
                  </span>
                )}
              </div>
              <span className="text-[11.5px] text-ink-soft tabular-nums shrink-0">{e.when}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

/* ================= project settings ================= */
export function ProjectSettingsModal({ tab, setTab, onClose }: { tab: string; setTab: (t: string) => void; onClose: () => void }) {
  const app = useApp();
  const project = PROJECTS[0];
  const tabs = ["details", "members", "teams", "jobs", "integrations", "sharing"];
  const idx = Math.max(0, tabs.indexOf(tab));
  return (
    <Modal wide title={`${app.t("projectSettings")} · ${tr(project.name)}`} onClose={onClose}
      footer={<Btn variant="primary" onClick={onClose}>{app.t("done")}</Btn>}>
      <Tabs className="-mx-5 px-5 -mt-1 mb-5" active={idx} onChange={(i) => setTab(tabs[i])} tabs={[
        app.t("details"), app.t("membersPerms"), app.t("teams"), app.t("jobTitles"), app.t("integrations"), app.t("sharing"),
      ]} />
      {tab === "details" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tr(L("نام", "Name"))}><input className={inputCls} defaultValue={tr(project.name)} /></Field>
            <Field label={tr(L("نمای پیش‌فرض بورد", "Default board view"))}>
              <select className={inputCls}><option>{app.t("kanban")}</option><option>{app.t("list")}</option><option>{app.t("timeline")}</option></select>
            </Field>
            <Field label={tr(L("تاریخ شروع", "Start date"))}><input className={inputCls} defaultValue={project.start} /></Field>
            <Field label={tr(L("تاریخ پایان", "Due date"))}><input className={inputCls} defaultValue={project.end} /></Field>
          </div>
          <Field label={tr(L("توضیحات", "Description"))}><textarea rows={3} className={`${inputCls} h-auto py-2`} defaultValue={tr(L("ریلیز بزرگ پاییز با تمرکز بر سرعت.", "The big autumn release, focused on speed."))} /></Field>
          <div className="flex justify-end"><Btn variant="primary" onClick={() => app.toast("✓ " + tr(L("پروژه به‌روز شد", "Project updated")))}>{app.t("save")}</Btn></div>
        </div>
      )}
      {tab === "members" && <MembersTab />}
      {tab === "teams" && <TeamsSettingsTab />}
      {tab === "jobs" && <JobsTab />}
      {tab === "integrations" && <IntegrationsTab />}
      {tab === "sharing" && <SharingTab />}
    </Modal>
  );
}

function MembersTab() {
  const app = useApp();
  const members = [
    { u: USERS[0], job: L("مدیر محصول", "Product Manager"), perms: 34, observer: false, pending: false },
    { u: USERS[1], job: L("توسعه‌دهنده", "Developer"), perms: 28, observer: false, pending: false },
    { u: USERS[3], job: L("طراح", "Designer"), perms: 19, observer: false, pending: false },
    { u: USERS[4], job: L("ناظر", "Observer"), perms: 0, observer: true, pending: false },
    { u: USERS[5], job: L("QA", "QA Engineer"), perms: 0, observer: false, pending: true },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select className={`${inputCls} max-w-[220px]`}>
          <option>{tr(L("انتخاب کاربر…", "Select user…"))}</option>
          {USERS.map((u) => <option key={u.id}>{tr(u.name)}</option>)}
        </select>
        <Btn variant="primary" onClick={() => app.toast("✓ " + app.t("sendInvite"))}>{app.t("sendInvite")}</Btn>
      </div>
      <div>
        <h5 className="text-[12.5px] font-semibold text-ink-soft mb-2">{app.t("pendingInvites")}</h5>
        {members.filter((m) => m.pending).map((m) => (
          <div key={m.u.id} className="flex items-center gap-3 rounded-xl border border-dashed border-[#E2811A]/50 bg-[#E2811A]/[0.06] px-3 py-2.5">
            <Avatar u={m.u} size="sm" />
            <span className="text-[13px] font-medium flex-1">{tr(m.u.name)} · {tr(L("در انتظار پذیرش", "Waiting to accept"))}</span>
            <Btn size="sm" variant="subtle" onClick={() => app.toast("invite cancelled")}>{app.t("cancel")}</Btn>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {members.filter((m) => !m.pending).map((m) => (
          <div key={m.u.id} className="app-card p-3 flex flex-wrap items-center gap-3">
            <Avatar u={m.u} />
            <div className="flex-1 min-w-[140px]">
              <div className="text-[13.5px] font-medium">{tr(m.u.name)}</div>
              <div className="text-[11.5px] text-ink-soft">{tr(m.job)}</div>
            </div>
            {m.observer ? (
              <div className="text-[11.5px] text-[#6554C0] bg-[#8270DB]/10 rounded-lg px-3 py-2 max-w-[260px] leading-5">
                {app.t("observerNote")}
              </div>
            ) : (
              <button onClick={() => app.toast("permissions editor")} className="text-[12px] font-medium text-[#2D7AFF] inline-flex items-center gap-1.5 hover:underline">
                {app.t("permissions")} · <span className="tabular-nums">{m.perms}/40</span>
              </button>
            )}
            {app.role === "owner" && !m.observer && <Btn size="sm" variant="subtle" onClick={() => app.toast("removed")}>{app.t("removeMember")}</Btn>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamsSettingsTab() {
  const app = useApp();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select className={`${inputCls} max-w-[220px]`}><option>{tr(L("انتخاب تیم…", "Select team…"))}</option><option>{tr(L("تیم هسته", "Core Team"))}</option></select>
        <Btn variant="primary" onClick={() => app.toast("✓ team invited")}>{app.t("sendInvite")}</Btn>
        <span className="text-[12px] text-ink-soft self-center">{tr(L("یا ساخت تیم جدید", "Or create a new team"))}</span>
      </div>
      <div className="app-card p-4 flex items-center gap-3">
        <span className="w-9 h-9 grid place-items-center rounded-lg bg-[#2D7AFF]/12 text-[#2D7AFF]"><Ic n="team" className="w-4.5 h-4.5" /></span>
        <div className="flex-1">
          <div className="text-[13.5px] font-medium">{tr(L("تیم هسته", "Core Team"))}</div>
          <div className="text-[11.5px] text-ink-soft">{tr(L("۳ عضو · مدیریت اعضا در صفحهٔ تیم‌ها", "3 members · Manage members on the Teams page"))}</div>
        </div>
        <Btn size="sm" variant="subtle" onClick={() => app.toast("unlinked")}>{tr(L("قطع اتصال", "Unlink"))}</Btn>
      </div>
    </div>
  );
}

function JobsTab() {
  const app = useApp();
  const jobs = [L("مدیر محصول", "Product Manager"), L("توسعه‌دهنده", "Developer"), L("طراح", "Designer"), L("ناظر", "Observer")];
  return (
    <div className="space-y-3">
      <p className="text-[12.5px] text-ink-soft">{tr(L("عناوین شغلی فقط برچسب‌اند؛ توانایی‌ها در تب اعضا تنظیم می‌شوند.", "Job titles are labels only — abilities live under Members."))}</p>
      <div className="flex flex-wrap gap-2">
        {jobs.map((j, i) => (
          <span key={tr(j)} className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-ink/[0.04] px-3.5 py-1.5 text-[13px] font-medium">
            {tr(j)}
            {i === 3 ? <Badge tone="purple">{tr(L("پیش‌فرض", "default"))}</Badge> : <button onClick={() => app.toast("removed")} className="text-ink-soft hover:text-[#C9372C] transition-colors"><Ic n="x" className="w-3.5 h-3.5" /></button>}
          </span>
        ))}
      </div>
      <Btn variant="default" onClick={() => app.toast("new job title")}><Ic n="plus" className="w-4 h-4" />{app.t("newJobTitle")}</Btn>
    </div>
  );
}

function IntegrationsTab() {
  const app = useApp();
  const gated = app.plan === "free";
  const [adding, setAdding] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] text-ink-soft">{tr(L("اتصال‌های CI/CD — وب‌هوک خروجی و اتوماسیون به‌زودی (FUTURE).", "CI/CD integrations only — outgoing webhooks & automations are FUTURE."))}</p>
        <Btn variant="primary" size="sm" onClick={() => (gated ? app.upgrade("cicd_integrations") : setAdding(true))}><Ic n="plus" className="w-3.5 h-3.5" />{app.t("addIntegration")}</Btn>
      </div>
      <div className={`space-y-2 ${gated ? "opacity-55" : ""}`}>
        <div className="app-card p-3.5 flex flex-wrap items-center gap-3">
          <span className="w-9 h-9 grid place-items-center rounded-lg bg-ink text-paper font-mono text-[11px]">GH</span>
          <div className="flex-1 min-w-[150px]">
            <div className="text-[13.5px] font-medium">finolo/finolo-web</div>
            <div className="text-[11.5px] text-ink-soft">GitHub · {tr(L("آخرین تحویل: ۱۰ دقیقه پیش", "last delivery 10m ago"))}</div>
          </div>
          <Badge tone="green">{tr(L("فعال", "Active"))}</Badge>
          <Btn size="sm" variant="subtle">{tr(L("تست", "Test"))}</Btn>
          <Btn size="sm" variant="subtle">{app.t("edit")}</Btn>
          <Btn size="sm" variant="subtle" onClick={() => app.toast("removed")}>{tr(L("حذف", "Remove"))}</Btn>
        </div>
      </div>
      {adding && (
        <Modal title={app.t("addIntegration")} onClose={() => setAdding(false)} footer={
          <>
            <Btn variant="subtle" onClick={() => setAdding(false)}>{app.t("cancel")}</Btn>
            <Btn variant="primary" onClick={() => { setAdding(false); app.toast("✓ connected"); }}>{tr(L("ایجاد / تست", "Create / Test"))}</Btn>
          </>
        }>
          <div className="space-y-3.5">
            <Field label="Provider"><select className={inputCls}><option>GitHub</option><option>GitLab</option></select></Field>
            <Field label={tr(L("نام", "Name"))}><input className={inputCls} placeholder="production" /></Field>
            <Field label="Repository"><input className={inputCls} placeholder="org/repo" dir="ltr" /></Field>
            <Field label="Access Token"><input type="password" className={inputCls} dir="ltr" /></Field>
            <Field label="Base URL"><input className={inputCls} placeholder="https://ci.example.com" dir="ltr" /></Field>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SharingTab() {
  const app = useApp();
  const gated = app.plan === "free";
  return (
    <div className="space-y-5">
      <div className={`rounded-xl border border-ink/12 p-4 ${gated ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h5 className="text-[13.5px] font-semibold">{tr(L("اشتراک عمومی", "Public sharing"))}</h5>
          {gated && <Badge tone="amber"><Ic n="crown" className="w-3 h-3" /> Pro</Badge>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="primary" size="sm" onClick={() => (gated ? app.upgrade("public_share_links") : app.toast("✓ finolo.ir/share/k2X9…"))}>
            <Ic n="link" className="w-3.5 h-3.5" />{app.t("createPublicLink")}
          </Btn>
          <Btn size="sm" variant="default" disabled={gated}>{app.t("revoke")}</Btn>
          <Btn size="sm" variant="subtle" disabled={gated}>{app.t("turnOffAll")}</Btn>
        </div>
        <div className="mt-3 space-y-1.5 text-[12px] text-ink-soft">
          <div className="flex items-center gap-2"><Badge tone="green">Active</Badge><span dir="ltr" className="font-mono">finolo.ir/share/k2X9</span><span>· {tr(L("انقضا: ۳۰ مهر", "expires Oct 21"))}</span></div>
          <div className="flex items-center gap-2"><Badge>Expired</Badge><span dir="ltr" className="font-mono">finolo.ir/share/9fTa</span></div>
        </div>
      </div>
      <div className="rounded-xl border border-ink/12 p-4">
        <h5 className="text-[13.5px] font-semibold mb-1">{app.t("observerCanSee")}</h5>
        <p className="text-[12px] text-ink-soft mb-3">{tr(L("این پرچم‌ها برای ناظرها و مهمان‌های لینک عمومی اعمال می‌شود.", "Flags apply to Observers and public link guests."))}</p>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {Object.entries(app.vis).map(([k, v]) => {
            const meta = [
              { key: "board", label: L("بورد", "Board") }, { key: "docs", label: L("اسناد", "Documents") }, { key: "attachments", label: L("پیوست‌ها", "Attachments") },
              { key: "members", label: L("اعضا", "Members") }, { key: "activity", label: L("فعالیت", "Activity") }, { key: "timelogs", label: L("گزارش زمان", "Time logs") }, { key: "reports", label: L("گزارش‌ها", "Reports") },
            ].find((f) => f.key === k)!;
            return (
              <div key={k} className="flex items-center justify-between rounded-lg bg-ink/[0.03] px-3 py-2">
                <span className="text-[13px] font-medium">{tr(meta.label)}</span>
                <Toggle on={v} label={tr(meta.label)} onChange={(nv) => app.setVis({ ...app.vis, [k]: nv })} />
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex justify-end"><Btn variant="primary" size="sm" onClick={() => app.toast("✓ " + tr(L("دیده‌بانی ذخیره شد", "Visibility saved")))}>{app.t("save")}</Btn></div>
      </div>
    </div>
  );
}

export function ShareModal({ onClose }: { onClose: () => void }) {
  const app = useApp();
  return (
    <Modal title={`${app.t("shareLink")} — ${tr(PROJECTS[0].name)}`} onClose={onClose} footer={<Btn variant="primary" onClick={onClose}>{app.t("done")}</Btn>}>
      <div className="rounded-xl border border-ink/12 bg-ink/[0.03] p-3.5 flex items-center gap-2">
        <Ic n="link" className="w-4 h-4 text-[#2D7AFF] shrink-0" />
        <span dir="ltr" className="font-mono text-[13px] flex-1 truncate">finolo.ir/share/k2X9mPq</span>
        <Btn size="sm" variant="default" onClick={() => { navigator.clipboard?.writeText("https://finolo.ir/share/k2X9mPq"); app.toast("⧉ copied"); }}><Ic n="copy" className="w-3.5 h-3.5" />{tr(L("کپی", "Copy"))}</Btn>
      </div>
      <div className="mt-4 space-y-2">
        <Btn variant="default" className="w-full" onClick={() => app.toast("✓ new link")}>{tr(L("ساخت لینک جدید", "Create new link"))}</Btn>
        <Btn variant="subtle" className="w-full" onClick={() => app.toast("revoked")}>{app.t("revoke")}</Btn>
        <Btn variant="subtle" className="w-full" onClick={() => app.toast("off")}>{app.t("turnOffAll")}</Btn>
      </div>
      <p className="mt-4 text-[12px] text-ink-soft leading-6">{tr(L("مهمان‌های لینک عمومی، بورد را فقط‌خواندنی و مطابق پرچم‌های دیده‌بانی می‌بینند.", "Public guests see a read-only board, per visibility flags."))}</p>
    </Modal>
  );
}

/* ================= info sidebar ================= */
export function InfoSidebar({ onClose, project }: { onClose: () => void; project: (typeof PROJECTS)[number] }) {
  const app = useApp();
  const { vis, role, can, t } = app;
  const [docsOpen, setDocsOpen] = useState(true);
  const show = (k: string) => role !== "observer" || vis[k];
  const docs = ["PRD-v3.md", "ERD.png", "api-conventions.txt", "release-checklist.pdf"];
  return (
    <Drawer title={t("projectInfo")} onClose={onClose}>
      <div className="space-y-5">
        {show("board") && (
          <Section title={t("progress")}>
            <div className="flex items-center gap-3">
              <div className="flex-1"><Bar pct={project.progress} h={8} /></div>
              <span className="text-[13px] font-semibold tabular-nums">{project.progress}٪</span>
            </div>
          </Section>
        )}
        {show("board") && (
          <Section title={t("taskStats")}>
            <div className="grid grid-cols-3 gap-2">
              <MetaBox label={tr(L("باز", "Open"))}><span className="text-lg font-semibold tabular-nums">۳</span></MetaBox>
              <MetaBox label={tr(L("در جریان", "Active"))}><span className="text-lg font-semibold tabular-nums text-[#2D7AFF]">۲</span></MetaBox>
              <MetaBox label={tr(L("تمام", "Done"))}><span className="text-lg font-semibold tabular-nums text-[#1F845A]">۲</span></MetaBox>
            </div>
          </Section>
        )}
        {show("board") && (
          <Section title={tr(L("بازهٔ زمانی", "Timeline"))}>
            <p className="text-[13px] font-medium tabular-nums">{project.start} ← {project.end}</p>
          </Section>
        )}
        {show("members") && (
          <Section title={t("membersW")}>
            <div className="flex flex-wrap gap-2">
              {USERS.slice(0, 4).map((u) => <Avatar key={u.id} u={u} />)}
            </div>
          </Section>
        )}
        {show("docs") && (
          <Section title={t("documentation")}>
            <button onClick={() => setDocsOpen((v) => !v)} className="w-full flex items-center justify-between rounded-lg bg-ink/[0.04] px-3 py-2.5 text-[13px] font-medium hover:bg-ink/[0.07] transition-colors">
              {docs.length} {tr(L("سند", "files"))}
              <Ic n="chevD" className={`w-4 h-4 transition-transform ${docsOpen ? "rotate-180" : ""}`} />
            </button>
            {docsOpen && (
              <div className="mt-2 space-y-1">
                {docs.map((d) => (
                  <button key={d} onClick={() => app.toast("▶ " + d)} className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-ink/[0.04] transition-colors text-start">
                    <Ic n="doc" className="w-4 h-4 text-ink-soft shrink-0" />
                    <span className="text-[12.5px] font-medium truncate" dir="ltr">{d}</span>
                    <Ic n="download" className="w-3.5 h-3.5 ms-auto text-ink-soft" />
                  </button>
                ))}
                {role !== "observer" && can("upload_project_doc") && (
                  <button onClick={() => app.toast("⇪ upload")} className="w-full mt-1 h-9 rounded-lg border border-dashed border-ink/25 text-[12.5px] font-medium text-ink-soft hover:text-verm hover:border-verm transition-colors inline-flex items-center justify-center gap-1.5">
                    <Ic n="plus" className="w-3.5 h-3.5" />{t("uploadDoc")}
                  </button>
                )}
              </div>
            )}
          </Section>
        )}
        {show("activity") && (
          <Section title={t("activity")}>
            <div className="space-y-2 text-[12.5px] text-ink-soft">
              <p><strong className="text-ink">{tr(USERS[1].name)}</strong> {tr(L("کامیت زد", "pushed a commit"))} · ۱۰د</p>
              <p><strong className="text-ink">{tr(USERS[0].name)}</strong> {tr(L("تسک ساخت", "created a task"))} · ۲س</p>
            </div>
          </Section>
        )}
      </div>
    </Drawer>
  );
}
