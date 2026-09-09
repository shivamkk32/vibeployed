import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, ScanLine, ShieldCheck, Wrench } from "lucide-react";
import { DETECTED_STACK, SCAN_FINDINGS, SEVERITY_STYLE } from "../../lib/data";
import type { RunState } from "../../lib/run";
import { Button } from "../ui/Kit";
import { StepShell, FieldLabel } from "./StepShell";
import { cn } from "../../lib/utils";
import { BrandLogo } from "../ui/BrandLogo";

const TOTAL_FILES = 1284;

export function StepScan({
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
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(run.scanned ? 1 : 0);
  const [found, setFound] = useState(run.scanned ? SCAN_FINDINGS.length : 0);

  useEffect(() => {
    if (run.scanned) return;
    if (reduce) {
      setProgress(1);
      setFound(SCAN_FINDINGS.length);
      update({ scanned: true });
      return;
    }
    let raf = 0;
    const started = performance.now();
    const DURATION = 4200;

    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / DURATION);
      setProgress(p);
      setFound(Math.floor(p * SCAN_FINDINGS.length));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setFound(SCAN_FINDINGS.length);
        update({ scanned: true });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run.scanned, reduce, update]);

  const done = progress >= 1;
  const filesRead = Math.round(progress * TOTAL_FILES);

  return (
    <StepShell
      title={done ? "Scan complete" : "Reading the codebase"}
      blurb="Static analysis in an isolated sandbox. The checkout is destroyed when the scan finishes. Only the findings survive."
    >
      {/* progress */}
      <div className="rounded-2xl bg-white/[0.025] p-5 ring-hairline">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {done ? (
              <ShieldCheck className="h-4 w-4 text-jade-400" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-gold-300" />
            )}
            <span className="text-[13.5px] font-semibold text-white">
              {done ? `${TOTAL_FILES.toLocaleString()} files analysed` : "Analysing"}
            </span>
          </div>
          <span className="font-mono text-[12px] tabular-nums text-white/40">
            {filesRead.toLocaleString()} / {TOTAL_FILES.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-1.5 rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-jade-400"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.12, ease: "linear" }}
          />
        </div>

        <div className="mt-3 flex justify-between font-mono text-[10.5px] text-white/25">
          <span>{run.repo} · {run.branch}</span>
          <span>{found} findings</span>
        </div>
      </div>

      {/* detected stack */}
      <div className="mt-8">
        <FieldLabel icon={ScanLine}>Detected stack</FieldLabel>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {DETECTED_STACK.map((s, i) => {
            const revealed = progress > (i + 1) / (DETECTED_STACK.length + 2);
            return (
              <motion.div
                key={s.label}
                animate={{
                  opacity: revealed ? 1 : 0.18,
                  y: revealed ? 0 : 6,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5 rounded-xl bg-white/[0.025] px-3.5 py-3 ring-hairline"
              >
                <BrandLogo brand={s.brand} className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="truncate text-[10px] uppercase tracking-wider text-white/30">
                    {s.label}
                  </div>
                  <div className="truncate text-[12.5px] font-medium text-white/85">
                    {s.value}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* findings */}
      <div className="mt-8">
        <FieldLabel>
          Findings{" "}
          <span className="ml-1 font-mono normal-case tracking-normal text-white/25">
            {found} of {SCAN_FINDINGS.length}
          </span>
        </FieldLabel>

        <div className="flex flex-col gap-2.5">
          {SCAN_FINDINGS.slice(0, found).map((f) => {
            const s = SEVERITY_STYLE[f.severity];
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl bg-white/[0.025] p-4 ring-hairline"
              >
                <div className="flex items-start gap-3">
                  <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13.5px] font-medium text-white/90">
                        {f.title}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide ring-1 ring-inset",
                          s.text,
                          s.ring,
                          s.bg,
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-white/30">
                      {f.file}
                    </div>
                    <div className="mt-2.5 flex items-start gap-2 text-[12px] text-jade-200/70">
                      <Wrench className="mt-0.5 h-3 w-3 shrink-0" />
                      <span>{f.fix}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-start gap-2.5 rounded-xl bg-gold-500/[0.07] px-4 py-3.5 text-[12.5px] leading-relaxed text-gold-100/85 ring-1 ring-inset ring-gold-400/20"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          Every finding above has a fix already written into the plan you are
          about to review. Nothing is applied without your approval.
        </motion.div>
      )}

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!done}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Answer the sizing questions
        </Button>
      </div>
    </StepShell>
  );
}
