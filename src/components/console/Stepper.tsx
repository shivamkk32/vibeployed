import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { STEPS } from "../../lib/run";
import { cn } from "../../lib/utils";

export function Stepper({
  current,
  furthest,
  onJump,
}: {
  current: number;
  furthest: number;
  onJump: (i: number) => void;
}) {
  return (
    <nav aria-label="Deployment progress">
      {/* ---------------------------- desktop rail --------------------------- */}
      <ol className="hidden lg:flex lg:flex-col lg:gap-1">
        {STEPS.map((s, i) => {
          const done = i < furthest;
          const active = i === current;
          const reachable = i <= furthest;

          return (
            <li key={s.id}>
              <button
                disabled={!reachable}
                onClick={() => reachable && onJump(i)}
                className={cn(
                  "group relative flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors duration-300",
                  reachable ? "cursor-pointer" : "cursor-not-allowed",
                  active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="step-marker"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    className="absolute inset-y-2 left-0 w-[2.5px] rounded-full bg-gradient-to-b from-gold-400 to-gold-300"
                  />
                )}

                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-all duration-300",
                    done
                      ? "bg-jade-400/15 text-jade-300 ring-1 ring-inset ring-jade-400/35"
                      : active
                        ? "bg-gradient-to-br from-gold-400 to-gold-300 text-[#0a0a0a]"
                        : "bg-white/[0.05] text-white/35",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>

                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[13.5px] font-semibold transition-colors",
                      active ? "text-white" : reachable ? "text-white/65" : "text-white/30",
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="block truncate text-[11.5px] text-white/30">
                    {s.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ----------------------------- mobile bar ---------------------------- */}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] font-semibold text-white">
            {STEPS[current].label}
          </span>
          <span className="font-mono text-[11px] text-white/35">
            {current + 1} / {STEPS.length}
          </span>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              disabled={i > furthest}
              onClick={() => i <= furthest && onJump(i)}
              aria-label={s.label}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.08]"
            >
              <motion.span
                className="block h-1 rounded-full bg-gradient-to-r from-gold-400 to-gold-300"
                initial={false}
                animate={{ width: i <= current ? "100%" : "0%" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
