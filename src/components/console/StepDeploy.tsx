import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  PartyPopper,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { DEPLOY_STEPS } from "../../lib/cost";
import { cloudById } from "../../lib/data";
import type { RunState } from "../../lib/run";
import { Button } from "../ui/Kit";
import { StepShell, FieldLabel } from "./StepShell";
import { cn } from "../../lib/utils";

export function StepDeploy({
  run,
  update,
  onRestart,
}: {
  run: RunState;
  update: (p: Partial<RunState>) => void;
  onRestart: () => void;
}) {
  const cloud = cloudById(run.cloud);
  const reduce = useReducedMotion();
  const [done, setDone] = useState(run.deployed ? DEPLOY_STEPS.length : 0);
  const logRef = useRef<HTMLDivElement>(null);

  const finished = done >= DEPLOY_STEPS.length;

  useEffect(() => {
    if (finished) {
      if (!run.deployed) update({ deployed: true });
      return;
    }
    const t = setTimeout(() => setDone((v) => v + 1), reduce ? 40 : 420);
    return () => clearTimeout(t);
  }, [done, finished, reduce, run.deployed, update]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [done]);

  return (
    <StepShell
      title={finished ? "It is live" : "Provisioning"}
      blurb={
        finished
          ? "Every resource in the approved plan exists, health checks passed, and the rollback point is stored."
          : "Running the approved plan stage by stage. A failure here halts the run and rolls back rather than leaving half a stack behind."
      }
    >
      {/* ------------------------------- the log ------------------------------- */}
      <div className="overflow-hidden rounded-2xl bg-[#0a0a0a] ring-hairline">
        <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
          <Terminal className="h-3.5 w-3.5 text-white/35" />
          <span className="font-mono text-[11.5px] text-white/45">
            provision · {cloud.short} · {run.region}
          </span>
          <span className="ml-auto font-mono text-[11px] text-white/30">
            {Math.min(done, DEPLOY_STEPS.length)} / {DEPLOY_STEPS.length}
          </span>
        </div>

        <div
          ref={logRef}
          className="max-h-[300px] overflow-y-auto p-4 font-mono text-[12px] leading-[1.9]"
        >
          {DEPLOY_STEPS.slice(0, done + 1).map((s, i) => {
            const complete = i < done;
            const running = i === done && !finished;
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5"
              >
                {complete ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-jade-400" />
                ) : running ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-gold-300" />
                ) : (
                  <span className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className={complete ? "text-white/40" : "text-white/85"}>
                  {s}
                </span>
                {complete && (
                  <span className="ml-auto shrink-0 text-[10.5px] text-white/20">
                    {(0.4 + (i % 7) * 0.31).toFixed(1)}s
                  </span>
                )}
              </motion.div>
            );
          })}
          {!finished && (
            <span className="ml-6 inline-block h-3.5 w-[7px] translate-y-0.5 animate-[blink_1.1s_step-end_infinite] bg-gold-300/80" />
          )}
        </div>
      </div>

      {/* ------------------------------- success ------------------------------- */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-6 overflow-hidden rounded-2xl bg-white/[0.025] p-6 ring-hairline sm:p-8"
          >
            <motion.div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(189,189,189,0.28), transparent 70%)",
              }}
              animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              <div className="flex items-center gap-2.5">
                <PartyPopper className="h-5 w-5 text-jade-400" />
                <span className="font-display font-bold text-[21px] tracking-[-0.03em] text-white">
                  Deployment successful
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2.5 rounded-xl bg-[#0a0a0a] px-4 py-3.5 ring-hairline">
                <span className="h-2 w-2 shrink-0 rounded-full bg-jade-400 shadow-[0_0_10px_2px_rgba(189,189,189,0.6)]" />
                <span className="font-mono text-[13px] text-white/85">
                  https://checkout-api.vibeployed.app
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <IconBtn label="Copy URL">
                    <Copy className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Open">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </IconBtn>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  { k: "Resources created", v: "31" },
                  { k: "Total time", v: "6m 12s" },
                  { k: "Findings resolved", v: "6 / 6" },
                  { k: "Rollback point", v: "stored" },
                ].map((m, i) => (
                  <motion.div
                    key={m.k}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                    className="rounded-xl bg-white/[0.03] px-4 py-3.5"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-white/30">
                      {m.k}
                    </div>
                    <div className="mt-1 font-ui text-[17px] font-semibold text-white">
                      {m.v}
                    </div>
                  </motion.div>
                ))}
              </div>

              <FieldLabel className="mt-7">What happens now</FieldLabel>
              <ul className="flex flex-col gap-2">
                {[
                  "Drift detection is watching this account continuously",
                  "Budget alarms fire before the ceiling, not after",
                  "The Terraform for this stack is yours to export",
                ].map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-white/55"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" />
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button onClick={onRestart} icon={<RotateCcw className="h-4 w-4" />}>
                  Run it again
                </Button>
                <a href="/#pricing">
                  <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
                    See pricing
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </StepShell>
  );
}

function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg text-white/45",
        "transition-colors duration-300 hover:bg-white/[0.07] hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
