import { motion } from "framer-motion";
import type { FC } from "react";
import { cn } from "../../lib/utils";

const STAGGER = 0.035;

/**
 * Letter-by-letter roll on hover: the visible row lifts out while an
 * identical row rises to replace it. `center` staggers outward from the
 * middle instead of left-to-right.
 *
 * Adapted from Skiper UI (Skiper58) by @gurvinder-singh02, https://gxuri.me
 * Attribution required by the Skiper UI free licence.
 */
export const TextRoll: FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => {
  const letters = children.split("");
  const delayFor = (i: number) =>
    center
      ? STAGGER * Math.abs(i - (letters.length - 1) / 2)
      : STAGGER * i;

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      /* Leading has to clear ascenders and descenders: the container clips to
         make the roll work, so anything tighter shaves the tops off glyphs. */
      style={{ lineHeight: 1.35 }}
    >
      <span className="block">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4, delay: delayFor(i) }}
            className="inline-block"
          >
            {l === " " ? " " : l}
          </motion.span>
        ))}
      </span>
      <span className="absolute inset-0 block" aria-hidden>
        {letters.map((l, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4, delay: delayFor(i) }}
            className="inline-block"
          >
            {l === " " ? " " : l}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
};
