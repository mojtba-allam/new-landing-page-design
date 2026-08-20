import { useEffect, useRef, useState } from "react";
import {
  IconArrow, IconBell, IconBolt, IconCalendar, IconChart, IconCheck, IconClock,
  IconDashboard, IconGantt, IconGraph, IconGrip, IconKanban, IconList, IconPlus,
  IconShield, IconTree, IconUsers, LogoMark,
} from "../components/Icons";

/* ============================================================
   FINOLO — hi-fi interactive prototype (faithful to shipped IA)
   Glass chrome · brand #2D7AFF · Toman · EN/FA
   ============================================================ */

type Persona = "owner" | "member" | "observer" | "guest";
type Screen =
  | "dashboard" | "workspaces" | "projects" | "board" | "teams" | "messages"
  | "time" | "analytics" | "search" | "docs" | "settings" | "admin";
type BoardView = "kanban" | "list" | "tree" | "graph" | "calendar" | "timeline";
type ModalKind = null | "addTask" | "projectSettings" | "share" | "upgrade" | "createWorkspace" | "createProject" | "addEntry";
type DemoState = "allowed" | "loading" | "empty" | "error" | "denied";

const NAV: { id: Screen; label: string; icon: (c: string) => React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: (c) => <IconDashboard className={c} /> },
  { id: "workspaces", label: "Workspaces", icon: (c) => <IconGrip className={c} /> },
  { id: "projects", label: "Projects", icon: (c) => <IconKanban className={c} /> },
  { id: "teams", label: "Teams", icon: (c) => <IconUsers className={c} /> },
  { id: "messages", label: "Messages", icon: (c) => <IconBell className={c} /> },
  { id: "time", label: "Time Tracking", icon: (c) => <IconClock className={c} /> },
  { id: "analytics", label: "Analytics", icon: (c) => <IconChart className={c} /> },
  { id: "search", label: "Search", icon: (c) => <IconList className={c} /> },
  { id: "docs", label: "Documentation", icon: (c) => <IconShield className={c} /> },
  { id: "settings", label: "Settings", icon: (c) => <IconBolt className={c} /> },
];

const TASKS = [
  { id: 1, title: "Design login flow", col: 0, status: "Open", priority: "High", due: "Oct 28", assignees: ["SM", "AK"], comments: 3, tags: ["design"], blocked: false },
  { id: 2, title: "Wire billing webhooks", col: 0, status: "Open", priority: "Urgent", due: "Oct 25", assignees: ["NR"], comments: 1, tags: ["backend"], blocked: true },
  { id: 3, title: "Refactor board reducer", col: 1, status: "In Progress", priority: "Medium", due: "Nov 02", assignees: ["GH"], comments: 5, tags: ["frontend"], blocked: false },
  { id: 4, title: "Calendar view spikes", col: 1, status: "In Progress", priority: "High", due: "Nov 05", assignees: ["SM"], comments: 2, tags: ["frontend"], blocked: false },
  { id: 5, title: "Ship MCP docs", col: 2, status: "Completed", priority: "Low", due: "Oct 20", assignees: ["KT"], comments: 0, tags: ["docs"], blocked: false },
];
const COLS = [
  { id: 0, name: "To Do", tint: "bg-[#8e8e93]" },
  { id: 1, name: "In Progress", tint: "bg-[#2d7aff]" },
  { id: 2, name: "Done", tint: "bg-[#22a06b]" },
];

const STATUS_COLOR: Record<string, string> = {
  Open: "bg-[#8e8e93]", "In Progress": "bg-[#2d7aff]", Completed: "bg-[#22a06b]",
  Blocked: "bg-[#c9372c]", "On hold": "bg-[#e2811a]", Cancelled: "bg-[#943d73]",
};
const PRIORITY_COLOR: Record<string, string> = {
  Urgent: "text-[#c9372c]", High: "text-[#e56910]", Medium: "text-[#2d7aff]", Low: "text-[#22a06b]",
};

/* small primitives ------------------------------------------------ */
function Btn({ children, variant = "primary", sm, onClick, className = "" }: {
  children: React.ReactNode; variant?: "primary" | "default" | "subtle" | "danger"; sm?: boolean; onClick?: () => void; className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#2d7aff] focus-visible:outline-offset-2 disabled:opacity-50";
  const size = sm ? "h-7 px-3 text-[12px] rounded-lg" : "h-9 px-4 text-[13px] rounded-lg";
  const look =
    variant === "primary" ? "bg-[#2d7aff] text-white hover:bg-[#0460ff] active:scale-[0.98]"
    : variant === "danger" ? "bg-[#c9372c] text-white hover:bg-[#b02a20] active:scale-[0.98]"
    : variant === "subtle" ? "text-[#2d7aff] hover:bg-[#e8f0fe]"
    : "bg-white/80 dark:bg-[#2c2c2e] border border-[rgba(0,0,0,0.14)] dark:border-[rgba(255,255,255,0.16)] text-ink hover:bg-[#e9eaf0] dark:hover:bg-[#3a3a3c]";
  return <button onClick={onClick} className={`${base} ${size} ${look} ${className}`}>{children}</button>;
}

function Chip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "blue" | "green" | "red" | "orange" | "purple" }) {
  const map = {
    neutral: "bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] text-ink-soft",
    blue: "bg-[#e8f0fe] dark:bg-[#0d1f40] text-[#2d7aff] dark:text-[#5694ff]",
    green: "bg-[#e6f4ec] dark:bg-[#0d2318] text-[#1f845a] dark:text-[#30d158]",
    red: "bg-[#fff2f0] dark:bg-[#2d0f0f] text-[#c9372c] dark:text-[#ff6b60]",
    orange: "bg-[#fffae6] dark:bg-[#2d1e04] text-[#974f0c] dark:text-[#ffd60a]",
    purple: "bg-[#e9e0ff] dark:bg-[#1c1633] text-[#6554c0] dark:text-[#a78bfa]",
  } as const;
  return <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-md text-[11px] font-semibold ${map[tone]}`}>{children}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold text-ink-soft mb-1.5">{label}</span>
      {children}
    </label>
  );
}
const inputCls = "w-full h-9 px-3 rounded-lg bg-white dark:bg-[#2c2c2e] border border-[rgba(0,0,0,0.18)] dark:border-[rgba(255,255,255,0.18)] text-[13px] text-ink outline-none focus:border-[#2d7aff] transition-colors placeholder:text-ink-soft/60";

function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)]" onClick={onClose} />
      <div className={`panel-in relative glass-heavy rounded-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[85vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] sticky top-0 glass-heavy rounded-t-2xl">
          <h3 className="font-semibold text-[15px] text-ink">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 grid place-items-center rounded-lg text-ink-soft hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Kebab({ onClick, label = "More" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} aria-label={label} className="w-7 h-7 grid place-items-center rounded-lg text-ink-soft hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] hover:text-ink transition-colors">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
    </button>
  );
}

