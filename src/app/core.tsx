import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useI18n, tr as trFn, type Pair, type Lang } from "../lib/i18n";

/* ================================================================
   FINOLO PRODUCT PROTOTYPE — core: types, data, permissions, kit
   ================================================================ */

export const L = (fa: string, en: string): Pair => ({ fa, en });

export type Role = "owner" | "member" | "observer";
export type Plan = "free" | "pro";
export type VState = "live" | "empty" | "loading" | "error" | "denied";

export type StatusId = "open" | "in_progress" | "completed" | "blocked" | "on_hold" | "cancelled";
export type PriorityId = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: Pair;
  status: StatusId;
  priority: PriorityId;
  urgency: number;
  est: number;
  due: string;
  start?: string;
  assignees: string[];
  tags: string[];
  col: string;
  comments: { who: string; text: Pair; when: string }[];
  attachments: number;
  checklist: { t: Pair; done: boolean }[];
  recurring?: boolean;
  blocked?: boolean;
  desc: Pair;
}

export const STATUS_META: Record<StatusId, { label: Pair; color: string; bg: string }> = {
  open: { label: L("باز", "Open"), color: "#8E8E93", bg: "bg-ink/10 text-ink-soft" },
  in_progress: { label: L("در حال انجام", "In Progress"), color: "#2D7AFF", bg: "bg-[#2D7AFF]/12 text-[#2D7AFF]" },
  completed: { label: L("تکمیل‌شده", "Completed"), color: "#1F845A", bg: "bg-[#1F845A]/12 text-[#1F845A]" },
  blocked: { label: L("مسدود", "Blocked"), color: "#C9372C", bg: "bg-[#C9372C]/12 text-[#C9372C]" },
  on_hold: { label: L("متوقف", "On hold"), color: "#B7791F", bg: "bg-amber/25 text-[#974F0C]" },
  cancelled: { label: L("لغوشده", "Cancelled"), color: "#943D73", bg: "bg-[#943D73]/12 text-[#943D73]" },
};

export const PRIORITY_META: Record<PriorityId, { label: Pair; color: string }> = {
  low: { label: L("کم", "Low"), color: "#1F845A" },
  medium: { label: L("متوسط", "Medium"), color: "#2D7AFF" },
  high: { label: L("زیاد", "High"), color: "#E56910" },
  urgent: { label: L("فوری", "Urgent"), color: "#C9372C" },
};

/* ---------------- users / demo data ---------------- */
export const USERS = [
  { id: "u1", name: L("سارا محمدی", "Sara Mohammadi"), init: "س", color: "#2D7AFF", job: L("مدیر محصول", "Product Manager"), online: true },
  { id: "u2", name: L("امیر کریمی", "Amir Karimi"), init: "ا", color: "#1F845A", job: L("توسعه‌دهنده", "Developer"), online: true },
  { id: "u3", name: L("نگار رستگار", "Negar Rastgar"), init: "ن", color: "#8270DB", job: L("اسکرام‌مستر", "Scrum Master"), online: false },
  { id: "u4", name: L("غزل حسینی", "Ghazal Hosseini"), init: "غ", color: "#E56910", job: L("طراح", "Designer"), online: true },
  { id: "u5", name: L("کاوه تهرانی", "Kaveh Tehrani"), init: "ک", color: "#943D73", job: L("ناظر", "Observer"), online: false },
  { id: "u6", name: L("لیلا حیدری", "Leila Heydari"), init: "ل", color: "#0FA3A3", job: L("QA", "QA Engineer"), online: false },
];

export const WORKSPACES = [
  { id: "w1", name: L("محصول فینولو", "Finolo Product"), slug: "finolo-product", desc: L("توسعهٔ خودِ محصول", "Building the product itself"), visibility: "Private", type: "Team", members: 6, active: true },
  { id: "w2", name: L("مشتری: آبان‌تک", "Client: AbanTech"), slug: "abantech", desc: L("پروژه‌های برون‌سپاری", "Outsourced projects"), visibility: "Workspace", type: "Client", members: 4, active: true },
];

export const PROJECTS = [
  { id: "p1", name: L("ریلیز ۳٫۰", "Release 3.0"), ws: "w1", status: "Active", priority: "high", boardType: "Kanban", progress: 62, color: "#2D7AFF", start: "۱ مهر", end: "۳۰ مهر", deleted: false },
  { id: "p2", name: L("اپلیکیشن موبایل", "Mobile App"), ws: "w1", status: "Active", priority: "urgent", boardType: "Kanban", progress: 38, color: "#8270DB", start: "۱۵ مهر", end: "۱۵ آذر", deleted: false },
  { id: "p3", name: L("سایت marketing", "Marketing Site"), ws: "w2", status: "On Hold", priority: "medium", boardType: "List", progress: 81, color: "#1F845A", start: "۱ شهریور", end: "۲۰ مهر", deleted: false },
  { id: "p4", name: L("مهاجرت زیرساخت", "Infra Migration"), ws: "w1", status: "Archived", priority: "low", boardType: "Timeline", progress: 100, color: "#8E8E93", start: "۱ مرداد", end: "۱۰ شهریور", deleted: false },
];

const T = (
  id: string, fa: string, en: string, status: StatusId, priority: PriorityId, col: string,
  opts: Partial<Task> = {}
): Task => ({
  id, title: L(fa, en), status, priority, urgency: 3, est: 8, due: "۲۱ مهر", assignees: ["u1"], tags: [],
  col, comments: [], attachments: 0, checklist: [],
  desc: L("توضیحات این تسک در بردار کشو قابل ویرایش است.", "Details are editable in the task drawer."),
  ...opts,
});

