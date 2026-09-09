import NumberFlow from "@number-flow/react";
import { useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Odometer-style figure that rolls up from zero the first time it scrolls
 * into view. NumberFlow animates digit-by-digit, so long values stay legible
 * while they move.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  /** Kept for call-site compatibility; NumberFlow owns its own timing. */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <span ref={ref} className={className}>
      <NumberFlow
        locales="en-US"
        value={inView ? value : 0}
        prefix={prefix}
        suffix={suffix}
        format={{
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }}
        transformTiming={{ duration: 900, easing: "cubic-bezier(0.16,1,0.3,1)" }}
        spinTiming={{ duration: 1100, easing: "cubic-bezier(0.16,1,0.3,1)" }}
        opacityTiming={{ duration: 350, easing: "ease-out" }}
      />
    </span>
  );
}

/** Live-updating money figure. No scroll trigger; reacts to every change. */
export function FlowingUSD({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      <NumberFlow
        locales="en-US"
        value={value}
        format={{
          style: "currency",
          currency: "USD",
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }}
        transformTiming={{ duration: 700, easing: "cubic-bezier(0.16,1,0.3,1)" }}
        spinTiming={{ duration: 850, easing: "cubic-bezier(0.16,1,0.3,1)" }}
        opacityTiming={{ duration: 300, easing: "ease-out" }}
      />
    </span>
  );
}
