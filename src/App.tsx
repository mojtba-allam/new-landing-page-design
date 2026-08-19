import { Ambient, Footer, Nav } from "./components/Chrome";
import Hero from "./components/Hero";
import { GanttSection } from "./components/Showcase";
import { CtaBand, Faq, Pricing, StatsBand, Testimonials } from "./components/Social";

export default function App() {
  return (
    <div className="relative min-h-screen font-body text-ink">
      <Ambient />
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
