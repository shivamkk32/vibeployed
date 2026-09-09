import { cn } from "../../lib/utils";

/**
 * The Vibeployed logo.
 *
 * `/vibeployed-logo.png` is the supplied artwork, byte for byte. Nothing is
 * cropped, recoloured or resampled on disk. The framing below is presentation
 * only:
 *
 *  - the artwork sits on a much larger canvas than the ink uses, so the box
 *    is positioned over the ink and the empty ground around it is left out of
 *    view. The browser draws part of the file; the file is untouched.
 *  - the ground baked into the PNG is near-black. `mix-blend-mode: screen`
 *    makes near-black blend away against our dark surfaces while leaving the
 *    cream ink at its own colour, so no transparent export is needed.
 *
 * The framed region is the full ink bounds, measured from the artwork:
 * x 100-2510, y 466-1226 of 2840 x 1472. That takes in the wordmark, the
 * curved "Vibe & Deploy" tagline and the sparkle. The multipliers below fall
 * straight out of those numbers.
 */

const SRC = "/vibeployed-logo.png";

/** Aspect ratio of the framed region. */
const ASPECT = 3.1711;
/** How much wider the whole canvas is than the framed box. */
const SCALE_W = 3.73687;
const OFFSET_X = -0.131573;
const OFFSET_Y = -0.613172;

/**
 * Within the framed region the wordmark itself is 440 of 760 units tall, so
 * a caller asking for a 20px wordmark needs a 34.5px box.
 */
export const WORDMARK_RATIO = 760 / 440;

export function Logo({
  className,
  height = 52,
}: {
  className?: string;
  /** Rendered height of the whole lockup, in px. */
  height?: number;
  animated?: boolean;
}) {
  /*
   * The artwork is 2840px wide and lands here around 165px, a ~17x downscale.
   * A background-image is resampled in one step at that ratio and visibly
   * aliases the thin tagline strokes, so the image is an <img> inside a
   * clipping box instead: same framing, but the browser uses its higher
   * quality image path. Still no change to the file.
   */
  return (
    <span
      role="img"
      aria-label="Vibeployed, vibe and deploy"
      className={cn(
        "relative block shrink-0 overflow-hidden [mix-blend-mode:screen]",
        className,
      )}
      style={{ height: `${height}px`, width: `${height * ASPECT}px` }}
    >
      <img
        src={SRC}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute max-w-none select-none"
        style={{
          width: `${height * SCALE_W}px`,
          left: `${height * OFFSET_X}px`,
          top: `${height * OFFSET_Y}px`,
        }}
      />
    </span>
  );
}

/** The entire file as-is, including its empty ground. For large placements. */
export function LogoRaw({ className }: { className?: string }) {
  return (
    <img
      src={SRC}
      alt="Vibeployed, vibe and deploy"
      width={2840}
      height={1472}
      className={cn("h-auto w-full [mix-blend-mode:screen]", className)}
      draggable={false}
    />
  );
}
