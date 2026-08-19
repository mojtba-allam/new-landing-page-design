/* ================= Nav ================= */
export const NAV_LINKS = [
  { label: "ویژگی‌ها", href: "#/features" },
  { label: "پنل محصول", href: "#timeline" },
  { label: "قیمت‌گذاری", href: "#pricing" },
  { label: "نظرات", href: "#testimonials" },
  { label: "سوالات", href: "#faq" },
];

/* ================= Hero kanban ================= */
export type KanbanCol = "todo" | "doing" | "done";

export interface KanbanTask {
  id: number;
  title: string;
  col: KanbanCol;
  tag: string;
  tagCls: string;
  who: string;
}

export const KANBAN_COLS: { id: KanbanCol; title: string; dot: string }[] = [
  { id: "todo", title: "برای انجام", dot: "bg-ink/30" },
  { id: "doing", title: "در حال انجام", dot: "bg-amber" },
  { id: "done", title: "انجام شد", dot: "bg-verm" },
];

export const KANBAN_TASKS: KanbanTask[] = [
  { id: 1, title: "طراحی صفحهٔ ورود", col: "todo", tag: "طراحی", tagCls: "bg-sage text-ink", who: "سارا" },
  { id: 2, title: "تست پرداخت ریالی", col: "todo", tag: "تست", tagCls: "bg-sky-soft text-ink", who: "امیر" },
  { id: 3, title: "اتصال تقویم شمسی", col: "doing", tag: "توسعه", tagCls: "bg-amber/70 text-ink", who: "نیما" },
  { id: 4, title: "بهینه‌سازی سرعت بورد", col: "doing", tag: "عملکرد", tagCls: "bg-amber/70 text-ink", who: "لیلا" },
  { id: 5, title: "مستندات API نسخهٔ ۲", col: "done", tag: "مستندات", tagCls: "bg-paper-deep text-ink-soft", who: "کاوه" },
  { id: 6, title: "ریلیز نسخهٔ ۲٫۴", col: "done", tag: "رلیز", tagCls: "bg-paper-deep text-ink-soft", who: "سارا" },
];

/* ================= Trusted-by ================= */
export const TRUSTED = ["آبان‌تک", "رایان‌گستر", "پارس‌دیتا", "آفتاب‌سافت", "نوآوران", "چکاد", "سیمرغ‌لب"];

/* ================= Stats ================= */
export const STATS = [
  { end: 2400, suffix: "+", decimals: 0, label: "تیم فعال روی فینولو" },
  { end: 186000, suffix: "+", decimals: 0, label: "تسک تکمیل‌شده" },
  { end: 99.9, suffix: "٪", decimals: 1, label: "آپ‌تایم سرورهای ایران" },
  { end: 35, suffix: "٪", decimals: 0, label: "تحویل سریع‌ترِ اسپرینت" },
];

/* ================= Testimonials ================= */
export const TESTIMONIALS = [
  {
    name: "سارا محمدی",
    role: "مدیر محصول، آبان‌تک",
    quote: "از وقتی فینولو آوردیم، جلسهٔ «وضعیت پروژه» حذف شد. همه‌چیز روی بورد است و هر کس خودش می‌بیند.",
    tone: "bg-paper",
    rotate: "-rotate-1",
  },
  {
    name: "امیر کریمی",
    role: "بنیان‌گذار استارتاپ چکاد",
    quote: "تقویم شمسی و پرداخت ریالی برای ما حیاتی بود. ابزارهای خارجی هیچ‌وقت این‌ها را درست نداشتند.",
    tone: "bg-verm text-paper",
    rotate: "rotate-2",
  },
  {
    name: "نگار رستگار",
    role: "اسکرام‌مستر، رایان‌گستر",
    quote: "گانت فینولو را به مدیرعامل نشان دادم و همان جلسه بودجه گرفتیم. گزارش‌ها آن‌قدر شفاف‌اند که حرف اضافه نمی‌ماند.",
    tone: "bg-amber",
    rotate: "-rotate-2",
  },
  {
    name: "غزل حسینی",
    role: "سرپرست تیم طراحی، پارس‌دیتا",
    quote: "سرعتش باورنکردنی است؛ درگ‌ودراپ بدون کوچک‌ترین لگ، حتی روی اینترنت اداره. حس یک اپ دسکتاپ را دارد.",
    tone: "bg-sage",
    rotate: "rotate-1",
  },
];

