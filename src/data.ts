import { getLang, type Pair } from "./lib/i18n";

/** pick the active-language value during render (components re-render on lang change) */
export const L = <T,>(p: { fa: T; en: T }): T => p[getLang()];

/* ================= Nav ================= */
export const NAV_LINKS: { label: Pair; href: string }[] = [
  { label: { fa: "ویژگی‌ها", en: "Features" }, href: "#/features" },
  { label: { fa: "پنل محصول", en: "Live demo" }, href: "#timeline" },
  { label: { fa: "قیمت‌گذاری", en: "Pricing" }, href: "#pricing" },
];

/* ================= Hero kanban ================= */
export type KanbanCol = "todo" | "doing" | "done";

export interface KanbanTask {
  id: number;
  title: Pair;
  col: KanbanCol;
  tag: Pair;
  tagCls: string;
  who: Pair;
}

export const KANBAN_COLS: { id: KanbanCol; title: Pair; dot: string }[] = [
  { id: "todo", title: { fa: "برای انجام", en: "To do" }, dot: "bg-ink/30" },
  { id: "doing", title: { fa: "در حال انجام", en: "In progress" }, dot: "bg-amber" },
  { id: "done", title: { fa: "انجام شد", en: "Done" }, dot: "bg-verm" },
];

export const KANBAN_TASKS: KanbanTask[] = [
  { id: 1, title: { fa: "طراحی صفحهٔ ورود", en: "Design the login page" }, col: "todo", tag: { fa: "طراحی", en: "Design" }, tagCls: "bg-sage text-ink", who: { fa: "سارا", en: "Sara" } },
  { id: 2, title: { fa: "تست پرداخت ریالی", en: "Test payment flow" }, col: "todo", tag: { fa: "تست", en: "QA" }, tagCls: "bg-sky-soft text-ink", who: { fa: "امیر", en: "Amir" } },
  { id: 3, title: { fa: "اتصال تقویم شمسی", en: "Wire up the calendar" }, col: "doing", tag: { fa: "توسعه", en: "Dev" }, tagCls: "bg-amber/70 text-ink", who: { fa: "نیما", en: "Nima" } },
  { id: 4, title: { fa: "بهینه‌سازی سرعت بورد", en: "Speed up board rendering" }, col: "doing", tag: { fa: "عملکرد", en: "Perf" }, tagCls: "bg-amber/70 text-ink", who: { fa: "لیلا", en: "Leila" } },
  { id: 5, title: { fa: "مستندات API نسخهٔ ۲", en: "API v2 documentation" }, col: "done", tag: { fa: "مستندات", en: "Docs" }, tagCls: "bg-paper-deep text-ink-soft", who: { fa: "کاوه", en: "Kaveh" } },
  { id: 6, title: { fa: "ریلیز نسخهٔ ۲٫۴", en: "Ship release 2.4" }, col: "done", tag: { fa: "رلیز", en: "Release" }, tagCls: "bg-paper-deep text-ink-soft", who: { fa: "سارا", en: "Sara" } },
];

/* ================= Trusted-by ================= */
export const TRUSTED: Pair[] = [
  { fa: "آبان‌تک", en: "Abantech" },
  { fa: "رایان‌گستر", en: "Rayan Gostar" },
  { fa: "پارس‌دیتا", en: "ParsData" },
  { fa: "آفتاب‌سافت", en: "AftabSoft" },
  { fa: "نوآوران", en: "Noavaran" },
  { fa: "چکاد", en: "Chakad" },
  { fa: "سیمرغ‌لب", en: "SimorghLab" },
];

/* ================= Stats ================= */
export const STATS = [
  { end: 2400, suffix: { fa: "+", en: "+" }, decimals: 0, label: { fa: "تیم فعال روی فینولو", en: "teams running on Finolo" } },
  { end: 186000, suffix: { fa: "+", en: "+" }, decimals: 0, label: { fa: "تسک تکمیل‌شده", en: "tasks completed" } },
  { end: 99.9, suffix: { fa: "٪", en: "%" }, decimals: 1, label: { fa: "آپ‌تایم سرورهای ایران", en: "uptime, local servers" } },
  { end: 35, suffix: { fa: "٪", en: "%" }, decimals: 0, label: { fa: "تحویل سریع‌ترِ اسپرینت", en: "faster sprint delivery" } },
];

