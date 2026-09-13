import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

/**
 * Persistent call to action for small screens.
 *
 * The header's "Deploy something" button is hidden below the `sm` breakpoint
 * to keep the bar from crowding, which leaves a phone visitor with no way to
 * reach the demo without opening the menu or scrolling to the bottom. This
 * puts it back within thumb reach.
 *
 * It stays out of the way at two points: over the hero, which already has its
 * own primary button, and over the last screenful, where the final CTA and the
 * footer links live and a floating bar would sit on top of them.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const doc = document.documentElement;
    const remaining = doc.scrollHeight - (y + window.innerHeight);
    setShow(y > 900 && remaining > 1100);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          /* Below the nav (z-50) and its mobile overlay (z-40) so an open menu
             always covers it. Padded for the home indicator on iOS. */
          className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden"
        >
          <Link
            to="/console"
            className="flex h-[54px] items-center justify-center gap-2 rounded-2xl bg-[oklch(0.922_0_0)] text-[15px] font-semibold tracking-[-0.01em] text-[oklch(0.165_0_0)] shadow-[0_18px_44px_-16px_rgba(0,0,0,0.9)] transition-[filter] duration-300 active:brightness-95"
          >
            Deploy something
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