export const SECTIONS = [
  {
    id: "s1", name: L("اسپرینت ۱۴", "Sprint 14"),
    columns: [
      { id: "c1", name: L("برای انجام", "To Do"), tasks: ["t1", "t2", "t3"] },
      { id: "c2", name: L("در حال انجام", "In Progress"), tasks: ["t4", "t5"] },
      { id: "c3", name: L("تکمیل‌شده", "Done"), tasks: ["t6", "t7"] },
    ],
  },
  {
    id: "s2", name: L("بک‌لاگ", "Backlog"),
    columns: [{ id: "c4", name: L("بعدی", "Up Next"), tasks: ["t8", "t9"] }],
  },
];

export const TASKS: Task[] = [
  T("t1", "طراحی صفحهٔ ورود جدید", "Redesign the sign-in page", "open", "high", "c1", { due: "۱۹ مهر", assignees: ["u4"], tags: ["design"], est: 12, checklist: [{ t: L("وایرفریم", "Wireframe"), done: true }, { t: L("های‌فای", "Hi-fi"), done: false }], comments: [{ who: "u1", text: L("لوگوی جدید را هم در نظر بگیر.", "Consider the new logo too."), when: "۲ ساعت پیش" }] }),
  T("t2", "تست پرداخت ریالی", "Test Rial checkout", "open", "urgent", "c1", { due: "۱۸ مهر", assignees: ["u6", "u2"], tags: ["qa", "billing"], urgency: 5, attachments: 2 }),
  T("t3", "ترجمهٔ اعلان‌ها به فارسی", "Localize notifications to FA", "open", "medium", "c1", { assignees: ["u3"], tags: ["i18n"] }),
  T("t4", "اتصال تقویم شمسی", "Wire up the Jalali calendar", "in_progress", "high", "c2", { due: "۱۶ مهر", assignees: ["u2"], tags: ["dev"], est: 16, blocked: false }),
  T("t5", "بهینه‌سازی سرعت بورد", "Board performance pass", "blocked", "urgent", "c2", { due: "۲۰ مهر", assignees: ["u2", "u4"], tags: ["dev"], blocked: true, urgency: 5 }),
  T("t6", "مستندات API نسخهٔ ۲", "API v2 docs", "completed", "medium", "c3", { assignees: ["u3"], tags: ["docs"] }),
  T("t7", "ریلیز نسخهٔ ۲٫۴", "Ship v2.4", "completed", "high", "c3", { assignees: ["u1", "u2"], tags: ["release"], recurring: false }),
  T("t8", "گزارش هفتگی خودکار", "Automatic weekly report", "on_hold", "low", "c4", { assignees: ["u1"], tags: ["analytics"], recurring: true }),
  T("t9", "پاک‌سازی داده‌های قدیمی", "Prune stale data", "cancelled", "low", "c4", { assignees: ["u6"], tags: ["ops"] }),
];

export const TEAMS = [
  { id: "tm1", name: L("تیم هسته", "Core Team"), desc: L("هستهٔ توسعهٔ محصول", "Product engineering core"), members: [{ id: "u1", role: "Lead" }, { id: "u2", role: "Member" }, { id: "u5", role: "Observer" }], projects: ["p1", "p2"], pending: 1 },
  { id: "tm2", name: L("تیم طراحی", "Design Guild"), desc: L("سیستم دیزاین و تحقیق", "Design system & research"), members: [{ id: "u4", role: "Lead" }, { id: "u1", role: "Member" }], projects: ["p1"], pending: 0 },
];

export const INVITES = [
  { id: "i1", kind: "project", name: L("مهاجرت زیرساخت", "Infra Migration"), by: "u3", role: "Member", msg: L("برای بازبینی مستندات لازمیم.", "We need you for the docs review.") },
  { id: "i2", kind: "team", name: L("تیم طراحی", "Design Guild"), by: "u4", role: "Observer", msg: null },
];

export const NOTIFS = [
  { id: "n1", icon: "task", text: L("امیر شما را روی «اتصال تقویم شمسی» منشن کرد", "Amir mentioned you on “Jalali calendar”"), when: L("۵ دقیقه پیش", "5m ago"), unread: true, kind: "Mentions" },
  { id: "n2", icon: "invite", text: L("دعوت‌نامهٔ پروژهٔ «مهاجرت زیرساخت»", "Invite to “Infra Migration”"), when: L("۱ ساعت پیش", "1h ago"), unread: true, kind: "Assignments", to: "invites" },
  { id: "n3", icon: "task", text: L("تسک «تست پرداخت» به شما محول شد", "“Test Rial checkout” assigned to you"), when: L("۳ ساعت پیش", "3h ago"), unread: true, kind: "Assignments" },
  { id: "n4", icon: "msg", text: L("پیام جدید از نگار", "New message from Negar"), when: L("دیروز", "Yesterday"), unread: false, kind: "All", to: "messages" },
  { id: "n5", icon: "sys", text: L("بکاپ هفتگی با موفقیت انجام شد", "Weekly backup completed"), when: L("۲ روز پیش", "2d ago"), unread: false, kind: "All" },
];

