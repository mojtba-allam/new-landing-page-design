import { useState } from "react";
import { Reveal } from "../lib/motion";
import { PageShell, Sheet, Sticker, usePageMeta } from "../components/PageShell";
import { IconCheck, IconPlus } from "../components/Icons";

/* ---------- shared legal layout ---------- */
function LegalLayout({
  sections,
  plainSummary,
  kind,
}: {
  sections: { id: string; title: string; body: string[] }[];
  plainSummary: string[];
  kind: "terms" | "privacy";
}) {
  const [openMobile, setOpenMobile] = useState<string>(sections[0].id);

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="mt-12 grid lg:grid-cols-[280px_1fr] gap-10 items-start">
        {/* sticky TOC */}
        <Reveal className="hidden lg:block sticky top-28">
          <Sheet className="p-5">
            <div className="text-[11px] font-black text-ink-soft mb-3">فهرست</div>
            <nav className="space-y-1">
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#/${kind === "terms" ? "terms" : "privacy"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-ink-soft hover:bg-paper-deep hover:text-ink transition-colors"
                >
                  <span className="font-display text-verm text-xs w-5">{["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸"][i]}</span>
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-dashed border-ink/25 text-[11px] font-bold text-ink-soft leading-5">
              آخرین به‌روزرسانی:
              <br />
              ۱۵ مهر ۱۴۰۴
            </div>
          </Sheet>
        </Reveal>

        <div className="min-w-0">
          {/* plain-language summary */}
          <Reveal>
            <div className="rounded-2xl border-[1.5px] border-ink bg-amber/40 p-6 sm:p-7 shadow-[6px_6px_0_0_rgba(25,23,18,1)]">
              <div className="flex items-center gap-3">
                <Sticker tone="bg-ink text-paper">خلاصهٔ خودمانی</Sticker>
                <span className="text-xs font-bold text-ink-soft">بدون زبان حقوقی</span>
              </div>
              <ul className="mt-5 space-y-3">
                {plainSummary.map((p) => (
                  <li key={p} className="flex items-start gap-3 font-bold text-[15px] leading-7">
                    <span className="mt-1 w-5 h-5 shrink-0 grid place-items-center rounded-full bg-ink text-paper">
                      <IconCheck className="w-3 h-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* sections */}
          <div className="mt-8 space-y-5">
            {sections.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i * 70, 350)}>
                <section
                  id={s.id}
                  className="scroll-mt-28 rounded-2xl border-[1.5px] border-ink bg-paper shadow-[4px_4px_0_0_rgba(25,23,18,1)] overflow-hidden"
                >
                  {/* desktop: always open; mobile: accordion */}
                  <button
                    onClick={() => setOpenMobile(openMobile === s.id ? "" : s.id)}
                    className="w-full lg:pointer-events-none flex items-center gap-4 px-6 sm:px-8 py-5"
                    aria-expanded={openMobile === s.id}
                  >
                    <span className="font-display text-2xl text-verm w-8">{["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸"][i]}</span>
                    <h2 className="flex-1 text-start font-display text-xl sm:text-2xl">{s.title}</h2>
                    <span className={`lg:hidden w-9 h-9 grid place-items-center rounded-full border-[1.5px] border-ink transition-transform duration-300 ${openMobile === s.id ? "bg-verm text-paper rotate-45" : ""}`}>
                      <IconPlus className="w-4 h-4" />
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ${openMobile === s.id ? "grid-rows-[1fr]" : "grid-rows-[0fr] lg:grid-rows-[1fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="px-6 sm:px-8 pb-7 ps-6 sm:ps-[4.5rem] space-y-4">
                        {s.body.map((p) => (
                          <p key={p.slice(0, 24)} className="text-ink-soft leading-8 font-medium text-[15px]">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <p className="text-xs text-ink-soft font-semibold leading-6 border-t border-dashed border-ink/30 pt-5">
              این سند در تاریخ ۱۵ مهر ۱۴۰۴ به‌روزرسانی شده و جایگزین نسخه‌های قبلی است. ادامهٔ استفاده از فینولو به‌معنای پذیرش این سند است.
              اگر با بخشی مخالفی، قبل از تصمیم با ما حرف بزن — <a href="#/contact" className="text-verm font-bold link-underline">صفحهٔ تماس</a>.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ================= Terms ================= */
const TERMS_SECTIONS = [
  { id: "t1", title: "تعریف‌ها", body: ["«فینولو» یعنی سامانهٔ مدیریت پروژهٔ finolo.ir به‌همراه اپلیکیشن‌های وب و موبایل آن. «کاربر» یعنی هر شخص حقیقی یا حقوقی که حساب ساخته باشد. «محتوا» یعنی هر داده، تسک، فایل و متنی که کاربر داخل فینولو وارد می‌کند.", "این تعریف‌ها در کل سند همین معنا را دارند مگر اینکه در جایی صریحاً خلافش گفته شود."] },
  { id: "t2", title: "حساب کاربری", body: ["برای ساخت حساب، اطلاعات درست و به‌روز لازم است. مسئولیت سری نگه‌داشتن رمز عبور با شماست و هر فعالیتی از حساب شما، منتسب به شماست.", "اگر متوجه دسترسی غیرمجاز شدید، فوراً از تنظیمات > امنیت، نشست‌ها را ببندید و به ما خبر دهید."] },
  { id: "t3", title: "مالکیت محتوا", body: ["همهٔ محتوایی که وارد فینولو می‌کنید مال خودتان است — ۱۰۰٪. ما فقط برای ارائهٔ خدمت (نمایش به اعضای تیم، بکاپ، همگام‌سازی) اجازهٔ پردازش محدود می‌گیریم.", "حذف حساب یعنی حذف کامل محتوا از سرورها حداکثر تا ۳۰ روز، مگر نسخه‌های بکاپ که طبق روال، خودشان منقضی می‌شوند."] },
  { id: "t4", title: "رفتار مجاز و ممنوع", body: ["فینولو برای مدیریت کار ساخته شده؛ نه برای ارسال اسپم، بدافزار، محتوای غیرقانونی یا نقض حقوق دیگران. تلاش برای نفوذ، مهندسی معکوس سرویس یا دور زدن محدودیت‌ها ممنوع است.", "در صورت نقض جدی، حساب پس از اخطار معلق می‌شود؛ در موارد قانونی، طبق حکم مقام قضایی عمل می‌کنیم."] },
  { id: "t5", title: "اشتراک و پرداخت", body: ["پلن‌های پولی به‌صورت ماهانه یا سالانه و به ریال شارژ می‌شوند. ارتقای وسط دوره روزشمار محاسبه می‌شود و مبلغ اضافه، به دورهٔ بعد منتقل نمی‌شود مگر به‌صورت اعتبار.", "تا ۷ روز پس از اولین خرید پلن پولی، اگر راضی نبودید، کل مبلغ برمی‌گردد — بدون سوال."] },
  { id: "t6", title: "دسترس‌پذیری سرویس", body: ["هدف ما آپ‌تایم ۹۹٫۹٪ است و در صفحهٔ وضعیت سرورها، لحظه‌ای گزارش می‌دهیم. اما فینولو «همان‌طور که هست» ارائه می‌شود و در برابر قطعی‌های ناشی از فورس‌ماژور مسئولیت مالی مستقیم نداریم.", "تعمیرات برنامه‌ریزی‌شده حداقل ۴۸ ساعت قبل، هم داخل محصول و هم ایمیل اطلاع‌رسانی می‌شود."] },
  { id: "t7", title: "محدودیت مسئولیت", body: ["سقف مسئولیت مالی فینولو در هر ۱۲ ماه، معادل مبلغی است که در همان دوره پرداخت کرده‌اید. خسارت‌های غیرمستقیم (مثل از دست دادن سود) مشمول این سقف نمی‌شوند و کلاً خارج از تعهدند.", "هیچ‌کدام از این موارد، حقوق قانونی مصرف‌کننده را که قابل اسقاط نیستند، محدود نمی‌کند."] },
  { id: "t8", title: "تغییرات و خاتمه", body: ["این قوانین ممکن است با رشد محصول به‌روز شود؛ تغییرات مهم حداقل ۱۴ روز قبل از اجرا، ایمیل و اعلان داخل محصول می‌شود.", "هر زمان بخواهید می‌توانید حساب را ببندید و خروجی کامل داده‌ها (JSON/CSV) بگیرید — داده‌ها گروگان ما نیستند."] },
];

export function Terms() {
  usePageMeta(
    "قوانین استفاده | فینولو",
    "قوانین استفاده از فینولو به زبان ساده — مالکیت محتوا، پرداخت، امنیت و مسئولیت‌ها. با فهرست جانبی و خلاصهٔ خودمانی."
  );
  return (
    <PageShell
      crumb="قوانین استفاده"
      index="۰۴"
      sticker="قانون"
      title={
        <>
          قوانین، <span className="text-verm">به زبان آدمیزاد</span>
        </>
      }
      lead="هر سند حقوقی، اول یک «خلاصهٔ خودمانی» دارد. چون باور داریم قراردادی که نفهمی‌اش، امضایش هم بی‌معنی است."
    >
      <LegalLayout
        kind="terms"
        plainSummary={[
          "محتوای تو مال خودت است؛ ما فقط نگه‌داری و نمایش به تیمت را انجام می‌دهیم.",
          "۷ روز ضمانت بازگشت وجه برای اولین خرید — بدون سوال.",
          "هر وقت بخواهی می‌توانی خروجی کامل بگیری و بروی.",
        ]}
        sections={TERMS_SECTIONS}
      />
    </PageShell>
  );
}

/* ================= Privacy ================= */
const PRIVACY_SECTIONS = [
  { id: "p1", title: "چه داده‌هایی جمع می‌کنیم؟", body: ["دادهٔ حساب: نام، ایمیل و نام تیم — همین. دادهٔ کاری: تسک‌ها، فایل‌ها و زمان‌های ثبت‌شده که خودت وارد می‌کنی. دادهٔ فنی: آدرس IP و نوع مرورگر فقط برای امنیت و جلوگیری از سوءاستفاده.", "چیزهایی که جمع نمی‌کنیم: موقعیت مکانی دقیق، مخاطبین گوشی، و هیچ داده‌ای برای تبلیغات شخص ثالث."] },
  { id: "p2", title: "چطور استفاده می‌کنیم؟", body: ["برای اجرای سرویس (نمایش بورد به هم‌تیمی‌ها، اعلان‌ها، بکاپ)، برای امنیت (تشخیص ورود مشکوک)، و برای بهتر کردن محصول — فقط به‌صورت تجمیعی و ناشناس.", "هرگز محتوای تسک‌هایت را نمی‌خوانیم؛ نه ما، نه هیچ ابزاری. تحلیل‌های محصولی روی دادهٔ ناشناس و تجمیعی است."] },
  { id: "p3", title: "کوکی‌ها", body: ["فقط کوکی نشست (برای لاگین ماندن) و یک کوکی تنظیمات (مثل تم انتخابی). کوکی تبلیغاتی و ردیاب شخص ثالث نداریم — هیچ‌وقت.", "مرورگرها را می‌توانی طوری تنظیم کنی که کوکی‌ها را ببندند؛ در آن صورت فقط لاگین ماندن از کار می‌افتد."] },
  { id: "p4", title: "نگهداری و امنیت", body: ["رمزنگاری در انتقال (TLS 1.3) و در ذخیره‌سازی (AES-256). بکاپ روزانهٔ رمزنگاری‌شده در دو دیتاسنتر مجزا داخل ایران. دسترسی کارکنان به داده‌ها، سطح‌بندی‌شده و لاگ‌شده است.", "تست نفوذ سالانه توسط تیم مستقل؛ گزارش‌های آسیب‌پذیری از طریق security@finolo.ir طی ۲۴ ساعت بررسی می‌شود."] },
  { id: "p5", title: "اشتراک با دیگران", body: ["داده‌ها را نمی‌فروشیم، اجاره نمی‌دهیم و برای تبلیغات در اختیار کسی نمی‌گذاریم. تنها اشتراک‌گذاری: با اعضای تیمی که خودت دعوتشان کرده‌ای، و با پردازشگرهای فنی (مثل درگاه پرداخت) در حد ضرورت.", "اگر قانوناً ملزم به افشا شویم، تا جای ممکن قبلش به تو خبر می‌دهیم — مگر قانون منع کرده باشد."] },
  { id: "p6", title: "حقوق تو", body: ["دسترسی: هر وقت بخواهی، کپی کامل داده‌هایت را می‌گیری (JSON/CSV). اصلاح: هر داده‌ای را می‌توانی ویرایش کنی. حذف: با بستن حساب، همه‌چیز تا ۳۰ روز پاک می‌شود.", "برای استفاده از این حقوق، یک ایمیل به privacy@finolo.ir کافی است؛ حداکثر تا ۷ روز کاری انجام می‌شود."] },
  { id: "p7", title: "مدت نگهداری", body: ["تا وقتی حساب فعال است، داده‌ها می‌مانند. بعد از حذف حساب: ۳۰ روز برای نسخهٔ اصلی و تا ۹۰ روز برای بکاپ‌های دوره‌ای که خودشان منقضی می‌شوند.", "اگر قانون، نگهداری طولانی‌تری بخواهد (مثل اسناد مالی)، فقط همان بخشِ خاص می‌ماند."] },
  { id: "p8", title: "اطلاع‌رسانی تغییرات", body: ["تغییرات مهم این سند، ۱۴ روز قبل از اجرا ایمیل و اعلان داخل محصول می‌شود. نسخه‌های قبلی سند هم همیشه قابل دسترسی‌اند.", "مسئول حفاظت از داده: تیم زیرساخت و امنیت فینولو — privacy@finolo.ir"] },
];

export function Privacy() {
  usePageMeta(
    "حریم خصوصی | فینولو",
    "سیاست حریم خصوصی فینولو به زبان ساده — چه داده‌هایی جمع می‌کنیم، چطور نگه می‌داریم و چه حقوقی داری. بدون ردیاب و تبلیغات."
  );
  return (
    <PageShell
      crumb="حریم خصوصی"
      index="۰۵"
      sticker="محرمانه"
      title={
        <>
          داده‌هایت، <span className="text-verm">گروگان نیستند</span>
        </>
      }
      lead="کوتاه‌ترین نسخهٔ این صفحه: محتوای تو مال توست، نمی‌فروشیمش، ردیاب نداریم، و هر وقت بخواهی کامل برمی‌داریش و می‌روی."
    >
      <LegalLayout
        kind="privacy"
        plainSummary={[
          "هیچ کوکی تبلیغاتی و ردیاب شخص ثالثی نداریم.",
          "تسک‌هایت را نمی‌خوانیم؛ تحلیل‌ها فقط ناشناس و تجمیعی‌اند.",
          "یک ایمیل به privacy@finolo.ir = دسترسی، اصلاح یا حذف کامل داده‌ها.",
        ]}
        sections={PRIVACY_SECTIONS}
      />
    </PageShell>
  );
}
