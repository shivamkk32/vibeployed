import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { ARCH_EDGES, ARCH_NODES } from "../../lib/data";
import { cn } from "../../lib/utils";
import { useOnScreen } from "../../lib/useOnScreen";

const COLS = 5;
const ROWS = 3;
/** Half the node card width. Wires stop at the card edge, not its centre. */
const NODE_HALF = 68;

export type DiagramDetail = "hld" | "lld";

/** Extra resource specifics revealed in low-level view. */
const LLD_SPECS: Record<string, string[]> = {
  users: ["TLS 1.3", "HTTP/3"],
  cdn: ["300+ PoPs", "OWASP ruleset", "5 min TTL"],
  lb: ["ALB, 2 AZs", "ACM certificate", "Drain 30s"],
  api: ["1 vCPU / 2 GB", "min 2, max 12", "Target 65% CPU"],
  worker: ["0.5 vCPU / 1 GB", "min 0, max 6", "SQS-triggered"],
  db: ["db.r6g.large", "gp3, 100 GB", "PITR 7 days"],
  cache: ["cache.t4g.small", "2 GB, TLS on", "AOF disabled"],
  bucket: ["Versioning on", "SSE-KMS", "Public access blocked"],
};

/** Protocol labels drawn on the wires in low-level view. */
const EDGE_LABELS: Record<string, string> = {
  "users>cdn": "443",
  "cdn>lb": "443",
  "lb>api": "8080",
  "lb>worker": "queue",
  "api>db": "5432",
  "api>cache": "6379",
  "worker>db": "5432",
  "worker>bucket": "S3 API",
};

type Pt = { x: number; y: number };

