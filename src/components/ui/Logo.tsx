import { cn } from "../../lib/utils";

/**
 * The Vibeployed logo.
 *
 * `/vibeployed-logo.png` is the supplied artwork, byte for byte. Nothing is
 * cropped, recoloured or resampled on disk. The framing below is presentation
 * only:
 *
 *  - the artwork is a wide canvas with the wordmark sitting in the lower left
 *    and a lot of empty ground around it, so it is used as a background image
 *    and the box shows only the wordmark region. The file is untouched; the
 *    browser simply draws part of it.
 *  - the ground baked into the PNG is near-black. `mix-blend-mode: screen`
 *    makes near-black blend away against our dark surfaces while leaving the
 *    cream ink bright, so no transparent version of the file is needed.
 *
 * Region shown, measured from the artwork: x 100-2230, y 660-1130 of
 * 2840 x 1472. The multipliers below fall out of those numbers.
 */

const SRC = "/vibeployed-logo.png";

/** Aspect ratio of the region we show. */
const ASPECT = 4.532;
/** How much larger the whole artwork is than the visible box. */
const SCALE_W = 6.0427;
const OFFSET_X = -0.21277;
const OFFSET_Y = -1.40427;

export function Logo({
  className,
  height = 20,
}: {
  className?: string;
  /** Rendered height of the wordmark, in px. */
  height?: number;
  animated?: boolean;
}) {
  return (
    <span
      role="img"
      aria-label="Vibeployed"
      className={cn("block shrink-0 [mix-blend-mode:screen]", className)}
      style={{
        height: `${height}px`,
        width: `${height * ASPECT}px`,
        backgroundImage: `url(${SRC})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${height * SCALE_W}px auto`,
        backgroundPosition: `${height * OFFSET_X}px ${height * OFFSET_Y}px`,
      }}
    />
  );
}

/**
 * The complete artwork, drawn in full: wordmark, the curved "Vibe & Deploy"
 * tagline and the sparkle. No cropping at all.
 */
export function LogoFull({ className }: { className?: string }) {
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
