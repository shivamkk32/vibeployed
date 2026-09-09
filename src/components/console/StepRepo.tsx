import { motion } from "framer-motion";
import { ArrowRight, Check, FolderGit2, GitBranch, Link2 } from "lucide-react";
import { MODES, type ModeId } from "../../lib/data";
import { SAMPLE_REPOS, type RunState } from "../../lib/run";
import { Button } from "../ui/Kit";
import { StepShell, FieldLabel } from "./StepShell";
import { cn } from "../../lib/utils";

export function StepRepo({
  run,
  update,
  onNext,
}: {
  run: RunState;
  update: (p: Partial<RunState>) => void;
  onNext: () => void;
}) {
  return (
    <StepShell
      title="Point Vibeployed at a repository"
      blurb="Pick one of the sample projects, or paste any repository URL. Read access to a single repo is the whole ask."
    >
      <FieldLabel icon={FolderGit2}>Repository</FieldLabel>
      <div className="grid gap-2.5">
        {SAMPLE_REPOS.map((r, i) => {
          const selected = run.repo === r.name;
          return (
            <motion.button
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => update({ repo: r.name })}
              className={cn(
                "group relative flex min-w-0 items-center gap-4 rounded-xl px-4 py-4 text-left transition-all duration-300",
                selected
                  ? "bg-gold-500/[0.08]"
                  : "bg-white/[0.025] hover:bg-white/[0.05]",
              )}
              style={{
                boxShadow: selected
                  ? "inset 0 0 0 1px rgba(229,229,229,0.55)"
                  : "inset 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors duration-300",
                  selected ? "bg-gold-400/20" : "bg-white/[0.05]",
                )}
              >
                <FolderGit2
                  className={cn(
                    "h-4 w-4 transition-colors",
                    selected ? "text-gold-200" : "text-white/45",
                  )}
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[13px] text-white/90">
                  {r.name}
                </span>
                <span className="mt-0.5 block truncate text-[12px] text-white/40">
                  {r.desc}
                </span>
              </span>

              <span className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10.5px] text-white/50">
                  {r.lang}
                </span>
                <span className="font-mono text-[10px] text-white/25">{r.size}</span>
              </span>

              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all duration-300",
                  selected ? "bg-gold-400 text-[#0a0a0a]" : "bg-white/[0.07]",
                )}
              >
                {selected && <Check className="h-3 w-3" />}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* custom URL */}
      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-white/[0.025] px-4 py-3 ring-hairline focus-within:ring-1 focus-within:ring-gold-400/40">
        <Link2 className="h-4 w-4 shrink-0 text-white/30" />
        <input
          value={run.repo}
          onChange={(e) => update({ repo: e.target.value })}
          placeholder="or paste github.com/you/your-repo"
          className="w-full bg-transparent font-mono text-[13px] text-white/85 outline-none placeholder:text-white/25"
          aria-label="Repository URL"
        />
        <div className="hidden items-center gap-2 border-l border-white/[0.08] pl-3 sm:flex">
          <GitBranch className="h-3.5 w-3.5 text-white/30" />
          <input
            value={run.branch}
            onChange={(e) => update({ branch: e.target.value })}
            className="w-20 bg-transparent font-mono text-[13px] text-white/70 outline-none"
            aria-label="Branch"
          />
        </div>
      </div>

      {/* mode */}
      <div className="mt-10">
        <FieldLabel>How much should Vibeployed decide?</FieldLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODES.map((m, i) => {
            const selected = run.mode === m.id;
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => update({ mode: m.id as ModeId })}
                className={cn(
                  "relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300",
                  selected ? "bg-white/[0.06]" : "bg-white/[0.025] hover:bg-white/[0.045]",
                )}
                style={{
                  boxShadow: selected
                    ? `inset 0 0 0 1px rgba(${m.rgb},0.6)`
                    : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                }}
              >
                {selected && (
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full"
                    style={{
                      background: `radial-gradient(circle, rgba(${m.rgb},0.35), transparent 70%)`,
                    }}
                  />
                )}
                <div className="relative">
                  <m.icon
                    className="h-4.5 w-4.5"
                    style={{ color: selected ? m.accent : "rgba(255,255,255,0.4)" }}
                  />
                  <div className="mt-3 text-[14px] font-semibold text-white">
                    {m.name}
                  </div>
                  <div className="mt-1 text-[12px] leading-relaxed text-white/40">
                    {m.tagline}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!run.repo.trim()}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Connect a cloud account
        </Button>
      </div>
    </StepShell>
  );
}
