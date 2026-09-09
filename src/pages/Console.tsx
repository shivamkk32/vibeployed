import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { INITIAL_RUN, STEPS, type RunState } from "../lib/run";
import { cloudById, MODES } from "../lib/data";
import { Aurora } from "../components/ui/Aurora";
import { Container } from "../components/ui/Kit";
import { Stepper } from "../components/console/Stepper";
import { StepRepo } from "../components/console/StepRepo";
import { StepCloud } from "../components/console/StepCloud";
import { StepScan } from "../components/console/StepScan";
import { StepQuestions } from "../components/console/StepQuestions";
import { StepDesign } from "../components/console/StepDesign";
import { StepDeploy } from "../components/console/StepDeploy";
import { pageTransition } from "../components/ui/ScrollToTop";

export function Console() {
  const [run, setRun] = useState<RunState>(INITIAL_RUN);
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);

  /* Stable identity. Several steps call this from inside effects. */
  const update = useCallback((patch: Partial<RunState>) => {
    setRun((prev) => {
      const next = { ...prev, ...patch };
      // Skip the state churn when nothing actually changed.
      const same = (Object.keys(patch) as Array<keyof RunState>).every(
        (k) => prev[k] === next[k],
      );
      return same ? prev : next;
    });
  }, []);

  const go = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, i));
    setStep(clamped);
    setFurthest((f) => Math.max(f, clamped));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const next = useCallback(() => go(step + 1), [go, step]);
  const back = useCallback(() => go(step - 1), [go, step]);

  const restart = useCallback(() => {
    setRun(INITIAL_RUN);
    setFurthest(0);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cloud = cloudById(run.cloud);
  const mode = MODES.find((m) => m.id === run.mode)!;

  return (
    <motion.div {...pageTransition} className="relative min-h-screen">
      <Aurora intensity={0.55} />

      <Container className="relative pb-24 pt-28 sm:pt-32">
        {/* ------------------------------- header ------------------------------ */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 text-[12.5px] text-white/40 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back to site
            </Link>
            <h1 className="mt-3 font-display font-bold text-[clamp(1.9rem,4.2vw,2.7rem)] tracking-[-0.035em] text-white">
              New deployment run
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Chip
              dot={mode.accent}
              label={`${mode.name} mode`}
            />
            <Chip dot={cloud.accent} label={`${cloud.short} · ${run.region}`} />
            <button
              onClick={restart}
              title="Start over"
              aria-label="Start over"
              className="grid h-9 w-9 place-items-center rounded-xl text-white/45 ring-hairline transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* -------------------------------- body ------------------------------- */}
        <div className="mt-9 grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <Stepper current={step} furthest={furthest} onJump={go} />
          </aside>

          <div className="glass min-w-0 min-h-[560px] rounded-3xl p-6 sm:p-9">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <StepRepo key="repo" run={run} update={update} onNext={next} />
              )}
              {step === 1 && (
                <StepCloud
                  key="cloud"
                  run={run}
                  update={update}
                  onNext={next}
                  onBack={back}
                />
              )}
              {step === 2 && (
                <StepScan
                  key="scan"
                  run={run}
                  update={update}
                  onNext={next}
                  onBack={back}
                />
              )}
              {step === 3 && (
                <StepQuestions
                  key="sizing"
                  run={run}
                  update={update}
                  onNext={next}
                  onBack={back}
                />
              )}
              {step === 4 && (
                <StepDesign
                  key="design"
                  run={run}
                  update={update}
                  onNext={next}
                  onBack={back}
                />
              )}
              {step === 5 && (
                <StepDeploy
                  key="deploy"
                  run={run}
                  update={update}
                  onRestart={restart}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}

function Chip({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-2 text-[12px] text-white/65 ring-hairline">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: dot, boxShadow: `0 0 8px 1px ${dot}66` }}
      />
      {label}
    </span>
  );
}
