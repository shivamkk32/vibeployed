import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  PlayCircle,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { Aurora } from "../ui/Aurora";
import { Button, Container } from "../ui/Kit";
import { GhostCollage } from "./GhostCollage";
import { HeroPanel } from "./HeroPanel";
import { EASE } from "../ui/Reveal";

const LINE_A = ["Ship", "to", "any", "cloud."];
const LINE_B = ["Optimized", "and", "protected."];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const copyFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  return (
    <section ref={ref} className="relative overflow-hidden pb-28 pt-36 sm:pt-40">
      <Aurora grid={false} intensity={0.75} />
      <GhostCollage />

      <Container className="relative">
        {/* ------------------------------- copy ------------------------------- */}
        <motion.div
          style={{ y: copyY, opacity: copyFade }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          {/* announcement pill */}
          <motion.a
            href="#design"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="group inline-flex items-center gap-2 rounded-full bg-[oklch(0.235_0_0)] py-2 pl-4 pr-3 ring-1 ring-inset ring-white/10 transition-colors duration-300 hover:bg-[oklch(0.28_0_0)]"
          >
            <span className="text-[13px] font-medium text-white/75">
              Design View
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-white/40 transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.a>

          {/* headline */}
          <h1 className="mt-8 font-display text-[clamp(2.7rem,7.6vw,5.9rem)] font-bold leading-[0.96] tracking-[-0.045em]">
            <span className="block text-white">
              <Words words={LINE_A} delay={0.14} />
            </span>
            <span className="block text-white/35">
              <Words words={LINE_B} delay={0.4} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72, ease: EASE }}
            className="mt-7 max-w-[38rem] text-balance text-[16.5px] leading-relaxed text-white/50 sm:text-[17.5px]"
          >
            Connect a repository and a cloud account. Vibeployed reads the code,
            designs the architecture, and shows you the diagram and the monthly
            bill, before a single resource exists.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.86, ease: EASE }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/console">
              <Button size="lg" magnetic icon={<ArrowRight className="h-4 w-4" />}>
                Try the live demo
              </Button>
            </Link>
            <a href="#how">
              <Button
                size="lg"
                variant="outline"
                icon={<PlayCircle className="h-4 w-4" />}
              >
                See how it works
              </Button>
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.05 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[12.5px] text-white/40"
          >
            {[
              { icon: ShieldCheck, t: "Read-only audits" },
              { icon: Wallet, t: "Cost shown before apply" },
              { icon: Zap, t: "Terraform you can keep" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-2">
                <f.icon className="h-3.5 w-3.5 text-white/30" />
                {f.t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ------------------------------- panel ------------------------------ */}
        <motion.div
          style={{ y: panelY }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
          className="relative z-10 mx-auto mt-20 max-w-4xl"
        >
          <HeroPanel />
        </motion.div>
      </Container>
    </section>
  );
}

function Words({ words, delay = 0 }: { words: string[]; delay?: number }) {
  return (
    <>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden pb-[0.06em] align-bottom"
          style={{ marginRight: i < words.length - 1 ? "0.22em" : undefined }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "112%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: delay + i * 0.06, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </>
  );
}