export const CONVERSATIONS = [
  {
    id: "cv1", user: "u2", unread: 2, muted: false, lastSeen: L("آنلاین", "Online"),
    msgs: [
      { me: false, text: L("سلام! تقویم شمسی آماده‌ست، فقط یه باگ کوچک در تبدیل سال کبیسه هست.", "Hey! Jalali calendar is ready — just a tiny leap-year bug."), when: "۱۰:۲۴", state: "seen", pinned: false },
      { me: true, text: L("عالی! لینکش رو بفرست، امروز تستش می‌کنم.", "Great! Send the link, I'll test today."), when: "۱۰:۲۶", state: "seen", pinned: false },
      { me: false, text: L("اینم تسکش 👇 یه نگاه به چک‌لیست بنداز.", "Here's the task 👇 check the checklist."), when: "۱۰:۳۱", state: "seen", pinned: true, task: "t4" },
      { me: false, text: L("راستی، فردا دمو داریم. آماده‌ای؟", "Btw, demo tomorrow. Ready?"), when: "۱۰:۳۲", state: "delivered", pinned: false },
    ],
  },
  {
    id: "cv2", user: "u4", unread: 0, muted: true, lastSeen: L("آخرین بازدید ۲ ساعت پیش", "Last seen 2h ago"),
    msgs: [
      { me: true, text: L("موکاپ‌های صفحهٔ ورود رو دیدی؟", "Seen the sign-in mockups?"), when: "دیروز", state: "seen", pinned: false },
      { me: false, text: L("آره، فردا نظرم رو می‌فرستم.", "Yes, sending feedback tomorrow."), when: "دیروز", state: "seen", pinned: false },
    ],
  },
];

export const TIME_ROWS = [
  { id: "tl1", task: "t4", date: "۱۴ مهر", start: "۰۹:۰۰", end: "۱۲:۳۰", hours: 3.5, billable: true, who: "u1" },
  { id: "tl2", task: "t2", date: "۱۴ مهر", start: "۱۳:۰۰", end: "۱۵:۰۰", hours: 2, billable: true, who: "u1" },
  { id: "tl3", task: "t5", date: "۱۳ مهر", start: "۱۰:۰۰", end: "۱۴:۰۰", hours: 4, billable: false, who: "u1" },
  { id: "tl4", task: "t1", date: "۱۲ مهر", start: "۰۹:۳۰", end: "۱۱:۰۰", hours: 1.5, billable: true, who: "u1" },
];

/* ---------------- permissions & plan gates ---------------- */
const MEMBER_SLUGS = [
  "view_project", "create_section", "edit_section", "create_column", "edit_column",
  "create_task", "edit_task", "move_task", "assign_task", "create_comment", "edit_comment",
  "upload_attachment", "create_tag", "log_time", "view_timelogs", "view_activity_log", "view_reports",
];
export const canFor = (role: Role, slug: string) => role === "owner" || (role === "member" && MEMBER_SLUGS.includes(slug));

export const PLAN_GATED: Record<string, Pair> = {
  recurring_tasks: L("تسک تکرارشونده", "Recurring tasks"),
  public_share_links: L("لینک اشتراک عمومی", "Public share links"),
  import_export: L("ورود/خروجی JSON", "Import / Export JSON"),
  analytics: L("تحلیل‌های پیشرفته", "Advanced analytics"),
  advanced_reporting: L("خروجی اکسل گزارش‌ها", "Report Excel export"),
  cicd_integrations: L("اتصال CI/CD", "CI/CD integrations"),
  custom_fields: L("فیلدهای سفارشی", "Custom fields"),
  billable_time: L("زمان قابل‌صورتحساب", "Billable time"),
  api_access: L("توکن API", "API access"),
  mcp_access: L("دسترسی MCP", "MCP access"),
  task_templates: L("قالب تسک", "Task templates"),
};

export const VIS_FLAGS: { key: string; label: Pair; def: boolean }[] = [
  { key: "board", label: L("بورد", "Board"), def: true },
  { key: "docs", label: L("اسناد", "Documents"), def: true },
  { key: "attachments", label: L("پیوست‌ها", "Attachments"), def: true },
  { key: "members", label: L("اعضا", "Members"), def: false },
  { key: "activity", label: L("فعالیت", "Activity"), def: false },
  { key: "timelogs", label: L("گزارش زمان", "Time logs"), def: false },
  { key: "reports", label: L("گزارش‌ها", "Reports"), def: false },
];

/* ---------------- context ---------------- */
export interface AppCtxT {
  screen: string; params: Record<string, string>;
  go: (s: string, p?: Record<string, string>) => void;
  role: Role; setRole: (r: Role) => void;
  plan: Plan; setPlan: (p: Plan) => void;
  vstate: VState; setVState: (v: VState) => void;
  lang: Lang; isFa: boolean;
  t: (k: string) => string; tr: (p: Pair) => string;
  can: (slug: string) => boolean;
  upgrade: (feature: keyof typeof PLAN_GATED) => boolean;
  upgradeLabel: Pair | null; closeUpgrade: () => void;
  vis: Record<string, boolean>; setVis: (v: Record<string, boolean>) => void;
  toast: (m: string) => void;
  tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  sections: typeof SECTIONS; setSections: React.Dispatch<React.SetStateAction<typeof SECTIONS>>;
  openTask: (id: string) => void; openSettings: (tab?: string) => void;
}
export const AppCtx = createContext<AppCtxT | null>(null);
export const useApp = () => useContext(AppCtx)!;