export function ArchitectureDiagram({
  detail = "hld",
  className,
  animate = true,
}: {
  detail?: DiagramDetail;
  className?: string;
  animate?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  /* SMIL packet motion and the dashed stroke repaint the SVG every frame, so
     they are gated on visibility rather than left running down the page. */
  const [screenRef, onScreen] = useOnScreen<HTMLDivElement>("150px");
  const flowing = animate && !reduce && onScreen;
  /* One trigger for the whole lattice. A per-node whileInView left the lower
     rows stuck at opacity 0 whenever the diagram was taller than the fold. */
  const inView = useInView(wrapRef, { once: true, amount: 0.15 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const center = (col: number, row: number): Pt => ({
    x: ((col + 0.5) / COLS) * size.w,
    y: ((row + 0.5) / ROWS) * size.h,
  });

  const pointOf = (id: string) => {
    const n = ARCH_NODES.find((x) => x.id === id)!;
    return center(n.col, n.row);
  };

  const ready = size.w > 0 && size.h > 0;

  /** Which edges touch the hovered node, used to dim the rest. */
  const isLit = (a: string, b: string) =>
    !hovered || hovered === a || hovered === b;

  return (
    <div
      ref={(node) => {
        wrapRef.current = node;
        screenRef.current = node;
      }}
      className={cn(
        "relative h-[380px] w-full sm:h-[440px] lg:h-[470px]",
        className,
      )}
    >
      {/* ------------------------------ wires ------------------------------ */}
      {ready && (
        <svg
          className="pointer-events-none absolute inset-0"
          width={size.w}
          height={size.h}
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-wire`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e5e5e5" stopOpacity="0.75" />
              <stop offset="55%" stopColor="#f5f5f5" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#bdbdbd" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {ARCH_EDGES.map(([a, b], i) => {
            const c1 = pointOf(a);
            const c2 = pointOf(b);
            // Anchor on facing edges so the wire never runs under a card.
            const p1 = { x: c1.x + NODE_HALF, y: c1.y };
            const p2 = { x: c2.x - NODE_HALF, y: c2.y };
            const dx = Math.max(34, (p2.x - p1.x) * 0.5);
            const d = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
            const pathId = `${uid}-p${i}`;
            const lit = isLit(a, b);

            return (
              <g key={pathId} opacity={lit ? 1 : 0.18} className="transition-opacity duration-300">
                <path id={pathId} d={d} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} />
                <motion.path
                  d={d}
                  fill="none"
                  stroke={`url(#${uid}-wire)`}
                  strokeWidth={1.5}
                  strokeDasharray="5 9"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                  transition={{ duration: 1, delay: 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  style={flowing ? { animation: "dash 2.6s linear infinite" } : undefined}
                />

                {/* travelling packet */}
                {flowing && (
                  <circle r={2} fill="#f5f5f5" opacity={0.75}>
                    <animateMotion
                      dur={`${2.6 + (i % 3) * 0.5}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.32}s`}
                      keyPoints="0;1"
                      keyTimes="0;1"
                      calcMode="linear"
                    >
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  </circle>
                )}

                {detail === "lld" && EDGE_LABELS[`${a}>${b}`] && (
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 - 9}
                    textAnchor="middle"
                    className="fill-white/40 font-mono"
                    style={{ fontSize: 9.5 }}
                  >
                    {EDGE_LABELS[`${a}>${b}`]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* ------------------------------ nodes ------------------------------ */}
      {ready &&
        ARCH_NODES.map((n, i) => {
          const p = center(n.col, n.row);
          const lit = !hovered || hovered === n.id;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.82 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.6, delay: i * 0.075, ease: [0.16, 1, 0.3, 1] }}
              onPointerEnter={() => setHovered(n.id)}
              onPointerLeave={() => setHovered(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-default"
              style={{ left: p.x, top: p.y, opacity: lit ? 1 : 0.32 }}
            >
              <NodeCard node={n} detail={detail} />
            </motion.div>
          );
        })}
    </div>
  );
}

function NodeCard({
  node,
  detail,
}: {
  node: (typeof ARCH_NODES)[number];
  detail: DiagramDetail;
}) {
  return (
    <div
      className="group relative w-[112px] rounded-xl bg-[#1c1c1c] px-2.5 py-2.5 text-center transition-all duration-300 hover:-translate-y-0.5 sm:w-[134px] sm:px-3"
      style={{ boxShadow: `inset 0 0 0 1px rgba(${node.rgb},0.30)` }}
    >
      {/* halo */}
      <div
        className="pointer-events-none absolute -inset-3 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, rgba(${node.rgb},0.35), transparent 70%)` }}
      />

      <div className="relative mx-auto mb-1.5 grid h-8 w-8 place-items-center rounded-lg" style={{ background: `rgba(${node.rgb},0.13)` }}>
        <node.icon className="relative h-4 w-4" style={{ color: node.accent }} />
      </div>

      <div className="text-[11.5px] font-semibold leading-tight text-white/90">
        {node.label}
      </div>
      <div className="mt-0.5 text-[9.5px] leading-tight text-white/35">{node.sub}</div>

      <AnimatePresence>
        {detail === "lld" && (
          <motion.ul
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.07] pt-2"
          >
            {(LLD_SPECS[node.id] ?? []).map((s) => (
              <li key={s} className="font-mono text-[8.5px] leading-[1.5] text-white/45">
                {s}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Small segmented control for switching between the two views. */
export function DetailToggle({
  value,
  onChange,
  className,
}: {
  value: DiagramDetail;
  onChange: (v: DiagramDetail) => void;
  className?: string;
}) {
  const opts: Array<{ id: DiagramDetail; label: string; hint: string }> = [
    { id: "hld", label: "High level", hint: "The shape" },
    { id: "lld", label: "Low level", hint: "Every resource" },
  ];

  return (
    <div className={cn("glass inline-flex gap-1 rounded-full p-1", className)}>
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          title={o.hint}
          className={cn(
            "relative rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-colors duration-300",
            value === o.id ? "text-[#0a0a0a]" : "text-white/55 hover:text-white",
          )}
        >
          {value === o.id && (
            <motion.span
              layoutId="detail-pill"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-300 to-gold-200"
            />
          )}
          <span className="relative z-10">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
