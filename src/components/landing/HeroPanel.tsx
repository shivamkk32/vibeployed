import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Check,
  Cloud,
  GitBranch,
  Loader2,
  ScanLine,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  CLOUDS,
  DETECTED_STACK,
  SCAN_FINDINGS,
  SEVERITY_STYLE,
} from "../../lib/data";
import { cn, formatUSD } from "../../lib/utils";
import { BrandLogo } from "../ui/BrandLogo";

const FRAMES = [
  { id: "connect", label: "Connect", icon: GitBranch, ms: 4200 },
  { id: "scan", label: "Scan", icon: ScanLine, ms: 5200 },
  { id: "design", label: "Design + cost", icon: Wallet, ms: 5600 },
] as const;

/**
 * The floating app window in the hero. Cycles through the three moments
 * that matter (connect, scan, price) so the value is legible in ~15s
 * without anyone clicking anything.
 */
export function HeroPanel() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setI((v) => (v + 1) % FRAMES.length), FRAMES[i].ms);
    return () => clearTimeout(t);
  }, [i, reduce]);

  const frame = FRAMES[i];

  return (
    <div className="relative">
      {/* glow bed */}
      <div
        className="pointer-events-none absolute -inset-x-10 -bottom-10 -top-6 rounded-[2rem]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 45%, rgba(229,229,229,0.09), transparent 72%)",
        }}
      />

      {/* Opaque: a translucent panel let the ambient wash bleed through and
          tinted the whole interface amber. */}
      <div className="glass relative overflow-hidden rounded-2xl bg-[#131313]">
        {/* title bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
          <div className="flex gap-1.5">
            {["#f26d6d", "#9e9e9e", "#bdbdbd"].map((c) => (
              <span
                key={c}
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: c, opacity: 0.65 }}
              />
            ))}
          </div>
          <div className="ml-1 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2.5 py-1">
            <ShieldCheck className="h-3 w-3 shrink-0 text-jade-400" />
            <span className="truncate font-mono text-[11px] text-white/45">
              app.vibeployed.com/run/8f2c
            </span>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            {FRAMES.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => setI(idx)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10.5px] font-medium transition-colors duration-300",
                  idx === i
                    ? "bg-white/10 text-white"
                    : "text-white/35 hover:text-white/70",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* progress bar for the current frame */}
        <div className="h-px w-full bg-white/[0.06]">
          {/* scaleX, not width: animating width relayouts the panel on every
              frame for the whole life of each slide. */}
          <motion.div
            key={`${frame.id}-bar`}
            className="h-px w-full origin-left bg-gradient-to-r from-gold-400 to-gold-300"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduce ? 0 : frame.ms / 1000, ease: "linear" }}
          />
        </div>

        <div className="relative h-[366px] overflow-hidden p-4 sm:h-[352px] sm:p-5">
          <AnimatePresence mode="wait">
            {frame.id === "connect" && <ConnectFrame key="connect" />}
            {frame.id === "scan" && <ScanFrame key="scan" />}
            {frame.id === "design" && <DesignFrame key="design" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const swap = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

/* ------------------------------ frame 1 ------------------------------- */

function ConnectFrame() {
  return (
    <motion.div {...swap} className="flex h-full flex-col gap-4">
      <Row label="Repository">
        <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-3 py-2.5 ring-hairline">
          <GitBranch className="h-3.5 w-3.5 text-gold-300" />
          <span className="font-mono text-[12px] text-white/80">
            acme/checkout-api
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-jade-300">
            <Check className="h-3 w-3" /> connected
          </span>
        </div>
      </Row>

      <Row label="Cloud account">
        <div className="grid grid-cols-3 gap-2">
          {CLOUDS.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.08, duration: 0.5 }}
              className={cn(
                "relative overflow-hidden rounded-lg px-2.5 py-2.5 text-center ring-hairline transition-colors",
                idx === 0 ? "bg-white/[0.07]" : "bg-white/[0.02]",
              )}
              style={
                idx === 0
                  ? { boxShadow: `inset 0 0 0 1px rgba(${c.rgb},0.5)` }
                  : undefined
              }
            >
              <BrandLogo
                brand={c.brand}
                tone={idx === 0 ? "brand" : "mono"}
                className={cn(
                  "mx-auto mb-1.5 h-5 w-5",
                  idx === 0 ? "opacity-100" : "text-white/35",
                )}
              />
              <div
                className={cn(
                  "text-[11px] font-semibold",
                  idx === 0 ? "text-white" : "text-white/40",
                )}
              >
                {c.short}
              </div>
            </motion.div>
          ))}
        </div>
      </Row>

      <Row label="Detected stack">
        <div className="flex flex-wrap gap-1.5">
          {DETECTED_STACK.map((s, idx) => (
            <motion.span
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.07, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-1.5 text-[11px] text-white/65 ring-hairline"
            >
              <BrandLogo brand={s.brand} className="h-3.5 w-3.5" />
              {s.value}
            </motion.span>
          ))}
        </div>
      </Row>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-auto flex items-center gap-2 rounded-lg bg-jade-500/[0.07] px-3 py-2.5 text-[11.5px] text-jade-200/90 ring-1 ring-inset ring-jade-400/20"
      >
        <Cloud className="h-3.5 w-3.5" />
        Role assumed with provisioning scope. Nothing created yet.
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------ frame 2 ------------------------------- */

