import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useOnScreen } from "../../lib/useOnScreen";

/**
 * Seamless infinite scroller: one track holding two identical copies,
 * translated by exactly -50% (= one copy) per cycle. Pauses on hover.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  /* A marquee that is nowhere near the viewport still burns frame budget on
     every scroll tick, so it only runs while it is on screen. */
  const [ref, onScreen] = useOnScreen<HTMLDivElement>("300px");

  return (
    <div
      ref={ref}
      className={cn("group relative overflow-hidden mask-fade-x", className)}
    >
      <div
        className="flex w-max group-hover:[animation-play-state:paused]"
        style={{
          contain: "layout paint",
          animation: `marquee ${speed}s linear infinite${reverse ? " reverse" : ""}`,
          animationPlayState: onScreen ? "running" : "paused",
        }}
      >
        <div className="flex shrink-0 items-center gap-14 pr-14">{children}</div>
        <div className="flex shrink-0 items-center gap-14 pr-14" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