/* ================= Testimonials ================= */
export const TESTIMONIALS = [
  {
    name: { fa: "سارا محمدی", en: "Sara Mohammadi" },
    role: { fa: "مدیر محصول، آبان‌تک", en: "Product Manager, Abantech" },
    quote: {
      fa: "از وقتی فینولو آوردیم، جلسهٔ «وضعیت پروژه» حذف شد. همه‌چیز روی بورد است و هر کس خودش می‌بیند.",
      en: "Since we moved to Finolo, the “status meeting” went extinct. Everything lives on the board — everyone just looks.",
    },
    tone: "bg-paper",
    rotate: "-rotate-1",
  },
  {
    name: { fa: "امیر کریمی", en: "Amir Karimi" },
    role: { fa: "بنیان‌گذار استارتاپ چکاد", en: "Founder, Chakad" },
    quote: {
      fa: "تقویم شمسی و پرداخت ریالی برای ما حیاتی بود. ابزارهای خارجی هیچ‌وقت این‌ها را درست نداشتند.",
      en: "A native calendar and local payments were deal-breakers for us. Foreign tools never got them right.",
    },
    tone: "bg-verm text-paper",
    rotate: "rotate-2",
  },
  {
    name: { fa: "نگار رستگار", en: "Negar Rastegar" },
    role: { fa: "اسکرام‌مستر، رایان‌گستر", en: "Scrum Master, Rayan Gostar" },
    quote: {
      fa: "گانت فینولو را به مدیرعامل نشان دادم و همان جلسه بودجه گرفتیم. گزارش‌ها آن‌قدر شفاف‌اند که حرف اضافه نمی‌ماند.",
      en: "I showed Finolo's gantt to our CEO and got the budget in the same meeting. The reports leave nothing to argue about.",
    },
    tone: "bg-amber",
    rotate: "-rotate-2",
  },
  {
    name: { fa: "غزل حسینی", en: "Ghazal Hosseini" },
    role: { fa: "سرپرست تیم طراحی، پارس‌دیتا", en: "Design Lead, ParsData" },
    quote: {
      fa: "سرعتش باورنکردنی است؛ درگ‌ودراپ بدون کوچک‌ترین لگ، حتی روی اینترنت اداره. حس یک اپ دسکتاپ را دارد.",
      en: "The speed is unreal — drag & drop with zero lag, even on office Wi-Fi. It feels like a desktop app.",
    },
    tone: "bg-sage",
    rotate: "rotate-1",
  },
];

/* ================= Plans ================= */
export const PLANS = [
  {
    name: { fa: "رایگان", en: "Free" },
    monthly: 0,
    yearly: 0,
    unit: { fa: "برای همیشه رایگان", en: "free forever" },
    cta: { fa: "همین حالا شروع کن", en: "Start now" },
    featured: false,
    features: [
      { fa: "۳ پروژه و ۵ عضو", en: "3 projects & 5 members" },
      { fa: "تختهٔ کانبان و لیستی", en: "Kanban & list boards" },
      { fa: "تقویم شمسی", en: "Native calendar" },
      { fa: "اپلیکیشن موبایل", en: "Mobile apps" },
    ],
  },
  {
    name: { fa: "حرفه‌ای", en: "Pro" },
    monthly: 890000,
    yearly: 712000,
    unit: { fa: "به‌ازای هر عضو / ماهانه", en: "per member / month" },
    cta: { fa: "۱۴ روز رایگان امتحان کن", en: "Try 14 days free" },
    featured: true,
    features: [
      { fa: "پروژه و عضو نامحدود", en: "Unlimited projects & members" },
      { fa: "گانت، گراف و تایم‌لاین", en: "Gantt, graph & timeline" },
      { fa: "اتوماسیون‌ها", en: "Automations" },
      { fa: "گزارش‌های زنده", en: "Live reports" },
      { fa: "نقش‌ها و دسترسی دقیق", en: "Roles & fine-grained access" },
    ],
  },
  {
    name: { fa: "سازمانی", en: "Enterprise" },
    monthly: 1890000,
    yearly: 1512000,
    unit: { fa: "به‌ازای هر عضو / ماهانه", en: "per member / month" },
    cta: { fa: "با فروش صحبت کن", en: "Talk to sales" },
    featured: false,
    features: [
      { fa: "همهٔ امکانات حرفه‌ای", en: "Everything in Pro" },
      { fa: "SSO و حسابرسی", en: "SSO & audit logs" },
      { fa: "API و وب‌هوک", en: "API & webhooks" },
      { fa: "سرور اختصاصی", en: "Dedicated server" },
      { fa: "پشتیبانی ویژه", en: "Priority support" },
    ],
  },
];

