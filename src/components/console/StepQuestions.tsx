import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Gauge } from "lucide-react";
import type { Answers } from "../../lib/cost";
import { replicasFor } from "../../lib/cost";
import type { RunState } from "../../lib/run";
import { cloudById } from "../../lib/data";
import { Button } from "../ui/Kit";
import { StepShell } from "./StepShell";
import { cn } from "../../lib/utils";

export function StepQuestions({
  run,
  update,
  onNext,
  onBack,
}: {
  run: RunState;
  update: (p: Partial<RunState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const a = run.answers;
  const cloud = cloudById(run.cloud);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    update({ answers: { ...a, [k]: v } });

  const replicas = replicasFor(a.traffic);

  return (
    <StepShell
      title="Four questions about scale"
      blurb="These answers decide instance sizing, redundancy, storage tiering and how much headroom the autoscaler gets. Change any of them later and the design re-renders."
    >
      <div className="flex flex-col gap-8">
        <Question
          n="01"
          q="How much traffic should it absorb at peak?"
          why="Sets replica count, the autoscaling ceiling and the load balancer tier."
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display font-bold text-[36px] leading-none tracking-[-0.03em] text-white">
              {a.traffic.toLocaleString()}
            </span>
            <span className="text-[13px] text-white/40">requests / second</span>
          </div>
          <input
            type="range"
            className="range mt-5"
            min={50}
            max={4000}
            step={50}
            value={a.traffic}
            onChange={(e) => set("traffic", Number(e.target.value))}
            aria-label="Peak requests per second"
          />
          <div className="mt-2 flex justify-between font-mono text-[10.5px] text-white/25">
            <span>50, a launch</span>
            <span>4,000, a busy product</span>
          </div>
          <Derived>
            {replicas} API replicas, autoscaling capped at {replicas * 3}
          </Derived>
        </Question>

        <Question
          n="02"
          q="How many regions do you need to serve from?"
          why="Drives data replication, egress cost and how the CDN is configured."
        >
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((r) => (
              <button
                key={r}
                onClick={() => set("regions", r)}
                className={cn(
                  "rounded-xl py-4 text-center transition-all duration-300",
                  a.regions === r
                    ? "bg-white/[0.08] text-white"
                    : "bg-white/[0.025] text-white/45 hover:bg-white/[0.05]",
                )}
                style={{
                  boxShadow:
                    a.regions === r
                      ? "inset 0 0 0 1px rgba(245,245,245,0.55)"
                      : "inset 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <span className="block font-display font-bold text-[23px] leading-none">{r}</span>
                <span className="mt-0.5 block text-[10.5px] text-white/35">
                  {r === 1 ? "region" : "regions"}
                </span>
              </button>
            ))}
          </div>
          <Derived>
            Primary in {run.region} on {cloud.short}
          </Derived>
        </Question>

        <Question
          n="03"
          q="What kind of data does it hold?"
          why="Decides encryption policy, network isolation, backup retention and audit logging."
        >
          <Choices
            value={a.sensitivity}
            onChange={(v) => set("sensitivity", v)}
            options={[
              {
                id: "standard",
                label: "Standard",
                desc: "Nothing personal or financial",
              },
              {
                id: "sensitive",
                label: "Sensitive",
                desc: "Personal data, credentials, orders",
              },
              {
                id: "regulated",
                label: "Regulated",
                desc: "Health, payment or similar regimes",
              },
            ]}
          />
        </Question>

        <Question
          n="04"
          q="What happens if a datacentre goes down?"
          why="Determines standby instances, failover routing and how much of the bill is redundancy."
        >
          <Choices
            value={a.availability}
            onChange={(v) => set("availability", v)}
            options={[
              {
                id: "single",
                label: "Accept downtime",
                desc: "Cheapest. One availability zone.",
              },
              {
                id: "multi-az",
                label: "Survive a zone",
                desc: "Standby in a second AZ. The usual answer.",
              },
              {
                id: "multi-region",
                label: "Survive a region",
                desc: "Full replica elsewhere. Roughly double.",
              },
            ]}
          />
        </Question>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button size="lg" onClick={onNext} icon={<ArrowRight className="h-4 w-4" />}>
          Generate the design
        </Button>
      </div>
    </StepShell>
  );
}

/* -------------------------------- pieces -------------------------------- */

function Question({
  n,
  q,
  why,
  children,
}: {
  n: string;
  q: string;
  why: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Number(n) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-white/[0.022] p-5 ring-hairline sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 font-mono text-[11px] text-gold-300/70">{n}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15.5px] font-semibold leading-snug text-white">{q}</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-white/35">{why}</p>
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}

function Derived({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-center gap-2 text-[12px] text-gold-200/70">
      <Gauge className="h-3.5 w-3.5 shrink-0" />
      {children}
    </div>
  );
}

function Choices<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ id: T; label: string; desc: string }>;
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-xl p-4 text-left transition-all duration-300",
              selected ? "bg-white/[0.07]" : "bg-white/[0.025] hover:bg-white/[0.05]",
            )}
            style={{
              boxShadow: selected
                ? "inset 0 0 0 1px rgba(229,229,229,0.55)"
                : "inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            <div
              className={cn(
                "text-[13.5px] font-semibold",
                selected ? "text-white" : "text-white/70",
              )}
            >
              {o.label}
            </div>
            <div className="mt-1 text-[11.5px] leading-relaxed text-white/35">
              {o.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}
