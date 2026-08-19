import { useMemo, useState } from "react";
import { Reveal, faNum } from "../lib/motion";
import { PageShell, Sticker, usePageMeta } from "../components/PageShell";
import { IconPlus } from "../components/Icons";

const CATEGORIES = ["همه", "شروع و راه‌اندازی", "صورتحساب", "امنیت", "مهاجرت", "فنی"];

const ITEMS = [
  { cat: "شروع و راه‌اندازی", q: "چطور اولین بورد را بسازم؟", a: "بعد از ثبت‌نام، روی «پروژهٔ جدید» بزن، اسم بگذار و یکی از قالب‌های آماده (کانبان، گانت یا اسپرینت) را انتخاب کن. کل فرایند زیر یک دقیقه است و می‌توانی اعضا را همان لحظه با لینک دعوت کنی." },
  { cat: "شروع و راه‌اندازی", q: "آیا فینولو اپلیکیشن موبایل دارد؟", a: "بله؛ نسخه‌های iOS و اندروید با همگام‌سازی لحظه‌ای و حالت آفلاین. تسک‌هایت در مترو و سفر هم همراهت هستند و به‌محض اتصال، تغییرات سینک می‌شود." },
  { cat: "شروع و راه‌اندازی", q: "چند نفر می‌توانند هم‌زمان روی یک بورد کار کنند؟", a: "در پلن حرفه‌ای و سازمانی نامحدود. تغییرات زیر ۲۰۰ میلی‌ثانیه برای همهٔ اعضا پخش می‌شود و نشانگر حضور (presence) نشان می‌دهد چه کسی همین حالا آنلاین است." },
  { cat: "صورتحساب", q: "نسخهٔ رایگان چه محدودیت‌هایی دارد؟", a: "۳ پروژه و ۵ عضو، به‌همراه بورد کانبان، لیستی و تقویم شمسی. هیچ محدودیت زمانی ندارد — «رایگان» یعنی برای همیشه رایگان. فقط نماهای پیشرفته و اتوماسیون در پلن‌های پولی‌اند." },
  { cat: "صورتحساب", q: "چطور پرداخت کنم؟ کارت خارجی لازم است؟", a: "نه؛ پرداخت ریالی با همهٔ کارت‌های بانکی عضو شتاب، درگاه امن و فاکتور رسمی. برای سازمان‌ها، فاکتور مدت‌دار و قرارداد هم صادر می‌کنیم." },
  { cat: "صورتحساب", q: "اگر وسط سال ارتقا بدهم، هزینه چطور حساب می‌شود؟", a: "به‌صورت روزشمار (prorated). فقط مابه‌التفاوت روزهای باقی‌مانده را می‌پردازی — نه یک ریال بیشتر." },
  { cat: "امنیت", q: "داده‌های تیم ما کجا نگهداری می‌شود؟", a: "در دو دیتاسنتر داخل ایران با بکاپ روزانهٔ رمزنگاری‌شده. ارتباط همیشه TLS است و داده‌ها هرگز برای تبلیغات یا تحلیل شخص ثالث استفاده نمی‌شوند." },
  { cat: "امنیت", q: "چه سطح‌بندی دسترسی‌هایی وجود دارد؟", a: "نقش‌های مدیر، عضو و مهمان با دسترسی دقیق تا سطح ستون و تسک. همهٔ تغییرات لاگ می‌شوند و می‌توانی بفهمی چه‌کسی، چه‌چیزی را، چه‌وقتی عوض کرده." },
  { cat: "امنیت", q: "آیا احراز هویت دومرحله‌ای دارید؟", a: "بله؛ TOTP (اپ‌های authenticator) و کد پیامکی. در پلن سازمانی، SSO و اجبارِ 2FA برای کل تیم هم فعال می‌شود." },
  { cat: "مهاجرت", q: "می‌توانم از ترلو، جیرا یا اسانا مهاجرت کنم؟", a: "با یک کلیک. تخته‌ها، کارت‌ها، اعضا، برچسب‌ها و ددلاین‌ها وارد می‌شوند و تاریخ‌ها خودکار شمسی می‌شوند. میانگین مهاجرت کامل زیر ۱۰ دقیقه است — رکورد ما ۳ دقیقه و ۴۰ ثانیه." },
  { cat: "مهاجرت", q: "اگر فایل اکسل تسک‌ها را داشته باشم چطور؟", a: "خروجی اکسل را مستقیم ایمپورت کن؛ ستون‌ها را به فیلدهای فینولو مپ می‌کنیم و پیش‌نمایش می‌دهیم قبل از اینکه چیزی ساخته شود." },
  { cat: "فنی", q: "فینولو API دارد؟", a: "REST API کامل با مستندات فارسی و توکن اختصاصی. وب‌هوک برای رویدادهای تسک، اتصال به تلگرام و Zapier هم آماده است." },
  { cat: "فنی", q: "حداکثر سرعت اینترنت موردنیاز چقدر است؟", a: "صفحه‌ها زیر ۱۵۰ کیلوبایت‌اند و روی اینترنت ضعیف اداره هم روان کار می‌کنند. حالت آفلاین موبایل هم که کلاً بی‌نیاز از اینترنت است." },
  { cat: "فنی", q: "چرا بعضی اعلان‌ها دیر می‌رسد؟", a: "اعلان‌ها دسته‌بندی می‌شوند تا نویز ایجاد نکنند (هر ۵ دقیقه یک‌بار، مگر فوری). اگر اعلان فوری دیر رسید، از تنظیمات > اعلان‌ها کانال تلگرام را فعال کن — زیر ۲ ثانیه می‌رسد." },
];

