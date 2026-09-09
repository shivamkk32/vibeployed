import { motion } from "framer-motion";

/**
 * The faint wall of product surfaces behind the hero copy. Built from CSS
 * rather than screenshots so it stays crisp at any size and costs nothing to
 * load. Kept far below text contrast; it is texture, not content.
 *
 * Performance note: the cards used to drift continuously. Measured on a
 * throttled CPU that cost roughly half the hero's frame budget, because the
 * full-viewport radial mask below has to be re-applied on every frame that
 * anything underneath it moves. The collage now fades in once and then holds
 * still, which is what the layout wanted anyway.
 */

type Ghost = {
  /** position + size in % of the container */
  x: number;
  y: number;
  w: number;
  h: number;
  /** rows of fake UI inside the card */
  rows: number;
  /** relative emphasis, 0–1 */
  lift: number;
};

const GHOSTS: Ghost[] = [
  { x: 2, y: 8, w: 15, h: 30, rows: 4, lift: 0.5 },
  { x: 6, y: 46, w: 19, h: 34, rows: 5, lift: 0.8 },
  { x: 20, y: 2, w: 13, h: 22, rows: 3, lift: 0.35 },
  { x: 30, y: 62, w: 16, h: 30, rows: 4, lift: 0.55 },
  { x: 34, y: 4, w: 20, h: 26, rows: 5, lift: 0.7 },
  { x: 56, y: 0, w: 17, h: 30, rows: 4, lift: 0.6 },
  { x: 68, y: 40, w: 20, h: 34, rows: 5, lift: 0.85 },
  { x: 78, y: 6, w: 16, h: 24, rows: 3, lift: 0.45 },
  { x: 88, y: 52, w: 14, h: 30, rows: 4, lift: 0.4 },
  { x: 48, y: 70, w: 18, h: 26, rows: 4, lift: 0.5 },
];

export function GhostCollage() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(120% 85% at 50% 42%, transparent 22%, black 62%, black 82%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(120% 85% at 50% 42%, transparent 22%, black 62%, black 82%, transparent 100%)",
      }}
    >
      {/* Two groups so the entrance staggers without giving every card its
          own layer. */}
      {[0, 1].map((gi) => (
        <motion.div
          key={gi}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2 + gi * 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {GHOSTS.filter((_, i) => i % 2 === gi).map((g, i) => (
            <div
              key={i}
              className="absolute rounded-lg"
              style={{
                left: `${g.x}%`,
                top: `${g.y}%`,
                width: `${g.w}%`,
                height: `${g.h}%`,
                background: `oklch(1 0 0 / ${0.016 + g.lift * 0.014})`,
                boxShadow: `inset 0 0 0 1px oklch(1 0 0 / ${0.02 + g.lift * 0.022})`,
              }}
            >
              {/* title bar */}
              <div
                className="mx-[8%] mt-[9%] h-[7%] rounded-full"
                style={{
                  background: `oklch(1 0 0 / ${0.05 + g.lift * 0.05})`,
                  width: "48%",
                }}
              />
              {/* body rows */}
              <div className="mx-[8%] mt-[9%] flex flex-col gap-[5%]">
                {Array.from({ length: g.rows }).map((_, r) => (
                  <div
                    key={r}
                    className="h-[6px] rounded-full"
                    style={{
                      width: `${92 - r * 11}%`,
                      background: `oklch(1 0 0 / ${0.028 + g.lift * 0.03 - r * 0.004})`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