/* ================= FAQ ================= */
export const FAQS: { q: Pair; a: Pair }[] = [
  {
    q: { fa: "فینولو چه فرقی با ابزارهای خارجی مثل ترلو دارد؟", en: "How is Finolo different from tools like Trello?" },
    a: {
      fa: "تقویم کاملاً شمسی، سرورهای داخل ایران برای سرعت و پایداری، پرداخت ریالی بدون کارت خارجی، راست‌چینِ بومی و پشتیبانی فارسی‌زبان — همان قدرت، اما برای تیم ایرانی طراحی شده.",
      en: "A fully native calendar, servers inside Iran for speed and stability, local payments with no foreign card, and support that actually speaks your language. Same power — built around your team.",
    },
  },
  {
    q: { fa: "آیا نسخهٔ رایگان محدودیت زمانی دارد؟", en: "Does the free plan expire?" },
    a: {
      fa: "نه. پلن رایگان برای همیشه رایگان است و فقط روی تعداد پروژه و عضو محدودیت دارد. هیچ دورهٔ آزمایشیِ پنهانی در کار نیست.",
      en: "No. Free means forever — it only caps projects and members. There is no hidden trial clock.",
    },
  },
  {
    q: { fa: "می‌توانم از ترلو، جیرا یا اسانا مهاجرت کنم؟", en: "Can I migrate from Trello, Jira or Asana?" },
    a: {
      fa: "بله؛ با یک کلیک تمام تخته‌ها، کارت‌ها، اعضا و ددلاین‌ها وارد می‌شوند و تاریخ‌ها به‌صورت خودکار شمسی می‌شوند. میانگین مهاجرت کامل زیر ۱۰ دقیقه است.",
      en: "Yes — one click imports every board, card, member and deadline, and dates convert automatically. A full migration averages under 10 minutes.",
    },
  },
  {
    q: { fa: "امنیت داده‌های تیم ما چطور تضمین می‌شود؟", en: "How is our data secured?" },
    a: {
      fa: "ارتباط رمزنگاری‌شده TLS، بکاپ روزانه در دو دیتاسنتر، دسترسی سطح‌بندی‌شده و لاگ کامل فعالیت‌ها. داده‌ها هرگز برای تبلیغات استفاده نمی‌شوند.",
      en: "TLS in transit, encrypted daily backups across two data centers, role-based access and a full activity log. Your data is never used for advertising.",
    },
  },
  {
    q: { fa: "آیا فینولو اپلیکیشن موبایل دارد؟", en: "Does Finolo have mobile apps?" },
    a: {
      fa: "بله؛ نسخه‌های iOS و اندروید با همگام‌سازی لحظه‌ای و حالت آفلاین — تسک‌هایتان در مترو و سفر هم همراهتان هستند.",
      en: "Yes — iOS and Android with real-time sync and an offline mode, so your tasks follow you onto the subway.",
    },
  },
];

