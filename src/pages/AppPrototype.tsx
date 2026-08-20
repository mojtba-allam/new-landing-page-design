import { useEffect, useRef, useState } from "react";
import {
  IconArrow, IconBell, IconBolt, IconCalendar, IconChart, IconCheck, IconClock,
  IconDashboard, IconGantt, IconGraph, IconGrip, IconKanban, IconList, IconPlus,
  IconShield, IconTree, IconUsers, LogoMark,
} from "../components/Icons";
import { useI18n, tr, num, type Pair } from "../lib/i18n";

/* ============================================================
   FINOLO — hi-fi interactive prototype (faithful to shipped IA)
   Bilingual فارسی (RTL) ⇄ English (LTR) · Toman
   ============================================================ */

const L = (fa: string, en: string): Pair => ({ fa, en });

type Persona = "owner" | "member" | "observer" | "guest";
type Screen =
  | "dashboard" | "workspaces" | "projects" | "board" | "teams" | "messages"
  | "time" | "analytics" | "search" | "docs" | "settings" | "admin";
type BoardView = "kanban" | "list" | "tree" | "graph" | "calendar" | "timeline";
type ModalKind = null | "addTask" | "projectSettings" | "share" | "upgrade" | "createWorkspace" | "createProject" | "addEntry";
type DemoState = "allowed" | "loading" | "empty" | "error" | "denied";

const NAV: { id: Screen; label: Pair; icon: (c: string) => React.ReactNode }[] = [
  { id: "dashboard", label: L("داشبورد", "Dashboard"), icon: (c) => <IconDashboard className={c} /> },
  { id: "workspaces", label: L("فضای‌های کاری", "Workspaces"), icon: (c) => <IconGrip className={c} /> },
  { id: "projects", label: L("پروژه‌ها", "Projects"), icon: (c) => <IconKanban className={c} /> },
  { id: "teams", label: L("تیم‌ها", "Teams"), icon: (c) => <IconUsers className={c} /> },
  { id: "messages", label: L("پیام‌ها", "Messages"), icon: (c) => <IconBell className={c} /> },
  { id: "time", label: L("گزارش زمان", "Time Tracking"), icon: (c) => <IconClock className={c} /> },
  { id: "analytics", label: L("تحلیل‌ها", "Analytics"), icon: (c) => <IconChart className={c} /> },
  { id: "search", label: L("جستجو", "Search"), icon: (c) => <IconList className={c} /> },
  { id: "docs", label: L("مستندات", "Documentation"), icon: (c) => <IconShield className={c} /> },
  { id: "settings", label: L("تنظیمات", "Settings"), icon: (c) => <IconBolt className={c} /> },
];

const STATUS_LABEL: Record<string, Pair> = {
  Open: L("باز", "Open"),
  "In Progress": L("در حال انجام", "In Progress"),
  Completed: L("تکمیل‌شده", "Completed"),
  Blocked: L("مسدود", "Blocked"),
  "On hold": L("متوقف", "On hold"),
  Cancelled: L("لغوشده", "Cancelled"),
};
const PRIORITY_LABEL: Record<string, Pair> = {
  Low: L("کم", "Low"), Medium: L("متوسط", "Medium"), High: L("زیاد", "High"), Urgent: L("فوری", "Urgent"),
};

type TaskT = { id: number; title: Pair; col: number; status: string; priority: string; due: Pair; assignees: string[]; comments: number; tags: string[]; blocked: boolean };
const TASKS: TaskT[] = [
  { id: 1, title: L("طراحی جریان ورود", "Design login flow"), col: 0, status: "Open", priority: "High", due: L("۶ آبان", "Oct 28"), assignees: ["SM", "AK"], comments: 3, tags: ["design"], blocked: false },
  { id: 2, title: L("اتصال وب‌هوک صورتحساب", "Wire billing webhooks"), col: 0, status: "Open", priority: "Urgent", due: L("۳ آبان", "Oct 25"), assignees: ["NR"], comments: 1, tags: ["backend"], blocked: true },
  { id: 3, title: L("بازسازی ردیوسر بورد", "Refactor board reducer"), col: 1, status: "In Progress", priority: "Medium", due: L("۱۱ آبان", "Nov 02"), assignees: ["GH"], comments: 5, tags: ["frontend"], blocked: false },
  { id: 4, title: L("اسپایک نمای تقویم", "Calendar view spikes"), col: 1, status: "In Progress", priority: "High", due: L("۱۴ آبان", "Nov 05"), assignees: ["SM"], comments: 2, tags: ["frontend"], blocked: false },
  { id: 5, title: L("انتشار مستندات MCP", "Ship MCP docs"), col: 2, status: "Completed", priority: "Low", due: L("۲۹ مهر", "Oct 20"), assignees: ["KT"], comments: 0, tags: ["docs"], blocked: false },
];
const COLS: { id: number; name: Pair; tint: string }[] = [
  { id: 0, name: L("برای انجام", "To Do"), tint: "bg-[#8e8e93]" },
  { id: 1, name: L("در حال انجام", "In Progress"), tint: "bg-[#2d7aff]" },
  { id: 2, name: L("تکمیل‌شده", "Done"), tint: "bg-[#22a06b]" },
];

const STATUS_COLOR: Record<string, string> = {
  Open: "bg-[#8e8e93]", "In Progress": "bg-[#2d7aff]", Completed: "bg-[#22a06b]",
  Blocked: "bg-[#c9372c]", "On hold": "bg-[#e2811a]", Cancelled: "bg-[#943d73]",
};
const PRIORITY_COLOR: Record<string, string> = {
  Urgent: "text-[#c9372c]", High: "text-[#e56910]", Medium: "text-[#2d7aff]", Low: "text-[#22a06b]",
};

