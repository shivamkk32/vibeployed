import { motion } from "framer-motion";
import { Hero } from "../components/landing/Hero";
import { Integrations } from "../components/landing/Integrations";
import { Pipeline } from "../components/landing/Pipeline";
import { Modes } from "../components/landing/Modes";
import { Architecture } from "../components/landing/Architecture";
import { CostExplorer } from "../components/landing/CostExplorer";
import { Security } from "../components/landing/Security";
import { Pricing } from "../components/landing/Pricing";
import { Faq } from "../components/landing/Faq";
import { Contact } from "../components/landing/Contact";
import { FinalCta } from "../components/landing/FinalCta";
import { Footer } from "../components/Footer";
import { StickyCta } from "../components/StickyCta";
import { pageTransition } from "../components/ui/ScrollToTop";
import { FAQ } from "../lib/data";
import { useJsonLd, useSeo } from "../lib/useSeo";

export function Landing() {
  /* Restores the homepage metadata after a visit to /console or /privacy,
     which overwrite the shared <head> tags on their way in. */
  useSeo({
    title: "Vibeployed · Ship to any cloud. Optimized and protected.",
    description:
      "Connect a repository and a cloud account. Vibeployed reads the code, designs the architecture, and shows you the diagram and the monthly bill, before a single resource exists.",
    path: "/",
  });

  /* Built from the same array the accordion renders, so the two cannot
     disagree. Google requires the answer text to be visible on the page. */
  useJsonLd("faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <motion.div {...pageTransition}>
      <main>
        <Hero />
        <Integrations />
        <Pipeline />
        <Modes />
        <Architecture />
        <CostExplorer />
        <Security />
        <Pricing />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </motion.div>
  );
}