/* ================= Plans ================= */
export const PLANS = [
  {
    name: "رایگان",
    monthly: 0,
    yearly: 0,
    unit: "برای همیشه رایگان",
    cta: "همین حالا شروع کن",
    featured: false,
    features: ["۳ پروژه و ۵ عضو", "تختهٔ کانبان و لیستی", "تقویم شمسی", "اپلیکیشن موبایل"],
  },
  {
    name: "حرفه‌ای",
    monthly: 890000,
    yearly: 712000,
    unit: "به‌ازای هر عضو / ماهانه",
    cta: "۱۴ روز رایگان امتحان کن",
    featured: true,
    features: ["پروژه و عضو نامحدود", "گانت، گراف و تایم‌لاین", "اتوماسیون‌ها", "گزارش‌های زنده", "نقش‌ها و دسترسی دقیق"],
  },
  {
    name: "سازمانی",
    monthly: 1890000,
    yearly: 1512000,
    unit: "به‌ازای هر عضو / ماهانه",
    cta: "با فروش صحبت کن",
    featured: false,
    features: ["همهٔ امکانات حرفه‌ای", "SSO و حسابرسی", "API و وب‌هوک", "سرور اختصاصی", "پشتیبانی ویژه"],
  },
];

/* ================= FAQ ================= */
export const FAQS = [
  {
    q: "فینولو چه فرقی با ابزارهای خارجی مثل ترلو دارد؟",
    a: "تقویم کاملاً شمسی، سرورهای داخل ایران برای سرعت و پایداری، پرداخت ریالی بدون کارت خارجی، راست‌چینِ بومی و پشتیبانی فارسی‌زبان — همان قدرت، اما برای تیم ایرانی طراحی شده.",
  },
  {
    q: "آیا نسخهٔ رایگان محدودیت زمانی دارد؟",
    a: "نه. پلن رایگان برای همیشه رایگان است و فقط روی تعداد پروژه و عضو محدودیت دارد. هیچ دورهٔ آزمایشیِ پنهانی در کار نیست.",
  },
  {
    q: "می‌توانم از ترلو، جیرا یا اسانا مهاجرت کنم؟",
    a: "بله؛ با یک کلیک تمام تخته‌ها، کارت‌ها، اعضا و ددلاین‌ها وارد می‌شوند و تاریخ‌ها به‌صورت خودکار شمسی می‌شوند. میانگین مهاجرت کامل زیر ۱۰ دقیقه است.",
  },
  {
    q: "امنیت داده‌های تیم ما چطور تضمین می‌شود؟",
    a: "ارتباط رمزنگاری‌شده TLS، بکاپ روزانه در دو دیتاسنتر، دسترسی سطح‌بندی‌شده و لاگ کامل فعالیت‌ها. داده‌ها هرگز برای تبلیغات استفاده نمی‌شوند.",
  },
  {
    q: "آیا فینولو اپلیکیشن موبایل دارد؟",
    a: "بله؛ نسخه‌های iOS و اندروید با همگام‌سازی لحظه‌ای و حالت آفلاین — تسک‌هایتان در مترو و سفر هم همراهتان هستند.",
  },
];

/* ================= Footer ================= */
export const FOOTER_COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "محصول",
    links: [
      { label: "ویژگی‌های فینولو", href: "#/features" },
      { label: "پنل زنده (دمو)", href: "#/timeline" },
      { label: "گانت و تایم‌لاین", href: "#/timeline" },
      { label: "قیمت‌گذاری", href: "#/pricing" },
      { label: "تغییرات نسخه‌ها", href: "#/changelog" },
      { label: "اپلیکیشن موبایل", href: "#/changelog" },
    ],
  },
  {
    title: "منابع",
    links: [
      { label: "مرکز راهنما", href: "#/help" },
      { label: "سوالات متداول", href: "#/faq" },
      { label: "وضعیت سرورها", href: "#/status" },
      { label: "مستندات و API", href: "#/help" },
      { label: "امنیت و آپ‌تایم", href: "#/status" },
    ],
  },
  {
    title: "شرکت",
    links: [
      { label: "دربارهٔ ما", href: "#/about" },
      { label: "تماس با ما", href: "#/contact" },
      { label: "فرصت‌های شغلی", href: "#/contact" },
      { label: "قوانین استفاده", href: "#/terms" },
      { label: "حریم خصوصی", href: "#/privacy" },
    ],
  },
  {
    title: "حساب",
    links: [
      { label: "ورود", href: "#/login" },
      { label: "ثبت‌نام رایگان", href: "#/login" },
      { label: "مقایسهٔ پلن‌ها", href: "#/pricing" },
    ],
  },
];

