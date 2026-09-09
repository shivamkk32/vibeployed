import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { CLOUDS, cloudById } from "../../lib/data";
import type { RunState } from "../../lib/run";
import { Button } from "../ui/Kit";
import { StepShell, FieldLabel } from "./StepShell";
import { cn } from "../../lib/utils";
import { BrandLogo } from "../ui/BrandLogo";

const HANDSHAKE = [
  "Generating an external ID for this run",
  "Assuming the cross-account role",
  "Verifying the granted permission set",
  "Reading account quotas and existing VPCs",
];

export function StepCloud({
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
  const cloud = cloudById(run.cloud);
  const [phase, setPhase] = useState<"idle" | "connecting" | "done">(
    run.connected ? "done" : "idle",
  );
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (phase !== "connecting") return;
    if (line >= HANDSHAKE.length) {
      const t = setTimeout(() => {
        setPhase("done");
        update({ connected: true });
      }, 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLine((v) => v + 1), 620);
    return () => clearTimeout(t);
  }, [phase, line, update]);

  const readOnly = run.mode === "audit";

  return (
    <StepShell
      title="Attach the cloud account"
      blurb={
        readOnly
          ? "Audit mode requests read-only credentials. Vibeployed will not hold a permission that can change anything."
          : "A cross-account role handshake. No long-lived keys are stored, and you can revoke it from your own console at any time."
      }
    >
      <FieldLabel>Provider</FieldLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        {CLOUDS.map((c, i) => {
          const selected = run.cloud === c.id;
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                update({ cloud: c.id, region: c.regions[0], connected: false });
                setPhase("idle");
                setLine(0);
              }}
              className={cn(
                "relative overflow-hidden rounded-xl p-5 text-left transition-all duration-300",
                selected ? "bg-white/[0.06]" : "bg-white/[0.025] hover:bg-white/[0.045]",
              )}
              style={{
                boxShadow: selected
                  ? `inset 0 0 0 1px rgba(${c.rgb},0.6)`
                  : "inset 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              {selected && (
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(${c.rgb},0.32), transparent 70%)`,
                  }}
                />
              )}
              <div className="relative flex items-start justify-between">
                <BrandLogo
                  brand={c.brand}
                  tone={selected ? "brand" : "mono"}
                  className={cn("h-8 w-8", selected ? "" : "text-white/30")}
                />
                {selected && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white/90">
                    <Check className="h-3 w-3 text-[#0a0a0a]" />
                  </span>
                )}
              </div>
              <div className="relative mt-4 text-[15px] font-semibold text-white">
                {c.short}
              </div>
              <div className="relative mt-0.5 text-[11.5px] text-white/35">
                {c.name}
              </div>
              <div className="relative mt-3 flex flex-wrap gap-1.5">
                {[c.compute, c.db].map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9.5px] text-white/45"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* region */}
      <div className="mt-9">
        <FieldLabel icon={MapPin}>Primary region</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {cloud.regions.map((r) => (
            <button
              key={r}
              onClick={() => update({ region: r })}
              className={cn(
                "rounded-lg px-3 py-2 font-mono text-[12px] transition-all duration-300",
                run.region === r
                  ? "bg-white/[0.09] text-white"
                  : "bg-white/[0.025] text-white/45 hover:bg-white/[0.05] hover:text-white/75",
              )}
              style={{
                boxShadow:
                  run.region === r
                    ? `inset 0 0 0 1px rgba(${cloud.rgb},0.5)`
                    : "inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* permission set */}
      <div className="mt-9 rounded-2xl bg-white/[0.025] p-5 ring-hairline">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "grid h-8 w-8 place-items-center rounded-lg",
              readOnly ? "bg-jade-400/15" : "bg-gold-400/15",
            )}
          >
            {readOnly ? (
              <Lock className="h-4 w-4 text-jade-300" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-gold-300" />
            )}
          </span>
          <div>
            <div className="text-[13.5px] font-semibold text-white">
              {readOnly ? "Read-only permission set" : "Provisioning permission set"}
            </div>
            <div className="text-[11.5px] text-white/35">
              Shown in full before you approve it
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#0a0a0a] p-4 font-mono text-[11.5px] leading-relaxed ring-hairline">
          <div className="text-white/30">{"{"}</div>
          <div className="pl-4 text-white/55">
            <span className="text-gold-300">"Effect"</span>: "Allow",
          </div>
          <div className="pl-4 text-white/55">
            <span className="text-gold-300">"Action"</span>: [
          </div>
          <div className="pl-8 text-jade-300/80">"ec2:Describe*", "rds:Describe*",</div>
          {readOnly ? (
            <div className="pl-8 text-jade-300/80">"s3:GetBucketPolicy", "iam:List*"</div>
          ) : (
            <div className="pl-8 text-gold-300/80">
              "ecs:*", "rds:Create*", "s3:CreateBucket", "iam:PassRole"
            </div>
          )}
          <div className="pl-4 text-white/55">]</div>
          <div className="text-white/30">{"}"}</div>
        </div>
      </div>

      {/* handshake */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  setLine(0);
                  setPhase("connecting");
                }}
              >
                Establish connection to {cloud.short}
              </Button>
            </motion.div>
          )}

          {phase !== "idle" && (
            <motion.div
              key="log"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/[0.025] p-5 ring-hairline"
            >
              <ul className="flex flex-col gap-2.5">
                {HANDSHAKE.map((h, i) => {
                  const complete = i < line || phase === "done";
                  const running = i === line && phase === "connecting";
                  if (i > line && phase !== "done") return null;
                  return (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                      className="flex items-center gap-2.5 text-[12.5px]"
                    >
                      {complete ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-jade-400" />
                      ) : running ? (
                        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-gold-300" />
                      ) : null}
                      <span className={complete ? "text-white/55" : "text-white/80"}>
                        {h}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>

              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-jade-500/[0.08] px-4 py-3 text-[12.5px] text-jade-200/90 ring-1 ring-inset ring-jade-400/20"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Connected to {cloud.short} · {run.region} · account 4471-2290-8813
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack} icon={undefined}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={phase !== "done"}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          {readOnly ? "Audit this account" : "Scan the code"}
        </Button>
      </div>
    </StepShell>
  );
}
