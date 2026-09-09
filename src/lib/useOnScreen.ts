import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Tracks whether an element is currently near the viewport.
 *
 * Continuous animations (marquees, SVG packet flows, drifting backdrops) cost
 * frame budget whether or not anyone can see them. Gating them on this hook
 * means a long page only ever pays for the section on screen. Unlike Framer's
 * `useInView({ once: true })` this keeps updating, so things stop again once
 * they scroll away.
 */
export function useOnScreen<T extends Element>(
  margin = "200px",
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return [ref, onScreen];
}
