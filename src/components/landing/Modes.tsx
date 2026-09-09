import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { MODES, type ModeId } from "../../lib/data";
import { Container, SectionHeading } from "../ui/Kit";
import { EASE } from "../ui/Reveal";
import { cn } from "../../lib/utils";

export function Modes() {
  const [active, setActive] = useState<ModeId>("auto");
  const mode = MODES.find((m) => m.id === active)!;

  return (
    <section id="modes" className="relative scroll-mt-24 py-28 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Three ways to run it"
          title="Hand it the wheel, take it back,"
          accent="or just look."
          blurb="The same engine behind every mode. What changes is how much of the decision-making you delegate, and whether it is allowed to write anything at all."
        />

        {/* tabs */}
        <div className="mt-14 flex justify-center">
          <div className="glass inline-flex gap-1 rounded-full p-1.5">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors duration-300 sm:px-7",
                  active === m.id ? "text-[#0a0a0a]" : "text-white/55 hover:text-white",
                )}
              >
                {active === m.id && (
                  <motion.span
                    layoutId="mode-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(120deg, ${m.accent}, rgba(255,255,255,0.85))`,
                      boxShadow: `0 8px 30px -10px rgba(${m.rgb},0.9)`,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <m.icon className="h-3.5 w-3.5" />
                  {m.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* panel */}
        <div className="relative mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12"
            >
              {/* mode-tinted wash */}
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full transition-colors duration-700"
                style={{
                  background: `radial-gradient(circle, rgba(${mode.rgb},0.22), transparent 68%)`,
                }}
              />

              <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-2xl"
                      style={{
                        background: `rgba(${mode.rgb},0.13)`,
                        boxShadow: `inset 0 0 0 1px rgba(${mode.rgb},0.32)`,
                      }}
                    >
                      <mode.icon className="h-5 w-5" style={{ color: mode.accent }} />
                    </span>
                    <div>
                      <div className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                        {mode.name} mode
                      </div>
                    </div>
                  </div>

                  <h3
                    className="mt-6 font-display font-bold text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.1] tracking-[-0.035em]"
                    style={{ color: mode.accent }}
                  >
                    {mode.tagline}
                  </h3>
                  <p className="mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-white/55">
                    {mode.description}
                  </p>

                  <Link
                    to="/console"
                    className="group mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-white/80 transition-colors hover:text-white"
                  >
                    Run {mode.name.toLowerCase()} mode in the demo
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

                <ul className="flex flex-col gap-3">
                  {mode.bullets.map((b, i) => (
                    <motion.li
                      key={b}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.09, ease: EASE }}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-4 py-3.5 ring-hairline"
                    >
                      <span
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                        style={{ background: `rgba(${mode.rgb},0.16)` }}
                      >
                        <Check className="h-3 w-3" style={{ color: mode.accent }} />
                      </span>
                      <span className="text-[13.5px] leading-relaxed text-white/65">
                        {b}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