/* ================= Footer ================= */
export const FOOTER_COLS: { title: Pair; links: { label: Pair; href: string }[] }[] = [
  {
    title: { fa: "محصول", en: "Product" },
    links: [
      { label: { fa: "ویژگی‌های فینولو", en: "Features" }, href: "#/features" },
      { label: { fa: "پنل زنده (دمو)", en: "Live demo" }, href: "#timeline" },
      { label: { fa: "گانت و تایم‌لاین", en: "Gantt & timeline" }, href: "#timeline" },
      { label: { fa: "قیمت‌گذاری", en: "Pricing" }, href: "#pricing" },
      { label: { fa: "تغییرات نسخه‌ها", en: "Changelog" }, href: "#changelog" },
    ],
  },
  {
    title: { fa: "منابع", en: "Resources" },
    links: [
      { label: { fa: "مرکز راهنما", en: "Help center" }, href: "#/help" },
      { label: { fa: "مستندات API", en: "API docs" }, href: "#/features" },
      { label: { fa: "وضعیت سرورها", en: "Server status" }, href: "#/status" },
      { label: { fa: "تغییرات نسخه‌ها", en: "Release notes" }, href: "#/changelog" },
    ],
  },
  {
    title: { fa: "شرکت", en: "Company" },
    links: [
      { label: { fa: "دربارهٔ ما", en: "About us" }, href: "#/about" },
      { label: { fa: "تماس با فروش", en: "Contact sales" }, href: "#/contact" },
      { label: { fa: "قوانین استفاده", en: "Terms of use" }, href: "#/terms" },
      { label: { fa: "حریم خصوصی", en: "Privacy" }, href: "#/privacy" },
    ],
  },
];

/* ================= Sim-panel data ================= */
export const PANEL_TASKS = [
  { id: 1, title: { fa: "طراحی صفحهٔ ورود", en: "Design the login page" }, status: "todo", tag: { fa: "طراحی", en: "Design" }, tagCls: "bg-sage text-ink", who: { fa: "سارا", en: "Sara" }, init: { fa: "س‌م", en: "SM" }, due: { fa: "۱۸ مهر", en: "Oct 10" }, start: 1, len: 2, load: 60 },
  { id: 2, title: { fa: "تست پرداخت ریالی", en: "Test payment flow" }, status: "todo", tag: { fa: "تست", en: "QA" }, tagCls: "bg-sky-soft text-ink", who: { fa: "امیر", en: "Amir" }, init: { fa: "ا‌ک", en: "AK" }, due: { fa: "۲۱ مهر", en: "Oct 13" }, start: 4, len: 2, load: 45 },
  { id: 3, title: { fa: "اتصال تقویم شمسی", en: "Wire up the calendar" }, status: "doing", tag: { fa: "توسعه", en: "Dev" }, tagCls: "bg-amber/70 text-ink", who: { fa: "نیما", en: "Nima" }, init: { fa: "ن‌ر", en: "NR" }, due: { fa: "۱۶ مهر", en: "Oct 8" }, start: 2, len: 3, load: 85 },
  { id: 4, title: { fa: "بهینه‌سازی سرعت بورد", en: "Speed up board rendering" }, status: "doing", tag: { fa: "عملکرد", en: "Perf" }, tagCls: "bg-amber/70 text-ink", who: { fa: "لیلا", en: "Leila" }, init: { fa: "ل‌ح", en: "LH" }, due: { fa: "۱۹ مهر", en: "Oct 11" }, start: 3, len: 2, load: 70 },
  { id: 5, title: { fa: "مستندات API نسخهٔ ۲", en: "API v2 documentation" }, status: "done", tag: { fa: "مستندات", en: "Docs" }, tagCls: "bg-paper-deep text-ink-soft", who: { fa: "کاوه", en: "Kaveh" }, init: { fa: "ک‌ت", en: "KT" }, due: { fa: "۱۲ مهر", en: "Oct 4" }, start: 0, len: 2, load: 40 },
  { id: 6, title: { fa: "ریلیز نسخهٔ ۲٫۴", en: "Ship release 2.4" }, status: "done", tag: { fa: "رلیز", en: "Release" }, tagCls: "bg-paper-deep text-ink-soft", who: { fa: "سارا", en: "Sara" }, init: { fa: "س‌م", en: "SM" }, due: { fa: "۱۴ مهر", en: "Oct 6" }, start: 1, len: 1, load: 30 },
];

