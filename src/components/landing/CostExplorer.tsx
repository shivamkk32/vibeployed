import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, SlidersHorizontal } from "lucide-react";
import {
  DEFAULT_ANSWERS,
  estimate,
  replicasFor,
  savingsHints,
  totalOf,
  type Answers,
} from "../../lib/cost";
import { CLOUDS, type CloudId } from "../../lib/data";
import { Button, Container, SectionHeading } from "../ui/Kit";
import { Reveal } from "../ui/Reveal";
import { FlowingUSD } from "../ui/AnimatedNumber";
import { cn, formatUSD } from "../../lib/utils";
import { BrandLogo } from "../ui/BrandLogo";

export function CostExplorer() {
  const [cloud, setCloud] = useState<CloudId>("aws");
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);

  const lines = useMemo(() => estimate(cloud, answers), [cloud, answers]);
  const total = useMemo(() => totalOf(lines), [lines]);
  const hints = useMemo(() => savingsHints(answers, total), [answers, total]);
  const max = Math.max(...lines.map((l) => l.monthly));

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }));

  return (
    <section id="cost" className="relative scroll-mt-24 py-28 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="The questionnaire"
          title="Four answers, and the bill"
          accent="stops being a surprise."
          blurb="This is the real sizing model. Move anything and watch the architecture and the estimate respond. No sign-up, no email gate."
        />

        <Reveal delay={0.1} className="mt-14">
          <div className="glass overflow-hidden rounded-3xl">
            <div className="grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)]">
              {/* ------------------------------ inputs ----------------------------- */}
              <div className="border-b border-white/[0.06] p-7 sm:p-9 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Your answers
                </div>

                {/* cloud */}
                <Field label="Cloud provider">
                  <div className="grid grid-cols-3 gap-2">
                    {CLOUDS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCloud(c.id)}
                        className={cn(
                          "relative overflow-hidden rounded-xl px-3 py-3 text-center transition-all duration-300",
                          cloud === c.id
                            ? "bg-white/[0.07]"
                            : "bg-white/[0.02] hover:bg-white/[0.045]",
                        )}
                        style={
                          cloud === c.id
                            ? { boxShadow: `inset 0 0 0 1px rgba(${c.rgb},0.55)` }
                            : { boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }
                        }
                      >
                        <BrandLogo
                          brand={c.brand}
                          tone={cloud === c.id ? "brand" : "mono"}
                          className={cn(
                            "mx-auto mb-2 h-5 w-5",
                            cloud === c.id ? "" : "text-white/30",
                          )}
                        />
                        <span
                          className={cn(
                            "text-[12px] font-semibold transition-colors",
                            cloud === c.id ? "text-white" : "text-white/45",
                          )}
                        >
                          {c.short}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                {/* traffic */}
                <Field
                  label="Peak traffic"
                  hint={`${answers.traffic} req/s · ${replicasFor(answers.traffic)} API replicas`}
                >
                  <input
                    type="range"
                    className="range"
                    min={50}
                    max={4000}
                    step={50}
                    value={answers.traffic}
                    onChange={(e) => set("traffic", Number(e.target.value))}
                    aria-label="Peak traffic in requests per second"
                  />
                  <Scale left="50 req/s" right="4,000 req/s" />
                </Field>

                {/* regions */}
                <Field
                  label="Regions served"
                  hint={`${answers.regions} region${answers.regions > 1 ? "s" : ""}`}
                >
                  <input
                    type="range"
                    className="range"
                    min={1}
                    max={4}
                    step={1}
                    value={answers.regions}
                    onChange={(e) => set("regions", Number(e.target.value))}
                    aria-label="Number of regions"
                  />
                  <Scale left="Single" right="Four" />
                </Field>

                {/* availability */}
                <Field label="Availability target">
                  <Segmented
                    value={answers.availability}
                    onChange={(v) => set("availability", v)}
                    options={[
                      { id: "single", label: "Single AZ" },
                      { id: "multi-az", label: "Multi-AZ" },
                      { id: "multi-region", label: "Multi-region" },
                    ]}
                  />
                </Field>

                {/* sensitivity */}
                <Field label="Data sensitivity">
                  <Segmented
                    value={answers.sensitivity}
                    onChange={(v) => set("sensitivity", v)}
                    options={[
                      { id: "standard", label: "Standard" },
                      { id: "sensitive", label: "Sensitive" },
                      { id: "regulated", label: "Regulated" },
                    ]}
                  />
                </Field>
              </div>

              {/* ----------------------------- estimate ---------------------------- */}
              <div className="p-7 sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      Estimated monthly cost
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <AnimatedTotal value={total} />
                      <span className="text-[13px] text-white/35">/ month</span>
                    </div>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <div className="text-[11px] text-white/30">on</div>
                    <div className="text-[13px] font-semibold text-white/70">
                      {CLOUDS.find((c) => c.id === cloud)!.short}
                    </div>
                  </div>
                </div>

                {/* line items */}
                <ul className="mt-7 flex flex-col gap-2.5">
                  {lines.map((l) => (
                    <li key={l.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13px] text-white/75">{l.service}</span>
                        <span className="font-mono text-[12.5px] tabular-nums text-white/55">
                          {formatUSD(l.monthly, 2)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2.5">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                          <motion.div
                            className="h-1 rounded-full"
                            style={{ background: l.accent }}
                            animate={{ width: `${(l.monthly / max) * 100}%` }}
                            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <span className="shrink-0 font-mono text-[10px] text-white/25">
                          {l.qty}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* savings */}
                <div className="mt-7 border-t border-white/[0.07] pt-6">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    <Lightbulb className="h-3.5 w-3.5 text-bronze-300" />
                    Ways to spend less
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <AnimatePresence mode="popLayout">
                      {hints.map((h) => (
                        <motion.div
                          key={h.title}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="rounded-xl bg-bronze-500/[0.05] px-4 py-3 ring-1 ring-inset ring-bronze-400/15"
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[12.5px] font-semibold text-bronze-100/90">
                              {h.title}
                            </span>
                            <span className="shrink-0 font-mono text-[11.5px] text-bronze-200/80">
                              −{formatUSD(h.saves)}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-white/40">
                            {h.body}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <Link to="/console" className="mt-7 block">
                  <Button className="w-full" icon={<ArrowRight className="h-4 w-4" />}>
                    Take this into the full run
                  </Button>
                </Link>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-white/25">
                  Illustrative model for the demo. A real run prices the exact
                  resources in your plan against current provider rates.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------- pieces -------------------------------- */

function AnimatedTotal({ value }: { value: number }) {
  return (
    <FlowingUSD
      value={Math.round(value)}
      className="font-display font-bold text-[clamp(2.4rem,5.2vw,3.2rem)] leading-none tracking-[-0.03em] text-white"
    />
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-white/70">{label}</span>
        {hint && (
          <span className="font-mono text-[11px] text-gold-200/70">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Scale({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-2 flex justify-between font-mono text-[10px] text-white/25">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ id: T; label: string }>;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/[0.03] p-1 ring-hairline">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "relative rounded-lg px-2 py-2 text-[12px] font-medium transition-colors duration-300",
            value === o.id ? "text-[#0a0a0a]" : "text-white/50 hover:text-white/85",
          )}
        >
          {value === o.id && (
            <motion.span
              layoutId={`seg-${options.map((x) => x.id).join("-")}`}
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-gold-300 to-gold-200"
            />
          )}
          <span className="relative z-10">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
