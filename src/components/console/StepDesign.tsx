import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileCode2,
  Lightbulb,
  Rocket,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { estimate, savingsHints, totalOf } from "../../lib/cost";
import type { RunState } from "../../lib/run";
import { cloudById } from "../../lib/data";
import {
  ArchitectureDiagram,
  DetailToggle,
  type DiagramDetail,
} from "../ui/ArchitectureDiagram";
import { Button } from "../ui/Kit";
import { StepShell, FieldLabel } from "./StepShell";
import { formatUSD } from "../../lib/utils";
import { FlowingUSD } from "../ui/AnimatedNumber";

export function StepDesign({
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
  const [detail, setDetail] = useState<DiagramDetail>("hld");
  const cloud = cloudById(run.cloud);

  const lines = useMemo(
    () => estimate(run.cloud, run.answers),
    [run.cloud, run.answers],
  );
  const total = useMemo(() => totalOf(lines), [lines]);
  const hints = useMemo(() => savingsHints(run.answers, total), [run.answers, total]);
  const max = Math.max(...lines.map((l) => l.monthly));
  const ceiling = Math.ceil((total * 1.35) / 50) * 50;

  return (
    <StepShell
      title="Review the design and the bill"
      blurb="This is the complete plan. Nothing in your cloud account has been created yet. The next button is the only irreversible one in the run."
    >
      {/* -------------------------------- diagram ------------------------------ */}
      <div className="rounded-2xl bg-white/[0.022] p-4 ring-hairline sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <FieldLabel className="mb-0">
            {detail === "hld" ? "High-level design" : "Low-level design"}
          </FieldLabel>
          <DetailToggle value={detail} onChange={setDetail} />
        </div>

        <div className="relative -mx-1 overflow-x-auto pb-2">
          <div className="min-w-[720px] px-1">
            <ArchitectureDiagram detail={detail} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 font-mono text-[10.5px] text-white/30">
          <span>{cloud.short} · {run.region}</span>
          <span>{run.answers.availability}</span>
          <span>{run.answers.regions} region{run.answers.regions > 1 ? "s" : ""}</span>
          <span>{run.answers.sensitivity} data</span>
          <span>{run.repo} · {run.branch}</span>
        </div>
      </div>

      {/* ------------------------------ cost + policy -------------------------- */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]">
        {/* cost */}
        <div className="rounded-2xl bg-white/[0.022] p-5 ring-hairline sm:p-6">
          <FieldLabel>Estimated monthly cost</FieldLabel>

          <div className="flex items-baseline gap-2.5">
            <FlowingUSD
              value={Math.round(total)}
              className="font-display font-bold text-[clamp(2.2rem,4.6vw,3rem)] leading-none tracking-[-0.03em] text-white"
            />
            <span className="text-[13px] text-white/35">/ month</span>
          </div>

          <div className="mt-2 text-[12px] text-white/35">
            Budget ceiling enforced at {formatUSD(ceiling)}. The autoscaler stops
            before it gets there.
          </div>

          <ul className="mt-6 flex flex-col gap-3">
            {lines.map((l, i) => (
              <motion.li
                key={l.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] text-white/80">{l.service}</span>
                  <span className="font-mono text-[12.5px] tabular-nums text-white/60">
                    {formatUSD(l.monthly, 2)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      className="h-1 rounded-full"
                      style={{ background: l.accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(l.monthly / max) * 100}%` }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-white/25">
                    {l.detail}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* policy + savings */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-jade-500/[0.05] p-5 ring-1 ring-inset ring-jade-400/15 sm:p-6">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4.5 w-4.5 text-jade-400" />
              <span className="text-[14px] font-semibold text-white">
                Policy checks passed
              </span>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {[
                "Database is not publicly reachable",
                "All storage encrypted with managed keys",
                "No wildcard actions in any generated role",
                "Secrets moved out of source into the key store",
                "Autoscaling bounded, budget alarm attached",
              ].map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                  className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-white/60"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-jade-400" />
                  {c}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white/[0.022] p-5 ring-hairline sm:p-6">
            <div className="flex items-center gap-2.5">
              <Lightbulb className="h-4 w-4 text-bronze-300" />
              <span className="text-[14px] font-semibold text-white">
                Ways to spend less
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              {hints.map((h) => (
                <div key={h.title} className="rounded-xl bg-bronze-500/[0.05] px-3.5 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12.5px] font-semibold text-bronze-100/90">
                      {h.title}
                    </span>
                    <span className="shrink-0 font-mono text-[11.5px] text-bronze-200/80">
                      −{formatUSD(h.saves)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-white/40">
                    {h.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button className="group flex items-center justify-between gap-3 rounded-2xl bg-white/[0.022] px-5 py-4 text-left ring-hairline transition-colors hover:bg-white/[0.04]">
            <span className="flex items-center gap-2.5">
              <FileCode2 className="h-4 w-4 text-gold-300" />
              <span className="text-[13px] font-medium text-white/80">
                Export as Terraform
              </span>
            </span>
            <span className="font-mono text-[11px] text-white/30">main.tf · 412 lines</span>
          </button>
        </div>
      </div>

      {/* ------------------------------- approval ------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 flex items-start gap-3 rounded-2xl bg-bronze-500/[0.06] px-5 py-4 ring-1 ring-inset ring-bronze-400/20"
      >
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-bronze-300" />
        <p className="text-[12.5px] leading-relaxed text-bronze-100/80">
          Approving creates real resources in {cloud.short} account 4471-2290-8813
          and starts billing at your provider. In this demo nothing leaves the
          browser.
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Change my answers
        </Button>
        <Button
          size="lg"
          onClick={() => {
            update({ approved: true });
            onNext();
          }}
          icon={<Rocket className="h-4 w-4" />}
        >
          Approve and deploy
        </Button>
      </div>
    </StepShell>
  );
}