/* ---------------- bilingual chrome dictionary ---------------- */
const DICT: Record<string, Pair> = {
  dashboard: L("داشبورد", "Dashboard"), workspaces: L("فضاهای کاری", "Workspaces"), projects: L("پروژه‌ها", "Projects"),
  teams: L("تیم‌ها", "Teams"), messages: L("پیام‌ها", "Messages"), timeTracking: L("گزارش زمان", "Time Tracking"),
  analytics: L("تحلیل‌ها", "Analytics"), search: L("جستجو", "Search"), docs: L("مستندات", "Documentation"),
  settings: L("تنظیمات", "Settings"), signOut: L("خروج", "Sign Out"), more: L("بیشتر", "More"),
  upgradeTitle: L("پلن خود را ارتقا دهید", "Upgrade your plan"), viewPlans: L("مشاهدهٔ پلن‌ها", "View plans"), notNow: L("الان نه", "Not now"),
  createWorkspace: L("ساخت فضای کاری", "Create Workspace"), createProject: L("ساخت پروژه", "Create Project"),
  addSection: L("افزودن بخش", "Add section"), addColumn: L("افزودن ستون", "+ Add Column"), addTask: L("افزودن تسک", "+ Add Task"),
  importSection: L("ورود بخش", "Import section"), importColumn: L("ورود ستون", "Import column"),
  exportProject: L("خروجی پروژه", "Export project"), exportJson: L("خروجی JSON", "Export as JSON"), exportSection: L("خروجی بخش", "Export section"),
  shareLink: L("لینک اشتراک", "Share link"), info: L("اطلاعات", "Info"), projectSettings: L("تنظیمات پروژه", "Project settings"),
  details: L("جزئیات", "Details"), membersPerms: L("اعضا و دسترسی‌ها", "Members & permissions"), jobTitles: L("عناوین شغلی", "Job titles"),
  integrations: L("اتصال‌ها", "Integrations"), sharing: L("اشتراک‌گذاری", "Sharing"),
  viewAllActivity: L("مشاهدهٔ همهٔ فعالیت‌ها", "View all activity"), open: L("باز کردن", "Open"), edit: L("ویرایش", "Edit"),
  delete: L("حذف", "Delete"), rename: L("تغییر نام", "Rename"), save: L("ذخیره", "Save"), cancel: L("انصراف", "Cancel"),
  done: L("بستن", "Done"), loading: L("در حال بارگذاری…", "Loading…"), retry: L("تلاش دوباره", "Retry"),
  denied403: L("دسترسی ندارید — این عمل برای نقش شما مجاز نیست.", "403 — You don't have permission for this action."),
  somethingWrong: L("خطایی رخ داد. دوباره تلاش کنید.", "Something went wrong. Please retry."),
  observerNote: L("ناظر از تنظیمات دیده‌بانی پروژه استفاده می‌کند — در تب «اشتراک‌گذاری» تنظیم شود.", "Observers use project visibility settings — adjust under Sharing."),
  joinFinolo: L("عضویت در فینولو", "Join Finolo"),
  verifyEmail: L("تأیید ایمیل", "Verify Email"), registrationClosed: L("ثبت‌نام بسته است", "Registration closed"),
  goLogin: L("رفتن به ورود", "Go to login"), myInvites: L("دعوت‌نامه‌های من", "My Invites"), noInvites: L("دعوت‌نامه‌ای در انتظار نیست.", "No pending invites."),
  accept: L("پذیرش", "Accept"), decline: L("رد", "Decline"), invitedBy: L("دعوت از طرف", "Invited by"),
  markAllRead: L("خواندن همه", "Mark all as read"), notifications: L("اعلان‌ها", "Notifications"),
  unread: L("خوانده‌نشده", "Unread"), mentions: L("منشن‌ها", "Mentions"), assignments: L("محول‌شده", "Assignments"), all: L("همه", "All"),
  darkMode: L("حالت تیره", "Dark mode"), appearance: L("ظاهر", "Appearance"), billing: L("صورتحساب", "Billing"),
  apiTokens: L("توکن‌های API", "API Tokens"), dangerZone: L("منطقهٔ خطر", "Danger Zone"), account: L("حساب", "Account"),
  profile: L("پروفایل", "Profile"), mute: L("بی‌صدا", "Mute"), muted: L("بی‌صدا شده", "Muted"), unmute: L("باصدا", "Unmute"),
  media: L("رسانه", "Media"), files: L("فایل‌ها", "Files"), links: L("لینک‌ها", "Links"),
  noPhotos: L("هنوز عکسی نیست.", "No photos yet."), noFiles: L("هنوز فایلی نیست.", "No files yet."), noLinks: L("هنوز لینکی نیست.", "No links yet."),
  startTimer: L("شروع تایمر", "Start Timer"), stopTimer: L("توقف تایمر", "Stop Timer"), addEntry: L("افزودن گزارش", "+ Add Entry"),
  exportExcel: L("خروجی اکسل", "Export Excel"), totalHours: L("مجموع ساعت", "Total Hours"), billable: L("قابل‌صورتحساب", "Billable"),
  points: L("امتیاز", "Points"), refresh: L("تازه‌سازی", "Refresh"), viewProjects: L("مشاهدهٔ پروژه‌ها", "View Projects"),
  welcomeBack: L("خوش برگشتی", "Welcome back"), myTasks: L("تسک‌های من", "My Tasks"), myAnalytics: L("تحلیل‌های من", "My Analytics"),
  fullReport: L("گزارش کامل", "Full report"), tryNow: L("همین حالا امتحان کن", "Try Now"), currentPlan: L("پلن فعلی", "Current plan"),
  kanban: L("کانبان", "Kanban"), list: L("لیست", "List"), tree: L("درختی", "Tree"), graph: L("گراف", "Graph"),
  calendar: L("تقویم", "Calendar"), timeline: L("تایم‌لاین", "Timeline"), searchTasks: L("جستجوی تسک‌ها…", "Search tasks…"),
  createPublicLink: L("ساخت لینک عمومی", "Create public link"), revoke: L("باطل کردن", "Revoke"), turnOffAll: L("خاموش کردن همه", "Turn off all"),
  observerCanSee: L("ناظر چه چیزی می‌بیند", "What observers can see"), visibility: L("دیده‌بانی", "Visibility"),
  newMessage: L("پیام جدید", "New message"), chatInfo: L("اطلاعات گفتگو", "Chat info"), send: L("ارسال", "Send"),
  message: L("پیام…", "Message…"), noConvs: L("هنوز گفتگویی نیست.", "No conversations yet."),
  noMsgs: L("هنوز پیامی نیست — سلامی بفرست یا تسکی به اشتراک بگذار.", "No messages yet — say hello or share a task."),
  emptyBoard: L("هنوز بخشی در بورد نیست.", "No board sections yet."), emptyCols: L("ستونی در این بخش نیست.", "No columns in this section."),
  startSearching: L("برای شروع، جستجو کنید.", "Start searching."), recent: L("اخیر", "Recent"), saved: L("ذخیره‌شده", "Saved"),
  saveSearch: L("ذخیرهٔ جستجو", "Save Search"), viewProfile: L("مشاهدهٔ پروفایل", "View profile"),
  createTeam: L("ساخت تیم", "Create Team"), leaveTeam: L("ترک تیم", "Leave Team"), deleteTeam: L("حذف تیم", "Delete Team"),
  addMember: L("افزودن عضو", "Add Member"), sendInvite: L("ارسال دعوت", "Send Invite"), pendingInvites: L("دعوت‌های در انتظار", "Pending invites"),
  inviteMember: L("دعوت عضو", "Invite member"), removeMember: L("حذف عضو", "Remove member"), permissions: L("دسترسی‌ها", "Permissions"),
  newJobTitle: L("عنوان شغلی جدید", "New job title"), ciRuns: L("اجراهای CI/CD", "CI/CD runs"), addIntegration: L("افزودن اتصال", "+ Add"),
  openFullLogs: L("باز کردن لاگ کامل", "Open full logs"), projectInfo: L("اطلاعات پروژه", "Project info"),
  progress: L("پیشرفت", "Progress"), taskStats: L("آمار تسک‌ها", "Tasks"), membersW: L("اعضا", "Members"), documentation: L("اسناد", "Documentation"),
  activity: L("فعالیت", "Activity"), noDocs: L("هنوز سند پروژه‌ای نیست.", "No documentation files yet."),
  uploadDoc: L("بارگذاری سند", "Upload document"), recurring: L("تکرارشونده", "Recurring task"), repeats: L("تکرار", "Repeats"),
  checklists: L("چک‌لیست‌ها", "Checklists"), commentsW: L("نظرات", "Comments"), attachmentsW: L("پیوست‌ها", "Attachments"),
  addComment: L("نظرت را بنویس… (@منشن)", "Add a comment… (@mention)"), post: L("ثبت", "Post"),
  maintenance: L("در حال تعمیرات", "Maintenance"), superAdmin: L("سوپر ادمین", "Super Admin"), enterAdmin: L("ورود به کنسول ادمین", "Enter admin console"),
  signInRegular: L("ورود به‌عنوان کاربر عادی", "Sign in as a regular user"), adminNoAccess: L("این حساب دسترسی ادمین ندارد.", "This account does not have admin access."),
  rememberMe: L("مرا به خاطر بسپار", "Remember me"), signIn: L("ورود", "Sign In"), createAccount: L("ساخت حساب", "Create Account"),
  alreadyAccount: L("حساب دارید؟", "Already have an account?"), createOne: L("حساب بسازید", "Create one"), backHome: L("بازگشت به خانه", "Back to home"),
  readNote: L("این بورد حذف شده — فقط قابل مشاهده است و تغییری پذیرفته نمی‌شود.", "This project was deleted — view only, no new changes."),
};