/* ================= Sim-panel data ================= */
export const PANEL_TASKS = [
  { id: 1, title: "طراحی صفحهٔ ورود", status: "todo", tag: "طراحی", tagCls: "bg-sage text-ink", who: "سارا", init: "س‌م", due: "۱۸ مهر", start: 1, len: 2, load: 60 },
  { id: 2, title: "تست پرداخت ریالی", status: "todo", tag: "تست", tagCls: "bg-sky-soft text-ink", who: "امیر", init: "ا‌ک", due: "۲۱ مهر", start: 4, len: 2, load: 45 },
  { id: 3, title: "اتصال تقویم شمسی", status: "doing", tag: "توسعه", tagCls: "bg-amber/70 text-ink", who: "نیما", init: "ن‌ر", due: "۱۶ مهر", start: 2, len: 3, load: 85 },
  { id: 4, title: "بهینه‌سازی سرعت بورد", status: "doing", tag: "عملکرد", tagCls: "bg-amber/70 text-ink", who: "لیلا", init: "ل‌ح", due: "۱۹ مهر", start: 3, len: 2, load: 70 },
  { id: 5, title: "مستندات API نسخهٔ ۲", status: "done", tag: "مستندات", tagCls: "bg-paper-deep text-ink-soft", who: "کاوه", init: "ک‌ت", due: "۱۲ مهر", start: 0, len: 2, load: 40 },
  { id: 6, title: "ریلیز نسخهٔ ۲٫۴", status: "done", tag: "رلیز", tagCls: "bg-paper-deep text-ink-soft", who: "سارا", init: "س‌م", due: "۱۴ مهر", start: 1, len: 1, load: 30 },
];

export const PANEL_MENU = [
  { id: "dashboard", label: "داشبورد", count: 6 },
  { id: "board", label: "بورد", count: 6 },
  { id: "analytics", label: "تحلیل‌ها", count: null },
  { id: "team", label: "تیم‌ها", count: 5 },
  { id: "time", label: "زمان", count: null },
] as const;

export const TEAM_MEMBERS = [
  { name: "سارا محمدی", role: "مدیر محصول", init: "س‌م", cls: "bg-verm", load: 72, online: true },
  { name: "امیر کریمی", role: "توسعه‌دهنده بک‌اند", init: "ا‌ک", cls: "bg-pine", load: 58, online: true },
  { name: "نگار رستگار", role: "اسکرام‌مستر", init: "ن‌ر", cls: "bg-ink", load: 44, online: false },
  { name: "غزل حسینی", role: "طراح محصول", init: "غ‌ح", cls: "bg-pine-soft", load: 81, online: true },
  { name: "کاوه تهرانی", role: "QA و تست", init: "ک‌ت", cls: "bg-verm-deep", load: 36, online: false },
];

export const TIME_ROWS = [
  { day: "شنبه", person: "سارا محمدی", task: "اتصال تقویم شمسی", hours: 6.5, billable: true },
  { day: "یکشنبه", person: "امیر کریمی", task: "تست پرداخت ریالی", hours: 7, billable: true },
  { day: "دوشنبه", person: "غزل حسینی", task: "طراحی صفحهٔ ورود", hours: 5.5, billable: false },
  { day: "سه‌شنبه", person: "نیما رهاورد", task: "بهینه‌سازی سرعت بورد", hours: 8, billable: true },
  { day: "چهارشنبه", person: "کاوه تهرانی", task: "مستندات API نسخهٔ ۲", hours: 4, billable: true },
  { day: "پنجشنبه", person: "لیلا حیدری", task: "ریلیز نسخهٔ ۲٫۴", hours: 8, billable: false },
];
