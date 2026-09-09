import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { PIPELINE, type PipelineStep } from "../../lib/data";
import { Container, SectionHeading } from "../ui/Kit";
import { EASE } from "../ui/Reveal";

export function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.62", "end 0.65"],
  });
  const height = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section id="how" className="relative scroll-mt-24 py-28 sm:py-36">
      {/* soft column glow behind the rail */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[36rem] -translate-x-1/2 lg:block"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 40%, rgba(229,229,229,0.055), transparent 72%)",
        }}
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="The run"
          title="Six steps from"
          accent="repo to running."
          blurb="No YAML to learn, no console to click through. Every stage is inspectable, and the only irreversible one waits for you."
        />

        <div ref={ref} className="relative mt-20">
          {/* rail */}
          <div className="absolute left-[27px] top-2 hidden h-[calc(100%-1rem)] w-px bg-white/[0.07] sm:block lg:left-1/2 lg:-translate-x-1/2">
            <motion.div
              style={{ height }}
              className="w-px bg-gradient-to-b from-gold-400 via-gold-300 to-jade-400"
            />
          </div>

          <ol className="flex flex-col gap-12 sm:gap-14">
            {PIPELINE.map((s, i) => (
              <Step key={s.n} step={s} index={i} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function Step({ step, index }: { step: PipelineStep; index: number }) {
  const left = index % 2 === 0;

  return (
    <li className="relative">
      <div
        className={`grid gap-6 sm:pl-16 lg:grid-cols-2 lg:gap-16 lg:pl-0 ${
          left ? "" : "lg:[direction:rtl]"
        }`}
      >
        {/* marker */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute left-0 top-1 hidden h-14 w-14 place-items-center sm:grid lg:left-1/2 lg:-translate-x-1/2"
        >
          <span
            className="absolute h-14 w-14 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${step.rgb},0.22), transparent 68%)`,
            }}
          />
          <span
            className="relative grid h-11 w-11 place-items-center rounded-full bg-[#131313] text-[11px] font-bold tracking-wider"
            style={{
              color: step.accent,
              boxShadow: `inset 0 0 0 1px rgba(${step.rgb},0.42)`,
            }}
          >
            {step.n}
          </span>
        </motion.div>

        {/* card */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className={`[direction:ltr] ${left ? "lg:pr-14 lg:text-right" : "lg:col-start-1 lg:row-start-1 lg:pl-14"}`}
        >
          <div
            className={`flex items-center gap-3 ${left ? "lg:justify-end" : ""}`}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{
                background: `rgba(${step.rgb},0.11)`,
                boxShadow: `inset 0 0 0 1px rgba(${step.rgb},0.28)`,
              }}
            >
              <step.icon className="h-4 w-4" style={{ color: step.accent }} />
            </span>
            <span className="font-mono text-[11px] text-white/25 sm:hidden">
              {step.n}
            </span>
          </div>

          <h3 className="mt-4 font-display font-bold text-[23px] tracking-[-0.03em] text-white sm:text-[27px]">
            {step.title}
          </h3>
          <p className="mt-2.5 text-pretty text-[14.5px] leading-relaxed text-white/50">
            {step.blurb}
          </p>

          <ul
            className={`mt-5 flex flex-col gap-2 ${left ? "lg:items-end" : ""}`}
          >
            {step.detail.map((d, di) => (
              <motion.li
                key={d}
                initial={{ opacity: 0, x: left ? 12 : -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0.12 + di * 0.08, ease: EASE }}
                className={`flex items-start gap-2.5 text-[13px] text-white/45 ${
                  left ? "lg:flex-row-reverse lg:text-right" : ""
                }`}
              >
                <Check
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  style={{ color: step.accent, opacity: 0.75 }}
                />
                <span>{d}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* spacer column keeps the alternating layout honest */}
        <div aria-hidden className="hidden lg:block" />
      </div>
    </li>
  );
}
