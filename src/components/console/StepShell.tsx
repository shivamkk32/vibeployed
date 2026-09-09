import { motion } from "framer-motion";
import type { ComponentType, ReactNode } from "react";
import { cn } from "../../lib/utils";

/** Common frame for every console step: heading, body, entrance animation. */
export function StepShell({
  title,
  blurb,
  children,
  className,
}: {
  title: string;
  blurb?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full", className)}
    >
      <h2 className="font-display font-bold text-[clamp(1.65rem,3.2vw,2.2rem)] tracking-[-0.035em] text-white">
        {title}
      </h2>
      {blurb && (
        <p className="mt-2.5 max-w-2xl text-pretty text-[14.5px] leading-relaxed text-white/45">
          {blurb}
        </p>
      )}
      <div className="mt-8">{children}</div>
    </motion.div>
  );
}

export function FieldLabel({
  children,
  icon: Icon,
  className,
}: {
  children: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35",
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </div>
  );
}
