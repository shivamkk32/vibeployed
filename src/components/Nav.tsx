import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "./ui/Kit";
import { Logo } from "./ui/Logo";
import { TextRoll } from "./ui/TextRoll";
import { cn } from "../lib/utils";

const LINKS = [
  { label: "How it works", href: "/#how" },
  { label: "Modes", href: "/#modes" },
  { label: "Security", href: "/#security" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <div
          className={cn(
            "mx-auto flex h-[76px] max-w-[1180px] items-center justify-between rounded-2xl px-3 pl-5 transition-all duration-500",
            /* The bar is always opaque. The logo art has a near-black ground
               baked in and relies on mix-blend-mode to drop it, and a blend
               needs something to blend against: over a transparent bar the
               fixed header isolates the blend and the ground shows as a black
               box. An opaque bar also just reads better over the hero. */
            "bg-[#131313] ring-1 ring-inset ring-white/[0.07]",
            scrolled
              ? "shadow-[0_18px_50px_-24px_rgba(0,0,0,0.95)]"
              : "shadow-none",
          )}
        >
          <Link
            to="/"
            className="flex items-center transition-opacity duration-300 hover:opacity-80"
            aria-label="Vibeployed home"
          >
            <Logo height={50} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative rounded-full px-3.5 py-2 text-[13.5px] font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <TextRoll>{l.label}</TextRoll>
                <span className="absolute inset-x-3.5 -bottom-px h-px origin-left scale-x-0 bg-white/70 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/console"
              className={cn(
                "hidden text-[13.5px] font-medium text-white/60 transition-colors hover:text-white sm:block",
                pathname === "/console" && "text-white",
              )}
            >
              <span className="px-3">Live demo</span>
            </Link>
            <Link to="/console" className="hidden sm:block">
              <Button size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                Deploy something
              </Button>
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-xl text-white/70 ring-hairline transition-colors hover:text-white md:hidden"
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#171717]/90 backdrop-blur-xl md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-24 flex flex-col gap-1 px-6"
            >
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, duration: 0.45 }}
                  className="border-b border-white/[0.06] py-4 font-display font-bold text-[28px] tracking-[-0.03em] text-white/80"
                >
                  <TextRoll>{l.label}</TextRoll>
                </motion.a>
              ))}
              <Link to="/console" onClick={() => setOpen(false)} className="mt-6">
                <Button size="lg" className="w-full">
                  Open the live demo
                </Button>
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
