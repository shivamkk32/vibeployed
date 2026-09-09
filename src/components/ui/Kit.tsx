import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Magnetic } from "./Magnetic";

/* ------------------------------- Badge -------------------------------- */

export function Badge({
  children,
  className,
  tone = "violet",
}: {
  children: ReactNode;
  className?: string;
  tone?: "violet" | "cyan" | "mint" | "amber" | "rose" | "neutral";
}) {
  const tones: Record<string, string> = {
    violet: "text-gold-200 ring-gold-400/25 bg-gold-500/10",
    cyan: "text-gold-200 ring-gold-400/25 bg-gold-500/10",
    mint: "text-jade-200 ring-jade-400/25 bg-jade-500/10",
    amber: "text-bronze-200 ring-bronze-400/25 bg-bronze-500/10",
    rose: "text-clay-200 ring-clay-400/25 bg-clay-500/10",
    neutral: "text-white/70 ring-white/15 bg-white/5",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------- Eyebrow / pill ---------------------------- */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.04] px-3.5 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.18em] text-white/60 ring-hairline">
      <span className="h-1 w-1 rounded-full bg-gold-400" />
      {children}
    </div>
  );
}

/* ------------------------------ Button -------------------------------- */

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  icon?: ReactNode;
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  magnetic = false,
  icon,
  ...rest
}: ButtonProps) {
  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-sm",
    lg: "h-[52px] px-7 text-[15px]",
  };

  const base = cn(
    "group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-tight",
    "transition-[transform,box-shadow,background-color,color] duration-300 active:scale-[0.975]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]",
    "disabled:pointer-events-none disabled:opacity-45",
    sizes[size],
  );

  const variants = {
    primary: cn(
      "text-[#131313]",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22)]",
      "hover:brightness-[1.07]",
    ),
    outline:
      "text-white/85 ring-hairline bg-white/[0.03] hover:bg-white/[0.07] hover:text-white",
    ghost: "text-white/65 hover:text-white hover:bg-white/[0.05]",
  };

  const inner = (
    <button
      className={cn(base, variants[variant], className)}
      /* The fill lives on the button itself. As a -z-10 child it painted
         behind any ancestor that had its own background (the contact form),
         which made the button look empty. */
      style={
        variant === "primary"
          ? {
              background:
                "linear-gradient(165deg, var(--color-gold-300), var(--color-gold-400))",
            }
          : undefined
      }
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && (
          <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
            {icon}
          </span>
        )}
      </span>
    </button>
  );

  return magnetic ? <Magnetic strength={0.22}>{inner}</Magnetic> : inner;
}

/* --------------------------- Section header --------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  accent,
  blurb,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  accent?: ReactNode;
  blurb?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "font-display font-bold text-balance text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.08] tracking-[-0.035em] text-white",
          align === "center" ? "max-w-3xl" : "max-w-2xl",
        )}
      >
        {title}{" "}
        {accent && <span className="accent-text">{accent}</span>}
      </motion.h2>
      {blurb && (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "text-pretty text-[15.5px] leading-relaxed text-white/55",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {blurb}
        </motion.p>
      )}
    </div>
  );
}

/* ------------------------------ Container ----------------------------- */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1180px] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
