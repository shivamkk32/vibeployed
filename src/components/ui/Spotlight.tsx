import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/utils";

/**
 * Card that lights a soft radial follow-glow under the cursor and lifts
 * its gradient hairline border on hover.
 */
export function SpotlightCard({
  children,
  className,
  glow = "229,229,229",
  radius = 380,
  style,
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
  radius?: number;
  style?: CSSProperties;
}) {
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);

  const bg = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(${glow},0.16), transparent 72%)`;
  const border = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(${glow},0.85), transparent 68%)`;

  return (
    <motion.div
      style={style}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-9999);
        my.set(-9999);
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white/[0.022] ring-hairline",
        "transition-transform duration-500 will-change-transform hover:-translate-y-1",
        className,
      )}
    >
      {/* animated 1px gradient border (mask-composite ring) */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: border,
          padding: 1,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* glow wash */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: bg }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