const VIEWS: { id: BoardView; label: Pair }[] = [
  { id: "kanban", label: L("کانبان", "Kanban") }, { id: "list", label: L("لیست", "List") }, { id: "tree", label: L("درختی", "Tree") },
  { id: "graph", label: L("گراف", "Graph") }, { id: "calendar", label: L("تقویم", "Calendar") }, { id: "timeline", label: L("تایم‌لاین", "Timeline") },
];

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
  const { lang, isFa, setLang } = useI18n();
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

  const langBtn = (l: "en" | "fa") => (
    <button onClick={() => setLang(l)} aria-pressed={lang === l}
      className={`px-2 py-1 rounded-md transition-colors ${lang === l ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:text-ink"}`}>
      {l.toUpperCase()}
    </button>
  );

  return (
    <div dir={isFa ? "rtl" : "ltr"} className="appshell app-ambient min-h-screen text-ink font-body">
      {/* ============ TOP NAV (glass) ============ */}
      <header className="glass sticky top-0 z-40 h-14 flex items-center px-4 gap-3">
        <button className="md:hidden w-9 h-9 grid place-items-center rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setMobileNav(true)} aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <button onClick={() => setScreen("dashboard")} className="flex items-center gap-2 font-bold text-[15px]">
          <LogoMark className="w-7 h-7" />
          <span className="text-ink">Finolo</span>
        </button>
        {screen === "admin" && <Chip tone="purple">{tr(L("سوپر ادمین", "Super Admin"))}</Chip>}

        <div className="flex-1" />

        {/* language — functional EN ⇄ FA */}
        <div className="flex items-center rounded-lg border border-[rgba(0,0,0,0.14)] dark:border-[rgba(255,255,255,0.16)] p-0.5 text-[11px] font-bold" role="group" aria-label="Language">
          {langBtn("en")}
          {langBtn("fa")}
        </div>
        {/* theme */}
        <button aria-label="Toggle theme" className="w-9 h-9 grid place-items-center rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] text-ink-soft">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5"><path d="M20 12.5A8 8 0 1 1 11.5 4a6.5 6.5 0 0 0 8.5 8.5Z" /></svg>
        </button>
        {/* bell */}
        <div className="relative">
          <button onClick={() => setNotifOpen((v) => !v)} aria-label={tr(L("اعلان‌ها", "Notifications"))} className="relative w-9 h-9 grid place-items-center rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] text-ink-soft">
            <IconBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c9372c]" />
          </button>
          {notifOpen && (
            <div className="panel-in absolute end-0 mt-2 w-80 glass-heavy rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 h-11 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
                <strong className="text-[13px]">{tr(L("اعلان‌ها", "Notifications"))}</strong>
                <button className="text-[11px] font-semibold text-[#2d7aff]" onClick={() => say(tr(L("همه خوانده شدند", "Marked all as read")))}>{tr(L("خواندن همه", "Mark all as read"))}</button>
              </div>
              {[
                L("امیر شما را در «وب‌هوک صورتحساب» منشن کرد", "Amir mentioned you in “Billing webhooks”"),
                L("دعوت‌نامه جدید: پروژه آپولو", "New invite: Project Apollo"),
                L("تسک «طراحی جریان ورود» عقب افتاده", "Task “Design login flow” is overdue"),
              ].map((n, i) => (
                <button key={i} onClick={() => { setNotifOpen(false); goBoard(); }} className="w-full text-start px-4 py-3 text-[12.5px] hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.06)] transition-colors border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.06)] last:border-0">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2d7aff] me-2" />{tr(n)}
                </button>
              ))}
              <button onClick={() => { setNotifOpen(false); }} className="w-full h-9 text-[12px] font-semibold text-[#2d7aff] hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.06)]">{tr(L("مشاهده همه اعلان‌ها", "View all notifications"))}</button>
            </div>
          )}
        </div>
        {/* avatar */}
        {!isGuest ? (
          <button onClick={() => setScreen("settings")} className="flex items-center gap-2 rounded-lg ps-1 pe-2 h-9 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <span className="w-7 h-7 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[11px] font-bold">SM</span>
            <span className="hidden sm:block text-[12.5px] font-semibold">{tr(L("سارا", "Sara"))}</span>
          </button>
        ) : (
          <Btn sm onClick={() => say(tr(L("در حال انتقال به ثبت‌نام…", "Redirecting to /register…")))}>{tr(L("عضویت در فینولو", "Join Finolo"))}</Btn>
        )}
      </header>

      {/* ============ BODY: sidenav + content ============ */}
      <div className="flex">
        {/* ---- desktop sidenav (glass) ---- */}
        {!isGuest && (
          <aside className="glass hidden md:flex flex-col w-[220px] shrink-0 sticky top-14 h-[calc(100vh-56px)] py-3 border-e border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
            {screen === "admin" ? <AdminNav /> : NAV.map((n) => (
              <button key={n.id} onClick={() => setScreen(n.id)}
                className={`flex items-center gap-3 mx-2 px-3 h-9 rounded-lg text-[13px] font-medium transition-all duration-150 ${screen === n.id ? "bg-[#e8f0fe] dark:bg-[#1a2f5e] text-[#2d7aff] dark:text-[#7aaaff] font-semibold" : "text-ink-soft hover:text-ink hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.07)]"}`}>
                {n.icon("w-[18px] h-[18px]")}
                {tr(n.label)}
              </button>
            ))}
            <div className="mt-auto px-4 pt-3 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
              <button onClick={() => say(tr(L("خارج شدید", "Signed out")))} className="text-[12.5px] font-medium text-ink-soft hover:text-[#c9372c] transition-colors">{tr(L("خروج", "Sign Out"))}</button>
            </div>
          </aside>
        )}

        {/* ---- mobile drawer ---- */}
        {mobileNav && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)]" onClick={() => setMobileNav(false)} />
            <div className="panel-in absolute start-0 top-0 bottom-0 w-64 glass-heavy flex flex-col py-3">
              <div className="flex items-center gap-2 px-4 pb-3 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
                <span className="w-8 h-8 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[12px] font-bold">SM</span>
                <div><div className="text-[13px] font-semibold">{tr(L("سارا محمدی", "Sara Mohammadi"))}</div><div className="text-[11px] text-ink-soft" dir="ltr">sara@finolo.ir</div></div>
              </div>
              <div className="py-2 flex-1 overflow-y-auto">
                {NAV.map((n) => (
                  <button key={n.id} onClick={() => { setScreen(n.id); setMobileNav(false); }}
                    className={`w-full flex items-center gap-3 px-4 h-10 text-[13px] ${screen === n.id ? "text-[#2d7aff] font-semibold" : "text-ink-soft"}`}>
                    {n.icon("w-[18px] h-[18px]")} {tr(n.label)}
                  </button>
                ))}
              </div>
              <button onClick={() => { setMobileNav(false); say(tr(L("خارج شدید", "Signed out"))); }} className="px-4 h-11 text-start text-[13px] text-[#c9372c] font-medium border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">{tr(L("خروج", "Sign Out"))}</button>
            </div>
          </div>
        )}

        {/* ---- main content ---- */}
        <main className="flex-1 min-w-0 p-4 md:p-6">
          {/* prototype control bar */}
          <ControlBar persona={persona} setPersona={setPersona} demo={demo} setDemo={setDemo} screen={screen} setScreen={setScreen} />

          <div key={screen + demo + lang} className="panel-in">
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
                {n.icon("w-5 h-5")} {tr(n.label)}
              </button>
            );
          })}
          <button onClick={() => setMobileNav(true)} className="flex flex-col items-center gap-0.5 text-[10px] text-ink-soft">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></svg>
            {tr(L("بیشتر", "More"))}
          </button>
        </nav>
      )}

      {/* ============ overlays ============ */}
      {selTask !== null && <TaskDrawer taskId={selTask} onClose={() => setSelTask(null)} canEdit={canEdit} isObserver={isObserver} />}
      <Modal open={modal === "addTask"} onClose={() => setModal(null)} title={tr(L("افزودن تسک", "Add Task"))}>
        <AddTaskForm onCancel={() => setModal(null)} onDone={() => { setModal(null); say(tr(L("تسک ساخته شد", "Task created"))); }} showUpgrade={showUpgrade} />
      </Modal>
      <Modal open={modal === "createWorkspace"} onClose={() => setModal(null)} title={tr(L("ساخت فضای کاری", "Create Workspace"))}>
        <div className="space-y-3">
          <Field label={tr(L("نام فضای کاری", "Workspace Name"))}><input className={inputCls} placeholder={tr(L("شرکت آبان", "Acme Inc."))} /></Field>
          <Field label={tr(L("نامک (اختیاری)", "Slug (optional)"))}><input className={inputCls} placeholder="acme" dir="ltr" /></Field>
          <Field label={tr(L("توضیحات", "Description"))}><input className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={tr(L("دیده‌بانی", "Visibility"))}><select className={inputCls}><option>{tr(L("خصوصی", "Private"))}</option><option>{tr(L("فضای کاری", "Workspace"))}</option><option>{tr(L("عمومی", "Public"))}</option></select></Field>
            <Field label={tr(L("نوع", "Type"))}><select className={inputCls}><option>{tr(L("تیم", "Team"))}</option><option>{tr(L("دپارتمان", "Department"))}</option><option>{tr(L("شرکت", "Company"))}</option><option>{tr(L("شخصی", "Personal"))}</option><option>{tr(L("مشتری", "Client"))}</option></select></Field>
          </div>
          <div className="flex justify-end gap-2 pt-1"><Btn variant="default" onClick={() => setModal(null)}>{tr(L("انصراف", "Cancel"))}</Btn><Btn onClick={() => { setModal(null); say(tr(L("فضای کاری ساخته شد", "Workspace created"))); }}>{tr(L("ساخت فضای کاری", "Create Workspace"))}</Btn></div>
        </div>
      </Modal>
      <Modal open={modal === "createProject"} onClose={() => setModal(null)} title={tr(L("ساخت پروژه", "Create Project"))}>
        <div className="space-y-3">
          <Field label={tr(L("نام پروژه", "Project Name"))}><input className={inputCls} placeholder={tr(L("آپولو", "Apollo"))} /></Field>
          <Field label={tr(L("توضیحات", "Description"))}><input className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={tr(L("وضعیت", "Status"))}><select className={inputCls}><option>{tr(L("فعال", "Active"))}</option><option>{tr(L("متوقف", "On Hold"))}</option><option>{tr(L("تکمیل‌شده", "Completed"))}</option></select></Field>
            <Field label={tr(L("اولویت", "Priority"))}><select className={inputCls}><option>{tr(PRIORITY_LABEL.Medium)}</option><option>{tr(PRIORITY_LABEL.High)}</option><option>{tr(PRIORITY_LABEL.Urgent)}</option></select></Field>
          </div>
          <Field label={tr(L("نوع بورد", "Board Type"))}><select className={inputCls}>{VIEWS.map((v) => <option key={v.id}>{tr(v.label)}</option>)}</select></Field>
          <div className="flex justify-end gap-2 pt-1"><Btn variant="default" onClick={() => setModal(null)}>{tr(L("انصراف", "Cancel"))}</Btn><Btn onClick={() => { setModal(null); goBoard(); say(tr(L("پروژه ساخته شد", "Project created"))); }}>{tr(L("ساخت پروژه", "Create Project"))}</Btn></div>
        </div>
      </Modal>
      <Modal open={modal === "addEntry"} onClose={() => setModal(null)} title={tr(L("افزودن گزارش زمان", "Add Time Entry"))}>
        <div className="space-y-3">
          <Field label={tr(L("تسک", "Task"))}><select className={inputCls}>{TASKS.map((t) => <option key={t.id}>{tr(t.title)}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={tr(L("شروع", "Start"))}><input type="time" className={inputCls} /></Field>
            <Field label={tr(L("پایان", "End"))}><input type="time" className={inputCls} /></Field>
          </div>
          <label className="flex items-center gap-2 text-[13px] font-medium"><input type="checkbox" className="accent-[#2d7aff]" /> {tr(L("قابل‌صورتحساب", "Billable"))} <Chip tone="orange">{tr(L("ارتقا", "Upgrade"))}</Chip></label>
          <div className="flex justify-end gap-2 pt-1"><Btn variant="default" onClick={() => setModal(null)}>{tr(L("انصراف", "Cancel"))}</Btn><Btn onClick={() => { setModal(null); say(tr(L("گزارش افزوده شد", "Entry added"))); }}>{tr(L("افزودن گزارش", "Add Entry"))}</Btn></div>
        </div>
      </Modal>
      <Modal open={modal === "share"} onClose={() => setModal(null)} title={tr(L("اشتراک‌گذاری «آپولو»", "Share “Apollo”"))}>
        <div className="space-y-4">
          <div>
            <div className="text-[12px] font-semibold text-ink-soft mb-1.5">{tr(L("اشتراک عمومی", "Public sharing"))}</div>
            <div className="flex items-center gap-2">
              <input readOnly className={inputCls} value="https://finolo.ir/share/a91xk2" dir="ltr" />
              <Btn onClick={() => say(tr(L("لینک کپی شد", "Link copied")))}>{tr(L("کپی", "Copy"))}</Btn>
            </div>
            <div className="flex gap-2 mt-2"><Btn variant="default" sm>{tr(L("ساخت لینک جدید", "Create new link"))}</Btn><Btn variant="danger" sm>{tr(L("خاموش کردن همه", "Turn off all"))}</Btn></div>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-ink-soft mb-1.5">{tr(L("ناظر چه چیزی می‌بیند", "What observers can see"))}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[[L("بورد", "Board"), true], [L("اسناد", "Documents"), true], [L("پیوست‌ها", "Attachments"), true], [L("اعضا", "Members"), false], [L("فعالیت", "Activity"), false], [L("گزارش زمان", "Time logs"), false], [L("گزارش‌ها", "Reports"), false]].map(([k, on], i) => (
                <label key={i} className="flex items-center justify-between text-[13px] font-medium">
                  {tr(k as Pair)}
                  <input type="checkbox" defaultChecked={on as boolean} className="accent-[#2d7aff]" />
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end"><Btn onClick={() => { setModal(null); say(tr(L("دیده‌بانی ذخیره شد", "Visibility saved"))); }}>{tr(L("ذخیره دیده‌بانی", "Save visibility"))}</Btn></div>
        </div>
      </Modal>
      <Modal open={modal === "projectSettings"} onClose={() => setModal(null)} title={`${tr(L("تنظیمات پروژه", "Project settings"))} · ${tr(L("آپولو", "Apollo"))}`} wide>
        <ProjectSettingsModal tab={settingsModalTab} setTab={setSettingsModalTab} canManage={canManage} showUpgrade={showUpgrade} say={say} />
      </Modal>

      {/* Upgrade modal */}
      <Modal open={modal === "upgrade"} onClose={() => setModal(null)} title={tr(L("پلن خود را ارتقا دهید", "Upgrade your plan"))}>
        <div className="text-center py-2">
          <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-[#e8f0fe] dark:bg-[#0d1f40] text-[#2d7aff] mb-4"><IconBolt className="w-7 h-7" /></span>
          <p className="text-[13.5px] text-ink-soft leading-6">{tr(L("این قابلیت روی پلن «حرفه‌ای» در دسترس است. برای باز کردن تسک‌های تکرارشونده، لینک اشتراک، CI/CD، تحلیل‌ها و بیشتر، ارتقا دهید.", "This feature is available on the Pro plan. Upgrade to unlock recurring tasks, share links, CI/CD, analytics and more."))}</p>
          <div className="flex justify-center gap-2 mt-5">
            <Btn variant="default" onClick={() => setModal(null)}>{tr(L("الان نه", "Not now"))}</Btn>
            <Btn onClick={() => { setModal(null); setScreen("settings"); setSettingsTab("Billing"); }}>{tr(L("مشاهده پلن‌ها", "View plans"))}</Btn>
          </div>
          <p className="text-[11px] text-ink-soft mt-3">{tr(L("قیمت‌ها به تومان · لغو در هر زمان", "Prices in Toman · Cancel anytime"))}</p>
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
  const personaLabel: Record<Persona, Pair> = {
    owner: L("مالک", "owner"), member: L("عضو", "member"), observer: L("ناظر", "observer"), guest: L("مهمان", "guest"),
  };
  const stateLabel: Record<DemoState, Pair> = {
    allowed: L("مجاز", "allowed"), loading: L("بارگذاری", "loading"), empty: L("خالی", "empty"), error: L("خطا", "error"), denied: L("ردشده", "denied"),
  };
  return (
    <div className="mb-5 rounded-xl border border-dashed border-[#2d7aff]/40 bg-[#2d7aff]/5 p-3 flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d7aff]">{tr(L("کنترل‌های پروتوتایپ", "Prototype controls"))}</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-semibold text-ink-soft">{tr(L("نقش:", "Actor:"))}</span>
        {(["owner", "member", "observer", "guest"] as Persona[]).map((p) => (
          <button key={p} onClick={() => setPersona(p)} className={`h-6 px-2.5 rounded-md text-[11px] font-semibold transition-colors ${persona === p ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]"}`}>{tr(personaLabel[p])}</button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-semibold text-ink-soft">{tr(L("حالت:", "State:"))}</span>
        {(["allowed", "loading", "empty", "error", "denied"] as DemoState[]).map((d) => (
          <button key={d} onClick={() => setDemo(d)} className={`h-6 px-2.5 rounded-md text-[11px] font-semibold transition-colors ${demo === d ? "bg-ink text-paper" : "text-ink-soft hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]"}`}>{tr(stateLabel[d])}</button>
        ))}
      </div>
      <button onClick={() => setScreen(screen === "admin" ? "dashboard" : "admin")} className="ms-auto h-7 px-3 rounded-lg text-[11px] font-bold bg-[#6554c0] text-white hover:opacity-90 transition-opacity">
        {screen === "admin" ? tr(L("خروج از کنسول ادمین", "Exit admin console")) : tr(L("باز کردن کنسول ادمین", "Open admin console"))}
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
        <p className="text-[12px] text-ink-soft">{tr(L("در حال بارگذاری…", "Loading…"))}</p>
      </div>
    );
  if (demo === "empty") return <>{empty}</>;
  if (demo === "error")
    return (
      <div className="app-surface rounded-xl p-8 text-center" role="alert">
        <p className="font-semibold text-[14px] text-[#c9372c]">{tr(L("مشکلی پیش آمد.", "Something went wrong."))}</p>
        <p className="text-[12.5px] text-ink-soft mt-1">{tr(L("این نما بارگذاری نشد. اتصال خود را بررسی کنید.", "We couldn't load this view. Check your connection."))}</p>
        <Btn className="mt-4" onClick={() => undefined}>{tr(L("تلاش دوباره", "Retry"))}</Btn>
      </div>
    );
  if (demo === "denied")
    return (
      <div className="app-surface rounded-xl p-8 text-center" role="alert">
        <p className="font-semibold text-[14px] text-[#c9372c]">{tr(L("۴۰۳ — دسترسی ندارید", "403 — You don't have permission"))}</p>
        <p className="text-[12.5px] text-ink-soft mt-1">{tr(L("این عمل به دسترسی‌ای نیاز دارد که نقش شما ندارد.", "This action requires a permission your role doesn't have."))}</p>
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
  const stats: { label: Pair; v: number }[] = [
    { label: L("تسک‌های من", "My Tasks"), v: 12 }, { label: L("تکمیل‌شده", "Completed"), v: 34 },
    { label: L("عقب‌افتاده", "Overdue"), v: 2 }, { label: L("پروژه‌های فعال", "Active projects"), v: 5 },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">{tr(L("خوش برگشتی، سارا 👋", "Welcome back, Sara 👋"))}</h1>
          <p className="text-[13px] text-ink-soft mt-1">{tr(L("این‌ها در پروژه‌های شما در جریان است.", "Here's what's moving across your projects."))}</p>
        </div>
        <div className="flex gap-2"><Btn variant="default" sm>{tr(L("تازه‌سازی", "Refresh"))}</Btn><Btn sm onClick={() => setScreen("projects")}>{tr(L("مشاهده پروژه‌ها", "View Projects"))}</Btn></div>
      </div>

      <StateBlock demo={demo} empty={<EmptyBox icon={<IconKanban className="w-6 h-6" />} title={tr(L("هنوز فضای کاری نیست", "No workspaces yet"))} sub={tr(L("برای شروع اولین پروژه، یک فضای کاری بسازید.", "Create a workspace to start your first project."))} cta={<Btn onClick={() => setScreen("workspaces")}>{tr(L("ساخت فضای کاری", "Create Workspace"))}</Btn>} />}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <button key={s.label.en} onClick={() => setScreen("analytics")} className="app-surface rounded-xl p-4 text-start hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="font-display text-3xl tabular-nums">{num(s.v)}</div>
              <div className="text-[12px] font-semibold text-ink-soft mt-1">{tr(s.label)}</div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
          <div className="app-surface rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-semibold text-[14px]">{tr(L("تسک‌های من", "My Tasks"))}</h2>
              <div className="flex gap-1">{[L("همه", "All"), L("باز", "Open"), L("در حال انجام", "In Progress"), L("تکمیل‌شده", "Completed")].map((f, i) => (
                <button key={f.en} className={`h-6 px-2 rounded-md text-[11px] font-semibold ${i === 0 ? "bg-[#e8f0fe] text-[#2d7aff]" : "text-ink-soft hover:bg-[rgba(0,0,0,0.05)]"}`}>{tr(f)}</button>
              ))}</div>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.07)]">
              {TASKS.slice(0, 4).map((t) => (
                <button key={t.id} onClick={goBoard} className="w-full flex items-center gap-3 py-2.5 text-start hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)] rounded-lg px-2 transition-colors">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLOR[t.status]}`} />
                  <span className="flex-1 text-[13px] font-medium truncate">{tr(t.title)}</span>
                  <span className={`text-[11px] font-semibold ${PRIORITY_COLOR[t.priority]}`}>{tr(PRIORITY_LABEL[t.priority])}</span>
                  <span className="text-[11px] text-ink-soft tabular-nums">{tr(t.due)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="app-surface rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-[14px]">{tr(L("تحلیل‌های من", "My Analytics"))}</h2>
                <button onClick={() => setScreen("analytics")} className="text-[12px] font-semibold text-[#2d7aff]">{tr(L("گزارش کامل", "Full report"))}</button>
              </div>
              <MiniChart />
            </div>
            <div className="app-surface rounded-xl p-4 flex items-center justify-between">
              <div><div className="text-[12px] font-semibold text-ink-soft">{tr(L("امتیاز", "Points"))}</div><div className="font-display text-2xl tabular-nums mt-0.5">{num(1240)}</div></div>
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
  const rows: [Pair, Pair, Pair][] = [
    [L("شرکت آبان", "Acme Inc."), L("شرکت", "Company"), L("۸ عضو", "8 members")],
    [L("تیم محصول", "Product Team"), L("تیم", "Team"), L("۵ عضو", "5 members")],
    [L("مشتری — آریا", "Client — Aria"), L("مشتری", "Client"), L("۳ عضو", "3 members")],
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-2xl md:text-3xl">{tr(L("فضای‌های کاری", "Workspaces"))}</h1>
        <Btn onClick={() => setModal("createWorkspace")}><IconPlus className="w-4 h-4" /> {tr(L("ساخت فضای کاری", "Create Workspace"))}</Btn>
      </div>
      <StateBlock demo={demo} empty={<EmptyBox icon={<IconGrip className="w-6 h-6" />} title={tr(L("هنوز فضای کاری نیست", "No workspaces yet"))} cta={<Btn onClick={() => setModal("createWorkspace")}>{tr(L("ساخت فضای کاری", "Create Workspace"))}</Btn>} />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(([n, t, m]) => (
            <div key={n.en} className="app-surface rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <span className="w-9 h-9 grid place-items-center rounded-lg bg-[#e8f0fe] dark:bg-[#0d1f40] text-[#2d7aff] font-bold">{tr(n).charAt(0)}</span>
                <Kebab onClick={() => undefined} />
              </div>
              <div className="font-semibold text-[14px] mt-3">{tr(n)}</div>
              <div className="flex gap-1.5 mt-2"><Chip tone="blue">{tr(t)}</Chip><Chip>{tr(m)}</Chip></div>
            </div>
          ))}
        </div>
      </StateBlock>
    </div>
  );
}

function ProjectsView({ demo, goBoard, canManage, setModal, showUpgrade }: { demo: DemoState; goBoard: () => void; canManage: boolean; setModal: (m: ModalKind) => void; showUpgrade: () => void }) {
  const rows: [Pair, Pair, number, string, string][] = [
    [L("آپولو", "Apollo"), L("شرکت آبان", "Acme Inc."), 68, "Active", "High"],
    [L("بازطراحی سایت", "Website Revamp"), L("تیم محصول", "Product Team"), 41, "On Hold", "Medium"],
    [L("اپلیکیشن موبایل", "Mobile App"), L("مشتری — آریا", "Client — Aria"), 90, "Active", "Urgent"],
  ];
  const statusChip: Record<string, Pair> = { Active: L("فعال", "Active"), "On Hold": L("متوقف", "On Hold") };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-2xl md:text-3xl">{tr(L("پروژه‌ها", "Projects"))}</h1>
        <div className="flex gap-2">
          <Btn variant="default" sm onClick={showUpgrade}>{tr(L("ورود پروژه", "Import Project"))}</Btn>
          <Btn onClick={() => setModal("createProject")}><IconPlus className="w-4 h-4" /> {tr(L("ساخت پروژه", "Create Project"))}</Btn>
        </div>
      </div>
      <input className={`${inputCls} max-w-sm`} placeholder={tr(L("جستجوی پروژه‌ها…", "Search projects…"))} />
      <StateBlock demo={demo} empty={<EmptyBox icon={<IconKanban className="w-6 h-6" />} title={tr(L("هنوز پروژه‌ای نیست", "No projects yet"))} sub={tr(L("برای داشتن بورد، اولین پروژه را بسازید.", "Create your first project to get a board."))} cta={<Btn onClick={() => setModal("createProject")}>{tr(L("ساخت پروژه", "Create Project"))}</Btn>} />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(([n, w, p, s, pr]) => (
            <div key={n.en} className="app-surface rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={goBoard}>
              <div className="flex items-start justify-between">
                <div className="font-semibold text-[14px]">{tr(n)}</div>
                {canManage && <Kebab onClick={() => undefined} />}
              </div>
              <div className="text-[11.5px] text-ink-soft mt-0.5">{tr(w)}</div>
              <div className="mt-3 h-1.5 rounded-full bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.12)] overflow-hidden">
                <div className="h-full rounded-full bg-[#2d7aff]" style={{ width: `${p}%` }} />
              </div>
              <div className="flex gap-1.5 mt-3">
                <Chip tone={s === "Active" ? "green" : "orange"}>{tr(statusChip[s])}</Chip>
                <Chip tone={pr === "Urgent" ? "red" : "neutral"}>{tr(PRIORITY_LABEL[pr])}</Chip>
                <span className="ms-auto text-[11px] font-semibold text-ink-soft tabular-nums">{num(p)}٪</span>
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
  const viewsAllowed: BoardView[] = p.isObserver ? ["kanban", "list"] : VIEWS.map((v) => v.id);

  return (
    <div className="space-y-4">
      {/* board header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-xl md:text-2xl">{tr(L("آپولو", "Apollo"))}</h1>
        <Chip tone="green">{tr(L("فعال", "Active"))}</Chip>
        {p.isObserver && <Chip tone="purple">{tr(L("ناظر", "Observer"))}</Chip>}
        <div className="flex-1" />
        <input className={`${inputCls} !w-44 md:!w-56`} placeholder={tr(L("جستجوی تسک‌ها…", "Search tasks…"))} />
        {!p.isGuest && <Kebab label={tr(L("عملیات پروژه", "Project actions"))} onClick={() => p.setModal("projectSettings")} />}
        <Btn sm variant="default" onClick={() => p.setScreen("settings")}>{tr(L("اطلاعات", "Info"))}</Btn>
      </div>

      {/* view switcher */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {VIEWS.map((v) => {
          const ok = viewsAllowed.includes(v.id);
          return (
            <button key={v.id} onClick={() => ok && p.setView(v.id)} disabled={!ok}
              className={`h-8 px-3 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-colors ${p.view === v.id ? "bg-[#2d7aff] text-white" : ok ? "text-ink-soft hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]" : "text-ink-soft/40 cursor-not-allowed"}`}>
              {tr(v.label)}{!ok && " 🔒"}
            </button>
          );
        })}
        <div className="flex-1" />
        <span className="text-[11px] text-ink-soft whitespace-nowrap">{tr(L("CI/CD:", "CI/CD:"))} <span className="text-[#22a06b] font-semibold">{tr(L("سالم", "passing"))}</span></span>
      </div>

      <StateBlock demo={p.demo} empty={
        <EmptyBox icon={<IconKanban className="w-6 h-6" />} title={tr(L("هنوز بخشی در بورد نیست", "No board sections yet"))}
          sub={p.canEdit ? tr(L("برای شروع ساخت بورد، یک بخش اضافه کنید.", "Add a section to start building your board.")) : tr(L("این بورد بخشی ندارد.", "This board has no sections."))}
          cta={p.canEdit ? <Btn onClick={() => p.say(tr(L("بخش افزوده شد", "Section added")))}><IconPlus className="w-4 h-4" /> {tr(L("افزودن بخش", "Add section"))}</Btn> : undefined} />
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

function KanbanPane(p: {
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
              <span className="text-[13px] font-semibold">{tr(col.name)}</span>
              <span className="text-[11px] text-ink-soft tabular-nums">{num(cards.length)}</span>
              <div className="flex-1" />
              <div className="relative">
                <Kebab onClick={() => p.setColumnMenu(p.columnMenu === col.id ? null : col.id)} label={tr(L("عملیات ستون", "Column actions"))} />
                {p.columnMenu === col.id && (
                  <div className="panel-in absolute end-0 mt-1 w-44 glass-heavy rounded-lg overflow-hidden z-20">
                    {p.canEdit && <MenuItem onClick={() => { p.setColumnMenu(null); p.setModal("addTask"); }}>{tr(L("افزودن تسک", "Add task"))}</MenuItem>}
                    {p.canEdit && <MenuItem onClick={() => p.setColumnMenu(null)}>{tr(L("تغییر نام ستون", "Rename column"))}</MenuItem>}
                    <MenuItem onClick={() => p.setColumnMenu(null)}>{tr(L("خروجی JSON", "Export as JSON"))}</MenuItem>
                    {p.canEdit && <MenuItem danger onClick={() => p.setColumnMenu(null)}>{tr(L("حذف ستون", "Delete column"))}</MenuItem>}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2.5">
              {cards.map((t) => <TaskCard key={t.id} t={t} onOpen={() => p.setSelTask(t.id)} canEdit={p.canEdit} showUpgrade={p.showUpgrade} />)}
            </div>
            {p.canEdit && (
              <button onClick={() => p.setModal("addTask")} className="mt-2.5 w-full h-8 rounded-lg border border-dashed border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.25)] text-[12.5px] font-medium text-ink-soft hover:border-[#2d7aff] hover:text-[#2d7aff] transition-colors flex items-center justify-center gap-1">
                <IconPlus className="w-3.5 h-3.5" /> {tr(L("افزودن تسک", "Add Task"))}
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
    <button onClick={onClick} className={`w-full text-start px-3 h-9 text-[12.5px] font-medium transition-colors ${danger ? "text-[#c9372c] hover:bg-[#fff2f0] dark:hover:bg-[#2d0f0f]" : "hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.07)]"}`}>
      {children}
    </button>
  );
}

function TaskCard({ t, onOpen, canEdit, showUpgrade }: { t: TaskT; onOpen: () => void; canEdit: boolean; showUpgrade: () => void }) {
  return (
    <div onClick={onOpen} className="group relative bg-white dark:bg-[#2c2c2e] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.14)] rounded-lg p-3 cursor-pointer hover:border-[#2d7aff] hover:shadow-md transition-all duration-150">
      {t.blocked && <span className="absolute -top-1.5 -end-1.5 w-4 h-4 grid place-items-center rounded-full bg-[#c9372c] text-white text-[8px] font-bold" title={tr(L("مسدود", "Blocked"))}>!</span>}
      <div className="text-[13px] font-medium leading-5">{tr(t.title)}</div>
      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
        <Chip tone="blue">{t.tags[0]}</Chip>
        {t.comments > 0 && <span className="text-[10.5px] text-ink-soft font-semibold">💬 {num(t.comments)}</span>}
        <span className="flex-1" />
        <span className={`text-[10.5px] font-bold ${PRIORITY_COLOR[t.priority]}`}>{tr(PRIORITY_LABEL[t.priority])}</span>
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex -space-x-1.5 rtl:space-x-reverse" dir="ltr">
          {t.assignees.map((a) => <span key={a} className="w-6 h-6 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[9px] font-bold border-2 border-white dark:border-[#2c2c2e]">{a}</span>)}
        </div>
        <span className="text-[10.5px] text-ink-soft tabular-nums">{tr(t.due)}</span>
      </div>
      {/* hover kebab */}
      {canEdit && (
        <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); showUpgrade(); }}>
          <Kebab label={tr(L("عملیات تسک", "Task actions"))} onClick={() => undefined} />
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
          <tr className="text-start text-[11px] font-bold text-ink-soft border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
            <th className="px-4 py-2.5 text-start">{tr(L("تسک", "Task"))}</th><th className="px-4 py-2.5 text-start">{tr(L("وضعیت", "Status"))}</th><th className="px-4 py-2.5 text-start">{tr(L("اولویت", "Priority"))}</th><th className="px-4 py-2.5 text-start">{tr(L("سررسید", "Due"))}</th>
          </tr>
        </thead>
        <tbody>
          {TASKS.map((t) => (
            <tr key={t.id} onClick={() => setSelTask(t.id)} className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.06)] last:border-0 hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors">
              <td className="px-4 py-3 font-medium">{tr(t.title)}</td>
              <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${STATUS_COLOR[t.status]}`} />{tr(STATUS_LABEL[t.status])}</span></td>
              <td className={`px-4 py-3 font-semibold ${PRIORITY_COLOR[t.priority]}`}>{tr(PRIORITY_LABEL[t.priority])}</td>
              <td className="px-4 py-3 text-ink-soft tabular-nums">{tr(t.due)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TreePane({ setSelTask }: { setSelTask: (n: number) => void }) {
  const kids: Pair[] = [L("طراحی جریان ورود", "Design login flow"), L("اتصال وب‌هوک صورتحساب", "Wire billing webhooks"), L("بازسازی ردیوسر بورد", "Refactor board reducer")];
  return (
    <div className="app-surface rounded-xl p-5 max-w-xl">
      <div className="flex items-center gap-2 py-1.5 font-semibold text-[13.5px]"><IconTree className="w-4 h-4 text-[#2d7aff]" />{tr(L("آپولو (۶۸٪)", "Apollo (68%)"))}</div>
      {kids.map((k) => (
        <button key={k.en} onClick={() => setSelTask(1)} className="flex items-center gap-2 py-1.5 ps-7 text-[13px] text-ink-soft hover:text-[#2d7aff] transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8e8e93]" />{tr(k)}
        </button>
      ))}
    </div>
  );
}

function GraphPane({ setSelTask }: { setSelTask: (n: number) => void }) {
  const nodes: { x: number; y: number; l: Pair }[] = [
    { x: 100, y: 60, l: L("طراحی", "Design") }, { x: 100, y: 150, l: L("بک‌اند", "Backend") },
    { x: 240, y: 100, l: L("ساخت", "Build") }, { x: 380, y: 70, l: L("انتشار", "Ship") },
  ];
  return (
    <div className="app-surface rounded-xl p-4 overflow-x-auto">
      <svg viewBox="0 0 480 200" className="w-full min-w-[480px]">
        <line x1="120" y1="60" x2="230" y2="100" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
        <line x1="120" y1="150" x2="230" y2="100" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
        <line x1="250" y1="100" x2="370" y2="70" stroke="#2d7aff" strokeWidth="2" className="dash-live" />
        {nodes.map((n) => (
          <g key={n.l.en} className="cursor-pointer" onClick={() => setSelTask(1)}>
            <circle cx={n.x} cy={n.y} r="26" fill="#e8f0fe" stroke="#2d7aff" strokeWidth="1.5" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#2d7aff">{tr(n.l)}</text>
          </g>
        ))}
      </svg>
      <p className="text-[11px] text-ink-soft mt-2">{tr(L("برای جابه‌جایی بکشید · برای بزرگ‌نمایی اسکرول کنید · برای باز کردن تسک روی گره کلیک کنید.", "Drag to pan · scroll to zoom · click a node to open the task."))}</p>
    </div>
  );
}

function CalendarPane({ setSelTask }: { setSelTask: (n: number) => void }) {
  const days: Pair[] = [L("ی", "Sun"), L("د", "Mon"), L("س", "Tue"), L("چ", "Wed"), L("پ", "Thu"), L("ج", "Fri"), L("ش", "Sat")];
  return (
    <div className="app-surface rounded-xl p-4">
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {days.map((d) => <div key={d.en} className="text-[11px] font-bold text-ink-soft py-1">{tr(d)}</div>)}
        {Array.from({ length: 28 }).map((_, i) => {
          const has = i === 4 || i === 11 || i === 18;
          return (
            <button key={i} onClick={() => has && setSelTask(1)} className={`aspect-square rounded-lg text-[12px] tabular-nums transition-colors ${has ? "bg-[#e8f0fe] text-[#2d7aff] font-bold hover:bg-[#dce7fd]" : "hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.06)]"}`}>
              {num(i + 1)}{has && <span className="block mx-auto w-1 h-1 rounded-full bg-[#2d7aff] mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimelinePane({ setSelTask }: { setSelTask: (n: number) => void }) {
  const bars: [Pair, number, number][] = [
    [L("طراحی جریان ورود", "Design login flow"), 5, 25],
    [L("اتصال وب‌هوک صورتحساب", "Wire billing webhooks"), 30, 30],
    [L("بازسازی ردیوسر بورد", "Refactor board reducer"), 45, 35],
    [L("اسپایک نمای تقویم", "Calendar view spikes"), 60, 25],
  ];
  return (
    <div className="app-surface rounded-xl p-5 space-y-3.5 overflow-x-auto">
      {bars.map(([n, s, w]) => (
        <div key={n.en} className="min-w-[480px]">
          <div className="text-[12px] font-semibold mb-1">{tr(n)}</div>
          <div className="h-6 rounded-md bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] relative">
            <button onClick={() => setSelTask(1)} className="absolute top-0.5 bottom-0.5 rounded bg-[#2d7aff] hover:brightness-110 transition-all" style={{ insetInlineStart: `${s}%`, width: `${w}%` }} />
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
  const tabs: [string, Pair][] = [
    ["Details", L("جزئیات", "Details")], ["Comments", L("نظرات", "Comments")], ["Checklists", L("چک‌لیست‌ها", "Checklists")],
    ["Attachments", L("پیوست‌ها", "Attachments")], ["Activity", L("فعالیت", "Activity")],
  ];
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)]" onClick={onClose} />
      <div className="panel-in relative glass-heavy w-full max-w-md h-full overflow-y-auto">
        <div className="sticky top-0 glass-heavy px-5 h-14 flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] z-10">
          <h3 className="font-semibold text-[14px] truncate pe-3">{tr(L("جزئیات تسک", "Task Details"))}</h3>
          <button onClick={onClose} aria-label={tr(L("بستن", "Close"))} className="w-7 h-7 grid place-items-center rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <h2 className="font-display text-xl leading-6">{tr(t.title)}</h2>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <Chip tone="blue">{tr(STATUS_LABEL[t.status])}</Chip>
              <Chip tone={t.priority === "Urgent" ? "red" : "neutral"}>{tr(PRIORITY_LABEL[t.priority])}</Chip>
              {t.blocked && <Chip tone="red">{tr(L("مسدود", "Blocked"))}</Chip>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div><div className="text-ink-soft font-semibold text-[11px]">{tr(L("سررسید", "Due date"))}</div><div className="font-medium mt-0.5 tabular-nums">{tr(t.due)}</div></div>
            <div><div className="text-ink-soft font-semibold text-[11px]">{tr(L("ساعت برآوردی", "Est. hours"))}</div><div className="font-medium mt-0.5">{tr(L("۶ ساعت", "6h"))}</div></div>
            <div><div className="text-ink-soft font-semibold text-[11px]">{tr(L("مسئولان", "Assignees"))}</div><div className="flex gap-1 mt-1">{t.assignees.map((a) => <span key={a} className="w-6 h-6 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[9px] font-bold">{a}</span>)}</div></div>
            <div><div className="text-ink-soft font-semibold text-[11px]">{tr(L("فوریت", "Urgency"))}</div><div className="font-medium mt-0.5">{tr(L("۳ از ۵", "3 / 5"))}</div></div>
          </div>

          <div className="flex gap-1 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`h-9 px-3 text-[12.5px] font-semibold border-b-2 -mb-px transition-colors ${tab === id ? "border-[#2d7aff] text-[#2d7aff]" : "border-transparent text-ink-soft hover:text-ink"}`}>{tr(label)}</button>
            ))}
          </div>

          {tab === "Details" && (
            <div className="space-y-3">
              <Field label={tr(L("توضیحات", "Description"))}><textarea className={`${inputCls} h-24 py-2 resize-none`} defaultValue={tr(L("پیاده‌سازی جریان ورود با ارائه‌دهنده‌های گوگل و گیت‌هاب.", "Implement the login flow with Google and GitHub providers."))} disabled={!canEdit} /></Field>
              <Field label={tr(L("برچسب‌ها", "Tags"))}><input className={inputCls} defaultValue={t.tags.join(", ")} placeholder={tr(L("انتخاب یا ساخت برچسب…", "Select or create tags…"))} disabled={!canEdit} /></Field>
              {canEdit && <div className="flex gap-2 justify-end"><Btn variant="default" sm>{tr(L("انصراف", "Cancel"))}</Btn><Btn sm>{tr(L("ذخیره", "Save"))}</Btn></div>}
              {isObserver && <p className="text-[12px] text-ink-soft bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)] rounded-lg p-3">{tr(L("به‌عنوان ناظر مشاهده می‌کنید — ویرایش فقط خواندنی است.", "You're viewing as an Observer — editing is read-only."))}</p>}
            </div>
          )}
          {tab === "Comments" && (
            <div className="space-y-3">
              {[[L("امیر", "Amir"), L("وب‌هوک‌های ناموفق را دوباره تلاش کنیم؟", "Should we retry failed webhooks?")], [L("سارا", "Sara"), L("بله — با backoff نمایی.", "Yes — with exponential backoff.")]].map(([u, m]) => (
                <div key={u.en} className="flex gap-2.5">
                  <span className="w-7 h-7 shrink-0 grid place-items-center rounded-full bg-[#6554c0] text-white text-[10px] font-bold">{tr(u).charAt(0)}</span>
                  <div className="bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-[12.5px]"><strong className="font-semibold">{tr(u)}</strong> <span className="text-ink-soft">{tr(m)}</span></div>
                </div>
              ))}
              {canEdit && <input className={inputCls} placeholder={tr(L("نظرت را بنویس… (@ برای منشن)", "Add a comment… (@ to mention)"))} />}
            </div>
          )}
          {tab === "Checklists" && (
            <div className="space-y-2">
              {[L("تعریف محدوده API", "Scope the API"), L("نوشتن تست‌ها", "Write tests"), L("انتشار به staging", "Ship to staging")].map((c, i) => (
                <label key={c.en} className="flex items-center gap-2.5 text-[13px]"><input type="checkbox" defaultChecked={i === 0} className="accent-[#2d7aff]" />{tr(c)}</label>
              ))}
            </div>
          )}
          {tab === "Attachments" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">{["#2d7aff", "#6554c0", "#22a06b"].map((c) => <div key={c} className="aspect-video rounded-lg" style={{ background: c }} />)}</div>
              {canEdit && <Btn variant="default" sm><IconPlus className="w-3.5 h-3.5" /> {tr(L("بارگذاری فایل", "Upload File"))}</Btn>}
            </div>
          )}
          {tab === "Activity" && (
            <div className="space-y-2.5 text-[12.5px] text-ink-soft">
              <p><strong className="text-ink">{tr(L("سارا", "Sara"))}</strong> {tr(L("وضعیت را تغییر داد", "changed status"))} <span className="text-ink">{tr(L("باز ← در حال انجام", "Open → In Progress"))}</span> · {tr(L("۲ ساعت پیش", "2h ago"))}</p>
              <p><strong className="text-ink">{tr(L("امیر", "Amir"))}</strong> {tr(L("نظری افزود", "added a comment"))} · {tr(L("۵ ساعت پیش", "5h ago"))}</p>
              <button className="text-[#2d7aff] font-semibold">{tr(L("مشاهده همه فعالیت‌ها", "View all activity"))}</button>
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
      <Field label={tr(L("عنوان تسک", "Task Title"))}><input className={inputCls} placeholder={tr(L("چه کاری باید انجام شود؟", "What needs doing?"))} /></Field>
      <Field label={tr(L("توضیحات", "Description"))}><textarea className={`${inputCls} h-20 py-2 resize-none`} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={tr(L("وضعیت", "Status"))}><select className={inputCls}>{Object.values(STATUS_LABEL).map((s) => <option key={s.en}>{tr(s)}</option>)}</select></Field>
        <Field label={tr(L("اولویت", "Priority"))}><select className={inputCls}>{Object.values(PRIORITY_LABEL).map((s) => <option key={s.en}>{tr(s)}</option>)}</select></Field>
        <Field label={tr(L("فوریت (۱ تا ۵)", "Urgency (1–5)"))}><input type="number" min={1} max={5} defaultValue={3} className={inputCls} /></Field>
        <Field label={tr(L("ساعت برآوردی", "Estimated Hours"))}><input type="number" defaultValue={4} className={inputCls} /></Field>
      </div>
      <Field label={tr(L("برچسب‌ها", "Tags"))}><input className={inputCls} placeholder={tr(L("انتخاب یا ساخت برچسب…", "Select or create tags…"))} /></Field>
      <div className="rounded-lg border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.14)] p-3">
        <label className="flex items-center gap-2 text-[13px] font-medium">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="accent-[#2d7aff]" />
          {tr(L("تسک تکرارشونده", "Recurring task"))} <Chip tone="orange">{tr(L("ارتقا", "Upgrade"))}</Chip>
        </label>
        {recurring && (
          <div className="mt-2 text-[12px] text-ink-soft bg-[#fffae6] dark:bg-[#2d1e04] rounded-lg p-2.5">
            {tr(L("تسک‌های تکرارشونده یک قابلیت «حرفه‌ای» هستند.", "Recurring tasks are a Pro feature."))} <button onClick={showUpgrade} className="text-[#2d7aff] font-semibold">{tr(L("پلن خود را ارتقا دهید", "Upgrade your plan"))}</button>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-1"><Btn variant="default" onClick={onCancel}>{tr(L("انصراف", "Cancel"))}</Btn><Btn onClick={onDone}>{tr(L("افزودن تسک", "Add Task"))}</Btn></div>
    </div>
  );
}

/* ================= project settings modal ================= */
function ProjectSettingsModal({ tab, setTab, canManage, showUpgrade, say }: { tab: string; setTab: (t: string) => void; canManage: boolean; showUpgrade: () => void; say: (m: string) => void }) {
  const tabs: [string, Pair][] = [
    ["Details", L("جزئیات", "Details")], ["Members & permissions", L("اعضا و دسترسی‌ها", "Members & permissions")],
    ["Teams", L("تیم‌ها", "Teams")], ["Job titles", L("عناوین شغلی", "Job titles")],
    ["Integrations", L("اتصال‌ها", "Integrations")], ["Sharing", L("اشتراک‌گذاری", "Sharing")],
  ];
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] mb-4">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`h-9 px-3 text-[12.5px] font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === id ? "border-[#2d7aff] text-[#2d7aff]" : "border-transparent text-ink-soft hover:text-ink"}`}>{tr(label)}</button>
        ))}
      </div>

      {tab === "Details" && (
        <div className="space-y-3">
          <Field label={tr(L("نام", "Name"))}><input className={inputCls} defaultValue={tr(L("آپولو", "Apollo"))} /></Field>
          <Field label={tr(L("توضیحات", "Description"))}><input className={inputCls} defaultValue={tr(L("انتشار محصول سه‌ماهه چهارم.", "Q4 product release."))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={tr(L("وضعیت", "Status"))}><select className={inputCls}><option>{tr(L("فعال", "Active"))}</option><option>{tr(L("متوقف", "On Hold"))}</option><option>{tr(L("تکمیل‌شده", "Completed"))}</option></select></Field>
            <Field label={tr(L("نمای پیش‌فرض بورد", "Default board view"))}><select className={inputCls}>{VIEWS.map((v) => <option key={v.id}>{tr(v.label)}</option>)}</select></Field>
          </div>
          <div className="flex justify-end"><Btn onClick={() => say(tr(L("پروژه به‌روزرسانی شد", "Project updated")))}>{tr(L("ذخیره", "Save"))}</Btn></div>
        </div>
      )}

      {tab === "Members & permissions" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input className={inputCls} placeholder={tr(L("دعوت عضو با نام یا ایمیل…", "Invite member by name or email…"))} />
            <Btn onClick={() => say(tr(L("دعوت ارسال شد", "Invite sent")))}>{tr(L("ارسال دعوت", "Send Invite"))}</Btn>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.07)]">
            {[[L("سارا محمدی", "Sara Mohammadi"), L("مالک", "Owner"), L("مدیر محصول", "Product Manager"), false], [L("امیر کریمی", "Amir Karimi"), L("عضو", "Member"), L("بک‌اند", "Backend"), false], [L("نگار رستگار", "Negar Rastegar"), L("ناظر", "Observer"), L("ناظر", "Observer"), true]].map(([n, role, jt, obs]) => (
              <div key={(n as Pair).en} className="flex items-center gap-3 py-2.5">
                <span className="w-8 h-8 grid place-items-center rounded-full bg-[#2d7aff] text-white text-[11px] font-bold">{tr(n as Pair).charAt(0)}</span>
                <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold truncate">{tr(n as Pair)}</div><div className="text-[11px] text-ink-soft">{tr(jt as Pair)}</div></div>
                <Chip tone={tr(role as Pair) === tr(L("مالک", "Owner")) ? "purple" : tr(role as Pair) === tr(L("ناظر", "Observer")) ? "orange" : "blue"}>{tr(role as Pair)}</Chip>
                {obs ? (
                  <span className="text-[10.5px] text-ink-soft max-w-[150px] text-end">{tr(L("ناظر از دیده‌بانی پروژه استفاده می‌کند — در «اشتراک‌گذاری» تنظیم شود.", "Observers use project visibility — adjust under Sharing."))}</span>
                ) : (
                  <button className="text-[11.5px] font-semibold text-[#2d7aff]" onClick={() => say(tr(L("دسترسی‌ها: ۱۲ از ۱۶ اعطا شد", "Permissions: 12/16 granted")))}>{tr(L("دسترسی‌ها", "Permissions"))}</button>
                )}
                {canManage && tr(role as Pair) !== tr(L("مالک", "Owner")) && <button className="text-[11.5px] font-semibold text-[#c9372c]">{tr(L("حذف", "Remove"))}</button>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Teams" && (
        <div className="space-y-3">
          <div className="flex gap-2"><input className={inputCls} placeholder={tr(L("دعوت یک تیم…", "Invite a team…"))} /><Btn onClick={() => say(tr(L("تیم دعوت شد", "Team invited")))}>{tr(L("ارسال دعوت", "Send invite"))}</Btn></div>
          <p className="text-[12px] text-ink-soft">{tr(L("یا", "Or"))} <button className="text-[#2d7aff] font-semibold">{tr(L("یک تیم جدید بسازید", "create a new team"))}</button>. {tr(L("اعضا را در صفحه «تیم‌ها» مدیریت کنید.", "Manage members on the Teams page."))}</p>
          <div className="app-surface rounded-lg p-3 flex items-center justify-between"><span className="text-[13px] font-medium">{tr(L("اسکواد پلتفرم", "Platform Squad"))}</span><Chip tone="green">{tr(L("متصل", "Linked"))}</Chip></div>
        </div>
      )}

      {tab === "Job titles" && (
        <div className="space-y-2.5">
          {[L("مدیر محصول", "Product Manager"), L("بک‌اند", "Backend"), L("ناظر", "Observer / ناظر")].map((j, i) => (
            <div key={j.en} className="flex items-center justify-between app-surface rounded-lg px-3 h-10">
              <span className="text-[13px] font-medium">{tr(j)}</span>
              {i === 2 ? <Chip tone="orange">{tr(L("پیش‌فرض", "default"))}</Chip> : <button className="text-[11.5px] text-[#c9372c] font-semibold">{tr(L("حذف", "Remove"))}</button>}
            </div>
          ))}
          <Btn variant="default" sm><IconPlus className="w-3.5 h-3.5" /> {tr(L("عنوان شغلی جدید", "New job title"))}</Btn>
        </div>
      )}

      {tab === "Integrations" && (
        <div className="space-y-3">
          <p className="text-[12.5px] text-ink-soft">{tr(L("فقط اتصال‌های CI/CD. برای اجرای build از روی بورد، یک مخزن وصل کنید.", "CI/CD integrations only. Connect a repository to run builds from the board."))}</p>
          <div className="flex items-center justify-between"><span className="text-[13px] font-semibold">{tr(L("متصل‌شده", "Connected"))}</span><Btn sm onClick={showUpgrade}><IconPlus className="w-3.5 h-3.5" /> {tr(L("افزودن", "Add"))}</Btn></div>
          <EmptyBox icon={<IconBolt className="w-6 h-6" />} title={tr(L("هنوز اتصالی نیست", "No integrations yet"))} sub={tr(L("برای اتصال یک ارائه‌دهنده روی «+ افزودن» کلیک کنید.", "Click “+ Add” to connect a provider."))} />
        </div>
      )}

      {tab === "Sharing" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between app-surface rounded-lg px-3 h-11">
            <span className="text-[13px] font-medium">{tr(L("اشتراک عمومی", "Public sharing"))}</span>
            <Btn sm onClick={showUpgrade}>{tr(L("ساخت لینک عمومی", "Create public link"))}</Btn>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-ink-soft mb-2">{tr(L("ناظر چه چیزی می‌بیند", "What observers can see"))}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[[L("بورد", "Board"), true], [L("اسناد", "Documents"), true], [L("پیوست‌ها", "Attachments"), true], [L("اعضا", "Members"), false], [L("فعالیت", "Activity"), false], [L("گزارش زمان", "Time logs"), false], [L("گزارش‌ها", "Reports"), false]].map(([k, on], i) => (
                <label key={i} className="flex items-center justify-between text-[13px] font-medium">{tr(k as Pair)}<input type="checkbox" defaultChecked={on as boolean} className="accent-[#2d7aff]" /></label>
              ))}
            </div>
          </div>
          <div className="flex justify-end"><Btn onClick={() => say(tr(L("دیده‌بانی ذخیره شد", "Visibility saved")))}>{tr(L("ذخیره دیده‌بانی", "Save visibility"))}</Btn></div>
        </div>
      )}
    </div>
  );
}

/* ================= remaining screens ================= */
function TeamsView({ canManage }: { canManage: boolean }) {
  const rows: [Pair, Pair][] = [
    [L("اسکواد پلتفرم", "Platform Squad"), L("۵ عضو · سرپرست: سارا", "5 members · Lead: Sara")],
    [L("رشد", "Growth"), L("۳ عضو · سرپرست: امیر", "3 members · Lead: Amir")],
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between"><h1 className="font-display text-2xl md:text-3xl">{tr(L("تیم‌ها", "Teams"))}</h1>{canManage && <Btn><IconPlus className="w-4 h-4" /> {tr(L("ساخت تیم", "Create Team"))}</Btn>}</div>
      <div className="grid sm:grid-cols-2 gap-4">
        {rows.map(([n, s]) => (
          <div key={n.en} className="app-surface rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3"><span className="w-10 h-10 grid place-items-center rounded-lg bg-[#e6f4ec] text-[#1f845a] font-bold">{tr(n).charAt(0)}</span>
              <div><div className="font-semibold text-[14px]">{tr(n)}</div><div className="text-[11.5px] text-ink-soft mt-0.5">{tr(s)}</div></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesView() {
  const [sel, setSel] = useState(0);
  const convos: [Pair, Pair, string][] = [
    [L("امیر کریمی", "Amir Karimi"), L("باشه، الان فیکس رو پوش می‌کنم", "Sure, pushing the fix now"), "2m"],
    [L("نگار رستگار", "Negar Rastegar"), L("می‌تونی بورد رو ببینی؟", "Can you review the board?"), "1h"],
    [L("اسکواد پلتفرم", "Platform Squad"), L("سارا: استنداپ تا ۱۰ دقیقه", "Sara: standup in 10"), "3h"],
  ];
  return (
    <div className="app-surface rounded-xl overflow-hidden grid md:grid-cols-[280px_1fr] h-[560px]">
      <div className="border-e border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] flex flex-col">
        <div className="p-3 flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)]">
          <strong className="text-[14px]">{tr(L("پیام‌ها", "Messages"))}</strong><Btn sm><IconPlus className="w-3.5 h-3.5" /> {tr(L("جدید", "New"))}</Btn>
        </div>
        <input className={`${inputCls} !rounded-none !border-0 !border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)]`} placeholder={tr(L("جستجو…", "Search…"))} />
        <div className="flex-1 overflow-y-auto">
          {convos.map(([n, m, t], i) => (
            <button key={n.en} onClick={() => setSel(i)} className={`w-full text-start px-3 py-3 flex gap-2.5 transition-colors ${sel === i ? "bg-[#e8f0fe] dark:bg-[#1a2f5e]" : "hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)]"}`}>
              <span className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-[#6554c0] text-white text-[11px] font-bold">{tr(n).charAt(0)}</span>
              <span className="min-w-0 flex-1"><span className="flex justify-between"><strong className="text-[13px] truncate">{tr(n)}</strong><span className="text-[10px] text-ink-soft">{t}</span></span>
                <span className="block text-[11.5px] text-ink-soft truncate mt-0.5">{i === 2 ? tr(L("بی‌صدا · ", "Muted · ")) : ""}{tr(m)}</span></span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="h-12 px-4 flex items-center gap-3 border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)]">
          <strong className="text-[13.5px]">{tr(convos[sel][0])}</strong>
          <span className="text-[11px] text-ink-soft">{tr(L("آخرین بازدید ۵ دقیقه پیش", "last seen 5m ago"))}</span>
          <div className="flex-1" /><Kebab onClick={() => undefined} />
        </div>
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="max-w-[70%] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] rounded-2xl rounded-es-md px-3.5 py-2 text-[13px]">{tr(L("می‌تونی PR صورتحساب رو ببینی؟", "Can you review the billing PR?"))}</div>
          <div className="max-w-[70%] ms-auto bg-[#2d7aff] text-white rounded-2xl rounded-ee-md px-3.5 py-2 text-[13px]">{tr(L("در حال انجام — خوب به نظر می‌رسه.", "On it — looks good."))} <span className="block text-[9.5px] opacity-70 text-end mt-0.5">{tr(L("دیده شد ✓✓", "Seen ✓✓"))}</span></div>
        </div>
        <div className="p-3 border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] flex gap-2">
          <input className={inputCls} placeholder={tr(L("پیام…", "Message…"))} />
          <Btn>{tr(L("ارسال", "Send"))}</Btn>
        </div>
      </div>
    </div>
  );
}

function TimeView({ isObserver, canEdit, setModal, showUpgrade }: { isObserver: boolean; canEdit: boolean; setModal: (m: ModalKind) => void; showUpgrade: () => void }) {
  if (isObserver) return <EmptyBox icon={<IconClock className="w-6 h-6" />} title={tr(L("گزارش زمان پنهان است", "Time logs hidden"))} sub={tr(L("دیده‌بانی ناظر برای گزارش زمان خاموش است.", "Observer visibility for time logs is turned off."))} />;
  const ranges: Pair[] = [L("امروز", "Today"), L("این هفته", "This Week"), L("این ماه", "This Month"), L("سفارشی", "Custom")];
  const kpis: [Pair, string][] = [[L("مجموع ساعت", "Total Hours"), "38.5"], [L("ساعت قابل‌صورتحساب", "Billable Hours"), "26.0"], [L("غیرقابل‌صورتحساب", "Non-Billable"), "12.5"], [L("گزارش‌ها", "Entries"), "14"]];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-2xl md:text-3xl">{tr(L("گزارش زمان", "Time Tracking"))}</h1>
        <div className="flex gap-2">
          {canEdit && <Btn variant="default" sm onClick={showUpgrade}>{tr(L("خروجی اکسل", "Export Excel"))}</Btn>}
          {canEdit && <Btn onClick={() => setModal("addEntry")}><IconPlus className="w-4 h-4" /> {tr(L("افزودن گزارش", "Add Entry"))}</Btn>}
        </div>
      </div>
      <div className="flex gap-1">{ranges.map((r, i) => (
        <button key={r.en} className={`h-7 px-3 rounded-lg text-[12px] font-semibold ${i === 1 ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:bg-[rgba(0,0,0,0.05)]"}`}>{tr(r)}</button>
      ))}</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(([l, v]) => (
          <div key={l.en} className="app-surface rounded-xl p-4"><div className="font-display text-2xl tabular-nums">{v}</div><div className="text-[12px] font-semibold text-ink-soft mt-1">{tr(l)}</div></div>
        ))}
      </div>
      {canEdit && (
        <div className="app-surface rounded-xl p-4 flex items-center gap-3">
          <span className="w-10 h-10 grid place-items-center rounded-full bg-[#22a06b] text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5.5v13l11-6.5z" /></svg></span>
          <div className="flex-1 text-[13px] font-medium">{tr(L("شروع تایمر", "Start Timer"))} <span className="text-ink-soft font-normal">— {tr(L("برای شروع یک تسک انتخاب کنید", "pick a task to begin"))}</span></div>
          <Btn sm>{tr(L("شروع تایمر", "Start Timer"))}</Btn>
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ showUpgrade, isObserver }: { showUpgrade: () => void; isObserver: boolean }) {
  if (isObserver) return <EmptyBox icon={<IconChart className="w-6 h-6" />} title={tr(L("گزارش‌ها پنهان است", "Reports hidden"))} sub={tr(L("دیده‌بانی ناظر برای گزارش‌ها خاموش است.", "Observer visibility for reports is turned off."))} />;
  const kpis: [Pair, number][] = [[L("مجموع تسک‌ها", "Total Tasks"), 128], [L("تکمیل‌شده", "Completed"), 84], [L("پروژه‌های فعال", "Active Projects"), 5], [L("ساعت ثبت‌شده", "Hours Logged"), 210], [L("اعضای تیم", "Team Members"), 9]];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-2"><h1 className="font-display text-2xl md:text-3xl">{tr(L("تحلیل‌ها", "Analytics"))}</h1><Chip tone="green">{tr(L("زنده", "Live"))}</Chip></div>
        <Btn variant="default" sm onClick={showUpgrade}>{tr(L("خروجی اکسل", "Export Excel"))}</Btn>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map(([l, v]) => (
          <div key={l.en} className="app-surface rounded-xl p-4"><div className="font-display text-2xl tabular-nums">{num(v)}</div><div className="text-[12px] font-semibold text-ink-soft mt-1">{tr(l)}</div></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="app-surface rounded-xl p-4"><h2 className="font-semibold text-[14px] mb-2">{tr(L("تکمیل تسک", "Task Completion"))}</h2><MiniChart /></div>
        <div className="app-surface rounded-xl p-4"><h2 className="font-semibold text-[14px] mb-2">{tr(L("نقشه حرارتی فعالیت", "Activity Heatmap"))}</h2>
          <div className="grid grid-cols-14 gap-1">{Array.from({ length: 56 }).map((_, i) => (
            <span key={i} className="aspect-square rounded-[3px]" style={{ background: `rgba(45,122,255,${0.08 + ((i * 7) % 9) * 0.09})` }} />
          ))}</div>
        </div>
      </div>
    </div>
  );
}

function SearchView({ goBoard }: { goBoard: () => void }) {
  const filters: Pair[] = [L("همه", "All"), L("تسک‌ها", "Tasks"), L("پروژه‌ها", "Projects"), L("کاربران", "Users")];
  const results: [Pair, Pair][] = [
    [L("اتصال وب‌هوک صورتحساب", "Wire billing webhooks"), L("تسک · آپولو", "Task · Apollo")],
    [L("طراحی جریان ورود", "Design login flow"), L("تسک · آپولو", "Task · Apollo")],
    [L("آپولو", "Apollo"), L("پروژه", "Project")],
  ];
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="font-display text-2xl md:text-3xl">{tr(L("جستجو", "Search"))}</h1>
      <input autoFocus className={`${inputCls} h-11 text-[14px]`} placeholder={tr(L("جستجو… (Ctrl+K) · امتحان کنید assignee: due: tag: status:", "Search… (Ctrl+K) · try assignee: due: tag: status:"))} />
      <div className="flex gap-1">{filters.map((f, i) => (
        <button key={f.en} className={`h-7 px-3 rounded-lg text-[12px] font-semibold ${i === 0 ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:bg-[rgba(0,0,0,0.05)]"}`}>{tr(f)}</button>
      ))}</div>
      <div className="app-surface rounded-xl divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.07)]">
        {results.map(([t, s]) => (
          <button key={t.en} onClick={goBoard} className="w-full text-start px-4 py-3 hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors">
            <div className="text-[13px] font-medium">{tr(t)}</div><div className="text-[11px] text-ink-soft mt-0.5">{tr(s)}</div>
          </button>
        ))}
      </div>
      <p className="text-[11.5px] text-ink-soft">{tr(L("اخیر: صورتحساب · ورود", "Recent: billing · login"))} — <button className="text-[#2d7aff] font-semibold">{tr(L("ذخیره جستجو", "Save Search"))}</button></p>
    </div>
  );
}

function DocsView() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="font-display text-2xl md:text-3xl">{tr(L("مستندات", "Documentation"))}</h1>
      <div className="flex gap-1"><Chip tone="blue">MCP</Chip><Chip>API</Chip></div>
      <div className="app-surface rounded-xl p-4">
        <h2 className="font-semibold text-[14px] mb-2">{tr(L("سرور MCP فینولو", "Finolo MCP Server"))}</h2>
        <p className="text-[12.5px] text-ink-soft leading-6">{tr(L("دستیار هوش مصنوعی خود را به بوردها، تسک‌ها و پروژه‌های فینولو وصل کنید. در تنظیمات → توکن‌های API یک توکن بسازید.", "Connect your AI assistant to Finolo boards, tasks and projects. Create an API token in Settings → API Tokens."))}</p>
        <pre className="mt-3 rounded-lg bg-[#121214] text-[#7aaaff] text-[11.5px] p-3 overflow-x-auto" dir="ltr">npx finolo-mcp --token $FINOLO_TOKEN</pre>
      </div>
    </div>
  );
}

function SettingsView({ tab, setTab, showUpgrade, say }: { tab: string; setTab: (t: string) => void; showUpgrade: () => void; say: (m: string) => void }) {
  const tabs: [string, Pair][] = [
    ["Profile", L("پروفایل", "Profile")], ["Account", L("حساب", "Account")], ["API Tokens", L("توکن‌های API", "API Tokens")],
    ["Notifications", L("اعلان‌ها", "Notifications")], ["Appearance", L("ظاهر", "Appearance")],
    ["Billing", L("صورتحساب", "Billing")], ["Danger Zone", L("منطقه خطر", "Danger Zone")],
  ];
  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl md:text-3xl">{tr(L("تنظیمات", "Settings"))}</h1>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`h-8 px-3.5 rounded-lg text-[12.5px] font-semibold transition-colors ${tab === id ? "bg-[#2d7aff] text-white" : "text-ink-soft hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)]"}`}>{tr(label)}</button>
        ))}
      </div>

      {tab === "Profile" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-3">
          <Field label={tr(L("نام کامل", "Full Name"))}><input className={inputCls} defaultValue={tr(L("سارا محمدی", "Sara Mohammadi"))} /></Field>
          <Field label={tr(L("ایمیل", "Email"))}><input className={inputCls} defaultValue="sara@finolo.ir" dir="ltr" /></Field>
          <Field label={tr(L("بیو", "Bio"))}><textarea className={`${inputCls} h-20 py-2 resize-none`} defaultValue={tr(L("مدیر محصول. جمعه‌ها منتشر می‌کنم.", "Product manager. Ships on Fridays."))} /></Field>
          <div className="flex justify-end"><Btn onClick={() => say(tr(L("پروفایل ذخیره شد", "Profile saved")))}>{tr(L("ذخیره تغییرات", "Save changes"))}</Btn></div>
        </div>
      )}
      {tab === "Account" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-4">
          <label className="flex items-center justify-between text-[13px] font-medium">{tr(L("نمایش آخرین بازدید", "Show last seen"))}<input type="checkbox" defaultChecked className="accent-[#2d7aff]" /></label>
          <div className="border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] pt-4 space-y-3">
            <h3 className="font-semibold text-[13.5px]">{tr(L("تغییر رمز عبور", "Change Password"))}</h3>
            <Field label={tr(L("رمز فعلی", "Current password"))}><input type="password" className={inputCls} /></Field>
            <Field label={tr(L("رمز جدید", "New password"))}><input type="password" className={inputCls} /></Field>
            <div className="flex justify-end"><Btn onClick={() => say(tr(L("رمز به‌روزرسانی شد", "Password updated")))}>{tr(L("به‌روزرسانی", "Update"))}</Btn></div>
          </div>
        </div>
      )}
      {tab === "API Tokens" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-4">
          <div className="flex gap-2"><input className={inputCls} placeholder={tr(L("نام توکن", "Token name"))} /><Btn onClick={showUpgrade}>{tr(L("ساخت توکن", "Create token"))}</Btn></div>
          <p className="text-[12px] text-ink-soft">{tr(L("توکن‌ها فقط یک بار نمایش داده می‌شوند. دسترسی API و MCP یک قابلیت «حرفه‌ای» است —", "Tokens are shown once. API & MCP access is a Pro feature —"))} <button className="text-[#2d7aff] font-semibold" onClick={showUpgrade}>{tr(L("ارتقا", "Upgrade"))}</button>.</p>
        </div>
      )}
      {tab === "Notifications" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-3">
          {[L("ایمیل", "Email"), L("داخل اپ", "In-app"), L("تلگرام", "Telegram"), L("مرورگر", "Browser")].map((c, i) => (
            <label key={c.en} className="flex items-center justify-between text-[13px] font-medium">{tr(L("اعلان‌های", "notifications"))} {tr(c)}<input type="checkbox" defaultChecked={i < 2} className="accent-[#2d7aff]" /></label>
          ))}
        </div>
      )}
      {tab === "Appearance" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-3">
          <label className="flex items-center justify-between text-[13px] font-medium">{tr(L("حالت تیره", "Dark mode"))}<input type="checkbox" className="accent-[#2d7aff]" /></label>
          <p className="text-[11.5px] text-ink-soft">{tr(L("زبان از نوار بالا عوض می‌شود (EN / FA). ظاهر در اینجا فقط حالت تیره را کنترل می‌کند.", "Language is switched from the top bar (EN / FA). Appearance here controls dark mode only."))}</p>
        </div>
      )}
      {tab === "Billing" && (
        <div className="space-y-4">
          <div className="app-surface rounded-xl p-4 flex items-center justify-between max-w-lg"><span className="text-[13px] font-semibold">{tr(L("پلن فعلی", "Current plan"))}</span><Chip>{tr(L("رایگان", "Free"))}</Chip></div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
            {[[L("رایگان", "Free"), "0", [L("۳ پروژه", "3 projects"), L("۵ عضو", "5 members")]], [L("حرفه‌ای", "Pro"), "890,000", [L("پروژه نامحدود", "Unlimited projects"), L("تحلیل‌ها", "Analytics"), L("CI/CD", "CI/CD"), L("لینک اشتراک", "Share links")]], [L("تجاری", "Business"), "1,890,000", [L("همه‌چیزِ حرفه‌ای", "Everything in Pro"), L("SSO", "SSO"), L("پشتیبانی ویژه", "Priority support")]]].map(([n, p, f], i) => (
              <div key={(n as Pair).en} className={`app-surface rounded-xl p-5 ${i === 1 ? "ring-2 ring-[#2d7aff]" : ""}`}>
                <div className="font-semibold text-[14px]">{tr(n as Pair)}{i === 1 && <Chip tone="blue">{tr(L("محبوب", "Popular"))}</Chip>}</div>
                <div className="font-display text-2xl mt-2 tabular-nums">{p as string} <span className="text-[11px] font-body text-ink-soft">{tr(L("تومان / ماه", "Toman / mo"))}</span></div>
                <ul className="mt-3 space-y-1.5">{(f as Pair[]).map((x) => <li key={x.en} className="text-[12px] text-ink-soft flex gap-1.5"><IconCheck className="w-3.5 h-3.5 text-[#22a06b] shrink-0" />{tr(x)}</li>)}</ul>
                <Btn className="mt-4 w-full" variant={i === 1 ? "primary" : "default"} sm onClick={() => say(i === 0 ? tr(L("شما روی پلن رایگان هستید", "You're on Free")) : tr(L("در حال انتقال به پرداخت…", "Redirecting to checkout…")))}>{i === 0 ? tr(L("فعلی", "Current")) : tr(L("همین حالا امتحان کن", "Try Now"))}</Btn>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "Danger Zone" && (
        <div className="app-surface rounded-xl p-5 max-w-lg space-y-3 border-[#c9372c]/40">
          <div className="flex items-center justify-between"><span className="text-[13px] font-medium">{tr(L("خروجی گرفتن از داده‌های من", "Export my data"))}</span><Btn variant="default" sm onClick={() => say(tr(L("خروجی در صف قرار گرفت", "Export queued")))}>{tr(L("خروجی", "Export"))}</Btn></div>
          <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] pt-3"><span className="text-[13px] font-medium text-[#c9372c]">{tr(L("حذف حساب", "Delete Account"))}</span><Btn variant="danger" sm>{tr(L("حذف", "Delete"))}</Btn></div>
        </div>
      )}
    </div>
  );
}

/* ================= admin ================= */
function AdminNav() {
  const items: Pair[] = [
    L("نمای کلی", "Overview"), L("کاربران", "Users"), L("فضای‌های کاری", "Workspaces"), L("پروژه‌ها", "Projects"),
    L("نقش‌ها", "Roles"), L("تیم‌ها", "Teams"), L("صورتحساب", "Billing"), L("امتیازها", "Points"),
    L("پیام‌رسانی", "Messaging"), L("اتصال‌ها", "Integrations"), L("اعلان‌ها", "Notifications"),
    L("تنظیمات سیستم", "System settings"), L("فعالیت", "Activity"),
  ];
  return (
    <>
      {items.map((n, i) => (
        <button key={n.en} className={`flex items-center gap-3 mx-2 px-3 h-9 rounded-lg text-[13px] font-medium transition-colors ${i === 0 ? "bg-[#e9e0ff] text-[#6554c0] font-semibold" : "text-ink-soft hover:text-ink hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.07)]"}`}>{tr(n)}</button>
      ))}
      <div className="mt-auto px-4 pt-3 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="text-[11px] text-ink-soft truncate mb-1" dir="ltr">admin@finolo.ir</div>
        <button className="text-[12.5px] font-medium text-ink-soft hover:text-[#c9372c]">{tr(L("خروج", "Sign Out"))}</button>
      </div>
    </>
  );
}

function AdminView() {
  const kpis: [Pair, number][] = [[L("کاربران", "Users"), 1240], [L("فضای‌های کاری", "Workspaces"), 310], [L("پروژه‌ها", "Projects"), 820], [L("تسک‌ها", "Tasks"), 15400], [L("کاربران فعال", "Active users"), 460]];
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2"><h1 className="font-display text-2xl md:text-3xl">{tr(L("نمای کلی ادمین", "Admin Overview"))}</h1><Chip tone="purple">{tr(L("سوپر ادمین", "Super Admin"))}</Chip></div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map(([l, v]) => (
          <div key={l.en} className="app-surface rounded-xl p-4"><div className="font-display text-2xl tabular-nums">{num(v)}</div><div className="text-[12px] font-semibold text-ink-soft mt-1">{tr(l)}</div></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="app-surface rounded-xl p-4"><h2 className="font-semibold text-[14px] mb-2">{tr(L("ثبت‌نام‌ها", "Signups"))}</h2><MiniChart /></div>
        <div className="app-surface rounded-xl p-4">
          <h2 className="font-semibold text-[14px] mb-2">{tr(L("ثبت‌نام‌های اخیر", "Recent signups"))}</h2>
          <div className="divide-y divide-[rgba(0,0,0,0.06)] dark:divide-[rgba(255,255,255,0.07)]">
            {[[ "sara@finolo.ir", L("تأییدشده", "verified")], ["amir@acme.co", L("در انتظار", "pending")], ["negar@aria.ir", L("تأییدشده", "verified")]].map(([e, s]) => (
              <div key={e as string} className="flex items-center justify-between py-2.5 text-[12.5px]"><span className="font-medium" dir="ltr">{e as string}</span><Chip tone={tr(s as Pair) === tr(L("تأییدشده", "verified")) ? "green" : "orange"}>{tr(s as Pair)}</Chip></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= DESIGN-INTENT (future) ================= */
function FutureSection() {
  const future: [Pair, Pair][] = [
    [L("فراموشی رمز عبور", "Forgot password"), L("لینک کارت ورود → ایمیل → صفحه بازنشانی", "Sign-in card link → email → reset page")],
    [L("تب فیلدهای سفارشی", "Custom fields tab"), L("تنظیمات پروژه · manage_custom_fields", "Project settings · manage_custom_fields")],
    [L("وب‌هوک و اتوماسیون", "Webhooks & Automations"), L("تب‌های تنظیمات پروژه · مشروط به پلن", "Project settings tabs · plan-gated")],
    [L("کشو: وابستگی‌ها / زیرتسک‌ها / دنبال‌کننده‌ها", "Drawer: deps / subtasks / watchers"), L("ویرایشگرهای جزئیات تسک", "Task Details editors")],
    [L("مدیریت برچسب", "Tag manager"), L("ساخت / ویرایش / حذف متمرکز برچسب‌ها", "Create / edit / delete tags centrally")],
    [L("پنل قالب تسک", "Task templates panel"), L("بورد · استفاده / کپی / حذف", "Board · Use / Duplicate / Delete")],
    [L("حضور و تایپ در بورد", "Board presence & typing"), L("اشتراک presence.board.{id}", "presence.board.{id} subscription")],
    [L("پالت فرمان", "Command palette"), L("اورلی Ctrl+K · SearchPolicy", "Ctrl+K overlay · SearchPolicy")],
    [L("مرورگر آرشیو + نگهداری", "Archive browser + retention"), L("مرور / بازیابی کار آرشیوشده", "Browse / restore archived work")],
    [L("فاکتورها و خروج از همه نشست‌ها", "Invoices & logout-all"), L("تنظیمات ← صورتحساب / حساب", "Settings → Billing / Account")],
  ];
  return (
    <div className="mt-12 pt-8 border-t-2 border-dashed border-[#6554c0]/40">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display text-xl md:text-2xl">{tr(L("قصد طراحی", "Design-Intent"))}</h2>
        <Chip tone="purple">{tr(L("آینده — جزو کروم فعلی نیست", "FUTURE — not current chrome"))}</Chip>
      </div>
      <p className="text-[13px] text-ink-soft max-w-2xl mb-5">{tr(L("این صفحات به‌صورت سطح API وجود دارند اما در SPA منتشرشده نیستند. اینجا برای نقشه راه طراحی شده‌اند — هرگز با SideNav، تب‌های تنظیمات یا کشوی تسک فعلی بالا ترکیب نشوند.", "These screens exist as API surface but are not in the shipped SPA. Designed here for the roadmap — never mixed into the current SideNav, Settings tabs or task drawer above."))}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {future.map(([t, d]) => (
          <div key={t.en} className="app-surface rounded-xl p-4 border-dashed !border-[#6554c0]/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between"><span className="font-semibold text-[13px]">{tr(t)}</span><Chip tone="purple">{tr(L("آینده", "FUTURE"))}</Chip></div>
            <p className="text-[11.5px] text-ink-soft mt-1.5 leading-5">{tr(d)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
