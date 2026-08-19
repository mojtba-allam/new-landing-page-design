import { Reveal, faNum } from "../lib/motion";
import { PageShell, Sheet, Sticker, usePageMeta } from "../components/PageShell";
import { IconArrow, IconBolt, IconShield, IconSpark } from "../components/Icons";

const MILESTONES = [
  { year: "۱۳۹۹", title: "یک ایده روی وایت‌برد", text: "سه مهندس ایرانی که از «اسپرینت بعدی چه خبر؟» خسته شده بودند، تصمیم گرفتند ابزار خودشان را بسازند — فارسی، شمسی، سریع." },
  { year: "۱۴۰۰", title: "نسخهٔ صفر و ده تیم اول", text: "اولین بورد کانبان بالا آمد. ده تیمِ معروف به بدقلق، داوطلب شدند و هر هفته ما را کوبیدند و ساختند." },
  { year: "۱۴۰۱", title: "تقویم شمسیِ واقعی", text: "نه تبدیل تاریخ، بلکه تفکر شمسی: هفته از شنبه، تعطیلی‌های ایران، سررسیدهای هوشمند." },
  { year: "۱۴۰۲", title: "هزار تیم، گانت و تایم‌لاین", text: "نمای گانت و وابستگی تسک‌ها اضافه شد؛ هزارمین تیم هم از ترلو مهاجرت کرد — در ۹ دقیقه." },
  { year: "۱۴۰۳", title: "اتوماسیون و API", text: "قانون بنویس، بقیه‌اش خودکار. وب‌هوک، API و اتصال به تلگرام برای تیم‌هایی که در چت زندگی می‌کنند." },
  { year: "۱۴۰۴", title: "۲٬۴۰۰ تیم و تازه اولِ راه", text: "اپ موبایل، حالت آفلاین و گزارش‌های زنده. هدف بعدی: ده هزار تیم ایرانی که بدون جلسهٔ وضعیت، تحویل می‌دهند." },
];

const VALUES = [
  { icon: "speed", title: "سرعت، احترام است", text: "هر میلی‌ثانیهٔ لگ، یعنی حواس‌پرتی یک انسان. فینولو طوری ساخته شده که از فکر شما جلو نزند، عقب هم نماند.", size: "sm:col-span-2" },
  { icon: "honest", title: "صداقتِ محصول", text: "بدون الگوی تاریک، بدون هزینهٔ پنهان، بدون «رایگانِ ۷ روزه». پلن رایگان، واقعاً برای همیشه رایگان است.", size: "" },
  { icon: "local", title: "بومی یعنی عمیق", text: "فارسی‌کردنِ رابط کافی نیست؛ شمسی‌کردنِ تفکر لازم است. از هفتهٔ شنبه‌ای تا اعداد فارسیِ همه‌جا.", size: "" },
  { icon: "calm", title: "آرامشِ تیم", text: "هر اعلان باید ارزشش را ثابت کند. پیش‌فرض ما «ساکت» است — مگر اینکه واقعاً خبری باشد.", size: "sm:col-span-2" },
];

const TEAM = [
  { init: "س‌م", name: "سام مرادی", role: "هم‌بنیان‌گذار و مدیرعامل", cls: "bg-verm" },
  { init: "ش‌ر", name: "شیرین راد", role: "هم‌بنیان‌گذار و مدیر فنی", cls: "bg-pine" },
  { init: "ب‌ن", name: "بابک نیکنام", role: "هم‌بنیان‌گذار و طراحی محصول", cls: "bg-ink" },
  { init: "م‌ک", name: "مریم کاظمی", role: "سرپرست مهندسی", cls: "bg-pine-soft" },
  { init: "آ‌ج", name: "آرش جمشیدی", role: "زیرساخت و امنیت", cls: "bg-verm-deep" },
  { init: "ن‌ا", name: "نازنین احمدی", role: "موفقیت مشتری", cls: "bg-amber text-ink" },
];

function ValueIcon({ kind }: { kind: string }) {
  if (kind === "speed") return <IconBolt className="w-6 h-6" />;
  if (kind === "honest") return <IconSpark className="w-6 h-6" />;
  if (kind === "local")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
        <path d="M8 14h3.5M8 17h6" />
      </svg>
    );
  return <IconShield className="w-6 h-6" />;
}

