import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Radar } from "lucide-react";
import { Button, Container } from "../ui/Kit";
import { Reveal } from "../ui/Reveal";

export function FinalCta() {
  const reduce = useReducedMotion();

  return (
    <section className="relative py-28 sm:py-36">
      <Container>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] px-7 py-16 text-center sm:px-14 sm:py-20">
            {/* orbiting glow */}
            <div className="pointer-events-none absolute inset-0 grain">
              <motion.div
                className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(229,229,229,0.13), rgba(245,245,245,0.05) 45%, transparent 72%)",
                }}
                animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 grid-lines mask-fade-b opacity-40" />
            </div>

            <div className="relative">
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-3xl font-display font-bold text-[clamp(2.2rem,5.2vw,3.8rem)] leading-[1.06] tracking-[-0.04em] text-white"
              >
                Your next deploy could be the one{" "}
                <span className="accent-text">nobody has to clean up.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto mt-6 max-w-xl text-pretty text-[16px] leading-relaxed text-white/55"
              >
                Run the whole flow in the browser: repo, scan, design, cost,
                deploy. Nothing to install, no account, no card.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-wrap items-center justify-center gap-3"
              >
                <Link to="/console">
                  <Button size="lg" magnetic icon={<ArrowRight className="h-4 w-4" />}>
                    Start a run
                  </Button>
                </Link>
                <Link to="/console">
                  <Button size="lg" variant="outline" icon={<Radar className="h-4 w-4" />}>
                    Just audit my account
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