/* ---------------- icon set (stroke 2, round) ---------------- */
const PATHS: Record<string, string> = {
  more: "M12 5.2v.01M12 12v.01M12 18.8v.01",
  x: "M6 6l12 12M18 6 6 18",
  chevD: "m6 9 6 6 6-6",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm9.3 15.8-4.6-4.6",
  send: "m4.5 11.5 15-7-4 15-4.3-6.2L4.5 11.5Zm6.7 1.8L19.5 4.5",
  clip: "m15.5 8.5-6 6a2 2 0 0 0 2.9 2.9l6-6a4.1 4.1 0 0 0-5.8-5.8l-6 6a6.2 6.2 0 0 0 8.8 8.8l5.5-5.5",
  star: "m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z",
  refresh: "M20 12a8 8 0 1 1-2.3-5.6M20 4v4.5h-4.5",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  download: "M12 4v11m0 0 4-4m-4 4-4-4M5 20h14",
  pin: "M12 16.5V21m-5-11.5 1-5.5h8l1 5.5a5 5 0 0 1-10 0Z",
  trash: "M4.5 7h15M9.5 7V5h5v2M6.5 7l.8 12.5h9.4L17.5 7M10 10.5v6m4-6v6",
  pen: "m4.5 19.5.9-3.6L16.7 4.6a2 2 0 0 1 2.8 2.8L8.2 18.7l-3.7.8Z",
  eye: "M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 2.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z",
  timer: "M12 8.5V12l2.6 2.6M12 3.5a8.5 8.5 0 1 0 8.5 8.5",
  crown: "m4 17.5 16 .1-1.3-8.6-4.2 3.7L12 6l-2.5 6.7-4.2-3.7L4 17.5ZM4 20.5h16",
  link: "M10.2 13.8a3.8 3.8 0 0 0 5.4 0l2.9-2.9a3.8 3.8 0 0 0-5.4-5.4l-1.1 1.1m3.8 3.8a3.8 3.8 0 0 0-5.4 0l-2.9 2.9a3.8 3.8 0 0 0 5.4 5.4l1.1-1.1",
  play: "M8.5 5.5v13l10-6.5-10-6.5Z",
  reply: "M9 10 4 14l5 4v-3c5 0 9 1 11 5-1-7-5-10-11-10v-0Z",
  forward: "m15 10 5 4-5 4v-3c-5 0-9 1-11 5 1-7 5-10 11-10v-0Z",
  flag: "M5.5 20.5v-16m0 1h12l-2.5 4 2.5 4h-12",
  gear: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7.4-3.2 1.8-1.4-2-3.4-2.2.9a7.3 7.3 0 0 0-2-1.2L14.6 4.5h-4L10 6.9a7.3 7.3 0 0 0-2 1.2l-2.2-.9-2 3.4 1.8 1.4-1.8 1.4 2 3.4 2.2-.9a7.3 7.3 0 0 0 2 1.2l.6 2.4h4l.6-2.4a7.3 7.3 0 0 0 2-1.2l2.2.9 2-3.4-1.8-1.4Z",
  doc: "M6 3.5h8l4 4v13H6v-17Zm8 0v4h4M9 12h6M9 15.5h6",
  checkAll: "m3 13 4 4L15 9m-2 8 2 2 6-8",
  moon: "M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z",
  sun: "M12 4V2.5M12 21.5V20m8-8h1.5M2.5 12H4m13.7-5.7 1-1M5.3 18.7l1-1m12.4 1 1 1M5.3 5.3l1 1M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.4 3.8 5.6 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3Z",
  plus: "M12 5v14M5 12h14",
  bell: "M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Zm-8.5 9a2.5 2.5 0 0 0 5 0",
  user: "M12 11.5a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6ZM4.5 20a7.5 7.5 0 0 1 15 0",
  team: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M16 4.6a3.5 3.5 0 0 1 0 6.8m3 8.6a6 6 0 0 0-4-5.7",
  bolt: "M13 2.5 4.5 13.5H11l-1 8L18.5 10H12l1-7.5Z",
  archive: "M4 8V5.5h16V8M4 8h16v11.5H4V8Zm4 4h8",
  logout: "M9 4.5H5.5v15H9M14 8l4 4-4 4m4-4H9.5",
  grid: "M4.5 4.5h6v6h-6v-6Zm9 0h6v6h-6v-6Zm-9 9h6v6h-6v-6Zm9 0h6v6h-6v-6Z",
  warn: "M12 3.5 2.5 20h19L12 3.5Zm0 6.5v4.5m0 3v.01",
};