export default function About() {
  usePageMeta(
    "درباره ما | فینولو",
    "داستان فینولو — تیمی که می‌خواهد جلسه‌های «وضعیت پروژه» را بازنشسته کند. از ۱۳۹۹ تا امروز، ارزش‌ها و آدم‌های پشت فینولو."
  );

  return (
    <PageShell
      crumb="درباره ما"
      index="۰۱"
      sticker="ما"
      title={
        <>
          ما ابزار نمی‌سازیم؛
          <br />
          <span className="text-verm">تمرکز</span> می‌سازیم.
        </>
      }
      lead="فینولو از یک خستگی ساده به وجود آمد: جلسه‌هایی که فقط برای این بود که بفهمیم چه خبر است. ما آن خبر را روی بورد آوردیم — و جلسه‌ها را بازنشسته کردیم."
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* ---------- timeline ---------- */}
        <section className="mt-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <Sticker>مسیر ما</Sticker>
              <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
            </div>
          </Reveal>
          <div className="mt-10 grid md:grid-cols-2 gap-x-14">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={(i % 2) * 100} className={i % 2 ? "md:translate-y-10" : ""}>
                <div className="relative border-s-[3px] border-ink ps-7 pb-10 group">
                  <span className="absolute -start-[11px] top-1 w-5 h-5 rounded-full bg-amber border-[3px] border-paper outline outline-[1.5px] outline-ink group-hover:bg-verm transition-colors duration-300" />
                  <div className="font-display text-3xl text-verm">{m.year}</div>
                  <h3 className="mt-2 font-display text-xl">{m.title}</h3>
                  <p className="mt-2 text-ink-soft leading-7 font-medium text-[15px]">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- values (asymmetric) ---------- */}
        <section className="mt-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <Sticker tone="bg-amber text-ink">ارزش‌هایی که کوتاه نمی‌آییم</Sticker>
              <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
            </div>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100} className={v.size}>
                <div className="card-tilt h-full rounded-2xl border-[1.5px] border-ink bg-paper p-7 shadow-[6px_6px_0_0_rgba(25,23,18,1)]">
                  <span className={`w-12 h-12 grid place-items-center rounded-full border-[1.5px] border-ink ${i % 2 ? "bg-sage" : "bg-amber/60"}`}>
                    <ValueIcon kind={v.icon} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl">{v.title}</h3>
                  <p className="mt-3 text-ink-soft leading-7 font-medium text-[15px]">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- team ---------- */}
        <section className="mt-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <Sticker tone="bg-pine text-paper">آدم‌های پشت بورد</Sticker>
              <span className="h-px flex-1 border-t-[1.5px] border-dashed border-ink/25" />
            </div>
          </Reveal>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((t, i) => (
              <Reveal key={t.name} delay={i * 80} variant="scale">
                <div className="group flex items-center gap-4 rounded-2xl border-[1.5px] border-ink bg-paper p-5 shadow-[5px_5px_0_0_rgba(25,23,18,1)] hover:-translate-y-1.5 hover:shadow-[8px_8px_0_0_rgba(244,71,31,1)] transition-all duration-300">
                  <span className={`w-14 h-14 shrink-0 grid place-items-center rounded-full text-paper font-display text-lg border-[1.5px] border-ink ${t.cls} group-hover:rotate-6 transition-transform duration-300`}>
                    {t.init}
                  </span>
                  <span>
                    <strong className="block font-black text-lg">{t.name}</strong>
                    <span className="text-sm text-ink-soft font-semibold">{t.role}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- manifesto band ---------- */}
        <Reveal variant="scale" className="mt-24">
          <Sheet className="relative bg-ink text-paper overflow-hidden">
            <div className="absolute inset-0 bg-grid-dark opacity-60" aria-hidden />
            <div className="relative p-8 sm:p-12 text-center">
              <Sticker tone="bg-amber text-ink">مانیفست</Sticker>
              <p className="mt-6 font-display text-2xl sm:text-4xl leading-[1.5] max-w-3xl mx-auto">
                «هیچ تیمی نباید صبحش را با پرسیدنِ
                <span className="text-amber"> «خب… الان چی کار می‌کنیم؟» </span>
                شروع کند.»
              </p>
              <p className="mt-4 text-paper/60 font-semibold text-sm">— تیم فینولو، از روز اول</p>
              <a
                href="#/"
                className="group mt-8 inline-flex items-center gap-3 bg-verm text-paper rounded-full px-8 py-3.5 font-bold hover:bg-amber hover:text-ink transition-colors duration-300"
              >
                با فینولو شروع کن
                <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
            </div>
          </Sheet>
        </Reveal>

        {/* ---------- quick facts strip ---------- */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            ["۶", "سال ساختِ مداوم"],
            ["۱۸", "انسان در تیم فینولو"],
            ["۲", "دیتاسنتر داخل ایران"],
            ["۰", "سرمایهٔ خارجی — خودگردان"],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 90}>
              <div className="text-center rounded-2xl border-[1.5px] border-dashed border-ink/40 bg-paper-deep/60 py-6 px-3 hover:bg-amber/40 hover:border-ink transition-colors duration-300">
                <div className="font-display text-4xl text-verm tabular-nums">{faNum(Number(n.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))))}</div>
                <div className="mt-2 text-sm font-bold text-ink-soft">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
