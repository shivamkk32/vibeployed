import { useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useOnScreen } from "../../lib/useOnScreen";

/**
 * The ambient ground: two very low-opacity warm fields drifting slowly behind
 * a faint blueprint rule and film grain. Deliberately restrained: it should
 * read as depth in the material, not as a light show.
 */
export function Aurora({
  className,
  intensity = 1,
  grid = true,
}: {
  className?: string;
  intensity?: number;
  grid?: boolean;
}) {
  const reduce = useReducedMotion();
  const [ref, onScreen] = useOnScreen<HTMLDivElement>("200px");
  const play = !reduce && onScreen;

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden grain",
        className,
      )}
      aria-hidden
    >
      {grid && (
        <div className="absolute inset-0 grid-lines mask-fade-b opacity-60" />
      )}

      {/* Upper-left field.

          These carried `filter: blur(150px)` on a 44rem box. A blur that size
          repaints an enormous layer every frame it moves, and two of them
          dominated the frame budget. A radial gradient already falls off
          softly, so the blur bought nothing visually, and the drift is now a
          pure transform that the compositor handles for free. */}
      <div
        className="absolute -top-[26%] left-[4%] h-[48rem] w-[48rem] will-change-transform"
        style={{
          opacity: 0.55 * intensity,
          background:
            "radial-gradient(closest-side, oklch(0.65 0 0 / 0.13), oklch(0.65 0 0 / 0.05) 46%, transparent 72%)",
          animation: play ? "drift 30s ease-in-out infinite" : undefined,
        }}
      />

      {/* Lower-right field */}
      <div
        className="absolute bottom-[-28%] right-[2%] h-[44rem] w-[44rem] will-change-transform"
        style={{
          opacity: 0.5 * intensity,
          background:
            "radial-gradient(closest-side, oklch(0.55 0 0 / 0.12), oklch(0.55 0 0 / 0.04) 48%, transparent 74%)",
          animation: play ? "drift 38s ease-in-out infinite reverse" : undefined,
        }}
      />

      {/* a single static hairline of light along the top edge */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(229,229,229,0.20), transparent)",
        }}
      />
    </div>
  );
}
