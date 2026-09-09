import { cn } from "../../lib/utils";

/**
 * The Vibeployed wordmark.
 *
 * `/logo.png` is the supplied artwork cropped to the lettering with the
 * background removed, so it drops onto any surface. The source file has wide
 * empty margins around the mark, which is the only reason it is not used raw.
 */
export function Logo({ className }: { className?: string; animated?: boolean }) {
  return (
    <img
      src="/logo.png"
      alt="Vibeployed"
      className={cn("w-auto select-none", className)}
      draggable={false}
    />
  );
}