export const PANEL_MENU = [
  { id: "dashboard", label: { fa: "داشبورد", en: "Dashboard" }, count: 6 },
  { id: "board", label: { fa: "بورد", en: "Board" }, count: 6 },
  { id: "analytics", label: { fa: "تحلیل‌ها", en: "Analytics" }, count: null },
  { id: "team", label: { fa: "تیم‌ها", en: "Teams" }, count: 5 },
  { id: "time", label: { fa: "زمان", en: "Time" }, count: null },
] as const;

export const TEAM_MEMBERS = [
  { name: { fa: "سارا محمدی", en: "Sara Mohammadi" }, role: { fa: "مدیر محصول", en: "Product Manager" }, init: { fa: "س‌م", en: "SM" }, cls: "bg-verm", load: 72, online: true },
  { name: { fa: "امیر کریمی", en: "Amir Karimi" }, role: { fa: "توسعه‌دهنده بک‌اند", en: "Backend Engineer" }, init: { fa: "ا‌ک", en: "AK" }, cls: "bg-pine", load: 58, online: true },
  { name: { fa: "نگار رستگار", en: "Negar Rastegar" }, role: { fa: "اسکرام‌مستر", en: "Scrum Master" }, init: { fa: "ن‌ر", en: "NR" }, cls: "bg-ink", load: 44, online: false },
  { name: { fa: "غزل حسینی", en: "Ghazal Hosseini" }, role: { fa: "طراح محصول", en: "Product Designer" }, init: { fa: "غ‌ح", en: "GH" }, cls: "bg-pine-soft", load: 81, online: true },
  { name: { fa: "کاوه تهرانی", en: "Kaveh Tehrani" }, role: { fa: "QA و تست", en: "QA Engineer" }, init: { fa: "ک‌ت", en: "KT" }, cls: "bg-verm-deep", load: 36, online: false },
];

export const TIME_ROWS = [
  { day: { fa: "شنبه", en: "Sat" }, person: { fa: "سارا محمدی", en: "Sara Mohammadi" }, task: { fa: "اتصال تقویم شمسی", en: "Wire up the calendar" }, hours: 6.5, billable: true },
  { day: { fa: "یکشنبه", en: "Sun" }, person: { fa: "امیر کریمی", en: "Amir Karimi" }, task: { fa: "تست پرداخت ریالی", en: "Test payment flow" }, hours: 7, billable: true },
  { day: { fa: "دوشنبه", en: "Mon" }, person: { fa: "غزل حسینی", en: "Ghazal Hosseini" }, task: { fa: "طراحی صفحهٔ ورود", en: "Design the login page" }, hours: 5.5, billable: false },
  { day: { fa: "سه‌شنبه", en: "Tue" }, person: { fa: "نیما رهاورد", en: "Nima Rahavard" }, task: { fa: "بهینه‌سازی سرعت بورد", en: "Speed up board rendering" }, hours: 8, billable: true },
  { day: { fa: "چهارشنبه", en: "Wed" }, person: { fa: "کاوه تهرانی", en: "Kaveh Tehrani" }, task: { fa: "مستندات API نسخهٔ ۲", en: "API v2 documentation" }, hours: 4, billable: true },
  { day: { fa: "پنجشنبه", en: "Thu" }, person: { fa: "لیلا حیدری", en: "Leila Heidari" }, task: { fa: "ریلیز نسخهٔ ۲٫۴", en: "Ship release 2.4" }, hours: 8, billable: false },
];
