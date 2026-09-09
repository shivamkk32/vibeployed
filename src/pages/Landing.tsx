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
import { pageTransition } from "../components/ui/ScrollToTop";

export function Landing() {
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
    </motion.div>
  );
}
