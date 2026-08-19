import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Ambient, Footer, Nav } from "./components/Chrome";
import Hero from "./components/Hero";
import { GanttSection } from "./components/Showcase";
import { CtaBand, Faq, Pricing, StatsBand, Testimonials } from "./components/Social";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FaqPage from "./pages/FaqPage";
import { Privacy, Terms } from "./pages/Legal";
import Login from "./pages/Login";
import Help from "./pages/Help";
import Status from "./pages/Status";
import Changelog from "./pages/Changelog";
import PricingPage from "./pages/PricingPage";
import Features from "./pages/Features";

function HomePage() {
  return (
    <div className="relative min-h-screen font-body text-ink">
      <Nav />
      <main>
        <Hero />
        <GanttSection />
        <StatsBand />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}

/** اسکرول به بالای صفحه هنگام تغییر مسیر */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * لینک‌های قدیمیِ لنگری مثل #pricing یا #timeline از هر صفحه‌ای که باشند،
 * کاربر را به خانه برده و به سکشن موردنظر می‌رسانند.
 */
function AnchorRedirect() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const id = pathname.replace(/^\//, "");
    navigate("/", { replace: true });
    const t = window.setTimeout(() => {
      if (!id || id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
    return () => window.clearTimeout(t);
  }, [pathname, navigate]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Ambient />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/help" element={<Help />} />
        <Route path="/status" element={<Status />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="*" element={<AnchorRedirect />} />
      </Routes>
    </HashRouter>
  );
}