function ScanFrame() {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setN(SCAN_FINDINGS.length);
      return;
    }
    if (n >= SCAN_FINDINGS.length) return;
    const t = setTimeout(() => setN((v) => v + 1), 380);
    return () => clearTimeout(t);
  }, [n, reduce]);

  const done = n >= SCAN_FINDINGS.length;

  return (
    <motion.div {...swap} className="relative flex h-full flex-col gap-3">
      {/* scan sweep */}
      {!done && (
        <div className="pointer-events-none absolute inset-x-0 top-8 h-14 animate-[sweep_3.4s_ease-in-out_infinite] bg-[linear-gradient(180deg,transparent,rgba(189,189,189,0.10),transparent)]" />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] font-medium text-white/75">
          {done ? (
            <ShieldCheck className="h-3.5 w-3.5 text-jade-400" />
          ) : (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-jade-400" />
          )}
          {done ? "Scan complete" : "Scanning 1,284 files"}
        </div>
        <span className="font-mono text-[11px] text-white/35">
          {n}/{SCAN_FINDINGS.length} findings
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
        {SCAN_FINDINGS.slice(0, n).map((f) => {
          const s = SEVERITY_STYLE[f.severity];
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-2.5 rounded-lg bg-white/[0.03] px-2.5 py-2 ring-hairline"
            >
              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11.5px] text-white/80">{f.title}</div>
                <div className="truncate font-mono text-[10px] text-white/35">
                  {f.file}
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 text-[9.5px] font-medium ring-1 ring-inset",
                  s.text,
                  s.ring,
                  s.bg,
                )}
              >
                {s.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg bg-gold-500/[0.08] px-3 py-2.5 text-[11.5px] text-gold-100/90 ring-1 ring-inset ring-gold-400/20"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          All six resolved automatically in the generated plan.
        </motion.div>
      )}
    </motion.div>
  );
}

/* ------------------------------ frame 3 ------------------------------- */

const LINES = [
  { s: "ECS Fargate", q: "4 replicas", v: 109.6, c: "#ededed" },
  { s: "Aurora Postgres", q: "primary + standby", v: 150.9, c: "#bdbdbd" },
  { s: "CloudFront + WAF", q: "0.87 TB egress", v: 71.9, c: "#f5f5f5" },
  { s: "Redis", q: "2 GB node", v: 31.0, c: "#9e9e9e" },
  { s: "Worker pool", q: "2 replicas", v: 43.6, c: "#f26d6d" },
];

function DesignFrame() {
  const total = LINES.reduce((a, b) => a + b.v, 0) + 30.8;

  return (
    <motion.div {...swap} className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-white/75">
          Estimated monthly cost
        </span>
        <span className="rounded-full bg-jade-500/10 px-2 py-0.5 text-[10px] font-medium text-jade-200 ring-1 ring-inset ring-jade-400/25">
          under your $600 ceiling
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-display font-bold text-[40px] leading-none tracking-[-0.03em] text-white"
        >
          {formatUSD(total)}
        </motion.span>
        <span className="text-[12px] text-white/40">/ month</span>
      </div>

      {/* stacked share bar */}
      <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.05]">
        {LINES.map((l, idx) => (
          <motion.div
            key={l.s}
            initial={{ width: 0 }}
            animate={{ width: `${(l.v / total) * 100}%` }}
            transition={{ delay: 0.2 + idx * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: l.c }}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        {LINES.map((l, idx) => (
          <motion.div
            key={l.s}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28 + idx * 0.07, duration: 0.45 }}
            className="flex items-center gap-2.5 py-1.5"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: l.c }}
            />
            <span className="text-[11.5px] text-white/75">{l.s}</span>
            <span className="truncate font-mono text-[10px] text-white/30">{l.q}</span>
            <span className="ml-auto font-mono text-[11.5px] tabular-nums text-white/60">
              {formatUSD(l.v, 2)}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2 rounded-lg bg-bronze-500/[0.07] px-3 py-2.5 text-[11.5px] text-bronze-100/90 ring-1 ring-inset ring-bronze-400/20"
      >
        <Wallet className="h-3.5 w-3.5" />
        Scale workers to zero overnight to save ~$26/mo.
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- shared ------------------------------- */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
        {label}
      </span>
      {children}
    </div>
  );
}