export function Ic({ n, className = "w-5 h-5", sw = 1.8 }: { n: string; className?: string; sw?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={PATHS[n]} />
    </svg>
  );
}

/* ---------------- kit ---------------- */
export function Btn({
  children, variant = "default", size = "md", className = "", onClick, disabled, type = "button",
}: {
  children: React.ReactNode; variant?: "primary" | "default" | "subtle" | "danger" | "warn" | "success";
  size?: "sm" | "md"; className?: string; onClick?: () => void; disabled?: boolean; type?: "button" | "submit";
}) {
  const v = {
    primary: "bg-verm text-white hover:brightness-110 active:brightness-95",
    default: "bg-paper text-ink border border-ink/15 hover:bg-paper-deep active:bg-line/60",
    subtle: "text-ink-soft hover:bg-ink/6 hover:text-ink",
    danger: "bg-[#C9372C] text-white hover:brightness-110",
    warn: "bg-[#E2811A] text-white hover:brightness-110",
    success: "bg-[#1F845A] text-white hover:brightness-110",
  }[variant];
  const s = size === "sm" ? "h-8 px-3 text-[13px] rounded-lg gap-1.5" : "h-9 px-4 text-sm rounded-lg gap-2";
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-verm focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none ${v} ${s} ${className}`}>
      {children}
    </button>
  );
}

export function IconBtn({ n, label, onClick, className = "", active = false }: { n: string; label: string; onClick?: () => void; className?: string; active?: boolean }) {
  return (
    <button aria-label={label} title={label} onClick={onClick}
      className={`inline-grid place-items-center w-9 h-9 rounded-lg transition-all duration-150 focus-visible:outline-2 focus-visible:outline-verm ${active ? "bg-verm/12 text-verm" : "text-ink-soft hover:bg-ink/6 hover:text-ink"} ${className}`}>
      <Ic n={n} className="w-[18px] h-[18px]" />
    </button>
  );
}

export function Menu({ items, label = "actions", align = "end" }: {
  items: { label: string; icon?: string; danger?: boolean; onClick: () => void }[];
  label?: string; align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  if (items.length === 0) return null; // deny by hiding
  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button aria-label={label} aria-expanded={open} onClick={() => setOpen((v) => !v)}
        className={`inline-grid place-items-center w-8 h-8 rounded-lg transition-all duration-150 ${open ? "bg-ink/10 text-ink" : "text-ink-soft hover:bg-ink/6 hover:text-ink"}`}>
        <Ic n="more" className="w-[18px] h-[18px]" sw={2.4} />
      </button>
      {open && (
        <div className={`app-pop absolute z-[120] top-9 ${align === "end" ? "end-0" : "start-0"} min-w-[190px] app-glass-thick rounded-xl border border-ink/10 p-1.5 app-shadow-overlay`}>
          {items.map((it) => (
            <button key={it.label} onClick={() => { setOpen(false); it.onClick(); }}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${it.danger ? "text-[#C9372C] hover:bg-[#C9372C]/10" : "text-ink hover:bg-ink/6"}`}>
              {it.icon && <Ic n={it.icon} className="w-4 h-4" />}
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, wide = false }: {
  title: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center p-4 sm:p-6" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`app-pop relative w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[88vh] flex flex-col app-glass-thick rounded-2xl app-shadow-overlay overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-ink/10">
          <h3 className="font-semibold text-[17px] leading-6">{title}</h3>
          <IconBtn n="x" label="close" onClick={onClose} />
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-ink/10 flex items-center justify-end gap-2.5 bg-ink/[0.03]">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ title, onClose, children, footer }: { title: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="app-drawer absolute inset-y-0 end-0 w-full max-w-[460px] app-glass-thick border-s border-ink/10 flex flex-col app-shadow-overlay">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-ink/10">
          <h3 className="font-semibold text-[17px] leading-6 min-w-0 truncate">{title}</h3>
          <IconBtn n="x" label="close" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-ink/10 flex items-center justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange, className = "" }: { tabs: string[]; active: number; onChange: (i: number) => void; className?: string }) {
  return (
    <div className={`flex items-center gap-1 overflow-x-auto border-b border-ink/10 ${className}`} role="tablist">
      {tabs.map((t, i) => (
        <button key={t} role="tab" aria-selected={i === active} onClick={() => onChange(i)}
          className={`shrink-0 px-3.5 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all duration-150 ${i === active ? "border-verm text-verm" : "border-transparent text-ink-soft hover:text-ink"}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

export function Seg<T extends string>({ options, value, onChange, size = "md" }: { options: { v: T; label: string }[]; value: T; onChange: (v: T) => void; size?: "sm" | "md" }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-ink/6 p-0.5">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)}
          className={`${size === "sm" ? "px-2.5 h-7 text-[12px]" : "px-3 h-8 text-[13px]"} rounded-[7px] font-medium transition-all duration-150 ${value === o.v ? "bg-paper text-ink app-shadow-low" : "text-ink-soft hover:text-ink"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative w-11 h-[26px] rounded-full transition-colors duration-200 ${on ? "bg-verm" : "bg-ink/20"}`}>
      <span className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${on ? "start-[22px]" : "start-[3px]"}`} />
    </button>
  );
}

export function Field({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: string; error?: string }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium mb-1.5">{label}</span>
      {children}
      {hint && !error && <span className="block mt-1 text-[12px] text-ink-soft">{hint}</span>}
      {error && <span className="block mt-1 text-[12px] font-medium text-[#C9372C]" role="alert">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full h-9 px-3 rounded-lg bg-paper text-sm border border-ink/18 outline-none transition-all duration-150 focus:border-verm focus:shadow-[0_0_0_3px_rgba(45,122,255,0.18)] placeholder:text-ink-soft/50";

export function Badge({ children, tone = "neutral", className = "" }: { children: React.ReactNode; tone?: "neutral" | "blue" | "green" | "amber" | "red" | "purple"; className?: string }) {
  const t = {
    neutral: "bg-ink/8 text-ink-soft", blue: "bg-[#2D7AFF]/12 text-[#2D7AFF]", green: "bg-[#1F845A]/12 text-[#1F845A]",
    amber: "bg-[#E2811A]/14 text-[#974F0C]", red: "bg-[#C9372C]/12 text-[#C9372C]", purple: "bg-[#8270DB]/14 text-[#6554C0]",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${t} ${className}`}>{children}</span>;
}

export function StatusPill({ s }: { s: StatusId }) {
  const m = STATUS_META[s];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${m.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
      {trFn(m.label)}
    </span>
  );
}

export function PriorityDot({ p, withLabel = true }: { p: PriorityId; withLabel?: boolean }) {
  const m = PRIORITY_META[p];
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-soft">
      <Ic n="flag" className="w-3.5 h-3.5" sw={2.2} />
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
      {withLabel && trFn(m.label)}
    </span>
  );
}

export function Avatar({ u, size = "md", ring = false }: { u: (typeof USERS)[number]; size?: "xs" | "sm" | "md" | "lg"; ring?: boolean }) {
  const s = { xs: "w-5 h-5 text-[9px]", sm: "w-7 h-7 text-[11px]", md: "w-9 h-9 text-[13px]", lg: "w-14 h-14 text-xl" }[size];
  return (
    <span className={`relative shrink-0 grid place-items-center rounded-full text-white font-semibold ${s} ${ring ? "ring-2 ring-paper" : ""}`} style={{ background: u.color }} title={trFn(u.name)}>
      {u.init}
      {u.online && size !== "xs" && <span className="absolute -bottom-px -end-px w-2.5 h-2.5 rounded-full bg-[#1F845A] border-2 border-paper" />}
    </span>
  );
}

export function Bar({ pct, color = "var(--color-verm)", h = 6 }: { pct: number; color?: string; h?: number }) {
  return (
    <div className="w-full rounded-full bg-ink/10 overflow-hidden" style={{ height: h }}>
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
    </div>
  );
}

export function KPI({ label, value, sub, onClick, tone }: { label: string; value: React.ReactNode; sub?: string; onClick?: () => void; tone?: string }) {
  return (
    <button onClick={onClick} disabled={!onClick}
      className={`app-card text-start p-4 transition-all duration-200 ${onClick ? "hover:app-shadow-med hover:-translate-y-0.5 cursor-pointer" : "cursor-default"}`}>
      <div className="text-[12px] font-medium text-ink-soft">{label}</div>
      <div className={`mt-1.5 text-[26px] leading-none font-semibold tabular-nums ${tone ?? ""}`}>{value}</div>
      {sub && <div className="mt-1.5 text-[11.5px] text-ink-soft">{sub}</div>}
    </button>
  );
}

/* H-states */
export function Empty({ icon = "doc", title, sub, action }: { icon?: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="app-card border-dashed! grid place-items-center text-center py-14 px-6">
      <span className="w-14 h-14 grid place-items-center rounded-2xl bg-ink/5 text-ink-soft">
        <Ic n={icon} className="w-7 h-7" sw={1.5} />
      </span>
      <h4 className="mt-4 font-semibold text-[15px]">{title}</h4>
      {sub && <p className="mt-1.5 text-[13px] text-ink-soft max-w-xs leading-6">{sub}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <div className="space-y-3" role="status" aria-label={label}>
      {[80, 100, 65, 90].map((w, i) => (
        <div key={i} className="skel h-12 rounded-xl" style={{ width: `${w}%` }} />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ErrorBox({ label, onRetry }: { label: string; onRetry?: () => void }) {
  return (
    <div className="app-card border-[#C9372C]/30! bg-[#C9372C]/[0.05] p-6 text-center" role="alert">
      <span className="inline-grid place-items-center w-11 h-11 rounded-full bg-[#C9372C]/12 text-[#C9372C]">
        <Ic n="warn" className="w-5 h-5" />
      </span>
      <p className="mt-3 text-sm font-medium">{label}</p>
      {onRetry && <Btn variant="danger" size="sm" className="mt-4" onClick={onRetry}><Ic n="refresh" className="w-3.5 h-3.5" /> {trFn(L("تلاش دوباره", "Retry"))}</Btn>}
    </div>
  );
}

export function Denied403() {
  return (
    <div className="app-card p-8 text-center max-w-md mx-auto" role="alert">
      <div className="font-mono text-[42px] leading-none font-bold text-[#C9372C]">403</div>
      <p className="mt-3 text-sm text-ink-soft leading-6">{trFn(L("دسترسی ندارید — این عمل برای نقش شما مجاز نیست.", "You don't have permission to perform this action."))}</p>
    </div>
  );
}

export function UpgradeModal({ feature, onClose }: { feature: Pair; onClose: () => void }) {
  const { t, go } = useApp();
  return (
    <Modal title={
      <span className="inline-flex items-center gap-2">
        <Ic n="crown" className="w-5 h-5 text-[#E2811A]" />
        {t("upgradeTitle")}
      </span>
    } onClose={onClose}
      footer={
        <>
          <Btn variant="subtle" onClick={onClose}>{t("notNow")}</Btn>
          <Btn variant="primary" onClick={() => { onClose(); go("settings", { tab: "billing" }); }}>
            {t("viewPlans")}
            <Ic n="chevD" className="w-4 h-4 -rotate-90 rtl:rotate-90" />
          </Btn>
        </>
      }>
      <p className="text-sm text-ink-soft leading-7">
        {trFn(L("«", "“"))}<strong className="text-ink">{trFn(feature)}</strong>{trFn(L("» روی پلن رایگان در دسترس نیست. برای باز شدن این قابلیت، پلن حرفه‌ای را فعال کنید.", "” isn't available on the Free plan. Upgrade to Pro to unlock it."))}
      </p>
      <div className="mt-4 rounded-xl bg-[#2D7AFF]/8 border border-[#2D7AFF]/20 p-3.5 flex items-start gap-2.5 text-[13px] text-[#2D7AFF] font-medium">
        <Ic n="bolt" className="w-4 h-4 mt-0.5 shrink-0" />
        {trFn(L("دکمهٔ «مشاهدهٔ پلن‌ها» شما را به تنظیمات صورتحساب می‌برد.", "“View plans” takes you to Billing in Settings."))}
      </div>
    </Modal>
  );
}

export function Skel({ className = "" }: { className?: string }) {
  return <div className={`skel rounded-lg ${className}`} />;
}

export function useLocalState<T>(key: string, init: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [v, setV] = useState<T>(() => {
    try { return (localStorage.getItem(key) as T) ?? init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, String(v)); } catch { /* noop */ } }, [key, v]);
  return [v, setV];
}
