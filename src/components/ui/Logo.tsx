import { cn } from "../../lib/utils";

/**
 * The Vibeployed logo.
 *
 * `/vibeployed-logo.png` is the supplied artwork, byte for byte. Nothing is
 * cropped, recoloured or resampled on disk. The framing below is presentation
 * only:
 *
 *  - the mark sits in the middle of a 500 x 500 canvas with empty ground all
 *    around it, so the box is positioned over the ink and the rest is left
 *    out of view. The browser draws part of the file; the file is untouched.
 *  - the ground baked into the PNG is black. `mix-blend-mode: screen` makes
 *    black blend away against our dark surfaces while leaving the white ink
 *    and the grey rule at their own values, so no transparent export is
 *    needed. A blend needs an opaque backdrop in the same stacking context,
 *    which is why the nav bar is not transparent.
 *
 * Framed region, measured from the artwork: x 91-406, y 190-301 of 500 x 500.
 * That takes in the ruled box, the "VIBEPLOYED" wordmark and the
 * "VIBE & DEPLOY" line beneath it. The multipliers fall out of those numbers.
 */

const SRC = "/vibeployed-logo.png";

/** Aspect ratio of the framed region: 315 / 111. */
const ASPECT = 2.83784;
/** How much wider the whole canvas is than the framed box: ASPECT / 0.63. */
const SCALE_W = 4.5045;
const OFFSET_X = -0.819819;
const OFFSET_Y = -1.71171;

/**
 * Within the framed box the "VIBEPLOYED" line is about 48 of 111 units tall,
 * so a 60px lockup renders roughly a 26px wordmark, which sits comfortably
 * above the 13.5px nav links rather than competing with them.
 */
export const WORDMARK_FRACTION = 48 / 111;

export function Logo({
  className,
  height = 60,
}: {
  className?: string;
  /** Rendered height of the whole lockup, in px. */
  height?: number;
  animated?: boolean;
}) {
  /*
   * Drawn as an <img> inside a clipping box rather than a background-image:
   * the browser's image path resamples better at this downscale, which keeps
   * the thin rule and the small caps clean. Still no change to the file.
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
      width={500}
      height={500}
      className={cn("h-auto w-full [mix-blend-mode:screen]", className)}
      draggable={false}
    />
  );
}