/* ============================================================ */
export default function AppPrototype() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [persona, setPersona] = useState<Persona>("owner");
  const [demo, setDemo] = useState<DemoState>("allowed");
  const [view, setView] = useState<BoardView>("kanban");
  const [modal, setModal] = useState<ModalKind>(null);
  const [settingsTab, setSettingsTab] = useState("Profile");
  const [selTask, setSelTask] = useState<number | null>(null);
  const [columnMenu, setColumnMenu] = useState<number | null>(null);
  const [settingsModalTab, setSettingsModalTab] = useState("Details");
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const isGuest = persona === "guest";
  const isObserver = persona === "observer";
  const canEdit = persona === "owner" || persona === "member";
  const canManage = persona === "owner";
  const showUpgrade = () => setModal("upgrade");

  const say = (m: string) => {
    setToast(m);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  const goBoard = () => { setScreen("board"); };

  return (
    <div className="appshell app-ambient min-h-screen text-ink font-body">
      {/* ============ TOP NAV (glass) ============ */}
      <header className="glass sticky top-0 z-40 h-14 flex items-center px-4 gap-3">
        <button className="md:hidden w-9 h-9 grid place-items-center rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setMobileNav(true)} aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <button onClick={() => setScreen("dashboard")} className="flex items-center gap-2 font-bold text-[15px]">
          <LogoMark className="w-7 h-7" />
          <span className="text-ink">Finolo</span>
        </button>
        {screen === "admin" && <Chip tone="purple">Super Admin</Chip>}

        <div className="flex-1" />

        {/* language */}
        <div className="hidden sm:flex items-center rounded-lg border border-[rgba(0,0,0,0.14)] dark:border-[rgba(255,255,255,0.16)] p-0.5 text-[11px] font-bold">
          <span className="px-2 py-1 rounded-md bg-[#2d7aff] text-white">EN</span>
          <span className="px-2 py-1 text-ink-soft">FA</span>
        </div>
        {/* theme */}
        <button aria-label="Toggle theme" className="w-9 h-9 grid place-items-center rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] text-ink-soft">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5"><path d="M20 12.5A8 8 0 1 1 11.5 4a6.5 6.5 0 0 0 8.5 8.5Z" /></svg>
        </button>
        {/* bell */}
        <div className="relative">
          <button onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications" className="relative w-9 h-9 grid place-items-center rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] text-ink-soft">
            <IconBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c9372c]" />
          </button>
          {notifOpen && (
            <div className="panel-in absolute right-0 mt-2 w-80 glass-heavy rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 h-11 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
                <strong className="text-[13px]">Notifications</strong>
                <button className="text-[11px] font-semibold text-[#2d7aff]" onClick={() => say("Marked all as read")}>Mark all as read</button>
              </div>
              {["Amir mentioned you in “Billing webhooks”", "New invite: Project Apollo", "Task “Design login flow” is overdue"].map((n, i) => (
                <button key={i} onClick={() => { setNotifOpen(false); goBoard(); }} className="w-full text-left px-4 py-3 text-[12.5px] hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.06)] transition-colors border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.06)] last:border-0">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2d7aff] mr-2" />{n}
                </button>
              ))}
              <button onClick={() => { setNotifOpen(false); }} className="w-full h-9 text-[12px] font-semibold text-[#2d7aff] hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.06)]">View all notifications</button>
            </div>
          )}
        </div>
        {/* avatar */}
        {!isGuest ? (
          <button onClick={() => setScreen("settings")} className="flex items-center gap-2 rounded-lg pl-1 pr-2 h-9 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <span className="w-7 h-7 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[11px] font-bold">SM</span>
            <span className="hidden sm:block text-[12.5px] font-semibold">Sara</span>
          </button>
        ) : (
          <Btn sm onClick={() => say("Redirecting to /register…")}>Join Finolo</Btn>
        )}
      </header>

      {/* ============ BODY: sidenav + content ============ */}
      <div className="flex">
        {/* ---- desktop sidenav (glass) ---- */}
        {!isGuest && (
          <aside className="glass hidden md:flex flex-col w-[220px] shrink-0 sticky top-14 h-[calc(100vh-56px)] py-3 border-r border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
            {screen === "admin" ? <AdminNav /> : NAV.map((n) => (
              <button key={n.id} onClick={() => setScreen(n.id)}
                className={`flex items-center gap-3 mx-2 px-3 h-9 rounded-lg text-[13px] font-medium transition-all duration-150 ${screen === n.id ? "bg-[#e8f0fe] dark:bg-[#1a2f5e] text-[#2d7aff] dark:text-[#7aaaff] font-semibold" : "text-ink-soft hover:text-ink hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.07)]"}`}>
                {n.icon("w-[18px] h-[18px]")}
                {n.label}
              </button>
            ))}
            <div className="mt-auto px-4 pt-3 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
              <button onClick={() => say("Signed out")} className="text-[12.5px] font-medium text-ink-soft hover:text-[#c9372c] transition-colors">Sign Out</button>
            </div>
          </aside>
        )}

        {/* ---- mobile drawer ---- */}
        {mobileNav && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)]" onClick={() => setMobileNav(false)} />
            <div className="panel-in absolute left-0 top-0 bottom-0 w-64 glass-heavy flex flex-col py-3">
              <div className="flex items-center gap-2 px-4 pb-3 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
                <span className="w-8 h-8 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[12px] font-bold">SM</span>
                <div><div className="text-[13px] font-semibold">Sara Mohammadi</div><div className="text-[11px] text-ink-soft">sara@finolo.ir</div></div>
              </div>
              <div className="py-2 flex-1 overflow-y-auto">
                {NAV.map((n) => (
                  <button key={n.id} onClick={() => { setScreen(n.id); setMobileNav(false); }}
                    className={`w-full flex items-center gap-3 px-4 h-10 text-[13px] ${screen === n.id ? "text-[#2d7aff] font-semibold" : "text-ink-soft"}`}>
                    {n.icon("w-[18px] h-[18px]")} {n.label}
                  </button>
                ))}
              </div>
              <button onClick={() => { setMobileNav(false); say("Signed out"); }} className="px-4 h-11 text-left text-[13px] text-[#c9372c] font-medium border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">Sign Out</button>
            </div>
          </div>
        )}

        {/* ---- main content ---- */}
        <main className="flex-1 min-w-0 p-4 md:p-6">
          {/* prototype control bar */}
          <ControlBar persona={persona} setPersona={setPersona} demo={demo} setDemo={setDemo} screen={screen} setScreen={setScreen} />

          <div key={screen + demo} className="panel-in">
            {screen === "dashboard" && <DashboardView demo={demo} goBoard={goBoard} setScreen={setScreen} />}
            {screen === "workspaces" && <WorkspacesView setModal={setModal} demo={demo} />}
            {screen === "projects" && <ProjectsView demo={demo} goBoard={goBoard} canManage={canManage} setModal={setModal} showUpgrade={showUpgrade} />}
            {screen === "board" && (
              <BoardView2
                demo={demo} view={view} setView={setView} canEdit={canEdit} isObserver={isObserver} isGuest={isGuest}
                columnMenu={columnMenu} setColumnMenu={setColumnMenu} setModal={setModal} setSelTask={setSelTask}
                showUpgrade={showUpgrade} setScreen={setScreen} say={say}
              />
            )}
            {screen === "teams" && <TeamsView canManage={canManage} />}
            {screen === "messages" && <MessagesView />}
            {screen === "time" && <TimeView isObserver={isObserver} canEdit={canEdit} setModal={setModal} showUpgrade={showUpgrade} />}
            {screen === "analytics" && <AnalyticsView showUpgrade={showUpgrade} isObserver={isObserver} />}
            {screen === "search" && <SearchView goBoard={goBoard} />}
            {screen === "docs" && <DocsView />}
            {screen === "settings" && <SettingsView tab={settingsTab} setTab={setSettingsTab} showUpgrade={showUpgrade} say={say} />}
            {screen === "admin" && <AdminView />}
          </div>

          <FutureSection />
        </main>
      </div>

      {/* ============ mobile bottom nav ============ */}
      {!isGuest && (
        <nav className="glass md:hidden fixed bottom-0 inset-x-0 z-40 h-14 flex items-center justify-around">
          {(["dashboard", "projects", "search"] as Screen[]).map((s) => {
            const n = NAV.find((x) => x.id === s)!;
            return (
              <button key={s} onClick={() => setScreen(s)} className={`flex flex-col items-center gap-0.5 text-[10px] ${screen === s ? "text-[#2d7aff] font-semibold" : "text-ink-soft"}`}>
                {n.icon("w-5 h-5")} {n.label}
              </button>
            );
          })}
          <button onClick={() => setMobileNav(true)} className="flex flex-col items-center gap-0.5 text-[10px] text-ink-soft">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></svg>
            More
          </button>
        </nav>
      )}

      {/* ============ overlays ============ */}
      {selTask !== null && <TaskDrawer taskId={selTask} onClose={() => setSelTask(null)} canEdit={canEdit} isObserver={isObserver} />}
      <Modal open={modal === "addTask"} onClose={() => setModal(null)} title="Add Task">
        <AddTaskForm onCancel={() => setModal(null)} onDone={() => { setModal(null); say("Task created"); }} showUpgrade={showUpgrade} />
      </Modal>
      <Modal open={modal === "createWorkspace"} onClose={() => setModal(null)} title="Create Workspace">
        <div className="space-y-3">
          <Field label="Workspace Name"><input className={inputCls} placeholder="Acme Inc." /></Field>
          <Field label="Slug (optional)"><input className={inputCls} placeholder="acme" /></Field>
          <Field label="Description"><input className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Visibility"><select className={inputCls}><option>Private</option><option>Workspace</option><option>Public</option></select></Field>
            <Field label="Type"><select className={inputCls}><option>Team</option><option>Department</option><option>Company</option><option>Personal</option><option>Client</option></select></Field>
          </div>
          <div className="flex justify-end gap-2 pt-1"><Btn variant="default" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={() => { setModal(null); say("Workspace created"); }}>Create Workspace</Btn></div>
        </div>
      </Modal>
      <Modal open={modal === "createProject"} onClose={() => setModal(null)} title="Create Project">
        <div className="space-y-3">
          <Field label="Project Name"><input className={inputCls} placeholder="Apollo" /></Field>
          <Field label="Description"><input className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status"><select className={inputCls}><option>Active</option><option>On Hold</option><option>Completed</option></select></Field>
            <Field label="Priority"><select className={inputCls}><option>Medium</option><option>High</option><option>Urgent</option></select></Field>
          </div>
          <Field label="Board Type"><select className={inputCls}><option>Kanban</option><option>List</option><option>Tree</option><option>Graph</option><option>Calendar</option><option>Timeline</option></select></Field>
          <div className="flex justify-end gap-2 pt-1"><Btn variant="default" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={() => { setModal(null); goBoard(); say("Project created"); }}>Create Project</Btn></div>
        </div>
      </Modal>
      <Modal open={modal === "addEntry"} onClose={() => setModal(null)} title="Add Time Entry">
        <div className="space-y-3">
          <Field label="Task"><select className={inputCls}>{TASKS.map((t) => <option key={t.id}>{t.title}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start"><input type="time" className={inputCls} /></Field>
            <Field label="End"><input type="time" className={inputCls} /></Field>
          </div>
          <label className="flex items-center gap-2 text-[13px] font-medium"><input type="checkbox" className="accent-[#2d7aff]" /> Billable <Chip tone="orange">Upgrade</Chip></label>
          <div className="flex justify-end gap-2 pt-1"><Btn variant="default" onClick={() => setModal(null)}>Cancel</Btn><Btn onClick={() => { setModal(null); say("Entry added"); }}>Add Entry</Btn></div>
        </div>
      </Modal>
      <Modal open={modal === "share"} onClose={() => setModal(null)} title="Share “Apollo”">
        <div className="space-y-4">
          <div>
            <div className="text-[12px] font-semibold text-ink-soft mb-1.5">Public sharing</div>
            <div className="flex items-center gap-2">
              <input readOnly className={inputCls} value="https://finolo.ir/share/a91xk2" />
              <Btn onClick={() => say("Link copied")}>Copy</Btn>
            </div>
            <div className="flex gap-2 mt-2"><Btn variant="default" sm>Create new link</Btn><Btn variant="danger" sm>Turn off all</Btn></div>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-ink-soft mb-1.5">What observers can see</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[["Board", true], ["Documents", true], ["Attachments", true], ["Members", false], ["Activity", false], ["Time logs", false], ["Reports", false]].map(([k, on]) => (
                <label key={k as string} className="flex items-center justify-between text-[13px] font-medium">
                  {k as string}
                  <input type="checkbox" defaultChecked={on as boolean} className="accent-[#2d7aff]" />
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end"><Btn onClick={() => { setModal(null); say("Visibility saved"); }}>Save visibility</Btn></div>
        </div>
      </Modal>
      <Modal open={modal === "projectSettings"} onClose={() => setModal(null)} title="Project settings · Apollo" wide>
        <ProjectSettingsModal tab={settingsModalTab} setTab={setSettingsModalTab} canManage={canManage} showUpgrade={showUpgrade} say={say} />
      </Modal>

      {/* Upgrade modal */}
      <Modal open={modal === "upgrade"} onClose={() => setModal(null)} title="Upgrade your plan">
        <div className="text-center py-2">
          <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-[#e8f0fe] dark:bg-[#0d1f40] text-[#2d7aff] mb-4"><IconBolt className="w-7 h-7" /></span>
          <p className="text-[13.5px] text-ink-soft leading-6">This feature is available on the <strong className="text-ink">Pro</strong> plan. Upgrade to unlock recurring tasks, share links, CI/CD, analytics and more.</p>
          <div className="flex justify-center gap-2 mt-5">
            <Btn variant="default" onClick={() => setModal(null)}>Not now</Btn>
            <Btn onClick={() => { setModal(null); setScreen("settings"); setSettingsTab("Billing"); }}>View plans</Btn>
          </div>
          <p className="text-[11px] text-ink-soft mt-3">Prices in Toman · Cancel anytime</p>
        </div>
      </Modal>

      {/* toast */}
      {toast && (
        <div className="panel-in fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] glass-heavy rounded-xl px-4 h-10 flex items-center gap-2 text-[13px] font-medium shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#22a06b]" /> {toast}
        </div>
      )}
    </div>
  );
}

/* ================= control bar ================= */
function ControlBar({ persona, setPersona, demo, setDemo, screen, setScreen }: {
  persona: Persona; setPersona: (p: Persona) => void; demo: DemoState; setDemo: (d: DemoState) => void;
  screen: Screen; setScreen: (s: Screen) => void;
}) {
  return (
    <div className="mb-5 rounded-xl border border-dashed border-[#2d7aff]/40 bg-[#2d7aff]/5 p-3 flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d7aff]">Prototype controls</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-semibold text-ink-soft">Actor:</span>
        {(["owner", "member", "observer", "guest"] as Persona[]).map((p) => (
          <button key={p} onClick={() => setPersona(p)} className={`h-6 px-2.5 rounded-md text-[11px] font-semibold capitalize transition-colors ${persona === p ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]"}`}>{p}</button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-semibold text-ink-soft">State:</span>
        {(["allowed", "loading", "empty", "error", "denied"] as DemoState[]).map((d) => (
          <button key={d} onClick={() => setDemo(d)} className={`h-6 px-2.5 rounded-md text-[11px] font-semibold capitalize transition-colors ${demo === d ? "bg-ink text-paper" : "text-ink-soft hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]"}`}>{d}</button>
        ))}
      </div>
      <button onClick={() => setScreen(screen === "admin" ? "dashboard" : "admin")} className="ml-auto h-7 px-3 rounded-lg text-[11px] font-bold bg-[#6554c0] text-white hover:opacity-90 transition-opacity">
        {screen === "admin" ? "Exit admin console" : "Open admin console"}
      </button>
    </div>
  );
}

/* ================= state helpers ================= */
function StateBlock({ demo, empty, children }: { demo: DemoState; empty: React.ReactNode; children: React.ReactNode }) {
  if (demo === "loading")
    return (
      <div className="space-y-3" aria-busy>
        {[90, 70, 80, 60].map((w, i) => (
          <div key={i} className="app-surface rounded-xl h-14 animate-pulse" style={{ width: `${w}%` }} />
        ))}
        <p className="text-[12px] text-ink-soft">Loading…</p>
      </div>
    );
  if (demo === "empty") return <>{empty}</>;
  if (demo === "error")
    return (
      <div className="app-surface rounded-xl p-8 text-center" role="alert">
        <p className="font-semibold text-[14px] text-[#c9372c]">Something went wrong.</p>
        <p className="text-[12.5px] text-ink-soft mt-1">We couldn't load this view. Check your connection.</p>
        <Btn className="mt-4" onClick={() => undefined}>Retry</Btn>
      </div>
    );
  if (demo === "denied")
    return (
      <div className="app-surface rounded-xl p-8 text-center" role="alert">
        <p className="font-semibold text-[14px] text-[#c9372c]">403 — You don't have permission</p>
        <p className="text-[12.5px] text-ink-soft mt-1">This action requires a permission your role doesn't have.</p>
      </div>
    );
  return <>{children}</>;
}

function EmptyBox({ icon, title, sub, cta }: { icon: React.ReactNode; title: string; sub?: string; cta?: React.ReactNode }) {
  return (
    <div className="app-surface rounded-xl p-10 text-center">
      <div className="mx-auto w-12 h-12 grid place-items-center rounded-2xl bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] text-ink-soft mb-3">{icon}</div>
      <p className="font-semibold text-[14px]">{title}</p>
      {sub && <p className="text-[12.5px] text-ink-soft mt-1">{sub}</p>}
      {cta && <div className="mt-4 flex justify-center">{cta}</div>}
    </div>
  );
}

/* ================= screens ================= */
function DashboardView({ demo, goBoard, setScreen }: { demo: DemoState; goBoard: () => void; setScreen: (s: Screen) => void }) {
  const stats = [
    { label: "My Tasks", v: 12 }, { label: "Completed", v: 34 }, { label: "Overdue", v: 2 }, { label: "Active projects", v: 5 },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Welcome back, Sara 👋</h1>
          <p className="text-[13px] text-ink-soft mt-1">Here's what's moving across your projects.</p>
        </div>
        <div className="flex gap-2"><Btn variant="default" sm>Refresh</Btn><Btn sm onClick={() => setScreen("projects")}>View Projects</Btn></div>
      </div>

      <StateBlock demo={demo} empty={<EmptyBox icon={<IconKanban className="w-6 h-6" />} title="No workspaces yet" sub="Create a workspace to start your first project." cta={<Btn onClick={() => setScreen("workspaces")}>Create Workspace</Btn>} />}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <button key={s.label} onClick={() => setScreen("analytics")} className="app-surface rounded-xl p-4 text-left hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="font-display text-3xl tabular-nums">{s.v}</div>
              <div className="text-[12px] font-semibold text-ink-soft mt-1">{s.label}</div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
          <div className="app-surface rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[14px]">My Tasks</h2>
              <div className="flex gap-1">{["All", "Open", "In Progress", "Completed"].map((f, i) => (
                <button key={f} className={`h-6 px-2 rounded-md text-[11px] font-semibold ${i === 0 ? "bg-[#e8f0fe] text-[#2d7aff]" : "text-ink-soft hover:bg-[rgba(0,0,0,0.05)]"}`}>{f}</button>
              ))}</div>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.07)]">
              {TASKS.slice(0, 4).map((t) => (
                <button key={t.id} onClick={goBoard} className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)] rounded-lg px-2 transition-colors">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLOR[t.status]}`} />
                  <span className="flex-1 text-[13px] font-medium truncate">{t.title}</span>
                  <span className={`text-[11px] font-semibold ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</span>
                  <span className="text-[11px] text-ink-soft tabular-nums">{t.due}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="app-surface rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-[14px]">My Analytics</h2>
                <button onClick={() => setScreen("analytics")} className="text-[12px] font-semibold text-[#2d7aff]">Full report</button>
              </div>
              <MiniChart />
            </div>
            <div className="app-surface rounded-xl p-4 flex items-center justify-between">
              <div><div className="text-[12px] font-semibold text-ink-soft">Points</div><div className="font-display text-2xl tabular-nums mt-0.5">1,240</div></div>
              <span className="w-10 h-10 grid place-items-center rounded-full bg-[#fffae6] dark:bg-[#2d1e04] text-[#e2811a]"><IconBolt className="w-5 h-5" /></span>
            </div>
          </div>
        </div>
      </StateBlock>
    </div>
  );
}

function MiniChart() {
  return (
    <svg viewBox="0 0 220 70" className="w-full h-20" fill="none">
      <path d="M4 58C30 52 44 40 64 42s30 14 50 8 28-24 46-26 34 6 56-14" stroke="#2d7aff" strokeWidth="2.5" strokeLinecap="round" className="spark-path" />
      <circle cx="214" cy="10" r="4" fill="#2d7aff" />
    </svg>
  );
}

function WorkspacesView({ setModal, demo }: { setModal: (m: ModalKind) => void; demo: DemoState }) {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-2xl md:text-3xl">Workspaces</h1>
        <Btn onClick={() => setModal("createWorkspace")}><IconPlus className="w-4 h-4" /> Create Workspace</Btn>
      </div>
      <StateBlock demo={demo} empty={<EmptyBox icon={<IconGrip className="w-6 h-6" />} title="No workspaces yet" cta={<Btn onClick={() => setModal("createWorkspace")}>Create Workspace</Btn>} />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[["Acme Inc.", "Company", "8 members"], ["Product Team", "Team", "5 members"], ["Client — Aria", "Client", "3 members"]].map(([n, t, m]) => (
            <div key={n} className="app-surface rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <span className="w-9 h-9 grid place-items-center rounded-lg bg-[#e8f0fe] dark:bg-[#0d1f40] text-[#2d7aff] font-bold">{n[0]}</span>
                <Kebab onClick={() => undefined} />
              </div>
              <div className="font-semibold text-[14px] mt-3">{n}</div>
              <div className="flex gap-1.5 mt-2"><Chip tone="blue">{t}</Chip><Chip>{m}</Chip></div>
            </div>
          ))}
        </div>
      </StateBlock>
    </div>
  );
}

function ProjectsView({ demo, goBoard, canManage, setModal, showUpgrade }: { demo: DemoState; goBoard: () => void; canManage: boolean; setModal: (m: ModalKind) => void; showUpgrade: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-2xl md:text-3xl">Projects</h1>
        <div className="flex gap-2">
          <Btn variant="default" sm onClick={showUpgrade}>Import Project</Btn>
          <Btn onClick={() => setModal("createProject")}><IconPlus className="w-4 h-4" /> Create Project</Btn>
        </div>
      </div>
      <input className={`${inputCls} max-w-sm`} placeholder="Search projects…" />
      <StateBlock demo={demo} empty={<EmptyBox icon={<IconKanban className="w-6 h-6" />} title="No projects yet" sub="Create your first project to get a board." cta={<Btn onClick={() => setModal("createProject")}>Create Project</Btn>} />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[["Apollo", "Acme Inc.", 68, "Active", "High"], ["Website Revamp", "Product Team", 41, "On Hold", "Medium"], ["Mobile App", "Client — Aria", 90, "Active", "Urgent"]].map(([n, w, p, s, pr]) => (
            <div key={n as string} className="app-surface rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={goBoard}>
              <div className="flex items-start justify-between">
                <div className="font-semibold text-[14px]">{n}</div>
                {canManage && <Kebab onClick={() => undefined} />}
              </div>
              <div className="text-[11.5px] text-ink-soft mt-0.5">{w}</div>
              <div className="mt-3 h-1.5 rounded-full bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.12)] overflow-hidden">
                <div className="h-full rounded-full bg-[#2d7aff]" style={{ width: `${p}%` }} />
              </div>
              <div className="flex gap-1.5 mt-3">
                <Chip tone={s === "Active" ? "green" : "orange"}>{s as string}</Chip>
                <Chip tone={pr === "Urgent" ? "red" : "neutral"}>{pr as string}</Chip>
                <span className="ml-auto text-[11px] font-semibold text-ink-soft tabular-nums">{p as number}%</span>
              </div>
            </div>
          ))}
        </div>
      </StateBlock>
    </div>
  );
}

/* ================= board ================= */
function BoardView2(p: {
  demo: DemoState; view: BoardView; setView: (v: BoardView) => void; canEdit: boolean; isObserver: boolean; isGuest: boolean;
  columnMenu: number | null; setColumnMenu: (n: number | null) => void; setModal: (m: ModalKind) => void;
  setSelTask: (n: number) => void; showUpgrade: () => void; setScreen: (s: Screen) => void; say: (m: string) => void;
}) {
  const views: { id: BoardView; label: string }[] = [
    { id: "kanban", label: "Kanban" }, { id: "list", label: "List" }, { id: "tree", label: "Tree" },
    { id: "graph", label: "Graph" }, { id: "calendar", label: "Calendar" }, { id: "timeline", label: "Timeline" },
  ];
  const viewsAllowed: BoardView[] = p.isObserver ? ["kanban", "list"] : views.map((v) => v.id);

  return (
    <div className="space-y-4">
      {/* board header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-xl md:text-2xl">Apollo</h1>
        <Chip tone="green">Active</Chip>
        {p.isObserver && <Chip tone="purple">Observer</Chip>}
        <div className="flex-1" />
        <input className={`${inputCls} !w-44 md:!w-56`} placeholder="Search tasks…" />
        {!p.isGuest && <Kebab label="Project actions" onClick={() => p.setModal("projectSettings")} />}
        <Btn sm variant="default" onClick={() => p.setScreen("settings")}>Info</Btn>
      </div>

      {/* view switcher */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {views.map((v) => {
          const ok = viewsAllowed.includes(v.id);
          return (
            <button key={v.id} onClick={() => ok && p.setView(v.id)} disabled={!ok}
              className={`h-8 px-3 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-colors ${p.view === v.id ? "bg-[#2d7aff] text-white" : ok ? "text-ink-soft hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]" : "text-ink-soft/40 cursor-not-allowed"}`}>
              {v.label}{!ok && " 🔒"}
            </button>
          );
        })}
        <div className="flex-1" />
        <span className="text-[11px] text-ink-soft whitespace-nowrap">CI/CD: <span className="text-[#22a06b] font-semibold">passing</span></span>
      </div>

      <StateBlock demo={p.demo} empty={
        <EmptyBox icon={<IconKanban className="w-6 h-6" />} title="No board sections yet"
          sub={p.canEdit ? "Add a section to start building your board." : "This board has no sections."}
          cta={p.canEdit ? <Btn onClick={() => p.say("Section added")}><IconPlus className="w-4 h-4" /> Add section</Btn> : undefined} />
      }>
        {p.view === "kanban" && <KanbanPane {...p} />}
        {p.view === "list" && <ListPane setSelTask={p.setSelTask} />}
        {p.view === "tree" && <TreePane setSelTask={p.setSelTask} />}
        {p.view === "graph" && <GraphPane setSelTask={p.setSelTask} />}
        {p.view === "calendar" && <CalendarPane setSelTask={p.setSelTask} />}
        {p.view === "timeline" && <TimelinePane setSelTask={p.setSelTask} />}
      </StateBlock>
    </div>
  );
}

function KanbanPane(p: ReturnType<typeof Object> & {
  canEdit: boolean; columnMenu: number | null; setColumnMenu: (n: number | null) => void;
  setModal: (m: ModalKind) => void; setSelTask: (n: number) => void; showUpgrade: () => void;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-4 items-start">
      {COLS.map((col) => {
        const cards = TASKS.filter((t) => t.col === col.id);
        return (
          <div key={col.id} className="app-surface rounded-xl p-3">
            <div className="flex items-center gap-2 px-1 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${col.tint}`} />
              <span className="text-[13px] font-semibold">{col.name}</span>
              <span className="text-[11px] text-ink-soft tabular-nums">{cards.length}</span>
              <div className="flex-1" />
              <div className="relative">
                <Kebab onClick={() => p.setColumnMenu(p.columnMenu === col.id ? null : col.id)} label="Column actions" />
                {p.columnMenu === col.id && (
                  <div className="panel-in absolute right-0 mt-1 w-44 glass-heavy rounded-lg overflow-hidden z-20">
                    {p.canEdit && <MenuItem onClick={() => { p.setColumnMenu(null); p.setModal("addTask"); }}>Add task</MenuItem>}
                    {p.canEdit && <MenuItem onClick={() => p.setColumnMenu(null)}>Rename column</MenuItem>}
                    <MenuItem onClick={() => p.setColumnMenu(null)}>Export as JSON</MenuItem>
                    {p.canEdit && <MenuItem danger onClick={() => p.setColumnMenu(null)}>Delete column</MenuItem>}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2.5">
              {cards.map((t) => <TaskCard key={t.id} t={t} onOpen={() => p.setSelTask(t.id)} canEdit={p.canEdit} showUpgrade={p.showUpgrade} />)}
            </div>
            {p.canEdit && (
              <button onClick={() => p.setModal("addTask")} className="mt-2.5 w-full h-8 rounded-lg border border-dashed border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.25)] text-[12.5px] font-medium text-ink-soft hover:border-[#2d7aff] hover:text-[#2d7aff] transition-colors flex items-center justify-center gap-1">
                <IconPlus className="w-3.5 h-3.5" /> Add Task
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`w-full text-left px-3 h-9 text-[12.5px] font-medium transition-colors ${danger ? "text-[#c9372c] hover:bg-[#fff2f0] dark:hover:bg-[#2d0f0f]" : "hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.07)]"}`}>
      {children}
    </button>
  );
}

function TaskCard({ t, onOpen, canEdit, showUpgrade }: { t: (typeof TASKS)[number]; onOpen: () => void; canEdit: boolean; showUpgrade: () => void }) {
  return (
    <div onClick={onOpen} className="group relative bg-white dark:bg-[#2c2c2e] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.14)] rounded-lg p-3 cursor-pointer hover:border-[#2d7aff] hover:shadow-md transition-all duration-150">
      {t.blocked && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 grid place-items-center rounded-full bg-[#c9372c] text-white text-[8px] font-bold" title="Blocked">!</span>}
      <div className="text-[13px] font-medium leading-5">{t.title}</div>
      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
        <Chip tone="blue">{t.tags[0]}</Chip>
        {t.comments > 0 && <span className="text-[10.5px] text-ink-soft font-semibold">💬 {t.comments}</span>}
        <span className="flex-1" />
        <span className={`text-[10.5px] font-bold ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</span>
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex -space-x-1.5">
          {t.assignees.map((a) => <span key={a} className="w-6 h-6 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[9px] font-bold border-2 border-white dark:border-[#2c2c2e]">{a}</span>)}
        </div>
        <span className="text-[10.5px] text-ink-soft tabular-nums">{t.due}</span>
      </div>
      {/* hover kebab */}
      {canEdit && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); showUpgrade(); }}>
          <Kebab label="Task actions" onClick={() => undefined} />
        </div>
      )}
    </div>
  );
}

function ListPane({ setSelTask }: { setSelTask: (n: number) => void }) {
  return (
    <div className="app-surface rounded-xl overflow-x-auto">
      <table className="w-full min-w-[560px] text-[13px]">
        <thead>
          <tr className="text-left text-[11px] font-bold text-ink-soft border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
            <th className="px-4 py-2.5">Task</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5">Priority</th><th className="px-4 py-2.5">Due</th>
          </tr>
        </thead>
        <tbody>
          {TASKS.map((t) => (
            <tr key={t.id} onClick={() => setSelTask(t.id)} className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.06)] last:border-0 hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors">
              <td className="px-4 py-3 font-medium">{t.title}</td>
              <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${STATUS_COLOR[t.status]}`} />{t.status}</span></td>
              <td className={`px-4 py-3 font-semibold ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</td>
              <td className="px-4 py-3 text-ink-soft tabular-nums">{t.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TreePane({ setSelTask }: { setSelTask: (n: number) => void }) {
  return (
    <div className="app-surface rounded-xl p-5 max-w-xl">
      {[
        { t: "Apollo (68%)", d: 0, kids: ["Design login flow", "Wire billing webhooks", "Refactor board reducer"] },
      ].map((n) => (
        <div key={n.t}>
          <div className="flex items-center gap-2 py-1.5 font-semibold text-[13.5px]"><IconTree className="w-4 h-4 text-[#2d7aff]" />{n.t}</div>
          {n.kids.map((k) => (
            <button key={k} onClick={() => setSelTask(1)} className="flex items-center gap-2 py-1.5 pl-7 text-[13px] text-ink-soft hover:text-[#2d7aff] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8e8e93]" />{k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function GraphPane({ setSelTask }: { setSelTask: (n: number) => void }) {
  return (
    <div className="app-surface rounded-xl p-4 overflow-x-auto">
      <svg viewBox="0 0 480 200" className="w-full min-w-[480px]">
        <line x1="120" y1="60" x2="230" y2="100" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
        <line x1="120" y1="150" x2="230" y2="100" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
        <line x1="250" y1="100" x2="370" y2="70" stroke="#2d7aff" strokeWidth="2" className="dash-live" />
        {[{ x: 100, y: 60, l: "Design" }, { x: 100, y: 150, l: "Backend" }, { x: 240, y: 100, l: "Build" }, { x: 380, y: 70, l: "Ship" }].map((n) => (
          <g key={n.l} className="cursor-pointer" onClick={() => setSelTask(1)}>
            <circle cx={n.x} cy={n.y} r="26" fill="#e8f0fe" stroke="#2d7aff" strokeWidth="1.5" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#2d7aff">{n.l}</text>
          </g>
        ))}
      </svg>
      <p className="text-[11px] text-ink-soft mt-2">Drag to pan · scroll to zoom · click a node to open the task.</p>
    </div>
  );
}

function CalendarPane({ setSelTask }: { setSelTask: (n: number) => void }) {
  return (
    <div className="app-surface rounded-xl p-4">
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="text-[11px] font-bold text-ink-soft py-1">{d}</div>)}
        {Array.from({ length: 28 }).map((_, i) => {
          const has = i === 4 || i === 11 || i === 18;
          return (
            <button key={i} onClick={() => has && setSelTask(1)} className={`aspect-square rounded-lg text-[12px] tabular-nums transition-colors ${has ? "bg-[#e8f0fe] text-[#2d7aff] font-bold hover:bg-[#dce7fd]" : "hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.06)]"}`}>
              {i + 1}{has && <span className="block mx-auto w-1 h-1 rounded-full bg-[#2d7aff] mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimelinePane({ setSelTask }: { setSelTask: (n: number) => void }) {
  return (
    <div className="app-surface rounded-xl p-5 space-y-3.5 overflow-x-auto">
      {[["Design login flow", 5, 25], ["Wire billing webhooks", 30, 30], ["Refactor board reducer", 45, 35], ["Calendar view spikes", 60, 25]].map(([n, s, w]) => (
        <div key={n as string} className="min-w-[480px]">
          <div className="text-[12px] font-semibold mb-1">{n}</div>
          <div className="h-6 rounded-md bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] relative">
            <button onClick={() => setSelTask(1)} className="absolute top-0.5 bottom-0.5 rounded bg-[#2d7aff] hover:brightness-110 transition-all" style={{ left: `${s}%`, width: `${w}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= task drawer ================= */
function TaskDrawer({ taskId, onClose, canEdit, isObserver }: { taskId: number; onClose: () => void; canEdit: boolean; isObserver: boolean }) {
  const t = TASKS.find((x) => x.id === taskId) ?? TASKS[0];
  const [tab, setTab] = useState("Details");
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)]" onClick={onClose} />
      <div className="panel-in relative glass-heavy w-full max-w-md h-full overflow-y-auto">
        <div className="sticky top-0 glass-heavy px-5 h-14 flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] z-10">
          <h3 className="font-semibold text-[14px] truncate pr-3">Task Details</h3>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 grid place-items-center rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <h2 className="font-display text-xl leading-6">{t.title}</h2>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <Chip tone="blue">{t.status}</Chip>
              <Chip tone={t.priority === "Urgent" ? "red" : "neutral"}>{t.priority}</Chip>
              {t.blocked && <Chip tone="red">Blocked</Chip>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div><div className="text-ink-soft font-semibold text-[11px]">Due date</div><div className="font-medium mt-0.5 tabular-nums">{t.due}</div></div>
            <div><div className="text-ink-soft font-semibold text-[11px]">Est. hours</div><div className="font-medium mt-0.5">6h</div></div>
            <div><div className="text-ink-soft font-semibold text-[11px]">Assignees</div><div className="flex gap-1 mt-1">{t.assignees.map((a) => <span key={a} className="w-6 h-6 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[9px] font-bold">{a}</span>)}</div></div>
            <div><div className="text-ink-soft font-semibold text-[11px]">Urgency</div><div className="font-medium mt-0.5">3 / 5</div></div>
          </div>

          <div className="flex gap-1 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
            {["Details", "Comments", "Checklists", "Attachments", "Activity"].map((x) => (
              <button key={x} onClick={() => setTab(x)} className={`h-9 px-3 text-[12.5px] font-semibold border-b-2 -mb-px transition-colors ${tab === x ? "border-[#2d7aff] text-[#2d7aff]" : "border-transparent text-ink-soft hover:text-ink"}`}>{x}</button>
            ))}
          </div>

          {tab === "Details" && (
            <div className="space-y-3">
              <Field label="Description"><textarea className={`${inputCls} h-24 py-2 resize-none`} defaultValue="Implement the login flow with Google and GitHub providers." disabled={!canEdit} /></Field>
              <Field label="Tags"><input className={inputCls} defaultValue={t.tags.join(", ")} placeholder="Select or create tags…" disabled={!canEdit} /></Field>
              {canEdit && <div className="flex gap-2 justify-end"><Btn variant="default" sm>Cancel</Btn><Btn sm>Save</Btn></div>}
              {isObserver && <p className="text-[12px] text-ink-soft bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)] rounded-lg p-3">You're viewing as an Observer — editing is read-only.</p>}
            </div>
          )}
          {tab === "Comments" && (
            <div className="space-y-3">
              {[["Amir", "Should we retry failed webhooks?"], ["Sara", "Yes — with exponential backoff."]].map(([u, m]) => (
                <div key={u} className="flex gap-2.5">
                  <span className="w-7 h-7 shrink-0 grid place-items-center rounded-full bg-[#6554c0] text-white text-[10px] font-bold">{u[0]}</span>
                  <div className="bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-[12.5px]"><strong className="font-semibold">{u}</strong> <span className="text-ink-soft">{m}</span></div>
                </div>
              ))}
              {canEdit && <input className={inputCls} placeholder="Add a comment… (@ to mention)" />}
            </div>
          )}
          {tab === "Checklists" && (
            <div className="space-y-2">
              {["Scope the API", "Write tests", "Ship to staging"].map((c, i) => (
                <label key={c} className="flex items-center gap-2.5 text-[13px]"><input type="checkbox" defaultChecked={i === 0} className="accent-[#2d7aff]" />{c}</label>
              ))}
            </div>
          )}
          {tab === "Attachments" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">{["#2d7aff", "#6554c0", "#22a06b"].map((c) => <div key={c} className="aspect-video rounded-lg" style={{ background: c }} />)}</div>
              {canEdit && <Btn variant="default" sm><IconPlus className="w-3.5 h-3.5" /> Upload File</Btn>}
            </div>
          )}
          {tab === "Activity" && (
            <div className="space-y-2.5 text-[12.5px] text-ink-soft">
              <p><strong className="text-ink">Sara</strong> changed status <span className="text-ink">Open → In Progress</span> · 2h ago</p>
              <p><strong className="text-ink">Amir</strong> added a comment · 5h ago</p>
              <button className="text-[#2d7aff] font-semibold">View all activity</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= add task form ================= */
function AddTaskForm({ onCancel, onDone, showUpgrade }: { onCancel: () => void; onDone: () => void; showUpgrade: () => void }) {
  const [recurring, setRecurring] = useState(false);
  return (
    <div className="space-y-3">
      <Field label="Task Title"><input className={inputCls} placeholder="What needs doing?" /></Field>
      <Field label="Description"><textarea className={`${inputCls} h-20 py-2 resize-none`} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status"><select className={inputCls}><option>Open</option><option>In Progress</option><option>Completed</option><option>Blocked</option><option>On hold</option><option>Cancelled</option></select></Field>
        <Field label="Priority"><select className={inputCls}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></Field>
        <Field label="Urgency (1–5)"><input type="number" min={1} max={5} defaultValue={3} className={inputCls} /></Field>
        <Field label="Estimated Hours"><input type="number" defaultValue={4} className={inputCls} /></Field>
      </div>
      <Field label="Tags"><input className={inputCls} placeholder="Select or create tags…" /></Field>
      <div className="rounded-lg border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.14)] p-3">
        <label className="flex items-center gap-2 text-[13px] font-medium">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="accent-[#2d7aff]" />
          Recurring task <Chip tone="orange">Upgrade</Chip>
        </label>
        {recurring && (
          <div className="mt-2 text-[12px] text-ink-soft bg-[#fffae6] dark:bg-[#2d1e04] rounded-lg p-2.5">
            Recurring tasks are a Pro feature. <button onClick={showUpgrade} className="text-[#2d7aff] font-semibold">Upgrade your plan</button>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-1"><Btn variant="default" onClick={onCancel}>Cancel</Btn><Btn onClick={onDone}>Add Task</Btn></div>
    </div>
  );
}

/* ================= project settings modal ================= */
function ProjectSettingsModal({ tab, setTab, canManage, showUpgrade, say }: { tab: string; setTab: (t: string) => void; canManage: boolean; showUpgrade: () => void; say: (m: string) => void }) {
  const tabs = ["Details", "Members & permissions", "Teams", "Job titles", "Integrations", "Sharing"];
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] mb-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`h-9 px-3 text-[12.5px] font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === t ? "border-[#2d7aff] text-[#2d7aff]" : "border-transparent text-ink-soft hover:text-ink"}`}>{t}</button>
        ))}
      </div>

      {tab === "Details" && (
        <div className="space-y-3">
          <Field label="Name"><input className={inputCls} defaultValue="Apollo" /></Field>
          <Field label="Description"><input className={inputCls} defaultValue="Q4 product release." /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status"><select className={inputCls}><option>Active</option><option>On Hold</option><option>Completed</option></select></Field>
            <Field label="Default board view"><select className={inputCls}><option>Kanban</option><option>List</option><option>Tree</option><option>Graph</option><option>Calendar</option><option>Timeline</option></select></Field>
          </div>
          <div className="flex justify-end"><Btn onClick={() => say("Project updated")}>Save</Btn></div>
        </div>
      )}

      {tab === "Members & permissions" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input className={inputCls} placeholder="Invite member by name or email…" />
            <Btn onClick={() => say("Invite sent")}>Send Invite</Btn>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.07)]">
            {[["Sara Mohammadi", "Owner", "Product Manager", false], ["Amir Karimi", "Member", "Backend", false], ["Negar Rastegar", "Observer", "ناظر", true]].map(([n, role, jt, obs]) => (
              <div key={n as string} className="flex items-center gap-3 py-2.5">
                <span className="w-8 h-8 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[11px] font-bold">{(n as string)[0]}</span>
                <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold truncate">{n}</div><div className="text-[11px] text-ink-soft">{jt}</div></div>
                <Chip tone={role === "Owner" ? "purple" : role === "Observer" ? "orange" : "blue"}>{role as string}</Chip>
                {obs ? (
                  <span className="text-[10.5px] text-ink-soft max-w-[150px] text-right">Observers use project visibility — adjust under Sharing.</span>
                ) : (
                  <button className="text-[11.5px] font-semibold text-[#2d7aff]" onClick={() => say("Permissions: 12/16 granted")}>Permissions</button>
                )}
                {canManage && role !== "Owner" && <button className="text-[11.5px] font-semibold text-[#c9372c]">Remove</button>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Teams" && (
        <div className="space-y-3">
          <div className="flex gap-2"><input className={inputCls} placeholder="Invite a team…" /><Btn onClick={() => say("Team invited")}>Send invite</Btn></div>
          <p className="text-[12px] text-ink-soft">Or <button className="text-[#2d7aff] font-semibold">create a new team</button>. Manage members on the Teams page.</p>
          <div className="app-surface rounded-lg p-3 flex items-center justify-between"><span className="text-[13px] font-medium">Platform Squad</span><Chip tone="green">Linked</Chip></div>
        </div>
      )}

      {tab === "Job titles" && (
        <div className="space-y-2.5">
          {["Product Manager", "Backend", "Observer / ناظر"].map((j, i) => (
            <div key={j} className="flex items-center justify-between app-surface rounded-lg px-3 h-10">
              <span className="text-[13px] font-medium">{j}</span>
              {i === 2 ? <Chip tone="orange">default</Chip> : <button className="text-[11.5px] text-[#c9372c] font-semibold">Remove</button>}
            </div>
          ))}
          <Btn variant="default" sm><IconPlus className="w-3.5 h-3.5" /> New job title</Btn>
        </div>
      )}

      {tab === "Integrations" && (
        <div className="space-y-3">
          <p className="text-[12.5px] text-ink-soft">CI/CD integrations only. Connect a repository to run builds from the board.</p>
          <div className="flex items-center justify-between"><span className="text-[13px] font-semibold">Connected</span><Btn sm onClick={showUpgrade}><IconPlus className="w-3.5 h-3.5" /> Add</Btn></div>
          <EmptyBox icon={<IconBolt className="w-6 h-6" />} title="No integrations yet" sub="Click “+ Add” to connect a provider." />
        </div>
      )}

      {tab === "Sharing" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between app-surface rounded-lg px-3 h-11">
            <span className="text-[13px] font-medium">Public sharing</span>
            <Btn sm onClick={showUpgrade}>Create public link</Btn>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-ink-soft mb-2">What observers can see</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[["Board", true], ["Documents", true], ["Attachments", true], ["Members", false], ["Activity", false], ["Time logs", false], ["Reports", false]].map(([k, on]) => (
                <label key={k as string} className="flex items-center justify-between text-[13px] font-medium">{k as string}<input type="checkbox" defaultChecked={on as boolean} className="accent-[#2d7aff]" /></label>
              ))}
            </div>
          </div>
          <div className="flex justify-end"><Btn onClick={() => say("Visibility saved")}>Save visibility</Btn></div>
        </div>
      )}
    </div>
  );
}

/* ================= remaining screens ================= */
function TeamsView({ canManage }: { canManage: boolean }) {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between"><h1 className="font-display text-2xl md:text-3xl">Teams</h1>{canManage && <Btn><IconPlus className="w-4 h-4" /> Create Team</Btn>}</div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[["Platform Squad", "5 members · Lead: Sara"], ["Growth", "3 members · Lead: Amir"]].map(([n, s]) => (
          <div key={n} className="app-surface rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3"><span className="w-10 h-10 grid place-items-center rounded-lg bg-[#e6f4ec] text-[#1f845a] font-bold">{n[0]}</span>
              <div><div className="font-semibold text-[14px]">{n}</div><div className="text-[11.5px] text-ink-soft mt-0.5">{s}</div></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesView() {
  const [sel, setSel] = useState(0);
  const convos = [["Amir Karimi", "Sure, pushing the fix now", "2m"], ["Negar Rastegar", "Can you review the board?", "1h"], ["Platform Squad", "Sara: standup in 10", "3h"]];
  return (
    <div className="app-surface rounded-xl overflow-hidden grid md:grid-cols-[280px_1fr] h-[560px]">
      <div className="border-r border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] flex flex-col">
        <div className="p-3 flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)]">
          <strong className="text-[14px]">Messages</strong><Btn sm><IconPlus className="w-3.5 h-3.5" /> New</Btn>
        </div>
        <input className={`${inputCls} !rounded-none !border-0 !border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)]`} placeholder="Search…" />
        <div className="flex-1 overflow-y-auto">
          {convos.map(([n, m, t], i) => (
            <button key={n} onClick={() => setSel(i)} className={`w-full text-left px-3 py-3 flex gap-2.5 transition-colors ${sel === i ? "bg-[#e8f0fe] dark:bg-[#1a2f5e]" : "hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)]"}`}>
              <span className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-[#6554c0] text-white text-[11px] font-bold">{n[0]}</span>
              <span className="min-w-0 flex-1"><span className="flex justify-between"><strong className="text-[13px] truncate">{n}</strong><span className="text-[10px] text-ink-soft">{t}</span></span>
                <span className="block text-[11.5px] text-ink-soft truncate mt-0.5">{i === 2 ? "Muted · " : ""}{m}</span></span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="h-12 px-4 flex items-center gap-3 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
          <strong className="text-[13.5px]">{convos[sel][0]}</strong>
          <span className="text-[11px] text-ink-soft">last seen 5m ago</span>
          <div className="flex-1" /><Kebab onClick={() => undefined} />
        </div>
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="max-w-[70%] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] rounded-2xl rounded-bl-md px-3.5 py-2 text-[13px]">Can you review the billing PR?</div>
          <div className="max-w-[70%] ml-auto bg-[#2d7aff] text-white rounded-2xl rounded-br-md px-3.5 py-2 text-[13px]">On it — looks good. <span className="block text-[9.5px] opacity-70 text-right mt-0.5">Seen ✓✓</span></div>
        </div>
        <div className="p-3 border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] flex gap-2">
          <input className={inputCls} placeholder="Message…" />
          <Btn>Send</Btn>
        </div>
      </div>
    </div>
  );
}

function TimeView({ isObserver, canEdit, setModal, showUpgrade }: { isObserver: boolean; canEdit: boolean; setModal: (m: ModalKind) => void; showUpgrade: () => void }) {
  if (isObserver) return <EmptyBox icon={<IconClock className="w-6 h-6" />} title="Time logs hidden" sub="Observer visibility for time logs is turned off." />;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-2xl md:text-3xl">Time Tracking</h1>
        <div className="flex gap-2">
          {canEdit && <Btn variant="default" sm onClick={showUpgrade}>Export Excel</Btn>}
          {canEdit && <Btn onClick={() => setModal("addEntry")}><IconPlus className="w-4 h-4" /> Add Entry</Btn>}
        </div>
      </div>
      <div className="flex gap-1">{["Today", "This Week", "This Month", "Custom"].map((r, i) => (
        <button key={r} className={`h-7 px-3 rounded-lg text-[12px] font-semibold ${i === 1 ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:bg-[rgba(0,0,0,0.05)]"}`}>{r}</button>
      ))}</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[["Total Hours", "38.5"], ["Billable Hours", "26.0"], ["Non-Billable", "12.5"], ["Entries", "14"]].map(([l, v]) => (
          <div key={l} className="app-surface rounded-xl p-4"><div className="font-display text-2xl tabular-nums">{v}</div><div className="text-[12px] font-semibold text-ink-soft mt-1">{l}</div></div>
        ))}
      </div>
      {canEdit && (
        <div className="app-surface rounded-xl p-4 flex items-center gap-3">
          <span className="w-10 h-10 grid place-items-center rounded-full bg-[#22a06b] text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5.5v13l11-6.5z" /></svg></span>
          <div className="flex-1 text-[13px] font-medium">Start Timer <span className="text-ink-soft font-normal">— pick a task to begin</span></div>
          <Btn sm>Start Timer</Btn>
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ showUpgrade, isObserver }: { showUpgrade: () => void; isObserver: boolean }) {
  if (isObserver) return <EmptyBox icon={<IconChart className="w-6 h-6" />} title="Reports hidden" sub="Observer visibility for reports is turned off." />;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-2"><h1 className="font-display text-2xl md:text-3xl">Analytics</h1><Chip tone="green">Live</Chip></div>
        <Btn variant="default" sm onClick={showUpgrade}>Export Excel</Btn>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[["Total Tasks", 128], ["Completed", 84], ["Active Projects", 5], ["Hours Logged", 210], ["Team Members", 9]].map(([l, v]) => (
          <div key={l as string} className="app-surface rounded-xl p-4"><div className="font-display text-2xl tabular-nums">{v}</div><div className="text-[12px] font-semibold text-ink-soft mt-1">{l}</div></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="app-surface rounded-xl p-4"><h2 className="font-semibold text-[14px] mb-2">Task Completion</h2><MiniChart /></div>
        <div className="app-surface rounded-xl p-4"><h2 className="font-semibold text-[14px] mb-2">Activity Heatmap</h2>
          <div className="grid grid-cols-14 gap-1">{Array.from({ length: 56 }).map((_, i) => (
            <span key={i} className="aspect-square rounded-[3px]" style={{ background: `rgba(45,122,255,${0.08 + ((i * 7) % 9) * 0.09})` }} />
          ))}</div>
        </div>
      </div>
    </div>
  );
}

function SearchView({ goBoard }: { goBoard: () => void }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="font-display text-2xl md:text-3xl">Search</h1>
      <input autoFocus className={`${inputCls} h-11 text-[14px]`} placeholder="Search… (Ctrl+K)  ·  try assignee: due: tag: status:" />
      <div className="flex gap-1">{["All", "Tasks", "Projects", "Users"].map((f, i) => (
        <button key={f} className={`h-7 px-3 rounded-lg text-[12px] font-semibold ${i === 0 ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:bg-[rgba(0,0,0,0.05)]"}`}>{f}</button>
      ))}</div>
      <div className="app-surface rounded-xl divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.07)]">
        {[["Wire billing webhooks", "Task · Apollo"], ["Design login flow", "Task · Apollo"], ["Apollo", "Project"]].map(([t, s]) => (
          <button key={t} onClick={goBoard} className="w-full text-left px-4 py-3 hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors">
            <div className="text-[13px] font-medium">{t}</div><div className="text-[11px] text-ink-soft mt-0.5">{s}</div>
          </button>
        ))}
      </div>
      <p className="text-[11.5px] text-ink-soft">Recent: billing · login — <button className="text-[#2d7aff] font-semibold">Save Search</button></p>
    </div>
  );
}

function DocsView() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="font-display text-2xl md:text-3xl">Documentation</h1>
      <div className="flex gap-1"><Chip tone="blue">MCP</Chip><Chip>API</Chip></div>
      <div className="app-surface rounded-xl p-4">
        <h2 className="font-semibold text-[14px] mb-2">Finolo MCP Server</h2>
        <p className="text-[12.5px] text-ink-soft leading-6">Connect your AI assistant to Finolo boards, tasks and projects. Create an API token in Settings → API Tokens.</p>
        <pre className="mt-3 rounded-lg bg-[#121214] text-[#7aaaff] text-[11.5px] p-3 overflow-x-auto" dir="ltr">npx finolo-mcp --token $FINOLO_TOKEN</pre>
      </div>
    </div>
  );
}

function SettingsView({ tab, setTab, showUpgrade, say }: { tab: string; setTab: (t: string) => void; showUpgrade: () => void; say: (m: string) => void }) {
  const tabs = ["Profile", "Account", "API Tokens", "Notifications", "Appearance", "Billing", "Danger Zone"];
  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl md:text-3xl">Settings</h1>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`h-8 px-3.5 rounded-lg text-[12.5px] font-semibold transition-colors ${tab === t ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)]"}`}>{t}</button>
        ))}
      </div>

      {tab === "Profile" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-3">
          <Field label="Full Name"><input className={inputCls} defaultValue="Sara Mohammadi" /></Field>
          <Field label="Email"><input className={inputCls} defaultValue="sara@finolo.ir" /></Field>
          <Field label="Bio"><textarea className={`${inputCls} h-20 py-2 resize-none`} defaultValue="Product manager. Ships on Fridays." /></Field>
          <div className="flex justify-end"><Btn onClick={() => say("Profile saved")}>Save changes</Btn></div>
        </div>
      )}
      {tab === "Account" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-4">
          <label className="flex items-center justify-between text-[13px] font-medium">Show last seen<input type="checkbox" defaultChecked className="accent-[#2d7aff]" /></label>
          <div className="border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] pt-4 space-y-3">
            <h3 className="font-semibold text-[13.5px]">Change Password</h3>
            <Field label="Current password"><input type="password" className={inputCls} /></Field>
            <Field label="New password"><input type="password" className={inputCls} /></Field>
            <div className="flex justify-end"><Btn onClick={() => say("Password updated")}>Update</Btn></div>
          </div>
        </div>
      )}
      {tab === "API Tokens" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-4">
          <div className="flex gap-2"><input className={inputCls} placeholder="Token name" /><Btn onClick={showUpgrade}>Create token</Btn></div>
          <p className="text-[12px] text-ink-soft">Tokens are shown once. API & MCP access is a Pro feature — <button className="text-[#2d7aff] font-semibold" onClick={showUpgrade}>Upgrade</button>.</p>
        </div>
      )}
      {tab === "Notifications" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-3">
          {["Email", "In-app", "Telegram", "Browser"].map((c, i) => (
            <label key={c} className="flex items-center justify-between text-[13px] font-medium">{c} notifications<input type="checkbox" defaultChecked={i < 2} className="accent-[#2d7aff]" /></label>
          ))}
        </div>
      )}
      {tab === "Appearance" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-3">
          <label className="flex items-center justify-between text-[13px] font-medium">Dark mode<input type="checkbox" className="accent-[#2d7aff]" /></label>
          <p className="text-[11.5px] text-ink-soft">Language is switched from the top bar (EN / FA). Appearance here controls dark mode only.</p>
        </div>
      )}
      {tab === "Billing" && (
        <div className="space-y-4">
          <div className="app-surface rounded-xl p-4 flex items-center justify-between max-w-lg"><span className="text-[13px] font-semibold">Current plan</span><Chip>Free</Chip></div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
            {[["Free", "0", ["3 projects", "5 members"]], ["Pro", "890,000", ["Unlimited projects", "Analytics", "CI/CD", "Share links"]], ["Business", "1,890,000", ["Everything in Pro", "SSO", "Priority support"]]].map(([n, p, f], i) => (
              <div key={n as string} className={`app-surface rounded-xl p-5 ${i === 1 ? "ring-2 ring-[#2d7aff]" : ""}`}>
                <div className="font-semibold text-[14px]">{n}{i === 1 && <Chip tone="blue">Popular</Chip>}</div>
                <div className="font-display text-2xl mt-2 tabular-nums">{p} <span className="text-[11px] font-body text-ink-soft">Toman / mo</span></div>
                <ul className="mt-3 space-y-1.5">{(f as string[]).map((x) => <li key={x} className="text-[12px] text-ink-soft flex gap-1.5"><IconCheck className="w-3.5 h-3.5 text-[#22a06b] shrink-0" />{x}</li>)}</ul>
                <Btn className="mt-4 w-full" variant={i === 1 ? "primary" : "default"} sm onClick={() => say(i === 0 ? "You're on Free" : "Redirecting to checkout…")}>{i === 0 ? "Current" : "Try Now"}</Btn>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "Danger Zone" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-3 border-[#c9372c]/40">
          <div className="flex items-center justify-between"><span className="text-[13px] font-medium">Export my data</span><Btn variant="default" sm onClick={() => say("Export queued")}>Export</Btn></div>
          <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] pt-3"><span className="text-[13px] font-medium text-[#c9372c]">Delete Account</span><Btn variant="danger" sm>Delete</Btn></div>
        </div>
      )}
    </div>
  );
}

/* ================= admin ================= */
function AdminNav() {
  const items = ["Overview", "Users", "Workspaces", "Projects", "Roles", "Teams", "Billing", "Points", "Messaging", "Integrations", "Notifications", "System settings", "Activity"];
  return (
    <>
      {items.map((n, i) => (
        <button key={n} className={`flex items-center gap-3 mx-2 px-3 h-9 rounded-lg text-[13px] font-medium transition-colors ${i === 0 ? "bg-[#e9e0ff] text-[#6554c0] font-semibold" : "text-ink-soft hover:text-ink hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.07)]"}`}>{n}</button>
      ))}
      <div className="mt-auto px-4 pt-3 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="text-[11px] text-ink-soft truncate mb-1">admin@finolo.ir</div>
        <button className="text-[12.5px] font-medium text-ink-soft hover:text-[#c9372c]">Sign Out</button>
      </div>
    </>
  );
}

function AdminView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2"><h1 className="font-display text-2xl md:text-3xl">Admin Overview</h1><Chip tone="purple">Super Admin</Chip></div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[["Users", 1240], ["Workspaces", 310], ["Projects", 820], ["Tasks", 15400], ["Active users", 460]].map(([l, v]) => (
          <div key={l as string} className="app-surface rounded-xl p-4"><div className="font-display text-2xl tabular-nums">{Number(v).toLocaleString()}</div><div className="text-[12px] font-semibold text-ink-soft mt-1">{l}</div></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="app-surface rounded-xl p-4"><h2 className="font-semibold text-[14px] mb-2">Signups</h2><MiniChart /></div>
        <div className="app-surface rounded-xl p-4">
          <h2 className="font-semibold text-[14px] mb-2">Recent signups</h2>
          <div className="divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.07)]">
            {[["sara@finolo.ir", "verified"], ["amir@acme.co", "pending"], ["negar@aria.ir", "verified"]].map(([e, s]) => (
              <div key={e} className="flex items-center justify-between py-2.5 text-[12.5px]"><span className="font-medium">{e}</span><Chip tone={s === "verified" ? "green" : "orange"}>{s}</Chip></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= DESIGN-INTENT (future) ================= */
function FutureSection() {
  const future = [
    ["Forgot password", "Sign-in card link → email → reset page"],
    ["Custom fields tab", "Project settings · manage_custom_fields"],
    ["Webhooks & Automations", "Project settings tabs · plan-gated"],
    ["Drawer: deps / subtasks / watchers", "Task Details editors"],
    ["Tag manager", "Create / edit / delete tags centrally"],
    ["Task templates panel", "Board · Use / Duplicate / Delete"],
    ["Board presence & typing", "presence.board.{id} subscription"],
    ["Command palette", "Ctrl+K overlay · SearchPolicy"],
    ["Archive browser + retention", "Browse / restore archived work"],
    ["Invoices & logout-all", "Settings → Billing / Account"],
  ];
  return (
    <div className="mt-12 pt-8 border-t-2 border-dashed border-[#6554c0]/40">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display text-xl md:text-2xl">Design-Intent</h2>
        <Chip tone="purple">FUTURE — not current chrome</Chip>
      </div>
      <p className="text-[13px] text-ink-soft max-w-2xl mb-5">These screens exist as API surface but are <strong className="text-ink">not</strong> in the shipped SPA. Designed here for the roadmap — never mixed into the current SideNav, Settings tabs or task drawer above.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {future.map(([t, d]) => (
          <div key={t} className="app-surface rounded-xl p-4 border-dashed !border-[#6554c0]/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between"><span className="font-semibold text-[13px]">{t}</span><Chip tone="purple">FUTURE</Chip></div>
            <p className="text-[11.5px] text-ink-soft mt-1.5 leading-5">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