export default function FaqPage() {
  usePageMeta(
    "سوالات متداول | فینولو",
    "جواب همهٔ سوالات رایج دربارهٔ فینولو — شروع، صورتحساب، امنیت، مهاجرت از ترلو و جیرا، و مسائل فنی. با جستجوی زنده."
  );

  const [cat, setCat] = useState("همه");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number>(-1);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ITEMS.filter(
      (it) => (cat === "همه" || it.cat === cat) && (query === "" || it.q.includes(query) || it.a.includes(query))
    );
  }, [cat, q]);

  return (
    <PageShell
      crumb="سوالات متداول"
      index="۰۳"
      sticker="؟"
      title={
        <>
          سوال؟ <span className="text-verm">جوابش</span> همین‌جاست.
        </>
      }
      lead="۱۴ سوالی که هر روز از ما می‌پرسند — بی‌سانسور و بدون «با پشتیبانی تماس بگیرید». چیزی پیدا نکردی؟ پایین صفحه راهش هست."
    >
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        {/* search + categories */}
        <Reveal className="mt-12">
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft pointer-events-none">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m20 20-4.8-4.8" />
            </svg>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(-1);
              }}
              placeholder="جستجو… مثلاً «مهاجرت» یا «پرداخت»"
              className="w-full rounded-full border-[1.5px] border-ink bg-paper py-4 ps-14 pe-6 font-medium shadow-[5px_5px_0_0_rgba(25,23,18,1)] focus:shadow-[2px_2px_0_0_rgba(244,71,31,0.7)] focus:border-verm outline-none transition-all duration-200"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCat(c);
                  setOpen(-1);
                }}
                className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-bold transition-all duration-200 ${
                  cat === c ? "bg-ink text-paper border-ink shadow-[3px_3px_0_0_rgba(244,71,31,1)]" : "border-ink/30 hover:border-ink hover:-translate-y-0.5"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* results */}
        <div className="mt-4 mb-6 text-sm font-bold text-ink-soft" aria-live="polite">
          {faNum(filtered.length)} پاسخ پیدا شد
        </div>

        {filtered.length === 0 ? (
          <Reveal variant="scale">
            <div className="rounded-2xl border-[1.5px] border-dashed border-ink/40 bg-paper-deep/70 p-12 text-center">
              <Sticker tone="bg-amber text-ink">چیزی پیدا نشد</Sticker>
              <p className="mt-5 font-display text-2xl">این سوال را هنوز نپرسیده‌اند!</p>
              <p className="mt-2 text-ink-soft font-medium">کلمهٔ دیگری امتحان کن، یا مستقیم بپرس — جواب می‌دهیم و همین‌جا اضافه‌اش می‌کنیم.</p>
              <a href="#/contact" className="mt-6 inline-flex items-center gap-2 font-bold text-verm link-underline">
                فرستادن سوال به تیم
              </a>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {filtered.map((it, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={it.q} delay={Math.min(i * 60, 300)}>
                  <div className={`rounded-2xl border-[1.5px] border-ink bg-paper shadow-[4px_4px_0_0_rgba(25,23,18,1)] transition-all duration-300 ${isOpen ? "shadow-[6px_6px_0_0_rgba(244,71,31,1)]" : ""}`}>
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full flex items-center gap-4 text-start px-6 py-5"
                      aria-expanded={isOpen}
                    >
                      <span className={`font-display text-lg shrink-0 ${isOpen ? "text-verm" : "text-ink/35"}`}>{faNum(i + 1).padStart(2, "۰")}</span>
                      <span className="flex-1 font-bold text-base sm:text-lg">{it.q}</span>
                      <span className={`shrink-0 w-9 h-9 grid place-items-center rounded-full border-[1.5px] border-ink transition-all duration-300 ${isOpen ? "bg-verm text-paper rotate-45 border-verm" : "bg-paper"}`}>
                        <IconPlus className="w-4 h-4" />
                      </span>
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.19,0.65,0.22,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 pe-6 sm:pe-20">
                          <span className="inline-block text-[10px] font-black rounded-full bg-sage px-2.5 py-1 mb-3">{it.cat}</span>
                          <p className="text-ink-soft leading-8 font-medium">{it.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* still need help */}
        <Reveal variant="scale" className="mt-14">
          <div className="rounded-2xl border-[1.5px] border-ink bg-verm text-paper p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 shadow-[8px_8px_0_0_rgba(25,23,18,1)]">
            <div className="flex-1 text-center sm:text-start">
              <h3 className="font-display text-2xl sm:text-3xl">جوابت را پیدا نکردی؟</h3>
              <p className="mt-2 text-paper/85 font-medium">تیم پشتیبانی در تلگرام آنلاین است — میانگین پاسخ ۷ دقیقه، حتی جمعه‌ها.</p>
            </div>
            <div className="flex gap-3">
              <a href="#/contact" className="bg-ink text-paper rounded-full px-6 py-3 font-bold hover:bg-paper hover:text-ink transition-colors duration-300 whitespace-nowrap">
                صفحهٔ تماس
              </a>
              <a href="#/help" className="border-2 border-paper rounded-full px-6 py-3 font-bold hover:bg-paper hover:text-verm transition-colors duration-300 whitespace-nowrap">
                مرکز راهنما
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
